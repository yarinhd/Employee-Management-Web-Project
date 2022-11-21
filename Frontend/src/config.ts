// Ask Almog: what is going on?
// export const getEnv = (envName) => {
//     if (window._env_) {
//         return window._env_[envName];
//     }
//     return undefined;
// };

// export const isLocal = getEnv('IS_LOCAL') ? getEnv('IS_LOCAL') === 'true' || getEnv('IS_LOCAL') === true : false;

// const config = {
//     endpoints: {
//         server: getEnv('SERVER_HOST') ? getEnv('SERVER_HOST') : 'http://localhost:3001',
//         user: {
//             api: isLocal ? 'http://localhost:5000/auth/login' : '/api/user',
//         }
//     }}

const config = {
    DUMMY_DATA: {
        // user: {
        //     _id: '629693818a0821af7afeadc4',
        //     id: '629693818a0821af7afeadc4',
        //     __v: 0,
        //     username: 't_dim_v',
        //     fullName: 'Dimael Vilenski',
        //     rank: 'Seren',
        //     job: 'Engineer',
        //     gender: 'male',
        //     serviceEndDate: '10/5/2004',
        //     inGroup: 'cram',
        //     isAdmin: false,
        //     avatar: 'https://people/api/v1/user/image/t_dim_v?defaultImage=false',
        //     createdAt: '2022-05-31T22:15:26.581Z',
        //     updatedAt: '2022-06-27T09:22:04.985Z',
        // },
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
