import axios, { AxiosInstance, AxiosRequestConfig, AxiosError, AxiosResponse } from 'axios';

import getDefaultConfig, { Config } from './config';
import { Interceptor } from './interceptor';

const interceptor = new Interceptor();

type PerfectRequestConstructor = {
    http?: AxiosRequestConfig;
    onRequest?(res?: AxiosResponse | Record<string, unknown> | AxiosError, config?: Config): AxiosResponse;
    onFailure?(err?: AxiosError | Record<string, unknown>): any;
    onFinally?(res?: AxiosResponse | Record<string, unknown> | AxiosError): any;
};

class PerfectRequest {
    private httpConfig: Config = { exception: {}, interceptor: {} };
    private instance: AxiosInstance | undefined;

    /** 获取 axios instance */
    static getInstance(config: Config['http']) {
        return axios.create(config);
    }

    constructor(props: PerfectRequestConstructor) {
        this.initInstance(props);
    }

    protected get httpInstance(): AxiosInstance | undefined {
        return this.instance;
    }

    protected initInstance(props: PerfectRequestConstructor) {
        this.httpConfig = getDefaultConfig() || {};
        this.instance = PerfectRequest.getInstance({
            ...this.httpConfig.http,
            ...(props?.http || {}),
        });
        // 初始化异常
        this.initException(props);
        // 注册请求前拦截器，主要注入一些默认的请求配置
        this.instance.interceptors.request.use(opts => interceptor?.normalRequest?.(opts, this.httpConfig));
        // 注册请求后拦截器
        this.instance.interceptors.response.use(
            res => interceptor.responseSuccess(res, this.httpConfig),
            err => interceptor.responseFail(err, this.httpConfig),
        );
    }

    protected initException(props: PerfectRequestConstructor) {
        this.httpConfig.exception.callback = props?.onFailure;
        this.httpConfig.exception.finally = props?.onFinally;
        this.httpConfig.interceptor.request = props?.onRequest;
    }
}

export default PerfectRequest;
