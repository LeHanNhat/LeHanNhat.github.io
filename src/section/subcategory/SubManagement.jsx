import axios from "axios";
import React, { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Delete from "../../component/action/Delete";
import SortTable from "../../component/table/SortTable";


const SubManagement = () => {
  const [subcategories, setSubcategories] = useState([]);
  const [category, setCategory] = useState([]);
  const [selectedSubcategories, setselectedSubcategories] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showDetailModal, setDetailModal] = useState(false);
  const [selectAll, setSelectAll] = useState(false);
  const [listUser, setListUser] = useState([]);
   const [isUpdate, setIsUpdate] = useState(false);
  console.log("bem", selectedSubcategories);

  const handleSubSort = (sortedArray) => {
    setSubcategories(sortedArray);
  };
  const subcategoryColumns = [
    { key: "id", label: "No." },
    { key: "name", label: "Name" },
    { key: "categoryName", label: "Category" },
  ];
  const handleSubSelect = (category) => {
    setselectedSubcategories(category);
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
      setListUser(subcategories.map((item) => item.id));
    }
    setSelectAll(!selectAll);
  };
  useEffect(() => {
    const fetchData = async () => {
      const response = await axios.get("/api/service/subcategories");
      console.log("check", response.data);
      setIsUpdate(false);
      setSubcategories(response.data);
    };
    fetchData();
    const fetchCategory = async () => {
      const response = await axios.get("/api/service/categories");
      console.log("category", response.data);
      setCategory(response.data);
    };
    fetchCategory();
  }, [isUpdate]);
  const openDetailModal = async () => {
    setDetailModal(true);
    try {
      const response = await axios.get(
        `/api/service/subcategories/${selectedSubcategories.id}`
      );
      console.log("Here", response.data);
    } catch (error) {
      console.error("Error fetching subcategories data:", error);
    }
  };
  const closeDetailModal = () => setDetailModal(false);
  const openAddModal = () => {
    setShowAddModal(true);
  };
  const closeAddModal = () => setShowAddModal(false);

  const openEditModal = (subcategories) => {
    setShowEditModal(true);
  };
  const closeEditModal = () => setShowEditModal(false);

  const openDeleteModal = () => {
    setShowDeleteModal(true);
  };
  const closeDeleteModal = () => setShowDeleteModal(false);

  const handleAddsubcategories = async (e) => {
    e.preventDefault();
    const newsubcategories = {
      categoryId: e.target.categoryId.value,
      name: e.target.name.value,
    };
    console.log("newsubcategories", newsubcategories);
    console.log("category list", category);

    try {
      const response = await axios.post(
        "/api/service/subcategories",
        newsubcategories
      );
      if (response.data) {
        toast.success("Subcategory added successfully!");
      }
      setIsUpdate(true);
      closeAddModal();
    } catch (error) {
      console.log(error);
    }
  };

  const handleEditsubcategories = async (e) => {
    e.preventDefault();

    const updatesubcategories = {
      ...selectedSubcategories,
      name: e.target.name.value,
    };
    console.log("check update ", selectedSubcategories);

    try {
      const response = await axios.put(
        `/api/service/subcategories/${selectedSubcategories.id}`,
        updatesubcategories
      );
      if (response.data) {
        toast.success("Subcategory is edited successfully!");
      }
      console.log("check update", response.data);
      setSubcategories(
        subcategories.map((emp) =>
          emp.id === selectedSubcategories.id
            ? {
                ...selectedSubcategories,
                ...{
                  categoryId: e.target.categoryId.value,
                  name: e.target.name.value,
                },
              }
            : emp
        )
      );
      setIsDataUpdated(true);
      closeEditModal();
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeletesubcategories = async () => {
    try {
      const response = await axios.delete(
        `/api/service/subcategories/${selectedSubcategories.id}`
      );
      toast.success("Subcategory is deleted successfully!");
      console.log("after delete", response.data);
    } catch (error) {
      console.log(err);
    }
    setSubcategories(
      subcategories.filter((emp) => emp.id !== selectedSubcategories.id)
    );
    closeDeleteModal();
  };

  return (
    <div className="container-xl">
      <div className="table-responsive">
        <ToastContainer />
        <h1 style={{ textAlign: "center", marginBottom: "12px" }}>
          Subcategory Management
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
            products={subcategories}
            onSort={handleSubSort}
            columns={subcategoryColumns}
            openDetailModal={openDetailModal}
            openEditModal={openEditModal}
            openDeleteModal={openDeleteModal}
            onProductSelect={handleSubSelect}
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
                <form onSubmit={handleAddsubcategories}>
                  <div className="form-group">
                    <label htmlFor="name">Name</label>
                    <input
                      type="text"
                      name="name"
                      className="form-control"
                      placeholder="Name..."
                      id="name"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="categoryId">Category</label>
                    {category && (
                      <select
                        class="form-select form-select-sm"
                        aria-label=".form-select-sm example"
                        name="categoryId"
                      >
                        {category.map((item, index) => (
                          <option key={index} value={item.id}>
                            {item.name}
                          </option>
                        ))}
                      </select>
                    )}
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
                    <th>Name</th>
                    <th>Category</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>{selectedSubcategories.name}</td>
                    <td>{selectedSubcategories.categoryId}</td>
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
                <form onSubmit={handleEditsubcategories}>
                  <div className="form-group">
                    <label htmlFor="name">name</label>
                    <input
                      type="text"
                      name="name"
                      className="form-control"
                      id="name"
                      defaultValue={selectedSubcategories.name}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="categoryId">Category</label>
                    {category && (
                      <select
                        className="form-select form-select-sm"
                        aria-label=".form-select-sm example"
                        name="categoryId"
                        value={selectedSubcategories.categoryId}
                        onChange={(e) => {
                          setselectedSubcategories({
                            ...selectedSubcategories,
                            categoryId: e.target.value,
                          });
                        }}
                      >
                        {category.map((item, index) => {
                          if (item.id === selectedSubcategories.categoryId) {
                            return (
                              <option key={index} value={item.id}>
                                {item.name}
                              </option>
                            );
                          }
                          return (
                            <option key={index} value={item.id}>
                              {item.name}
                            </option>
                          );
                        })}
                      </select>
                    )}
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
          selectedProduct={selectedSubcategories}
          handleDeleteproduct={handleDeletesubcategories}
          table={""}
        />
      )}
    </div>
  );
};

export default SubManagement;
