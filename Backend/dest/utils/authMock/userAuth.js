"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userAuth = void 0;
// TODO: Remember to delete added propery inside Reequest -> RequestParamsHandler -> propery name - user:IUser
function userAuth(req, res, next) {
    req.user = {
        username: 't_yarin_h',
        fullName: 'Yarin Hadad',
        rank: 'Captain',
        job: 'Mechanical Engineer',
        birthday: '10/12/1995',
        releaseDate: '15/12/2024',
        gender: 'M',
        manager: 't_avishay_h',
        manager_name: 'Avishay Hayoun',
        inGroup: 'null',
        isAdmin: false,
        avatar: 'URL',
    };
    next();
}
exports.userAuth = userAuth;
