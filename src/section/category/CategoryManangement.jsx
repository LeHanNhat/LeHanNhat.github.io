import axios from "axios";
import React, { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import SortTable from "../../component/table/SortTable";
import Delete from "../../component/action/Delete";

const CategoryManagement = () => {
  const [category, setCategory] = useState([]);
  const [selectedCategory, setselectedCategory] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showDetailModal, setDetailModal] = useState(false);
  const [selectAll, setSelectAll] = useState(false);
  const [listUser, setListUser] = useState([]);
   const [isUpdate, setIsUpdate] = useState(false);
  console.log(selectedCategory);

  const handleSort = (sortedArray) => {
    setCategory(sortedArray);
  };
  const categoryColumns = [
    { key: "id", label: "No." },
    { key: "name", label: "Name" },
  ];
  const handleCatSelect = (category) => {
    setselectedCategory(category);
  };

  const handleHandleCheck = (user) => {
    setListUser((prevSelected) => {
      return prevSelected.includes(user.id)
        ? prevSelected.filter((id) => id !== user.id)
        : [...prevSelected, user.id];
    });
  };
  const handleSelectAll = () => {
    if (selectAll) {
      setListUser([]);
    } else {
      setListUser(category.map((item) => item.id));
    }
    setSelectAll(!selectAll);
  };
  useEffect(() => {
    const fetchData = async () => {
      const response = await axios.get("/api/service/categories");
      console.log("check", response.data);
      setIsUpdate(false);
      setCategory(response.data);
    };
    fetchData();
  }, [isUpdate]);
  const openDetailModal = async () => {
    setDetailModal(true);
    try {
      const response = await axios.get(
        `/api/service/categories/${selectedCategory.id}`
      );
      console.log("Here", response.data);
    } catch (error) {
      console.error("Error fetching category data:", error);
    }
  };
  const closeDetailModal = () => setDetailModal(false);
  const openAddModal = () => {
    setShowAddModal(true);
  };
  const closeAddModal = () => setShowAddModal(false);

  const openEditModal = (category) => {
    setShowEditModal(true);
  };
  const closeEditModal = () => setShowEditModal(false);

  const openDeleteModal = () => {
    setShowDeleteModal(true);
  };
  const closeDeleteModal = () => setShowDeleteModal(false);

  const handleAddcategory = async (e) => {
    e.preventDefault();
    const newcategory = {
      name: e.target.name.value,
    };
    console.log(newcategory);

    try {
      const response = await axios.post(
        "/api/service/categories",
        newcategory
      );
      if (response.data) {
        toast.success("Category added successfully!");
      }
      setIsUpdate(true);
      closeAddModal();
    } catch (error) {
      console.log(err);
    }
  };

  const handleEditcategory = async (e) => {
    e.preventDefault();

    const updatecategory = {
      ...selectedCategory,
      name: e.target.name.value,
    };
    console.log("check update ", selectedCategory);

    try {
      const response = await axios.put(
        `/api/service/categories/${selectedCategory.id}`,
        updatecategory
      );
      if (response.data) {
        toast.success("Category is edited successfully!");
      }
      console.log("check update", response.data);
      setCategory(
        category.map((emp) =>
          emp.id === selectedCategory.id
            ? {
                ...selectedCategory,
                ...{
                  name: e.target.name.value,
                },
              }
            : emp
        )
      );
      closeEditModal();
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeletecategory = async () => {
    try {
      const response = await axios.delete(
        `/api/service/categories/${selectedCategory.id}`
      );
      toast.success("Category is deleted successfully!");
      console.log("after delete", response.data);
    } catch (error) {
      console.log(err);
    }
    setCategory(category.filter((emp) => emp.id !== selectedCategory.id));
    closeDeleteModal();
  };

  return (
    <div className="container-xl">
      <div className="table-responsive">
        <ToastContainer />
        <h1 style={{ textAlign: "center", marginBottom: "12px" }}>
          Category Management
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
            products={category}
            onSort={handleSort}
            columns={categoryColumns}
            openDetailModal={openDetailModal}
            openEditModal={openEditModal}
            openDeleteModal={openDeleteModal}
            onProductSelect={handleCatSelect}
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
                <form onSubmit={handleAddcategory}>
                  <div className="form-group">
                    <label htmlFor="name">Category Name</label>
                    <input
                      type="text"
                      name="name"
                      className="form-control"
                      placeholder="name..."
                      id="name"
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

      {showDetailModal && (
        <div
          class="modal show bd-example-modal-lg"
          tabindex="-1"
          role="dialog"
          aria-labelledby="myLargeModalLabel"
          aria-hidden="true"
        >
          <div class="modal-dialog modal-lg">
            <div class="modal-content">
              <table class="table table-bordered modalDetail">
                <thead>
                  <tr>
                    {/* <th>ID</th> */}
                    <th>Name</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    {/* <td>{selectedCategory.id}</td> */}
                    <td>{selectedCategory.name}</td>
                    <td>
                      <button
                        onClick={closeDetailModal}
                        class="btn btn-danger btn-sm rounded-0"
                        type="button"
                        data-toggle="tooltip"
                        data-placement="top"
                        title="Delete"
                      >
                        X
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
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
                <form onSubmit={handleEditcategory}>
                  <div className="form-group">
                    <label htmlFor="name">name</label>
                    <input
                      type="text"
                      name="name"
                      className="form-control"
                      id="name"
                      defaultValue={selectedCategory.name}
                      required
                    />
                  </div>
                  <div
                    className="d-flex justify-content-between"
                    style={{ marginTop: "20px" }}
                  >
                    <button type="submit" className="btn btn-primary">
                      Update
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
        selectedProduct={selectedCategory}
        handleDeleteproduct={handleDeletecategory}
        table={"category"}
      />
      )}
    </div>
  );
};

export default CategoryManagement;
