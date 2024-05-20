import React from 'react';
import styles from './CheckBox.module.scss';

interface CheckboxProps {
    checked: boolean;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    // label: string;
}

const Checkbox: React.FC<CheckboxProps> = ({ checked, onChange, /*label*/ }) => {
    return (
        <label className={styles.checkboxWrapper}>
            <input 
                type="checkbox" 
                checked={checked} 
                onChange={onChange} 
                className={styles.checkboxInput}
            />
            <span className={styles.checkboxCustom}></span>
            {/* {label} */}
        </label>
    );
};

export default Checkbox;
