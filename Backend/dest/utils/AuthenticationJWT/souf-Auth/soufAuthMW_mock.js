"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.soufAuth = void 0;
// TODO: Remember to delete added propery inside Reequest -> RequestParamsHandler -> propery name: username:string
// TODO: need to do adaption to connect it to work place library - get sharp about it
// TODO: ask almog if should i wrap it and why
class soufAuth {
    static kerberosAuth(req, res, next) {
        req.username = 't_dim_v';
        // req.username = 't_yos_s';
        // req.username = 't_avishay_h';
        // req.username = 't_RRRRR_h';
        // req.username = 't_CCCCCC_h';
        // req.username = 't_dsim_v';
        // req.username = 't_ariel_s';
        // req.username = 't_asvishay_h';
        // req.username = 't_Mcfarland_h';
        // req.username = 't_David_h';
        next();
    }
}
exports.soufAuth = soufAuth;
