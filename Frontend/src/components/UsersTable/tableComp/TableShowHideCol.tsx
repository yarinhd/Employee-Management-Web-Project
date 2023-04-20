import React from 'react';
import { ColumnInstance } from 'react-table';
import IUser from '../../../models/IUser';

const TableShowHideCol: React.FC<{ allColumns: ColumnInstance<IUser>[] }> = ({ allColumns }) => (
    <div
        style={{
            display: 'flex',
            flexDirection: 'row',
            width: '100%',
            tableLayout: 'fixed',
            justifyContent: 'center',
        }}
    >
        {allColumns.map(
            (column) =>
                column.Header !== 'Id' && (
                    <div key={column.id} className="cat action">
                        <label htmlFor={column.id}>
                            <input id={column.id} type="checkbox" {...column.getToggleHiddenProps()} />
                            <span>{column.Header}</span>
                        </label>
                    </div>
                )
        )}
    </div>
);
export default TableShowHideCol;
