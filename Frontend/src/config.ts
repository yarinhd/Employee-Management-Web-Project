
const config = {
    DUMMY_DATA: {

        userFields: ['username', 'fullName', 'rank', 'job', 'gender', 'inGroup', 'serviceEndDate'],
    },
    endpoints: {
        user: {
            api: process.env.REACT_APP_ENV === 'local' ? 'http://localhost:5000/api/user' : '/api/user',
        },
        auth: {
            api: process.env.REACT_APP_ENV === 'local' ? 'http://localhost:5000/api/auth/login' : '/api/auth/login',
        },
        document: {
            api: process.env.REACT_APP_ENV === 'local' ? 'http://localhost:5000/api/document' : '/api/document',
        },
        note: {
            api: process.env.REACT_APP_ENV === 'local' ? 'http://localhost:5000/api/note' : '/api/note',
        },
    },
};

export default config;
