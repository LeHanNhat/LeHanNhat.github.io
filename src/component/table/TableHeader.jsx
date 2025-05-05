import React from 'react';
import SwapVertIcon from '@mui/icons-material/SwapVert';
import SortOutlinedIcon from '@mui/icons-material/SortOutlined';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';

const TableHeader = ({ columns, sortData, activeSortKey,sortOrder  }) => {

  const getSortIcon = (key) => {
    if (activeSortKey === key) {
      return sortOrder === 'ascending' ? <ArrowUpwardIcon /> : <ArrowDownwardIcon />;
    }
    return <SortOutlinedIcon />;
  };

  return (
    <thead>
      <tr style={{ cursor: "pointer" }}>
        {columns && columns.map((column) => (
          <th key={column.key} onClick={() => sortData(column.key)}>
            {column.label}
            <span style={{ marginLeft: "0.5rem" }}>{getSortIcon(column.key)}</span>
          </th>
        ))}
      </tr>
    </thead>
  );
};

export default TableHeader;