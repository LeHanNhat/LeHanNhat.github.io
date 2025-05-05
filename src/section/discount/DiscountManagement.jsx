import { useEffect, useState } from "react";
import { createDiscountCode, deleteDiscountCode, getAllDiscountCode, updateDiscountCode } from "../../component/services/discountService";
import { ToastContainer, toast } from "react-toastify";
import SortTable from "../../component/table/SortTable";
import Delete from "../../component/action/Delete";

const DiscountManagement = () => {
    const [discounts, setDiscounts] = useState([]);
    const [selectedDiscount, setSelectedDiscount] = useState({});
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showAddModal, setShowAddModal] = useState(false);
     const [showEditModal, setShowEditModal] = useState(false);
    const [loading, setLoading] = useState(false);
    console.log("discounts", selectedDiscount);

    const discountColumns = [
        { key: "id", label: "No." },
        { key: "code", label: "Code" },
        { key: "percentage", label: "Rate" },

    ];
    const closeAddModal = () => setShowAddModal(false);
    const openDeleteModal = () => {
        setShowDeleteModal(true);
    };
    const openAddModal = () => {
        setShowAddModal(true);
    };
    const closeDeleteModal = () => setShowDeleteModal(false);
    const openEditModal = (category) => {
        setShowEditModal(true);
      };
      const closeEditModal = () => setShowEditModal(false);
    const handleDiscountSelect = (order) => {
        setSelectedDiscount(order);
    };
    const handleSort = (sortedArray) => {
        setDiscounts(sortedArray);
    };
    const deleteDiscount = async () => {
        try {
            const response = await deleteDiscountCode(selectedDiscount.id);
            if (response === 204) {
                toast.success("Discount code deleted successfully!");
                setLoading(false);
            }
            closeDeleteModal();
        } catch (error) {
            console.log(error);
        }
    }
    const handleAddDiscount = async (e) => {
        e.preventDefault();
        const newDiscount = {
            code: e.target.code.value,
            percentage: parseInt(e.target.percentage.value)
        };
        console.log(newDiscount);
        try {
            const response = await createDiscountCode(newDiscount);
            if (response.data) {
                toast.success("Discount code added successfully!");
            }
            setLoading(false);
            closeAddModal();
        } catch (error) {
            console.log(error);
        }
    };
    const handleEditDiscount = async (e) => {
        e.preventDefault();
        const updatedDiscount = {
            code: e.target.code.value,
            percentage: parseInt(e.target.percentage.value)
        };
        console.log(updatedDiscount);
        try {
            const response = await updateDiscountCode(selectedDiscount.id, updatedDiscount);
            if (response.data) {
                toast.success("Discount code updated successfully!");
            }
            setLoading(false);
            closeEditModal();
        } catch (error) {
            console.log(error);
        }
    };
    useEffect(() => {
        const fetchAllDiscount = async () => {
            try {
                const response = await getAllDiscountCode();
                console.log("rev discounts", response);
                if (response) {
                    setDiscounts(response);
                    setLoading(true);
                }
            } catch (error) {
                console.log(error);
            }
        }
        fetchAllDiscount();
    }, [loading])
    return (<>
        <div className="container-xl">
            <div className="table-responsive">
                <ToastContainer />
                <h1 style={{ textAlign: "center", marginBottom: "12px" }}>
                    Discount Code Management
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
                                <div
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
                                </div>
                            </div>
                        </div>
                    </div>
                    <SortTable
                        products={discounts}
                        onSort={handleSort}
                        columns={discountColumns}
                        // changeStatus={handleChangeStatus}
                        onProductSelect={handleDiscountSelect}
                        openDeleteModal={openDeleteModal}
                        tableName={"discount"}
                        openEditModal={openEditModal}
                    />
                </div>
            </div>
        </div>
        {showAddModal && (
            <div
                className="modal fade show"
                id="exampleModal"
                tabIndex="-1"
                role="dialog"
                aria-labelledby="exampleModalLabel"
                aria-hidden="true"
            >
                <div className="modal-dialog" role="document">
                    <div className="modal-content">
                        <div className="modal-header d-flex justify-content-between">
                            <h5 className="modal-title" id="exampleModalLabel">
                                Add
                            </h5>
                            <button
                                type="button"
                                className="close"
                                data-dismiss="modal"
                                aria-label="Close"
                                onClick={closeAddModal}
                            >
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div className="modal-body">
                            <form onSubmit={handleAddDiscount}>
                                <div className="form-group">
                                    <label htmlFor="code">Discount Code</label>
                                    <input
                                        type="text"
                                        name="code"
                                        className="form-control"
                                        placeholder="Start with BAKI..."
                                        id="code"
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="percentage">Percentage</label>
                                    <input
                                        type="number"
                                        name="percentage"
                                        className="form-control"
                                        placeholder="0-100"
                                        id="percentage"
                                        min="0"
                                        max="100"
                                        required
                                    />
                                </div>
                                <div
                                    className="d-flex justify-content-between"
                                    style={{ marginTop: "20px" }}
                                >
                                    <button type="submit" className="btn btn-primary">
                                        Add
                                    </button>
                                    <button
                                        type="button"
                                        className="btn btn-secondary"
                                        onClick={closeAddModal}
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        )}
            {showEditModal && (
            <div
                className="modal fade show"
                id="exampleModal"
                tabIndex="-1"
                role="dialog"
                aria-labelledby="exampleModalLabel"
                aria-hidden="true"
            >
                <div className="modal-dialog" role="document">
                    <div className="modal-content">
                        <div className="modal-header d-flex justify-content-between">
                            <h5 className="modal-title" id="exampleModalLabel">
                                Edit
                            </h5>
                            <button
                                type="button"
                                className="close"
                                data-dismiss="modal"
                                aria-label="Close"
                                onClick={closeEditModal}
                            >
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div className="modal-body">
                            <form onSubmit={handleEditDiscount}>
                                <div className="form-group">
                                    <label htmlFor="code">Discount Code</label>
                                    <input
                                        type="text"
                                        name="code"
                                        className="form-control"
                                        placeholder="Start with BAKI..."
                                        id="code"
                                        defaultValue={selectedDiscount.code}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="percentage">Percentage</label>
                                    <input
                                        type="number"
                                        name="percentage"
                                        className="form-control"
                                        placeholder="0-100"
                                        id="percentage"
                                        min="0"
                                        max="100"
                                        defaultValue={selectedDiscount.percentage}
                                        required
                                    />
                                </div>
                                <div
                                    className="d-flex justify-content-between"
                                    style={{ marginTop: "20px" }}
                                >
                                    <button type="submit" className="btn btn-primary">
                                        Edit
                                    </button>
                                    <button
                                        type="button"
                                        className="btn btn-secondary"
                                        onClick={closeEditModal}
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        )}
        {showDeleteModal && (
            <Delete
                closeDeleteModal={closeDeleteModal}
                selectedProduct={selectedDiscount}
                handleDeleteproduct={deleteDiscount}
                table={"discount"}
            />
        )}
    </>);
}

export default DiscountManagement;