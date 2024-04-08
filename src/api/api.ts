import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import { ApiConfig } from "../config/api.config";

export default async function api(
    path: string,
    method: 'get' | 'post' | 'patch' | 'delete',
    body: any | undefined
){

    return new Promise<ApiResponse | undefined>((resolve)=>{
        const requestData ={
            method: method,
            url: path,
            baseURL: ApiConfig.API_URL,
            data: JSON.stringify(body),
            headers:{
                'Content-type' : 'application/json',
                'Authorization': getToken(),
            }
        }
        axios(requestData)
        .then(res=>responseHandler(res, resolve))
        .catch(async err =>{
            if(err.response.status === 401){
                const newToken = await refreshToken();
                if(!newToken){
                    const response: ApiResponse ={
                        status: 'login',
                        data: null,
                    };

                    return resolve(response);
                }

                saveToken(newToken)

                if(requestData.headers){
                    requestData.headers['Authorization'] = getToken();


                    // mozda je ovde repeatRequest PROBATI
                }

                return await repeatRequest(requestData, resolve);
            }

            const response: ApiResponse={
                status: 'error',
                data: err
            }
            resolve(response)
        })
    })
}

export interface ApiResponse{
    status: 'ok' | 'error' | 'login';
    data: any;
}

async function responseHandler(
    res:AxiosResponse<any>,
    resolve: (value?: ApiResponse) => void,
){
    if(res.status < 200 || res.status >= 300){
        let errorMessage = 'Server error';
        if(res.data && res.data.message){
            errorMessage = res.data.message;
        }

        const response: ApiResponse ={
            status : 'error',
            data: {
                status: res.status,
                message: errorMessage,
                details: res.data
            }
        };

        return resolve(response);
    }


    let response: ApiResponse;

    if(res.data.statusCode < 0){
        response = {
            status: 'login',
            data: null,
        }
    }else{
        response = {
            status: 'ok',
            data: res.data
        };
    }
    return resolve(response);
}

function getToken(): string{
    const token = localStorage.getItem('api_token');
    return 'Bearer ' + token;
}

export function saveToken(token: string){
    localStorage.setItem('api_token', token);
}

function getRefreshToken(): string{
    const token = localStorage.getItem('api_refresh_token');
    return token + '';
}

export function saveRefreshToken(token: string){
    localStorage.setItem('api_refresh_token', token);
}

async function refreshToken(): Promise<string | null>{
    const path = 'auth/user/refresh';
    const data = {
        token: getRefreshToken()
    }

    const refreshTokenRequestData: AxiosRequestConfig = {
        method: 'post',
        url: path,
        baseURL: ApiConfig.API_URL,
        data: JSON.stringify(data),
        headers:{
            'Content-Type': 'application/json'
        }
    };
    const refreshTokenResponse: {data: {token: string | undefined}} = await axios(refreshTokenRequestData);

    if(!refreshTokenResponse.data.token){
        return null;
    }

    return refreshTokenResponse.data.token;
}

async function  repeatRequest(
    requestData: AxiosRequestConfig<any>,
    resolve: (value?: ApiResponse) => void
) {
    await axios(requestData)
        .then(res=>{
            let response: ApiResponse;

            if(res.status === 401){
                response={
                    status: 'login',
                    data: null
                };
            }else{
                response = {
                    status: 'ok',
                    data: res,
                }
            }
            return resolve(response)
        })    
        .catch(err =>{
            const response: ApiResponse ={
                status: 'error',
                data: err.data,
            }

            return resolve(response);
        })
}