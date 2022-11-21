import React from 'react';
import { HeaderGroup } from 'react-table';
import IUser from '../../../models/IUser';

type Props = {
    sortColumn: (columnToSort: HeaderGroup<IUser>) => '🔽' | '🔼' | '';
    headerGroups: HeaderGroup<IUser>[];
};

const TableHead: React.FC<Props> = ({ headerGroups, sortColumn }) => (
    <thead>
        {headerGroups.map((headerGroup) => (
            <tr
                {...headerGroup.getHeaderGroupProps()}
                style={{
                    background: 'linear-gradient(45deg, #5AB9EA 0%, #84CEEB 50%, #5AB9EA 100%)',
                }}
            >
                {headerGroup.headers.map((column) => (
                    <th {...column.getHeaderProps(column.getSortByToggleProps())} style={{ whiteSpace: 'nowrap' }}>
                        {column.render('Header')}
                        <span>{sortColumn(column)}</span>
                        <div>{column.canFilter ? column.render('Filter') : null}</div>
                    </th>
                ))}
            </tr>
        ))}
    </thead>
);
export default TableHead;
