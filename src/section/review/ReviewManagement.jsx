import { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import SortTable from "../../component/table/SortTable";
import { getAllReview, getReviewsByProduct } from "../../component/services/reviewService";


const ReviewManagement = () => {
    const [reviews, setReviews] = useState([]);
    const [reviewsByProduct ,setReviewsByProduct]= useState([]);
    const [selectedReviews, setSelectedReviews] = useState({});
    const [id, setID] = useState(null);
    const [loading, setLoading] = useState(false);
    const [onDetail, setOnDetail] = useState(false);
    const [edit,setOnEdit] = useState(false); 

    console.log("aaa",selectedReviews);
    const handleSort = (sortedArray) => {
        setReviews(sortedArray);
    };
    console.log("loading",loading);

    const reviewsColumns = [
        { key: "id", label: "No." },
        { key: "productId", label: "Product" },
        { key: "totalReviews", label: "Total Reviews" },
    ];
    const headCells = [
        { id: '_id', numeric: false, disablePadding: true, label: 'No' },
        { id: '', numeric: false, disablePadding: true, label: 'Product ID' },
        { id: 'user_name', numeric: false, disablePadding: false, label: 'Username' },
        { id: 'content', numeric: false, disablePadding: false, label: 'Content' },
        { id: 'rating', numeric: false, disablePadding: false, label: 'Rating' },
        { id: 'createdAt', numeric: true, disablePadding: false, label: 'Create Date' },
    
    ];
    const handleReviewSelect = (order) => {
        setSelectedReviews(order);
    };
    const handleDetail = () => {
        setOnDetail(!onDetail);
    }
    const handleEdit = () => {
        setOnEdit(!edit);
    }

    // useEffect(()=>{
    //     if(selectedReviews.productId){
            
    //     }
    // },[selectedReviews])
    useEffect(() => {
        if(!loading){
        const fetchAllreviews = async () => {
            try {
                const response = await getAllReview();
                console.log("rev data", response.data);
                if (response) {
                    setReviews(response.data);
                    setLoading(true);
                }
            } catch (error) {
                console.log(error);
            }
        }
        fetchAllreviews();
    }
    }, [loading])
    return (
        <div className="container-xl">
            <div className="table-responsive">
                <ToastContainer />
                <h1 style={{ textAlign: "center", marginBottom: "12px" }}>
                    Review Management
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
                        products={reviews}
                        onSort={handleSort}
                        columns={reviewsColumns}
                        onProductSelect={handleReviewSelect}
                        tableName={"review"}
                        handleDetail={handleDetail}
                        open={onDetail}
                        handleEdit={handleEdit}
                        openEditModal={edit}
                        setLoading={setLoading}
                        orderDetails={reviewsByProduct}
                        headCells={headCells}
                        productByStock={selectedReviews.productId}
                    />
                </div>
            </div>
        </div>


    )
}
export default ReviewManagement;