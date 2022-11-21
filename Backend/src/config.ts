export const config = {
    db: {
        server: `mongodb://${process.env.DB_SERVER || `localhost`}`,
        name: process.env.DB_NAME || 'cramim',
        port: +(process.env.DB_PORT || 27017),
    },
    minio: {
        server: `${process.env.MINIO_SERVER || `localhost`}`,
        bucketName: `${process.env.MINIO_BUCKET || `documents`}`,
        port: +(process.env.MINIO_PORT || 9000),
    },
    serverPort: +(process.env.PORT || 5000),
    action: {
        Add: 'Add',
        Del: 'Del',
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
