import { toast } from 'react-toastify';
import './toastStyle.css';

const classifyToastMsg = (type: string, content: string) => {
    // const toastAttrVal = {
    //     position: 'top-center',
    //     autoClose: 6000,
    //     hideProgressBar: false,
    //     closeOnClick: true,
    //     pauseOnHover: true,
    //     draggable: true,
    //     progress: undefined,
    // };
    switch (type) {
        case 'error':
            return toast.error(content, {
                position: 'top-left',
                autoClose: 4000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: 'colored',
            });
        case 'success':
            return toast.success(content, {
                position: 'top-left',
                autoClose: 4000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: 'colored',
            });
        case 'info':
            return toast.info(content, {
                position: 'top-left',
                autoClose: 4000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,

                theme: 'colored',
            });
        default:
            return toast('General Message', {
                position: 'top-center',
                autoClose: 4000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
    }
};

export default classifyToastMsg;
