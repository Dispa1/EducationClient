import React, { HTMLAttributes, ReactNode} from 'react';
import styles from './container.module.scss'

interface IProps extends HTMLAttributes<HTMLDivElement>{
    children: React.ReactElement | ReactNode | null,
}

const Container: React.FC<IProps> = ({children}) => {
    return (
        <div className={styles.container}>
            {children}
        </div>
    );
};

export default Container;