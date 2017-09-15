import { config } from '../configs/database';
import * as Sequelize from 'sequelize';
import { UserSchema, IUserModel } from './models/user';
import { hashSync } from 'bcrypt';

export class Repository {
    public collections: {
        User: string
    } = {
        User: 'User'
    };
    private _sequelize: Sequelize.Sequelize;
    private _models: {
        User?: Sequelize.Model<any, IUserModel>
    };
    constructor() {
        this._sequelize = new Sequelize(config.db_name, config.username,
            config.password, config);
        this._models = {
            User: this._sequelize.define<any, IUserModel>('Users', UserSchema, {
                freezeTableName: true,
                paranoid: true
            })
        };
        this._models.User.hook('beforeCreate', (user, options) => {
            user.password = hashSync(user.password, 10);
        });
    }
    sync() {
        return this._models.User.sync();
    }
    private _getCollection(collectionName: string): Sequelize.Model<any, any> {
        return this._models[collectionName];
    }
    findOne(collectionName: string, condition: Sequelize.WhereOptions) {
        return this._getCollection(collectionName).findOne({
            where: condition,
        });
    }
    create<Data>(collectionName: string, data: Data) {
        return this._getCollection(collectionName).create(data, {
            isNewRecord: true,
            validate: true,
        });
    }
    update<Data>(collectionName: string, condition: Sequelize.WhereOptions, data: Data) {
        return this._getCollection(collectionName).update(data, {
            where: condition,
            validate: true,
            fields: Object.keys(data)
        });
    }
}
export let repository = new Repository();
