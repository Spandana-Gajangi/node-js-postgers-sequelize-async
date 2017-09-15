import AppConfig from './../app_config';
export default class Util {
    static config: AppConfig;
    static Log = (...params) => {
        Util.config = new AppConfig();
        if (Util.config.nodeEnv !== 'production') {
            console.log(params);
        }
    };
}
