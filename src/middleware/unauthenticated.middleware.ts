import {Injectable, NestMiddleware, NestModule} from '@nestjs/common';
import {JwtHandler} from '../providers/jwt.handler';
import {ExtRequest} from '../../extended/types.extended';
import { Response } from  'express';

@Injectable()
export class UnauthenticatedMiddleware implements NestMiddleware {

    constructor() {

    }

    use(req: ExtRequest, res: Response, next: () => void) {

        const decoded  = JwtHandler.decode(req.token);

        if (!req.token || decoded.error) {
            res.status(401).send({
                error: 'UNAUTHORIZED',
                message: 'UNAUTHORIZED',
                statusCode: 401,
            });
        } else {

            if (req.token) {
                req.identity = decoded.result.payload;
            }
            next();
        }
    }
}
