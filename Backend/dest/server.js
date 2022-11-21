"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Server = void 0;
const express_1 = __importDefault(require("express"));
const bodyParser = __importStar(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
const passport_1 = __importDefault(require("passport"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const config_1 = require("./config");
const router_1 = require("./router");
const errorHandler_1 = require("./utils/errors/errorHandler");
const passport_2 = require("./utils/AuthenticationJWT/config/passport");
// import { users } from './utils/people-api-mock/people-api';
// need to implement files structure at each feature!
class Server {
    constructor() {
        console.log(`In Server constructor --> V`);
        this.app = (0, express_1.default)();
        this.app.use((0, cors_1.default)({ credentials: true, origin: config_1.config.endpoints.clientUrl }));
        this.app.use((0, cookie_parser_1.default)());
        this.app.use(bodyParser.json({ limit: '50mb' }));
        this.app.use(express_1.default.json());
        passport_1.default.use(passport_2.Strategy);
        this.app.use(passport_1.default.initialize());
        // TODO: adapt it to the work place libarary
        // this.app.use(soufAuth.kerberosAuth);
        // users.createUser();
        this.app.use(router_1.appRouter);
        this.app.use(errorHandler_1.userErrorHandler);
        this.app.listen(config_1.config.serverPort, () => {
            console.log(`Server started on port: ${config_1.config.serverPort} --> V `);
        });
    }
    static bootStrap() {
        return new Server();
    }
}
exports.Server = Server;
