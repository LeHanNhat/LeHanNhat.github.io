import * as React from 'react';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Typography from '@mui/material/Typography';
import { Grid, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TableSortLabel, Paper } from '@mui/material';
import EditStock from '../action/EditStock';
import { deleteStock, getAllStocksByProduct } from '../services/stockServices';
import Delete from '../action/Delete';
import { deleteReview, getReviewsByProduct } from '../services/reviewService';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 1000,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};

function descendingComparator(a, b, orderBy) {
    if (b[orderBy] < a[orderBy]) {
        return -1;
    }
    if (b[orderBy] > a[orderBy]) {
        return 1;
    }
    return 0;
}

function getComparator(order, orderBy) {
    return order === 'desc'
        ? (a, b) => descendingComparator(a, b, orderBy)
        : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort(array, comparator) {
    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
        const order = comparator(a[0], b[0]);
        if (order !== 0) return order;
        return a[1] - b[1];
    });
    return stabilizedThis.map((el) => el[0]);
}



function EnhancedTableHead(props) {
    const { order, orderBy, onRequestSort, headCells } = props;
    const createSortHandler = (property) => (event) => {
        onRequestSort(event, property);
    };

    return (
        <TableHead>
            <TableRow>
                {headCells.map((headCell) => (
                    <TableCell
                        key={headCell.id}
                        align={headCell.numeric ? 'right' : 'left'}
                        padding={headCell.disablePadding ? 'none' : 'normal'}
                        sortDirection={orderBy === headCell.id ? order : false}
                    >
                        <TableSortLabel
                            active={orderBy === headCell.id}
                            direction={orderBy === headCell.id ? order : 'asc'}
                            onClick={createSortHandler(headCell.id)}
                        >
                            {headCell.label}
                        </TableSortLabel>
                    </TableCell>
                ))}
            </TableRow>
        </TableHead>
    );
}

