import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Row, TableBodyPropGetter, TableBodyProps } from 'react-table';
import useWrapFetch from '../../../hooks/useWrapFetch';
import IUser from '../../../models/IUser';
import { getUser } from '../../../services/user';
import { Context } from '../../../store/Store';
import toastHandler from '../../../Utils/toastHandler';

type Props = {
    getTableBodyProps: (propGetter?: TableBodyPropGetter<IUser> | undefined) => TableBodyProps;
    page: Array<Row<any>>;
    prepareRow: (row: Row<IUser>) => void;
};

const TableBody: React.FC<Props> = ({ getTableBodyProps, page, prepareRow }) => {
    const [, dispatch] = useContext(Context);
    const getUserWrapped = useWrapFetch(getUser);
    const navigate = useNavigate();

    return (
        <tbody {...getTableBodyProps()}>
            {page.map((row) => {
                prepareRow(row);

                return (
                    <tr
                        {...row.getRowProps()}
                        onClick={() => {
                            getUserWrapped(row.allCells[0].value)((user) => {
                                toastHandler('info', `הינך כעת בעמוד של: ${user.fullName} `);
                                dispatch({ type: 'SET_CHOSEN_USER', payload: user });
                                dispatch({ type: 'SET_SELECTED_INDEX', payload: 0 });

                                navigate('/notes');
                            });
                        }}
                    >
                        {row.cells.map((cell) => {
                            return (
                                <td className="block" {...cell.getCellProps()}>
                                    {cell.render('Cell')}
                                </td>
                            );
                        })}
                    </tr>
                );
            })}
        </tbody>
    );
};
export default TableBody;
