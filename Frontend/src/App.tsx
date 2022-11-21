import React, { useContext, useMemo } from 'react';
import './App.css';
import { BrowserRouter } from 'react-router-dom';
// Jarin Note: jssPreset, styleProvider is used as plugin to preset style
// Jarin Note: ThemeProvide, createTheme is used for redefining parts of styles in mui library
import { ThemeProvider, StylesProvider, jssPreset, createTheme } from '@material-ui/core/styles';
import createCache from '@emotion/cache';

import stylisRTLPlugin from 'stylis-plugin-rtl';

import { create } from 'jss';
// Jarin Note: change everything from right to left1
import rtl from 'jss-rtl';
// Jarin Note: custom theme - ask almog why? and how to define it
import { CacheProvider } from '@emotion/react';
import theme from './Theme';
import StoreProvider, { Context } from './store/Store';
import AppRoutes from './AppRoutes';

// Ask Almog: what does it mean the 2 theme that applied at the final theme?
// Ask Almog: what is the difference between ThemeProvider and Styles Provider

// Configure JSS
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
