import { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import SortTable from "../../component/table/SortTable";
import { getAllOrder,getOrderById,changeOrderStatus } from "../../component/services/orderService";
import OrderDetail from "../../component/order/OrderDetails";


const OrderManagemet = () => {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState({});
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState([{ name: "PENDING", style: "btn btn-warning" }, { name: "COMPLETED", style: "btn btn-success" }, { name: "SHIPPING", style: "btn btn-info" }, { name: "CANCELLED", style: "btn btn-danger" }])
  const [onDetail, setOnDetail] = useState(false);
  const handleSort = (sortedArray) => {
    setOrders(sortedArray);
  };
  console.log(selectedOrder);

  const orderColumns = [
    { key: "id", label: "No." },
    { key: "receiverName", label: "Receiver Name" },
    { key: "receiverAddress", label: "Address" },
    { key: "receiverPhone", label: "Phone" },
    { key: "totalPrice", label: "Total" },
    { key: "transactionId", label: "TransactionID" },
    { key: "status", label: "Status" },
    { key: "paymentMethod", label: "Shipping Method" },
    { key: "pstatus", label: "Shipping Status" },
  ];

  const headCells = [
    { id: 'id', numeric: false, disablePadding: true, label: 'Product ID' },
    { id: 'name', numeric: false, disablePadding: false, label: 'Product Name' },
    { id: 'size', numeric: false, disablePadding: false, label: 'Size' },
    { id: 'color', numeric: false, disablePadding: false, label: 'Color' },
    { id: 'price', numeric: true, disablePadding: false, label: 'Price' },
    { id: 'quantity', numeric: true, disablePadding: false, label: 'Quantity' },

];
  const handleOrderSelect = (order) => {
    setSelectedOrder(order);
  };
  const handleDetail =()=>{
    setOnDetail(!onDetail);
  }
  useEffect(()=>{
    const fetchAllOrder= async()=>{
      try {
        const response = await getAllOrder();
        console.log("rev data",response);
        if(response){  
          setOrders(response);
          setLoading(true);

        }

      } catch (error) {
        console.log(error);  
      }
    }
    fetchAllOrder();
  },[loading])

 
  const handleChangeStatus= async(id,status)=>{
    try {
      const response = await changeOrderStatus(id,status);
      console.log("change order", response);
      if(response){
        toast.success("STATUS HAS BEEN CHANGED SUCCESSFULLY!") ;
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
          Order Management
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
  
              </div>
            </div>
          </div>
          <SortTable
            products={orders}
            onSort={handleSort}
            columns={orderColumns}
            changeStatus = {handleChangeStatus}
            onProductSelect={handleOrderSelect}
            tableName={"order"}
            orderStatus={status}
            handleDetail = {handleDetail}
            open={onDetail}
            orderDetails={selectedOrder.orderDetails}
            headCells= {headCells}
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
export default OrderManagemet;