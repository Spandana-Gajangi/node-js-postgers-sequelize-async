import { Request, Response, NextFunction } from 'express';
import { repository } from './../db/index';
class UserServices {
    findOne = (req: any) => {
        return repository.findOne(repository.collections.User, req);
    };
    createUser = (req: any) => {
        return repository.create(repository.collections.User, req);
    };
    UpdateUser = (req: any) => {
        return repository.update(repository.collections.User, req.condition, req.attributes);
    };
}
export const user_services = new UserServices();
