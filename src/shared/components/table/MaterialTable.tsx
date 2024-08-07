import * as React from 'react';
import { alpha } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Checkbox from '@mui/material/Checkbox';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import DeleteIcon from '@mui/icons-material/Delete';
import FilterListIcon from '@mui/icons-material/FilterList';
import { visuallyHidden } from '@mui/utils';
import { Button, Pagination, Skeleton } from '@mui/material';
import { FaPlus, FaQuestion } from "react-icons/fa6";
import { useTranslation } from 'react-i18next';
import { FaEllipsisVertical } from "react-icons/fa6";
import { MdModeEdit } from "react-icons/md";
import { IoEye } from "react-icons/io5";
import { HeadsType } from './CrudTable';
import Divider from '@mui/material/Divider';
import { usePagination } from '@/shared/hooks/usePagination';
import { RiDeleteBin6Line } from 'react-icons/ri';

type Actions = "delete" | "create" | "details" | "edit";
interface Props<DT> {
    rows: (DT & { id: string })[] | undefined;
    heads: HeadsType<DT>[];
    total?: number | undefined;
    dataReducer?: "client" | "server";
    isLoading: boolean;
    actions: Actions[];
    selectable: boolean;
    disabledCheckBox?: (item: DT) => boolean;
    details?: boolean;
    moreActions?: React.ReactNode,
    pagination?: React.ReactNode,
    onDelete?: (id: any[]) => void,
    onEdit?: (id: any) => void,
    onMoreActions?: (id: any) => void,
    onCreate?: () => void,

}


function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
    if (b[orderBy] < a[orderBy]) {
        return -1;
    }
    if (b[orderBy] > a[orderBy]) {
        return 1;
    }
    return 0;
}

type Order = 'asc' | 'desc';

