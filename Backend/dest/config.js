"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
exports.config = {
    db: {
        server: `mongodb://${process.env.DB_SERVER || `localhost`}`,
        name: process.env.DB_NAME || 'cramim',
        port: +(process.env.DB_PORT || 27017),
    },
    serverPort: +(process.env.PORT || 5000),
    action: {
        Add: 'Add',
        Del: 'Del',
    },
    minio: {
        bucketName: 'documents',
    },
    peopleApi: {
        UserAndGroupfields: [
            'username',
            'fullName',
            'rank',
            'job',
            'dateOfBirth',
            'serviceEndDate',
            'team',
            'teamManager',
            'mador',
            'madorManager',
            'branch',
            'branchManager',
        ],
        userFields: ['username', 'fullName', 'rank', 'job', 'dateOfBirth', 'serviceEndDate'],
    },
    endpoints: {
        clientUrl: process.env.CLIENT_URL || 'http://localhost:3000',
    },
    errors: {
        serverError: {
            status: 500,
        },
    },
};
