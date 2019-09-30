import { Inject, Injectable, HttpService } from '@nestjs/common';
import { Model } from 'mongoose';
import { DocumentUser } from '../database/models';
import { newGuid } from 'ts-guid';
const md5 = require('md5');
import { JwtHandler } from './jwt.handler';
import { MSG } from '../../../uehue.models/messages';
import { Observable } from 'rxjs';
import { Role, User } from '../../../uehue.models';
import { DBModel } from '../environment/db';
import * as GLOBAL from "../variables";
import { generateCode } from '../utils/utils.utility';


@Injectable()
export class AuthProvider {

    constructor(@Inject(DBModel.USER_MODEL) private userModel: Model<DocumentUser>, private http: HttpService) { }

    async login(email, password): Promise<{ message?: MSG, user?: DocumentUser, error?: string, token?: string }> {
        const condition = {
            email,
            password: md5(md5(password + '@_@' + password)),
        };
        const user = await this.userModel.findOne(condition, { password: 0 });
        if (user) {
            const token = JwtHandler.encode(user);
            delete user.password;
            return { token, user };
        }
        throw ({
            error: 'WRONG_USER_OR_PASSWORD',
            message: 'WRONG_USER_OR_PASSWORD',
        });
    }

    async me(identity: User): Promise<{ token?, user?: User, err?: boolean, message?: MSG }> {
        const baseError: any = {
            error: 'NOT_AUTHENTICATED',
            message: 'NOT_AUTHENTICATED',
        };
        if (identity) {
            const res: any = await this.userModel.findOne({ guid: identity.guid }, { password: 0 });

            if (!res) {
                throw (baseError);
            }
            return { user: res, token: JwtHandler.encode(res) };
        }
        throw (baseError);
    }

    async getByEmail(email) {
        return await this.userModel.findOne({ email });
    }

    signin(user: DocumentUser) {
        let pwd = user.password;
        return new Observable(subscriber => {
            this.getByEmail(user.email).then(res => {
                if (res) {
                    subscriber.error({
                        error: 'USER_ALREADY_EXISTS',
                        message: 'USER_ALREADY_EXISTS',
                    });
                } else {
                    user.guid = newGuid();
                    user.roles = [Role.defaultRole()];
                    user.password = md5(md5(user.password + '@_@' + user.password));
                    this.userModel.insertMany([user]).then(result => {

                        this.http.post(
                            GLOBAL.VARIABLES.FORUM_ENDPOINT + "/users",
                            { username: generateCode(Date.now()/1000, 2), email: user.email, password: pwd, _uid: 1 },
                            {
                                headers: {
                                    "Authorization": "Bearer " + GLOBAL.VARIABLES.FORUM_MASTER_TOKEN
                                }
                            }
                        ).subscribe(responseForum => {
                        }, err1 => {
                        })

                        subscriber.next({
                            user: result,
                            token: JwtHandler.encode(result),
                        });
                    }).catch(err => {
                        debugger;

                        subscriber.error(err);
                    });
                }
            }).catch(err => {
                debugger;

                subscriber.error(err);
            });

        });

    }
}
