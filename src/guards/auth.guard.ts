import {Injectable, CanActivate, ExecutionContext, UnauthorizedException} from '@nestjs/common';
import { Observable } from 'rxjs';
import {Reflector} from '@nestjs/core';
import {ExtRequest} from '../../extended/types.extended';
import { AuthProvider } from '../providers/auth.providers';

@Injectable()
export class AuthGuard implements CanActivate {
    constructor( private authService: AuthProvider, private readonly reflector?: Reflector) {}

    canActivate(
        context: ExecutionContext,
    ): boolean | Promise<boolean> | Observable<boolean> {

        const request: ExtRequest = context.switchToHttp().getRequest();
        const roles = this.reflector.get<string[]>('roles', context.getHandler());

        if (roles && request.identity) {
            return new Promise((resolve, reject) => {
                this.authService.me(request.identity).then(result => {
                    if (result.user.roles.find(role => roles.find(rr => rr === role.name) != null)) {
                        resolve(true);
                    } else {
                        resolve(false);
                    }
                });
            });
        }

        return request.identity != null;
    }
}
