import React from 'react';
import { Context } from '../store/Store';

// Hook which wraps the fetch function to add loading and error handling functionality.
// usage:
// const getResourceWrapped = useWrapFetch(getResource);
// getResource(...args)(callback funcion);
export default function useWrapFetch<T>(
    fetch: (...args: any[]) => Promise<T>
): (...args: any) => (callback?: (resource: T) => void) => Promise<T | void> {
    const [, dispatch] = React.useContext(Context);

    return (...args: any[]) => {
        return (callback) => {
            dispatch({ type: 'LOADING' });
            return fetch(...args)
                .then(callback)
                .catch((status: string) => {
                    console.log('usewrapfetch - hi in error');

                    dispatch({ type: 'SET_ERROR', payload: status });
                })
                .finally(() => {
                    dispatch({ type: 'UNLOADING' });
                });
        };
    };
}
