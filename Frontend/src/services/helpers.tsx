export const getHeaders: () => any = () => ({
    Accept: 'application/json',
    'Content-Type': 'application/json',
});

export const handleErrors: (response: any) => any = (response: any) => {
    if (!response.ok) {
        throw response.status;
    }
    return response;
};

export const json: (response: any) => any = (response: any) => response.json();

export const asyncMock: (mock: any) => any = (mock: any) =>
    new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(mock);
        }, 1000);
    });
