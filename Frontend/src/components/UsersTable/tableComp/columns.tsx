/* eslint-disable react/react-in-jsx-scope */
import { Avatar } from '@material-ui/core';
import { CellProps, Column } from 'react-table';
import IUser from '../../../models/IUser';

const avatarJSX = (tableProps: React.PropsWithChildren<CellProps<IUser, string>>): React.ReactNode => (
    <Avatar
        alt="Remy Sharp"
        src="https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
    />
);

const genderJSX = (tableProps: React.PropsWithChildren<CellProps<IUser, string>>): React.ReactNode => {
    const cellValue: string = tableProps.cell.value;
    if (cellValue === 'male' || cellValue === 'זכר') return <strong style={{ fontSize: '32px' }}> 🚹</strong>;

    if (cellValue === 'female' || cellValue === 'נקבה') return <strong style={{ fontSize: '32px' }}> 🚺 </strong>;
    return <span> null</span>;
};

const COLUMNS: readonly Column<IUser>[] = [
    {
        Header: 'Id',
        Footer: 'Id',
        accessor: '_id',
        disableFilters: true,
    },
    {
        Header: 'תמונת פרופיל',
        Footer: 'תמונת פרופיל',
        accessor: 'avatar',
        Cell: (tableProps) => avatarJSX(tableProps),
        disableFilters: true,
    },
    {
        Header: 'שם משתמש',
        Footer: 'שם משתמש',
        accessor: 'username',
    },
    {
        Header: 'שם מלא',
        Footer: 'שם מלא',
        accessor: 'fullName',
    },
    {
        Header: 'תאריך שחרור',
        Footer: 'תאריך שחרור',
        accessor: 'serviceEndDate',
    },
    {
        Header: 'מדור',
        Footer: 'מדור',
        accessor: 'madorGroup',
    },
    {
        Header: 'צוות',
        Footer: 'צוות',
        accessor: 'inGroup',
    },
    {
        Header: 'תפקיד',
        Footer: 'תפקיד',
        accessor: 'job',
    },
    {
        Header: 'דרגה',
        Footer: 'דרגה',
        accessor: 'rank',
    },
    {
        Header: 'מגדר',
        Footer: 'מגדר',
        accessor: 'gender',
        Cell: (tableProps) => genderJSX(tableProps),
    },
];

export default COLUMNS;
