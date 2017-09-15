import { v1 } from 'uuid';
import * as request from 'request';
import Util from './../utils';
import { BaseController, base_controller } from './../controllers/base_controller';
import AppConfig from './../app_config';
import HttpCodes from './../utils/http_codes';
import { message } from './../utils/status_messages';
import { user_services } from './../services/user_services';

class Middleware extends BaseController {
    private _appConfig: AppConfig;
    constructor() {
        super();
        this._appConfig = new AppConfig();
    }
    // Future purpose
    requireAuth = async function (req, res, next) {
        let user = await user_services.findOne({ fullname: req.params.name, resetPasswordToken: req.get('authorization') });
        if (user) {
            next();
        } else {
            return base_controller.sendResponse(res, HttpCodes.Unauthorized, message.Unauthorized);
        }
    };
    errorHandler = (err, req, res, next) => {
        let uniqueId = v1();
        let result = {
            code: HttpCodes.InternalServerError,
            uniqueId: uniqueId,
            status: 'failure',
            message: 'Internal Server Error. Ref #' + uniqueId,
            err: err
        };
        Util.Log(err);
        return res.send(result);
    };
    methodNotAllowed = (req, res, next) => {
        return this.sendResponse(res, HttpCodes.MethodNotAllowed, message.NotAllowed);
    };
    isPostBodyValid = (req, res, next) => {
        if (Object.keys(req.body).length === 0) {
            return this.sendResponse(res, HttpCodes.PreconditionFailed, message.CannotEmpty);
        } else {
            next();
        }
    };
    pageNotFound = (req, res, next) => {
        return this.sendResponse(res, HttpCodes.NotFound, message.NotFound);
    };
}
export default Middleware;
