import axios from 'axios';

function _extends() {
    _extends =
        Object.assign ||
        function (target) {
            for (var i = 1; i < arguments.length; i++) {
                var source = arguments[i];

                for (var key in source) {
                    if (Object.prototype.hasOwnProperty.call(source, key)) {
                        target[key] = source[key];
                    }
                }
            }

            return target;
        };

    return _extends.apply(this, arguments);
}

function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ('value' in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
    }
}

function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    return Constructor;
}

var getDefaultConfig = function getDefaultConfig() {
    return {
        http: {
            /** 默认 25 秒超时 */
            timeout: 25000,

            /** 需要服务端同步开启，这里默认开启 */
            withCredentials: true, // headers: {
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

var Interceptor = /*#__PURE__*/ (function () {
    function Interceptor() {}

    var _proto = Interceptor.prototype;

    _proto.normalRequest = function normalRequest(res, config) {
        return _extends({}, res);
    };

    _proto.responseSuccess = function responseSuccess(res, config) {
        var _config$interceptor;

        typeof config.exception['finally'] === 'function' && config.exception['finally'](res);
        return (
            ((_config$interceptor = config.interceptor) == null
                ? void 0
                : _config$interceptor.request == null
                ? void 0
                : _config$interceptor.request(res)) || this.responseFail(res, config)
        );
    };

    _proto.responseFail = function responseFail(err, config) {
        var _config$exception;

        typeof (config == null
            ? void 0
            : (_config$exception = config.exception) == null
            ? void 0
            : _config$exception['finally']) === 'function' && config.exception['finally'](err);

        if (config.exception.callback && typeof config.exception.callback === 'function') {
            return Promise.reject(config.exception.callback(err));
        }

        return Promise.reject(err);
    };

    return Interceptor;
})();

var interceptor = new Interceptor();

var PerfectRequest = /*#__PURE__*/ (function () {
    /** 获取 axios instance */
    PerfectRequest.getInstance = function getInstance(config) {
        return axios.create(config);
    };

    function PerfectRequest(props) {
        this.httpConfig = {
            exception: {},
            interceptor: {},
        };
        this.instance = void 0;
        this.initInstance(props);
    }

    var _proto = PerfectRequest.prototype;

    _proto.initInstance = function initInstance(props) {
        var _this = this;

        this.httpConfig = getDefaultConfig() || {};
        this.instance = PerfectRequest.getInstance(
            _extends({}, this.httpConfig.http, (props == null ? void 0 : props.http) || {}),
        ); // 初始化异常

        this.initException(props); // 注册请求前拦截器，主要注入一些默认的请求配置

        this.instance.interceptors.request.use(function (opts) {
            return interceptor == null
                ? void 0
                : interceptor.normalRequest == null
                ? void 0
                : interceptor.normalRequest(opts, _this.httpConfig);
        }); // 注册请求后拦截器

        this.instance.interceptors.response.use(
            function (res) {
                return interceptor.responseSuccess(res, _this.httpConfig);
            },
            function (err) {
                return interceptor.responseFail(err, _this.httpConfig);
            },
        );
    };

    _proto.initException = function initException(props) {
        this.httpConfig.exception.callback = props == null ? void 0 : props.onFailure;
        this.httpConfig.exception['finally'] = props == null ? void 0 : props.onFinally;
        this.httpConfig.interceptor.request = props == null ? void 0 : props.onRequest;
    };

    _createClass(PerfectRequest, [
        {
            key: 'httpInstance',
            get: function get() {
                return this.instance;
            },
        },
    ]);

    return PerfectRequest;
})();

export { PerfectRequest as default };
//# sourceMappingURL=index.js.map
