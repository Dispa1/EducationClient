import React, { HTMLAttributes, ReactNode} from 'react';

import styles from './Box.module.scss';

interface IProps extends HTMLAttributes<HTMLDivElement>{
    children: React.ReactElement | ReactNode | null,
}

const Box: React.FC<IProps> = ({children}) => {
    return (
        <div className={`${styles.Box}`}>
            {children}
        </div>
    );
};

export default Box;