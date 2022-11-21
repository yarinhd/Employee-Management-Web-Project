import React from 'react';
import IUser from '../../../models/IUser';

type Props = {
    gotoPage: (updater: number | ((pageIndex: number) => number)) => void;
    previousPage: () => void;
    nextPage: () => void;
    canPreviousPage: boolean;
    canNextPage: boolean;
    pageCount: number;
    pageIndex: number;
    pageOptions: number[];
    pageSize: number;
    data: IUser[];
    setPageSize: (pageSize: number) => void;
};

const TablePagination: React.FC<Props> = ({
    gotoPage,
    previousPage,
    nextPage,
    canPreviousPage,
    canNextPage,
    pageCount,
    pageIndex,
    pageOptions,
    setPageSize,
    pageSize,
    data,
}) => (
    <>
        <div
            style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                height: '100%',
                gap: '1%',
            }}
        >
            <button className="buttonStl" type="button" onClick={() => gotoPage(0)} disabled={!canPreviousPage}>
                {'<<'}
            </button>
            <button className="buttonStl" type="button" onClick={() => previousPage()} disabled={!canPreviousPage}>
                <strong>הקודם</strong>
            </button>
            <button className="buttonStl" type="button" onClick={() => nextPage()} disabled={!canNextPage}>
                <strong>הבא</strong>
            </button>
            <button className="buttonStl" type="button" onClick={() => gotoPage(pageCount - 1)} disabled={!canNextPage}>
                {'>>'}
            </button>
        </div>
        <div
            style={{
                float: 'right',
                width: '100%',
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'flex-start',
                gap: '1%',
            }}
        >
            <span>
                עמוד: &nbsp;
                <strong>
                    {pageIndex + 1} מתוך {pageOptions.length}
                </strong>
            </span>
            <span>
                | לך לעמוד 🢀 &nbsp;
                <input
                    type="number"
                    defaultValue={pageIndex + 1}
                    onChange={(e) => {
                        const pageNumber = e.target.value ? Number(e.target.value) - 1 : 0;
                        gotoPage(pageNumber);
                    }}
                    style={{ width: '50px' }}
                />
            </span>
            <span>
                <select value={pageSize} onChange={(e) => setPageSize(Number(e.target.value))}>
                    {[5, 8, 15, data.length].map((pageSizee) => (
                        <option key={pageSizee} value={pageSizee}>
                            הצג {pageSizee} רשומות
                        </option>
                    ))}
                </select>
            </span>
        </div>
    </>
);
export default TablePagination;
