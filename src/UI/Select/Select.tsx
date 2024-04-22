import React, { useState } from 'react';
import styles from './Select.module.scss';

interface SelectProps {
  options: string[];
  placeholder?: string; // Добавляем опциональное поле placeholder
}

const Select: React.FC<SelectProps> = ({ options, placeholder }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [filteredOptions, setFilteredOptions] = useState(options);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value.toLowerCase();
    setInputValue(value);
    const filtered = options.filter(option => option.toLowerCase().includes(value));
    setFilteredOptions(filtered);
    setIsOpen(true);
  };

  const handleOptionClick = (option: string) => {
    setInputValue(option);
    setIsOpen(false);
  };

  const handleInputFocus = () => {
    setIsOpen(true);
  };

  const handleInputBlur = () => {
    setIsOpen(false);
  };

  return (
    <div className={styles['select-container']}>
      <input
        className={styles['chosen-value']}
        type="text"
        value={inputValue}
        placeholder={placeholder || ''}
        onChange={handleInputChange}
        onFocus={handleInputFocus}
        onBlur={handleInputBlur}
      />
      <ul className={`${styles['value-list']} ${isOpen ? styles.open : ''}`}>
        {filteredOptions.map((option, index) => (
          <li key={index} onClick={() => handleOptionClick(option)}>
            {option}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Select;
