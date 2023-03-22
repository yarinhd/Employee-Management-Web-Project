import { NextFunction, Request, Response } from 'express';

export class Auth {
    static kerberosAuth(req: Request, res: Response, next: NextFunction) {
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
