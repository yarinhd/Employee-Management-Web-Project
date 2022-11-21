import React, { useImperativeHandle } from 'react';

export type ICheckboxProps = {
    checked?: boolean;
    indeterminate?: boolean;
} & React.InputHTMLAttributes<HTMLInputElement>;

const Checkbox = React.forwardRef<HTMLInputElement, ICheckboxProps>((props, inRef) => {
    const { checked = false, indeterminate, ...rest } = props;

    const ref = React.useRef<HTMLInputElement>(null);
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    useImperativeHandle(inRef, () => ref.current!, [ref]);

    return <input type="checkbox" checked={checked} ref={ref} {...rest} />;
});

export default Checkbox;

Checkbox.defaultProps = {
    checked: true,
    indeterminate: true,
};
