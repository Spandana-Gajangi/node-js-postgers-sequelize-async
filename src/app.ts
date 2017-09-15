import * as bodyParser from 'body-parser';
import * as express from 'express';
import * as path from 'path';
import * as compression from 'compression';
import * as cors from 'cors';
import Middleware from './middleware/';
import Route from './routes/';
import AppConfig from './app_config';
import Util from './utils/';
import { repository } from './db/index';

class Server {
    public app: express.Application;
    private _config: AppConfig;
    private _middleware: Middleware;
    public static bootstrap(): Server {
        return new Server();
    }
    constructor() {
        this.app = express();
        this._config = new AppConfig();
        this._middleware = new Middleware();
        this.configureApp();
    }
    configureApp() {
        this.app.use(cors(
            {
                allowedHeaders: ['Content-Type', 'authorization', 'Access-Control-Allow-Headers', 'isAdmin'],
                origin: '*',
                methods: 'OPTIONS,PUT,POST,DELETE,GET',
                credentials: true
            }
        ));
        this.app.use(bodyParser.json());
        this.app.use(bodyParser.urlencoded({ extended: true }));
        this.app.use(compression());
        this.app.use(express.static('artifacts'));
        this.app.disable('x-powered-by');
        this.app.use(new Route().ConfigureRoutes(this._middleware));
        this.app.all('*', this._middleware.pageNotFound);
        this.app.use(this._middleware.errorHandler);
        repository.sync()
            .then(() => {
                let server = this.app.listen(this._config.port,
                    this._config.host, () => {
                        Util.Log('------------------------------------------New Worker Launched------');
                        Util.Log(
                            `App (With PID : ${process.pid}) is ready on http://${server.address().address}:${server.address().port}`
                        );
                    });
            });
    }
}
export = Server.bootstrap().app;
