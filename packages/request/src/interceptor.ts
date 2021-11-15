import { BaseInterceptor } from './interface/interceptor';
import { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';
import { Config } from './config';

export class Interceptor implements BaseInterceptor {
    normalRequest(res: AxiosRequestConfig, config: Config): AxiosRequestConfig {
        return {
            ...res,
        };
    }

    responseSuccess(
        res: AxiosResponse | Record<string, unknown>,
        config: Config,
    ): AxiosResponse | Promise<any> | undefined {
        typeof config.exception.finally === 'function' && config.exception.finally(res);
        return config.interceptor?.request?.(res) || this.responseFail(res, config);
    }

    responseFail(err: AxiosError | AxiosResponse | Record<string, unknown>, config: Config): Promise<any> {
        typeof config?.exception?.finally === 'function' && config.exception.finally(err);

        if (config.exception.callback && typeof config.exception.callback === 'function') {
            return Promise.reject(config.exception.callback(err));
        }
        return Promise.reject(err);
    }
}
