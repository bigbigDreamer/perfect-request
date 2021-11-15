import { AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';

export { AxiosRequestConfig };

export type PerfectRequestConfig = {
    http?: AxiosRequestConfig;
    /** 异常处理 */
    exception: {
        /** 常规 callback */
        callback?(res?: AxiosError | Record<string, unknown> | AxiosResponse): any;
        /** 请求最终处理结果 */
        finally?(res?: AxiosResponse | Record<string, unknown> | AxiosError): any;
    };
    /** 请求拦截 */
    interceptor: {
        request?(
            res?: AxiosResponse | Record<string, unknown> | AxiosError,
            config?: Config,
        ): AxiosResponse | Promise<any>;
    };
};

export type Config = PerfectRequestConfig & AxiosRequestConfig;

export type ConfigHookShape = {
    (config?: Config): Config;
};

const getDefaultConfig: ConfigHookShape = () => {
    return {
        http: {
            /** 默认 25 秒超时 */
            timeout: 25000,
            /** 需要服务端同步开启，这里默认开启 */
            withCredentials: true,
            // headers: {
            //     'Content-Type': 'application/json',
            //     // 'Accept': 'application/json',
            // },
        },
        exception: {
            callback: undefined,
            finally: undefined,
        },
        interceptor: {
            request: undefined,
        },
    };
};

export default getDefaultConfig;
