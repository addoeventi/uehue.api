import {Injectable, CanActivate, ExecutionContext, UnauthorizedException} from '@nestjs/common';
import { Observable } from 'rxjs';
import {Reflector} from '@nestjs/core';
import {ExtRequest} from '../../extended/types.extended';

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(private readonly reflector?: Reflector) {}

    canActivate(
        context: ExecutionContext,
    ): boolean | Promise<boolean> | Observable<boolean> {

        const request: ExtRequest = context.switchToHttp().getRequest();

        return request.identity != null;
    }
}
