import express from 'express';

export default class Wrapper {
    static wrapAsync(func: any) {
        return (req: express.Request, res: express.Response, next: express.NextFunction) => {
            func(req, res, next).catch(next);
        };
    }

    // and then continue to the treatment in whole errors:
    // add error handler and userError and all that shit
}
