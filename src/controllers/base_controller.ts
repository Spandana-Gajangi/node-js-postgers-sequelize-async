import { Request, Response } from 'express';
import * as request from 'request';
import HttpCodes from './../utils/http_codes';
import { sign as JWTSign } from 'jsonwebtoken';

export class BaseController {
    sendResponse<T>(res: Response, statusCode: number, message: string, data?: T) {
        if (statusCode >= 200 && statusCode < 300) {
            return res.status(statusCode).send({
                statusCode: statusCode,
                message: message,
                status: 'success',
                data: data
            });
        } else {
            return res.status(statusCode).send({
                statusCode: statusCode,
                message: message,
                status: 'failure',
                errors: data
            });
        }
    }
    generateToken = (user) => {
        return JWTSign({ email: user.email, _id: user._id }, 'Santosh J', {
            expiresIn: 10080, // in seconds,
            issuer: 'localhost1',  // wasn't sure what this was, so I left as defaulted in the doc
            audience: 'localhost'
        });
    };

    setUserInfo = (request) => {
        console.log('setUserInfo');
        return {
            fullName: request.profile.firstName,
            email: request.email,
            token: request.resetPasswordToken
        };
    };

}
export const base_controller = new BaseController();
