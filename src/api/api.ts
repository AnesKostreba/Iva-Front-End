import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";
import { ApiConfig } from "../config/api.config";

export default async function api(
    path: string,
    method: 'get' | 'post' | 'patch' | 'delete',
    body: any | undefined,
    role: 'user' | 'administrator' = 'user',
){
    return new Promise<ApiResponse>((resolve)=>{
        const requestData = {
            method: method,
            url: path,
            baseURL: ApiConfig.API_URL,
            data: JSON.stringify(body),
            headers:{
                'Content-Type': 'application/json',
                'Authorization': getToken(role),
            }
        };

        axios(requestData)
        .then(res => responseHandler(res, resolve))
        .catch(async err => {
            if(err.response?.status === 401){
                const newToken = await refreshToken(role);

                if(!newToken){
                    const response:ApiResponse ={
                        status: 'login',
                        data: null,
                    };
                    return resolve(response);
                }
                await saveToken(role, newToken);
                
                requestData.headers['Authorization'] = `Bearer ${newToken}`;
                
                return await repeatRequest(requestData, resolve);
            }

            const response: ApiResponse={
                status: 'error',
                data: err,
            };
            resolve(response);
        })
    })
    
}

export async function apiFile(
    path: string,
    name: string,
    file: File,
    role: 'user' | 'administrator' = 'user',
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
                'Authorization': getToken(role),
            }
        };

        axios(requestData)
        .then(res => responseHandler(res, resolve))
        .catch(async err => {
            if(err.response?.status === 401){
                const newToken = await refreshToken(role);

                if(!newToken){
                    const response:ApiResponse ={
                        status: 'login',
                        data: null,
                    };
                    return resolve(response);
                }
                await saveToken(role, newToken);

                if(!requestData.headers){
                    requestData.headers = {};
                }

                requestData.headers['Authorization'] = `Bearer ${newToken}`;
                
                
                return await repeatRequest(requestData, resolve);
            }

            const response: ApiResponse={
                status: 'error',
                data: err,
            };
            resolve(response);
        })
    })
    
}

export interface ApiResponse{
    status: 'ok' | 'error' | 'login';
    data: any;
}

async function responseHandler(
    res: AxiosResponse<any>,
    resolve: (value: ApiResponse) => void,
    ){
        if(res.status < 200 || res.status >= 300){ // nepovoljan ishod kada server ne odradi posao
            const response:ApiResponse ={
                status: 'error',
                data: res.data,
            };
            return resolve(response);
        }

        let response: ApiResponse;
        if(res.data.statusCode < 0){ // nepovoljan ishod kada aplikacija ne odradi posao
            response= {
                status: 'login',
                data: res.data,
            };
        }else{
            response={
                status: 'ok',
                data: res.data,
            };
        }
        return resolve(response) // povoljan ishod kada je sve kako treba
        
}



function getToken(role: 'user' | 'administrator'): string{
    const token = localStorage.getItem('api_token_' + role);
    // console.log('Current token: ',token)
    return 'Berer ' + token;
    
}

export async function saveToken(role: 'user' | 'administrator', token: string){
    // console.log('Saving new token: ',token)
    localStorage.setItem('api_token_' + role, token);
}

function getRefreshToken(role: 'user' | 'administrator'): string{
    const token = localStorage.getItem('api_refresh_token_'+ role);
    return token + '';
}

export function saveRefreshToken(role: 'user' | 'administrator' ,token: string){
    localStorage.setItem('api_refresh_token_'+ role, token);
}

export function saveIdentity(role: 'user' | 'administrator' ,identity: string){
    localStorage.setItem('api_identity_'+ role, identity);
}

export function getIdentity(role: 'user' | 'administrator'): string{
    const token = localStorage.getItem('api_identity_' + role);
    // console.log('Current token: ',token)
    return 'Berer ' + token;
    
}

export function removeTokenData(role: 'user' | 'administrator'){
    localStorage.removeItem('api_token_' + role);
    localStorage.removeItem('api_refresh_token_'+ role);
    localStorage.removeItem('api_identity_' + role);
}


async function refreshToken(role: 'user' | 'administrator'):Promise<string | null>{
    const path = 'auth/'+ role +'/refresh';
    const data = {
        token: getRefreshToken(role),
    }

    const refreshTokenRequestData: AxiosRequestConfig = {
        method: 'post',
        url: path,
        baseURL: ApiConfig.API_URL,
        data: JSON.stringify(data),
        headers:{
            'Content-Type': 'application/json',
        }
    };

    //refreshTokenResponse
    try{
        const rtr:{ data:{token:string | undefined } } = await axios(refreshTokenRequestData);

        if(!rtr.data.token){
            return null;
        }

        
        return rtr.data.token;
    }catch(err){
        console.error('Fail to refresh token:',err);
        return null;
    }

}


async function repeatRequest(
    requestData: AxiosRequestConfig<any>, 
    resolve: (value: ApiResponse) => void
    ){
        
        try {
            const res = await axios(requestData);
            let response: ApiResponse;
    
            if (res.status === 401) {
                response = {
                    status: 'login',
                    data: null,
                };
            } else {
                response = {
                    status: 'ok',
                    data: res,
                };
            }
    
            return resolve(response);
        } catch (err) {
            const error = err as AxiosError;
            const response: ApiResponse = {
                status: 'error',
                data: error.response?.data,
            };
            return resolve(response);
        }
}