import React, { InputHTMLAttributes } from 'react';

import styles from './Input.module.scss'

import {ReactComponent  as DeleteIcon} from '../../assets/icons/delete.svg';
import InputErrorMessage from "./InputErrorMessage/InputErrorMessage";

interface IProps extends InputHTMLAttributes<HTMLInputElement> {
    readonly onDelete?: any;
    readonly isDirty?: boolean;
    readonly errors?: string[];
}

const Input: React.FC<IProps> = ({onDelete, isDirty, errors = [], ...otherProps}) => {
    return (
        <>
            <div className={styles.container}>
                <input {...otherProps} />
                {
                    onDelete && <DeleteIcon onClick={onDelete} />
                }
            </div>
            {
                isDirty && errors?.length > 0 && <InputErrorMessage isDirty={isDirty} errors={errors} />
            }
        </>
    );
};

export default Input;