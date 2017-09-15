export default class AppConfig {
    host: string;
    port: number;
    nodeEnv: string;
    buildURL: string;
    constructor() {
        this.host = process.env.HOST;
        this.port = process.env.PORT;
        this.nodeEnv = process.env.NODE_ENV;
        this.buildURL = process.env.BUILD_URL;
    }
}
