import {IUser} from '../../../uehue.models';

const jwt = require('jsonwebtoken');

export class JwtHandler {
    private static KEY = 'Secr3kekdmcsxxxxyysysjxlkjKDLNMasdf2399835flmldmfsa09@';

    static decode(token): {error?, result?: { payload: IUser }} {
        try {
            return {result: jwt.verify(token, JwtHandler.KEY)};
        } catch (err) {
            return {error: 'TOKEN_NOT_VALID'};
        }
    }

    static encode(user: IUser|any): string {
        return jwt.sign({ payload:  {_id: user._id, guid: user.guid} as any}, JwtHandler.KEY, {expiresIn: 60 * 60 * 24});
    }

    static expired() {}
}