export default function OrderDetail({ productId, open, selectedStock = {}, setLoading, handleDetail, handleEdit, orderDetails = [], tableName, headCells = [], edit }) {
    const [order, setOrder] = React.useState('asc');
    const [orderBy, setOrderBy] = React.useState('id');
    const [details, setDetails] = React.useState(orderDetails);
    const [onDelete, setOnDelete] = React.useState(false);
    const [update, setUpdate] = React.useState(false);
    const [id, setId] = React.useState({});
    const [selected, setSelected] = React.useState({});
    console.log("pass", tableName);

    const handleRequestSort = (event, property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };
    const handleID = (item) => {
        if(tableName=== "stock"){
            console.log("bbb", id);
            setSelected(item)
            setId(item.id);
        }
        else{
            setSelected(item)
            setId(item._id);
        }
    }
    const handleDelete = () => {
        setOnDelete(!onDelete);
    }
    const DeleteStock = async () => {
        if (tableName === "stock") {
            const response = await deleteStock(id);
            console.log("delete", response);
            if (response.status === 204) {
                handleDelete();
                setLoading(false);
                setUpdate(false);
            }
        }
        else {
            console.log("chong",productId+"-"+id);
            const response = await deleteReview(productId, id);
            console.log("delete", response);
            if (response.status === 204) {
                handleDelete();
                setLoading(false);
                setUpdate(false);
            }
        }

        return response;
    }
    React.useEffect(() => {
        if (tableName === "stock" && !update) {
            const fetchStockByProduct = async () => {
                const response = await getAllStocksByProduct(productId)
                setDetails(response);
                setUpdate(true);
            }
            fetchStockByProduct();
        }
        else if (tableName === "review" && !update) {
            const fetchAllReviewsByProduct = async () => {
                const response = await getReviewsByProduct(productId);
                if (response.data) {
                    setDetails(response.data[0].reviews);
                    setUpdate(true);
                }
            }
            fetchAllReviewsByProduct();
        }
    }, [update])
    const sortedOrderDetails = stableSort(details, getComparator(order, orderBy));

    return (
        <div>
            <Modal
                keepMounted
                open={open}
                onClose={handleDetail}
                aria-labelledby="keep-mounted-modal-title"
                aria-describedby="keep-mounted-modal-description"
            >
                <Box sx={style}>
                    <Typography id="keep-mounted-modal-title" variant="h6" component="h2">
                        {tableName==="order"? ("Order Details"):tableName==="stock"?("Stock Details"):("Review Details")}
                    </Typography>
                    <div style={{ overflowY: 'scroll', height: '400px' }}>
                        <TableContainer component={Paper}>
                            <Table>
                                <EnhancedTableHead
                                    order={order}
                                    orderBy={orderBy}
                                    onRequestSort={handleRequestSort}
                                    headCells={headCells}
                                />
                                <TableBody>
                                    {sortedOrderDetails.map((orderDetail, index) => {
                                        if (tableName === "order") {
                                            if (orderDetail.product) {
                                                return (
                                                    <TableRow key={index}>
                                                        <TableCell component="th" scope="row">
                                                            {orderDetail.product.id}
                                                        </TableCell>
                                                        <TableCell align="left">{orderDetail.product.name}</TableCell>
                                                        <TableCell align="left">{orderDetail.size}</TableCell>
                                                        <TableCell align="left" style={{ textTransform: "uppercase" }}>
                                                            {orderDetail.color}
                                                        </TableCell>
                                                        <TableCell align="right">{orderDetail.product.price}$</TableCell>
                                                        <TableCell align="right">{orderDetail.quantity}</TableCell>
                                                    </TableRow>
                                                );
                                            } else {
                                                return (
                                                    <TableRow key={index}>
                                                        <TableCell colSpan={6} align="center">Product not found</TableCell>
                                                    </TableRow>
                                                );
                                            }
                                        }
                                        else if (tableName === "review") {
                                            if (orderDetail) {
                                                return (
                                                    <TableRow key={index}>
                                                        <TableCell component="th" scope="row">
                                                            {index + 1}
                                                        </TableCell>
                                                        <TableCell align="left">{productId}</TableCell>
                                                        <TableCell align="left">{orderDetail.user_name}</TableCell>
                                                        <TableCell align="left">{orderDetail.content}</TableCell>
                                                        <TableCell align="left" style={{ textTransform: "uppercase" }}>
                                                            {orderDetail.rating}
                                                        </TableCell>
                                                        <TableCell align="right">{orderDetail.createdAt}</TableCell>
                                                        <TableCell align="right" onClick={() => handleID(orderDetail)}>
                                                            <ul>
                                                                <li className="list-inline-item" onClick={handleDelete}>
                                                                    <button
                                                                        className="btn btn-danger btn-sm rounded-0"
                                                                        type="button"
                                                                        data-toggle="tooltip"
                                                                        data-placement="top"
                                                                        title="Delete"
                                                                    >
                                                                        <i className="fa fa-trash"></i>
                                                                    </button>
                                                                </li>
                                                            </ul>
                                                        </TableCell>
                                                    </TableRow>
                                                );
                                            } else {
                                                return (
                                                    <TableRow key={index}>
                                                        <TableCell colSpan={6} align="center">Product not found</TableCell>
                                                    </TableRow>
                                                );
                                            }
                                        }
                                        else {
                                            return (
                                                <TableRow key={index}>
                                                    <TableCell component="th" scope="row">
                                                        {orderDetail.id}
                                                    </TableCell>
                                                    <TableCell align="left">{orderDetail.productId}</TableCell>
                                                    <TableCell align="left">{orderDetail.size}</TableCell>
                                                    <TableCell align="left" style={{ textTransform: "uppercase" }}>
                                                        {orderDetail.color}
                                                    </TableCell>
                                                    <TableCell align="right">{orderDetail.quantity}</TableCell>
                                                    <TableCell align="right" onClick={() => handleID(orderDetail)}>
                                                        <ul>
                                                            <li className="list-inline-item" onClick={handleEdit}>
                                                                <button
                                                                    className="btn btn-success btn-sm rounded-0"
                                                                    type="button"
                                                                    data-toggle="tooltip"
                                                                    data-placement="top"
                                                                    title="Edit"
                                                                >
                                                                    <i className="fa fa-edit"></i>
                                                                </button>
                                                            </li>
                                                            <li className="list-inline-item" onClick={handleDelete}>
                                                                <button
                                                                    className="btn btn-danger btn-sm rounded-0"
                                                                    type="button"
                                                                    data-toggle="tooltip"
                                                                    data-placement="top"
                                                                    title="Delete"
                                                                >
                                                                    <i className="fa fa-trash"></i>
                                                                </button>
                                                            </li>
                                                        </ul>
                                                    </TableCell>
                                                </TableRow>
                                            );
                                        }
                                    })}
                                </TableBody>

                                {/* Render EditStock outside the table */}
                                {edit && (
                                    <EditStock
                                        handleEdit={handleEdit}
                                        open={edit}
                                        selectedStock={id}
                                        setUpdate={setUpdate}
                                        setLoading={setLoading}
                                    />
                                )}
                                {onDelete && <Delete closeDeleteModal={handleDelete} selectedProduct={selected} handleDeleteproduct={DeleteStock} table={tableName} action={"delete"} />}
                            </Table>
                        </TableContainer>
                    </div>

                </Box>
            </Modal>
        </div>
    );
}