
import { Request } from 'express';
import {User} from "../../uehue.models";

export interface ExtRequest extends Request {
    token: string;
    identity: User;
    headers: any;
    skip;
    limit;
    filters;
    fields;
    requestInfo: { skip?, limit?, filters?, fields?, identity?: User, token?: string};

    create<T>(req: ExtRequest, aggregate: T[]): T[];
}
