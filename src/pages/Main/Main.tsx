import React from 'react';
import styles from './Main.module.scss';
import BlockLeft from './BlockLeft/BlockLeft';
import BlockCenter from './BlockCenter/BlockCenter';
import BlockRight from './BlockRight/BlockRight';

const Main = () => {
    const handleSearch = (searchTerm: string) => {
        console.log('Search term:', searchTerm);
    };

    return (
        <>
            <div className={styles.wrapper}>
                <BlockLeft/>
                <BlockCenter/>
                <BlockRight onSearch={handleSearch} />
            </div>
        </>
    );
};

export default Main;
