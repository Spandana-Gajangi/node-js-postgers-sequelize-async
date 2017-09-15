import * as Sequelize from 'sequelize';

export interface IUserModel {
    fullName: string;
    email: string;
    password: string;
    resetPasswordToken: string;
}
export const UserSchema = {
    fullName: { type: Sequelize.STRING, allowNull: false },
    email: { type: Sequelize.STRING, allowNull: false },
    password: { type: Sequelize.STRING, allowNull: false },
    resetPasswordToken: { type: Sequelize.STRING }
};