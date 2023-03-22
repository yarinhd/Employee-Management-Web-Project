import React, { useContext, useMemo } from 'react';
import './App.css';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider, StylesProvider, jssPreset, createTheme } from '@material-ui/core/styles';
import createCache from '@emotion/cache';
import stylisRTLPlugin from 'stylis-plugin-rtl';
import { create } from 'jss';
import rtl from 'jss-rtl';
import { CacheProvider } from '@emotion/react';
import theme from './Theme';
import StoreProvider, { Context } from './store/Store';
import AppRoutes from './AppRoutes';



const jss = create({ plugins: [...jssPreset().plugins, rtl()] });

const cacheRtl = createCache({
    key: 'muirtl',
    stylisPlugins: [stylisRTLPlugin],
});

const App: React.FC = () => {
    const [state] = useContext(Context);

    const appTheme = useMemo(
        () =>
            createTheme({
                palette: {
                    type: state.isDarkMode ? 'dark' : 'light',
                },
                typography: {
                    fontFamily: [
                        '-apple-system',
                        'BlinkMacSystemFont',
                        '"Segoe UI"',
                        'Roboto',
                        '"Helvetica Neue"',
                        'Arial',
                        'sans-serif',
                        '"Apple Color Emoji"',
                        '"Segoe UI Emoji"',
                        '"Segoe UI Symbol"',
                    ].join(','),
                },
                direction: 'rtl',
            }),
        [state.isDarkMode]
    );
    const finalTheme = { ...theme, ...appTheme };

    return (
        <StoreProvider>
            <CacheProvider value={cacheRtl}>
                <StylesProvider jss={jss}>
                    <ThemeProvider theme={finalTheme}>
                        <BrowserRouter>
                            <AppRoutes />
                        </BrowserRouter>
                    </ThemeProvider>
                </StylesProvider>
            </CacheProvider>
        </StoreProvider>
    );
};

export default App;
