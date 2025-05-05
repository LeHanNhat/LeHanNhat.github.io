import { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import SortTable from "../../component/table/SortTable";
import { getAllStocks } from "../../component/services/stockServices";
import OrderDetail from "../../component/order/OrderDetails";
import EditStock from "../../component/action/EditStock";


const StockManagement = () => {
    const [stocks, setStocks] = useState([]);
    const [selectedStock, setSelectedStock] = useState({});
    const  status =["true"];
    const [loading, setLoading] = useState(false);
    const [onDetail, setOnDetail] = useState(false);
    const [edit,setOnEdit] = useState(false); 
    const handleSort = (sortedArray) => {
        setStocks(sortedArray);
    };
    console.log("loading",loading);

    const stockColumns = [
        { key: "id", label: "No." },
        { key: "product", label: "Product" },
        { key: "total", label: "Stock" },
    ];
    const headStocks = [
        { id: 'id', numeric: false, disablePadding: true, label: 'No' },
        { id: 'name', numeric: false, disablePadding: false, label: 'Product ID' },
        { id: 'size', numeric: false, disablePadding: false, label: 'Size' },
        { id: 'color', numeric: false, disablePadding: false, label: 'Color' },
        { id: 'quantity', numeric: true, disablePadding: false, label: 'Quantity' },
    
    ];
    const handleStockSelect = (order) => {
        setSelectedStock(order);
    };
    const handleDetail = () => {
        setOnDetail(!onDetail);
    }
    const handleEdit = () => {
        setOnEdit(!edit);
    }
    useEffect(() => {
        if(!loading){
        const fetchAllStock = async () => {
            try {
                const response = await getAllStocks();
                console.log("rev data", response);
                if (response) {
                    setStocks(response);
                    setLoading(true);

                }

            } catch (error) {
                console.log(error);
            }
        }
        fetchAllStock();
    }
    }, [loading])


    const handleChangeStatus = async (id, status) => {
        try {
            const response = await changeOrderStatus(id, status);
            console.log("change order", response);
            if (response) {
                toast.success("STATUS HAS BEEN CHANGED SUCCESSFULLY!");
                setLoading(false);
            }
        } catch (error) {
            console.log(error);
        }
    }
    return (
        <div className="container-xl">
            <div className="table-responsive">
                <ToastContainer />
                <h1 style={{ textAlign: "center", marginBottom: "12px" }}>
                    Stock Management
                </h1>
                <div className="table-wrapper">
                    <div className="table-title">
                        <div className="row">
                            <div className="col-sm-6"></div>
                            <div
                                className="col-sm-6"
                                style={{
                                    display: "flex",
                                    flexDirection: "row",
                                    alignItems: "center",
                                }}
                            >
                                <div class="input-group">
                                    <input
                                        type="search"
                                        class="form-control rounded"
                                        placeholder="Search"
                                        aria-label="Search"
                                        aria-describedby="search-addon"
                                    />
                                    <button
                                        type="button"
                                        class="btn btn-primary"
                                        data-mdb-ripple-init
                                    >
                                        <i class="fas fa-search"></i>
                                    </button>
                                </div>
                                {/* <div
                  class="input-group"
                  style={{
                    width: "340px",
                    display: "flex",
                    justifyContent: "end",
                  }}
                >
                  <button
                    onClick={openAddModal}
                    type="button"
                    class="btn btn-primary btn-sm"
                  >
                    <i className="material-icons">&#xE147;</i> <span>Add</span>
                  </button>
                  <button
                    onClick={() => openDeleteModal()}
                    type="button"
                    class="btn btn-danger btn-sm"
                    style={{ marginLeft: "10px" }}
                  >
                    <i className="material-icons">&#xE15C;</i>{" "}
                    <span>Delete</span>
                  </button>
                </div> */}
                            </div>
                        </div>
                    </div>
                    <SortTable
                        products={stocks}
                        onSort={handleSort}
                        columns={stockColumns}
                        changeStatus={handleChangeStatus}
                        onProductSelect={handleStockSelect}
                        tableName={"stock"}
                        orderStatus={stocks}
                        handleDetail={handleDetail}
                        headCells={headStocks}
                        open={onDetail}
                        handleEdit={handleEdit}
                        openEditModal={edit}
                        productByStock={selectedStock.product}
                        setLoading={setLoading}
                    />
                </div>
                {/* <div class="clearfix">
                      <div class="hint-text">Showing <b>5</b> out of <b>25</b> entries</div>
                      <ul class="pagination">
                          <li class="page-item disabled"><a href="#">Previous</a></li>
                          <li class="page-item"><a href="#" class="page-link">1</a></li>
                          <li class="page-item"><a href="#" class="page-link">2</a></li>
                          <li class="page-item active"><a href="#" class="page-link">3</a></li>
                          <li class="page-item"><a href="#" class="page-link">4</a></li>
                          <li class="page-item"><a href="#" class="page-link">5</a></li>
                          <li class="page-item"><a href="#" class="page-link">Next</a></li>
                      </ul>
                  </div> */}
            </div>
        </div>


    )
}
export default StockManagement;