import { AxiosResponse, AxiosRequestConfig, AxiosError } from 'axios';
import { Config } from '../config';

export abstract class BaseInterceptor {
    abstract normalRequest(res: AxiosRequestConfig, config: Config): AxiosRequestConfig;
    abstract responseSuccess(
        res: AxiosResponse | Record<string, unknown>,
        config: Config,
    ): AxiosResponse | Promise<any> | undefined;
    abstract responseFail(err: AxiosError, config: Config): void;
}
