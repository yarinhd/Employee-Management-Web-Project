import React, { useContext, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { Slide, ToastContainer } from 'react-toastify';
import { makeStyles } from '@material-ui/core';
import { Context } from './store/Store';
import Login from './pages/Login';
import PrivateRoute from './PrivateRouter';

// import Example2Page from './pages/Example2';
import Home from './pages/Home';
import Loading from './components/Loading';
import MainLayout from './components/CustomNavBar/MainLayout';
import PeyAlef from './pages/PeyAlef';
import NotesTimeline from './components/NotesTimeline/NotesTimeLine';
import Havad from './pages/Havad';
import Pakoodim from './pages/Pakoodim';
import Hatah from './pages/Hatah';
import ErrorComp from './pages/Error';

const theme = createTheme({
    components: {
        MuiTypography: {
            styleOverrides: {
                root: {
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
            },
        },
    },
});

const useStyles = makeStyles(() => ({
    toastMsg: {
        top: '9vh !important',
        width: 'max-content',
    },
}));

const AppRoutes: React.FC = () => {
    // load the current user
    const [state] = useContext(Context);
    const classes = useStyles();
    const { isLoading } = state;
    console.log('AppRoutes - isLoading', isLoading);
    // TODO: deal with the component leave the connection of private route
    // and every thing

    return (
        <ThemeProvider theme={theme}>
            <MainLayout>
                <Routes>
                    <Route path="/*" element={<PrivateRoute component={Home} />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/peyalef" element={<PrivateRoute component={PeyAlef} />} />
                    {/* <Route path="/*" element={<Home />} /> */}
                    {/* <Route path="/aaa/aaa" element={<PrivateRoute component={Example2Page} />} /> */}
                    {/* TODO: need to take data from json server and inject here
                check if is working if not make it work
            TODO: connect it to the private route when you want to start work on backend */}
                    <Route path="/hatah" element={<PrivateRoute component={Hatah} />} />
                    <Route path="/havad" element={<PrivateRoute component={Havad} />} />
                    <Route path="/notes" element={<PrivateRoute component={NotesTimeline} />} />
                    <Route path="/pakoodim" element={<PrivateRoute component={Pakoodim} />} />
                    <Route path="/error/*" element={<ErrorComp />} />
                    {/* <Route path="/dis">
                <Route index element={<p>Parent element</p>} />
                <Route path="noder" element={<p>Child route</p>} />
            </Route> */}
                </Routes>
                {isLoading && <Loading />}
            </MainLayout>
            <ToastContainer rtl className={classes.toastMsg} transition={Slide} />

            {/* {alertMsg.show && <ToastMsg type={alertMsg.class} content={alertMsg.content} />} */}
        </ThemeProvider>
    );
};

export default AppRoutes;
