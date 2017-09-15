import { Router, IRoute, Request, Response, RequestHandler } from 'express';
import { repository } from './../db/';
import { user_controller } from './../controllers/user_controller';
import Middleware from './../middleware';

class Route {
    public router: Router;
    constructor() {
        this.router = Router();
    }
    ConfigureRoutes(middleware: Middleware) {
        this.router
            .route('/user/register')
            .post([
                middleware.isPostBodyValid,
                user_controller.register
            ])
            .all(middleware.methodNotAllowed);

        this.router
            .route('/user/log')
            .post([
                user_controller.loginUser
            ]).all(middleware.methodNotAllowed);

        this.router
            .route('/user/profile/:name')
            .get([
                user_controller.getUserProfile
            ])
            .put([
                middleware.requireAuth,
                user_controller.getUserProfile
            ]).all(middleware.methodNotAllowed);

        return this.router;
    }
}

export default Route;
