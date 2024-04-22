import React from 'react';
import Box from '../../../UI/Box/Box';
import styles from './BlockRight.module.scss';
import Container from '../../../UI/container/container';
import Input from '../../../UI/Input/Input';
import Select from '../../../UI/Select/Select';
import { ReactComponent as SearchIcon } from '../../../assets/icons/search.svg';

interface Props {
    onSearch: (searchTerm: string) => void;
}

const BlockRight: React.FC<Props> = ({ onSearch }) => {
    const russianAlphabet = Array.from({ length: 32 }, (_, i) => String.fromCharCode(1072 + i));

    const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
        onSearch(event.target.value);
    };

    return (
        <div className={styles.BlockRight}>
            <Container>
                <Box>
                    <div className={styles.SearchBlock}>
                        <Input placeholder="Поиск" onChange={handleSearch} />
                        <SearchIcon />
                    </div>
                </Box>
                <Box>
                    <div className={styles.filters}>
                        <Select options={russianAlphabet} placeholder="Курсы" />
                        <Select options={russianAlphabet} placeholder="Тесты" />
                    </div>
                </Box>
            </Container>
        </div>
    );
};

export default BlockRight;
