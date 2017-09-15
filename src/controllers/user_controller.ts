//npm modules
import { Request, Response } from 'express';
import * as async from 'asyncawait/async';
import * as await from 'asyncawait/await';
import { sign as JWTSign } from 'jsonwebtoken';
import { authenticate as JWTauthenticate } from 'passport';
import { compareSync } from 'bcrypt';

//local methods
import { BaseController, base_controller } from './../controllers/base_controller';
import HttpCodes from './../utils/http_codes';
import { message } from './../utils/status_messages';
import { user_services } from './../services/user_services';

class UserController extends BaseController {
    constructor() {
        super();
    }
    register = async function (req, res, next) {
        if (!req.body.email) {
            return res.status(422).send({ error: 'You must enter an email address.' });
        }
        if (!req.body.fullName) {
            return res.status(422).send({ error: 'You must enter your full name.' });
        }
        if (!req.body.password) {
            return res.status(422).send({ error: 'You must enter a password.' });
        }
        try {
            // check for duplicate email
            let existingUser = await user_services.findOne({ email: req.body.email });
            if (existingUser) {
                return res.status(422).send({ error: 'That email address is already in use.' });
            }
            else {
                // email not found. So create
                let user = {
                    email: req.body.email,
                    password: req.body.password,
                    fullName: req.body.fullName
                };
                let createUser = await user_services.createUser(user);
                let userInfo = {
                    fullName: createUser.fullName,
                    email: createUser.email,
                };
                let token = base_controller.generateToken(userInfo);
                let updateToken = await user_services.UpdateUser({ condition: { email: user.email }, attributes: { resetPasswordToken: token } });
                res.status(200).json({
                    token: token,
                    data: userInfo,
                    status: true
                });
            }
        } catch (error) {
            return base_controller.sendResponse(res, HttpCodes.InternalServerError, error);
        }
    };
    loginUser = async function (req, res, next) {
        try {
            if (!req.body.email) {
                return res.status(422).send({ error: 'You must enter an email address.' });
            }
            if (!req.body.password) {
                return res.status(422).send({ error: 'You must enter a password.' });
            }
            let user = await user_services.findOne({ email: req.body.email });
            if (!user) {
                return res.status(406).send({ status: false, message: 'Email does not Exist' });
            }
            else {
                let doesMatch = await compareSync(req.body.password, user.password);
                if (doesMatch) {
                    let token = base_controller.generateToken(user);
                    let updateToken = await user_services.UpdateUser({ condition: { email: user.email }, attributes: { resetPasswordToken: token } });
                    return base_controller.sendResponse(res, HttpCodes.OK, message.OK,
                        {
                            token: token,
                            fullname: user.fullName,
                            email: user.email
                        });
                }
                else {
                    return base_controller.sendResponse(res, HttpCodes.Unauthorized, message.Unauthorized);
                }
            }
        } catch (error) {
            return base_controller.sendResponse(res, HttpCodes.InternalServerError, error);
        }
    };
    getUserProfile = async function (req, res, next) {
        try {
            let user = await user_services.findOne({ fullname: req.params.name, resetPasswordToken: req.get('authorization') });
            if (user) {
                return base_controller.sendResponse(res, HttpCodes.OK, message.OK, {
                    token: user.resetPasswordToken,
                    fullname: user.fullName,
                    email: user.email
                });
            } else {
                return base_controller.sendResponse(res, HttpCodes.Unauthorized, message.Unauthorized);
            }
        } catch (error) {
            return base_controller.sendResponse(res, HttpCodes.InternalServerError, error);
        }
    };
    updateUserProfile = async function (req, res, next) {
        try {
            let updateUser = await user_services.UpdateUser({ condition: { resetPasswordToken: req.get('authorization') }, attributes: { email: req.body.email, fullName: req.body.userName } });
            let user = await user_services.findOne({ email: req.body.email });
            return base_controller.sendResponse(res, HttpCodes.OK, message.OK, {
                token: user.resetPasswordToken,
                fullname: user.fullName,
                email: user.email
            });
        } catch (error) {
            return base_controller.sendResponse(res, HttpCodes.InternalServerError, error);
        }
    };
}


export const user_controller = new UserController();
