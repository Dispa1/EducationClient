import React, {ButtonHTMLAttributes, ReactNode} from 'react';

import styles from './Button.module.scss';

interface IProps extends ButtonHTMLAttributes<HTMLButtonElement>{
    children: React.ReactElement | ReactNode,
    variant: 'success' | 'outline-success' | 'danger' | 'outline-danger' | 'normal' | 'outline-normal',
}

const Button: React.FC<IProps> = ({children, variant, disabled, ...props}) => {
    return (
        <button className={`${styles.btn} ${styles[variant]} ${disabled ? styles.disabled : ''}`} {...props}>
            {children}
        </button>
    );
};

export default Button;