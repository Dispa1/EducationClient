import React, { ReactNode } from 'react';
import styles from './Table.module.scss';

interface TableProps {
  headers: string[];
  data: (string | ReactNode)[][];
  imageWidth?: string;
  imageHeight?: string;
  tbodyClassName?: string;
}

const TableComponent: React.FC<TableProps> = ({ headers, data, tbodyClassName }) => {
  return (
    <div className={styles.tableContainer}>
      <table className={styles.table}>
        <thead>
          <tr>
            {headers.map((header, index) => (
              <th key={index}>{header}</th>
            ))}
          </tr>
        </thead>
        <tbody className={tbodyClassName || ''}>
          {data.map((rowData, rowIndex) => (
            <tr key={rowIndex}>
              {rowData.map((cellData, cellIndex) => (
                <td key={cellIndex}>{cellData}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TableComponent;
