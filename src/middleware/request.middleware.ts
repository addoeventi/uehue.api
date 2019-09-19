import {Injectable, NestMiddleware, NestModule} from '@nestjs/common';
import {JwtHandler} from '../providers/jwt.handler';
import {ExtRequest} from '../../extended/types.extended';

@Injectable()
export class RequestMiddleware implements NestMiddleware {

    constructor() {

    }

    static SetIdentity(token, req: ExtRequest){
        const decoded = JwtHandler.decode(token);

        if (!decoded.error) {
            req.identity = decoded.result.payload as any;
        }
    }

    use(req: ExtRequest, res: Response, next: () => void) {

        req.token = (req.headers.authorization || '').replace('Bearer ', '');

        try {
            let result = JSON.parse(req.query.fields);
            if (Object.keys(result).length == 0) {
                result = null;
            }
            req.fields = result;
        } catch (e) {
            req.fields = null;
        }
        try {
            let result = JSON.parse(req.query.filters);
            if (Object.keys(result).length == 0) {
                result = null;
            }
            req.filters = result;
        } catch (e) {
            req.filters = null;
        }

        Object.defineProperty(req, 'create' , {
            configurable: false,
            enumerable: false,
            get: () => {
                return (request: ExtRequest, aggregate) => {
                    if (request.filters) {
                        aggregate.push({$match: req.filters});
                    }

                    if (request.fields) {
                        aggregate.push({$project: req.fields});
                    }

                    if (request.skip != null && !isNaN(request.skip)) {
                        aggregate.push({$skip: parseInt(req.skip)});
                    }

                    if (request.limit != null && !isNaN(request.limit)) {
                        aggregate.push({$limit: parseInt(req.limit)});
                    }
                    return aggregate;
                };
            },
        } as PropertyDescriptor);

        req.skip = isNaN(req.query.skip) ? 0 : parseInt(req.query.skip);

        req.limit = isNaN(req.query.limit) ?  50 : parseInt(req.query.limit);

        if (req.token) {
            RequestMiddleware.SetIdentity(req.token, req);
        }

        next();
    }
}