function getComparator<Key extends keyof any>(
    order: Order,
    orderBy: Key,
): (
    a: { [key in Key]: number | string },
    b: { [key in Key]: number | string },
) => number {
    return order === 'desc'
        ? (a, b) => descendingComparator(a, b, orderBy)
        : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort<DT>(array: DT[], comparator: (a: DT, b: DT) => number) {
    if (array) {
        const stabilizedThis = array.map((el, index) => [el, index] as [DT, number]);

        stabilizedThis.sort((a, b) => {
            const order = comparator(a[0], b[0]);
            if (order !== 0) {
                return order;
            }
            return a[1] - b[1];
        });
        return stabilizedThis.map((el) => el[0]);
    }
    return []

}

interface EnhancedTableProps<DT> {
    numSelected: number;
    onRequestSort: (event: React.MouseEvent<unknown>, property: keyof DT) => void;
    onSelectAllClick: (event: React.ChangeEvent<HTMLInputElement>) => void;
    order: Order;
    orderBy: string;
    rowCount: number;
    heads: HeadsType<DT>[];
    actions: Actions[];
    selectable: boolean;


}

function renderCellContent(content: any): React.ReactNode {
    if (typeof content === 'string' || typeof content === 'number') {
        return content;
    } else if (React.isValidElement(content)) {
        return content;
    } else {
        return JSON.stringify(content);
    }
}


function EnhancedTableHead<DT>(props: EnhancedTableProps<DT>) {

    const { onSelectAllClick, order, orderBy, numSelected, rowCount, actions, onRequestSort, heads, selectable } =
        props;
    const createSortHandler =
        (property: keyof DT) => (event: React.MouseEvent<unknown>) => {
            onRequestSort(event, property);
        };

    return (
        <TableHead sx={{ background: theme => theme.palette.mode === 'dark' ? theme.palette.divider : '#eeeeee6c', borderBottom: theme => theme.palette.mode === 'dark' ? theme.palette.divider : '#eeeeee6c' }}>

            <TableRow >
                {selectable && (<TableCell padding="checkbox">
                    <Checkbox
                        color="primary"
                        indeterminate={numSelected > 0 && numSelected < rowCount}
                        checked={rowCount > 0 && numSelected === rowCount}
                        onChange={onSelectAllClick}
                        inputProps={{
                            'aria-label': 'select all desserts',
                        }}
                    />
                </TableCell>)}
                {heads?.map((headCell) => (
                    <TableCell
                        key={headCell.key as string}
                        align={headCell.numeric ? 'right' : 'left'}
                        padding={headCell.disablePadding ? 'none' : 'normal'}
                        sortDirection={orderBy === headCell.key ? order : false}
                    >
                        <TableSortLabel
                            active={orderBy === headCell.key}
                            direction={orderBy === headCell.key ? order : 'asc'}
                            onClick={createSortHandler(headCell.key)}
                        >
                            {headCell.label}
                            {orderBy === headCell.key ? (
                                <Box component="span" sx={visuallyHidden}>
                                    {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                                </Box>
                            ) : null}
                        </TableSortLabel>
                    </TableCell>
                ))}
                {actions && <TableCell padding="normal" align='center'>
                    الإجراءات
                </TableCell>}
            </TableRow>
        </TableHead>
    );
}

interface EnhancedTableToolbarProps {
    numSelected: number;
    actions: Actions[];
    selected: any[];
    onDelete: (id: any[]) => void,
    resetSelected: () => void,
    moreActions?: React.ReactNode,
    onCreate: () => void,
}

function EnhancedTableToolbar(props: EnhancedTableToolbarProps) {
    const { resetSelected, moreActions, numSelected, actions, onDelete, onCreate, selected } = props;
    return (
        <Toolbar
            sx={{
                pl: { sm: 2 },
                pr: { xs: 1, sm: 1 },
                ...(numSelected > 0 && {
                    bgcolor: (theme) =>
                        alpha(theme.palette.primary.main, theme.palette.action.activatedOpacity),
                }),
            }}
        >
            {numSelected > 0 ? (
                <Typography
                    sx={{ flex: '1 1 100%' }}
                    color="inherit"
                    variant="subtitle1"
                    component="div"
                >
                    {numSelected} selected
                </Typography>
            ) : (
                <Typography
                    sx={{ flex: '1 1 100%' }}
                    variant="h6"
                    id="tableTitle"
                    component="div"
                >
                    البيانات
                </Typography>
            )}
            {numSelected > 0 ? (
                actions.includes('delete') && (<Tooltip title="حذف">
                    <IconButton onClick={() => { onDelete(selected); resetSelected() }}>
                        <DeleteIcon />
                    </IconButton>
                </Tooltip>)
            ) : (
                <>
                    {moreActions}
                    {actions.includes('create') && (<Tooltip title="إضافة عنصر">
                        <Button sx={{ ml: 2 }} onClick={() => onCreate()} endIcon={<FaPlus size={16} />} variant='contained'>
                            إضافة
                        </Button>
                    </Tooltip>)}
                </>

            )
            }
        </Toolbar >
    );
}
export default function EnhancedTable<DT>({ rows, heads, onMoreActions, actions, moreActions, dataReducer, details, isLoading, disabledCheckBox, pagination, total, onDelete, onEdit, onCreate, selectable }: Props<DT>) {
    const [order, setOrder] = React.useState<Order>('asc');
    const [orderBy, setOrderBy] = React.useState<keyof DT>();
    const [selected, setSelected] = React.useState<string[]>([]);
    const [dense, setDense] = React.useState(false);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);
    const { pagesCount, pageSize, page, setPage, pageData } = usePagination(rows, { page: 1, pageSize: 10, total: total });

    const handleRequestSort = (
        event: React.MouseEvent<unknown>,
        property: keyof DT,
    ) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.checked && rows) {
            const newSelected = rows?.map((n) => n.id);
            setSelected(newSelected);
            console.log(newSelected);

            return;
        }
        setSelected([]);
    };

    const handleClick = (event: React.MouseEvent<unknown>, id: string) => {
        const selectedIndex = selected.indexOf(id);
        let newSelected: string[] = [];

        if (selectedIndex === -1) {
            newSelected = newSelected.concat(selected, id);
        } else if (selectedIndex === 0) {
            newSelected = newSelected.concat(selected.slice(1));
        } else if (selectedIndex === selected.length - 1) {
            newSelected = newSelected.concat(selected.slice(0, -1));
        } else if (selectedIndex > 0) {
            newSelected = newSelected.concat(
                selected.slice(0, selectedIndex),
                selected.slice(selectedIndex + 1),
            );
        }
        setSelected(newSelected);
    };

    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const isSelected = (id: string) => selected.indexOf(id) !== -1;

    // Avoid a layout jump when reaching the last page with empty rows.
    const emptyRows =
        rows && page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

    const visibleRows = React.useMemo(
        () =>
            stableSort(pageData, getComparator(order, orderBy as string)),
        [pageData, order, orderBy, page, pageSize],
    );


    return (
        <Box sx={{ width: '100%' }}>
            <Paper sx={{ width: '100%', mb: 2 }}>
                <EnhancedTableToolbar moreActions={moreActions} resetSelected={() => setSelected([])} selected={selected} onCreate={() => onCreate && onCreate()} numSelected={selected.length} actions={actions} onDelete={() => onDelete && onDelete(selected)} />
                <TableContainer>
                    <Table
                        sx={{ minWidth: 750 }}
                        aria-labelledby="tableTitle"
                        size={dense ? 'small' : 'medium'}
                    >


                        <EnhancedTableHead
                            numSelected={selected.length}
                            order={order}
                            orderBy={orderBy as string}
                            onSelectAllClick={handleSelectAllClick}
                            onRequestSort={handleRequestSort}
                            rowCount={rows?.length ?? 0}
                            heads={heads}
                            actions={actions}
                            selectable={selectable}

                        />
                        <TableBody>
                            {
                                visibleRows && !isLoading ? visibleRows?.map((row, index) => {
                                    const isItemSelected = isSelected(row?.id);
                                    const labelId = `enhanced-table-checkbox-${index}`;

                                    return (
                                        <TableRow hover
                                            role="checkbox"
                                            aria-checked={isItemSelected}
                                            tabIndex={-1}
                                            key={row.id}
                                            selected={isItemSelected}
                                            sx={{ cursor: 'pointer' }}>
                                            {selectable && (
                                                <TableCell padding="checkbox" sx={{ borderBottom: theme => theme.palette.mode === 'dark' ? theme.palette.divider : '#eeeeee6c' }}>
                                                    <Checkbox
                                                        color="primary"
                                                        onClick={(event) => handleClick(event, row.id)}
                                                        checked={isItemSelected}
                                                        inputProps={{
                                                            'aria-labelledby': labelId,
                                                        }}
                                                    />
                                                </TableCell>
                                            )}


                                            {
                                                heads?.map((h) => (
                                                    <TableCell key={h.key as string} sx={{ borderBottom: theme => theme.palette.mode === 'dark' ? theme.palette.divider : '#eeeeee6c' }}>
                                                        {h.customRenderer
                                                            ? h.customRenderer(row)
                                                            : renderCellContent(row[h.key] ? row[h.key] : '----')}
                                                    </TableCell>
                                                ))
                                            }
                                            {
                                                actions && (
                                                    <TableCell align='center' sx={{ borderBottom: theme => theme.palette.mode === 'dark' ? theme.palette.divider : '#eeeeee6c' }}>
                                                        {
                                                            actions.includes('edit') && onEdit &&
                                                            <IconButton onClick={() => onEdit(row.id)} size="small" color="inherit" >
                                                                <MdModeEdit />
                                                            </IconButton>
                                                        }
                                                        {
                                                            actions.includes('delete') && onDelete &&
                                                            <IconButton onClick={() => onDelete([row.id])} size="small" color="error" >
                                                                <RiDeleteBin6Line />
                                                            </IconButton>
                                                        }
                                                        {
                                                            onMoreActions &&
                                                            <Tooltip title={'بنك الأسئلة'}>
                                                                <IconButton size="small" color="inherit" onClick={() => onMoreActions(row.id)}>
                                                                    <FaQuestion />
                                                                </IconButton>
                                                            </Tooltip>
                                                        }
                                                    </TableCell>
                                                )
                                            }

                                        </TableRow>
                                    )
                                }
                                ) :
                                    isLoading && (
                                        <TableRow>
                                            <TableCell colSpan={heads.length + 2}>
                                                <Typography variant="h3"> <Skeleton /></Typography>
                                                <Typography variant="h3"> <Skeleton /></Typography>
                                                <Typography variant="h3"> <Skeleton /></Typography>
                                                <Typography variant="h3"> <Skeleton /></Typography>
                                            </TableCell>
                                        </TableRow>
                                    )
                            }
                            {
                                visibleRows?.length === 0 && !isLoading && (
                                    <TableRow
                                        style={{
                                            height: 53,
                                        }}
                                    >
                                        <TableCell colSpan={heads.length + 2}>
                                            <div className="text-center flex justify-center w-full py-4 text-xl font-bold text-gray-400">
                                                لاتوجد بيانات
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                )
                            }

                            {/* {emptyRows > 0 && (
                                <TableRow
                                    style={{
                                        height: (dense ? 33 : 53) * emptyRows,
                                    }}
                                >
                                    <TableCell colSpan={6} />
                                </TableRow>
                            )} */}

                        </TableBody>
                    </Table>
                </TableContainer>

                <Divider />
                <div className='flex justify-center items-center w-full'>
                    <div className='flex justify-center items-center w-full'>
                        <Pagination sx={{ padding: 1.5 }} count={pagesCount} shape="rounded" page={page} onChange={handleChangePage} />
                    </div>
                    {/* <Pagination sx={{ padding: 1.5 }} count={rows?.length ?? 1} shape="rounded" page={page} onChange={handleChangePage} /> */}
                </div>
            </Paper>

        </Box>
    );
}
