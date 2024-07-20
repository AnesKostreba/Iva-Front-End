import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";
import { ApiConfig } from "../config/api.config";

export type Role = 'visitor' | 'user' | 'administrator';

export function getRole():Role {
    const token = localStorage.getItem('api_token_user')
    const refreshToken = localStorage.getItem('api_refresh_token_user');
    const adminToken = localStorage.getItem('api_token_administrator');
    const adminRefreshToken = localStorage.getItem('api_refresh_token_administrator');

    if(token || refreshToken){
        return 'user';
    }

    if(adminToken || adminRefreshToken){
        return 'administrator'
    }
    
    return 'visitor'
}

export interface ApiResponse {
    status: 'ok' | 'error' | 'login';
    data: any;
}

export default async function api(
    path: string,
    method: 'get' | 'post' | 'patch' | 'delete',
    body: any | undefined,
    skipTokenCheck: boolean = false,
    role: Role = getRole()
): Promise<ApiResponse> {
    return new Promise<ApiResponse>(async (resolve) => {
        let token = getToken(role);

        if (!skipTokenCheck && role !== 'visitor' && token && !isTokenValid(token)) {
            const newToken = await refreshToken(role);
            if (!newToken) {
                const response: ApiResponse = {
                    status: 'login',
                    data: null,
                };
                return resolve(response);
            }
            await saveToken(role,newToken);
            token = 'Bearer ' + newToken;
        }

        const headers: any = {
            'Content-Type': 'application/json',
        };

        if (token && !skipTokenCheck && role !== 'visitor') {
            headers['Authorization'] = token;
        }

        const requestData: AxiosRequestConfig = {
            method: method,
            url: path,
            baseURL: ApiConfig.API_URL,
            data: body, // Without JSON.stringify
            headers: headers,
        };
        console.log('Role', role);
        console.log('Sending request:', requestData);

        axios(requestData)
            .then(res => responseHandler(res, resolve))
            .catch(async err => {
                if (err.response?.status === 401 && !skipTokenCheck && role !== 'visitor') {
                    const newToken = await refreshToken(role);

                    if (!newToken) {
                        const response: ApiResponse = {
                            status: 'login',
                            data: null,
                        };
                        return resolve(response);
                    }

                    await saveToken(role,newToken);
                    if (requestData.headers) {
                        requestData.headers['Authorization'] = 'Bearer ' + newToken;
                    }
                    console.log('Retrying request with new token:', newToken);
                    return await repeatRequest(requestData, resolve);
                }

                const response: ApiResponse = {
                    status: 'error',
                    data: err.response?.data || err.message,
                };
                resolve(response);
            });
    });
}

function isTokenValid(token: string): boolean {
    try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        const exp = payload.exp;
        const currentTime = Math.floor(Date.now() / 1000);
        return exp > currentTime;
    } catch (e) {
        return false;
    }
}

export async function apiFile(
    path: string,
    name: string,
    file: File,
    roles: Role[] = ['user']
){
    return new Promise<ApiResponse>((resolve)=>{

        const formData = new FormData();
        formData.append(name, file);
        const requestData:AxiosRequestConfig = {
            method: 'post',
            url: path,
            baseURL: ApiConfig.API_URL,
            data: formData,
            headers:{
                'Content-Type': 'multipart/form-data',
            }
        };

        let validTokenFound = false;

        for (let role of roles) {
            let token = getToken(role);

            if (token && isTokenValid(token)) {
                validTokenFound = true;
                if(requestData.headers){
                    requestData.headers['Authorization'] = token;
                }
                break;
            }
        }

        axios(requestData)
        .then(res => responseHandler(res, resolve))
        .catch(async err => {
            if(err.response?.status === 401){
                for (let role of roles) {
                    const newToken = await refreshToken(role);

                    if (newToken) {
                        await saveToken(role, newToken);
                        if(requestData.headers){
                            requestData.headers['Authorization'] = `Bearer ${newToken}`;
                        }
                        console.log('Retrying request with new token:', newToken);
                        return await repeatRequest(requestData, resolve);
                    }
                }

                const response: ApiResponse = {
                    status: 'login',
                    data: null,
                };
                return resolve(response);
            }

            const response: ApiResponse={
                status: 'error',
                data: err,
            };
            resolve(response);
        })
    })
}

// export interface ApiResponse{
//     status: 'ok' | 'error' | 'login';
//     data: any;
// }

async function responseHandler(
    res: AxiosResponse<any>,
    resolve: (value: ApiResponse) => void,
){
    // Ako je status kod van opsega 200-299, tretiraj to kao grešku
    if (res.status < 200 || res.status >= 300) {
        const response: ApiResponse = {
            status: 'error',
            data: res.data,
        };
        return resolve(response);
    }

    // Provera status koda unutar same response data
    let response: ApiResponse;
    if (res.data.statusCode && res.data.statusCode < 0) {
        response = {
            status: 'error',
            data: res.data,
        };
    } else {
        response = {
            status: 'ok',
            data: res.data,
        };
    }
    return resolve(response);
}




export async function saveToken(role:Role,token: string) {
    console.log('Saving new token:', token);
    localStorage.setItem('api_token_'+role, token);
}

function getToken(role:Role): string {
    const token = localStorage.getItem('api_token_'+role);
    console.log('Current token: ', token);
    return 'Bearer ' + token;
}

export function saveRefreshToken(role:Role,token: string) {
    console.log('Saving refresh token:', token);
    localStorage.setItem('api_refresh_token_'+role, token);
}

function getRefreshToken(role:Role): string {
    console.log('Get refresh token');
    const token = localStorage.getItem('api_refresh_token_'+role);
    console.log('Retrieved refresh token:', token);
    return token || '';
}

export function saveIdentity(identity: string) {
    localStorage.setItem('api_identity', identity);
}

export function getIdentity(): string {
    const token = localStorage.getItem('api_identity');
    console.log('Get identity token: ', token);
    return 'Bearer ' + token;
}

export function removeTokenData(role: Role) {
    localStorage.removeItem('api_token_' + role);
    localStorage.removeItem('api_refresh_token_' + role);
    localStorage.removeItem('api_identity_' + role);
}


async function refreshToken(role:Role): Promise<string | null> {
    // const path = 'auth/user/refresh';
    const path = `auth/${role}/refresh`;
    const data = {
        token: getRefreshToken(role),
    };

    console.log('Attempting to refresh token with data:', data);

    const refreshTokenRequestData: AxiosRequestConfig = {
        method: 'post',
        url: path,
        baseURL: ApiConfig.API_URL,
        data: data, // Without JSON.stringify
        headers: {
            'Content-Type': 'application/json',
        },
    };

    try {
        const response = await axios(refreshTokenRequestData);
        console.log('Refresh token response:', response.data);

        if (response.data && response.data.token) {
            return response.data.token;
        }
        return null;
    } catch (err) {
        console.error('Failed to refresh token:', err);
        return null;
    }
}


async function repeatRequest(
    requestData: AxiosRequestConfig<any>, 
    resolve: (value: ApiResponse) => void
) {
    console.log('Repeating request with data:', requestData);

    try {
        const res = await axios(requestData);
        console.log('Repeat request response:', res);

        let response: ApiResponse;

        if (res.status === 401) {
            response = {
                status: 'login',
                data: null,
            };
        } else {
            response = {
                status: 'ok',
                data: res.data,
            };
        }

        return resolve(response);
    } catch (err) {
        console.error('Error in repeat request:', err);
        const error = err as AxiosError;
        const response: ApiResponse = {
            status: 'error',
            data: error.response?.data,
        };
        return resolve(response);
    }
}