/* eslint-disable jsx-a11y/media-has-caption */
import { Fade, makeStyles, Theme } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import PROMO from './promo_classic.gif';

interface promoProps {
    children: React.ReactNode;
    promoTimeout?: { enter?: number; exit?: number };
    childrenTimeout?: { enter?: number; exit?: number };
    delay?: number;
}
const useStyles = makeStyles((theme: Theme) => ({
    image: {
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        height: '100vh',
        zIndex: 0,
    },
    logo: { zIndex: 300, position: 'absolute', left: 344, top: 48 },
}));
const Promo: React.FC<promoProps> = (props) => {
    const classes = useStyles();
    const { children, promoTimeout, childrenTimeout, delay } = props;
    const [signal, setSignal] = useState(true);
    const [childrenSignal, setChildrenSignal] = useState(false);

    useEffect(() => {
        setChildrenSignal(true);
        setTimeout(() => setSignal(false), delay);
    }, []);
    return (
        <>
            <Fade
                in={signal}
                style={{
                    zIndex: 3,
                    position: 'fixed',
                    backgroundColor: '#fcfcfc',
                    height: '100vh',
                    width: '100vw',
                }}
                timeout={promoTimeout}
            >
                <div>
                    <img src={PROMO} alt="" className={classes.image} />
                </div>
            </Fade>
            <Fade in={childrenSignal} timeout={childrenTimeout}>
                <div>{children as React.ReactElement}</div>
            </Fade>
        </>
    );
};
Promo.defaultProps = {
    delay: 3000,
    promoTimeout: { enter: 0, exit: 1200 },
    childrenTimeout: { enter: 4200, exit: 0 },
};
export default Promo;
