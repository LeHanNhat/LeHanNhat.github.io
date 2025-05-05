import axios from "axios";
import React, { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import SortTable from "../../component/table/SortTable";
import Delete from "../../component/action/Delete";

const BrandManagement = () => {
  const [brand, setBrand] = useState([]);
  const [selectedBrand, setselectedBrand] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showDetailModal, setDetailModal] = useState(false);
  const [selectAll, setSelectAll] = useState(false);
  const [isUpdate, setIsUpdate] = useState(false);
  const [listUser, setListUser] = useState([]);
  const [file, setFile] = useState(null);
  console.log("opoppo", selectedBrand);
  let formData = new FormData();

  const handleSort = (sortedArray) => {
    setBrand(sortedArray);
  };
  const brandColumns = [
    { key: "id", label: "No." },
    { key: "logo", label: "Logo" },
    { key: "name", label: "Name" },
  ];
  const handleBrandSelect = (brand) => {
    setselectedBrand(brand);
  };
  const addFile = (e) => {
    if (e.target && e.target.files && e.target.files.length > 0) {
      const newFile = e.target.files[0];
      const imageUrl = URL.createObjectURL(newFile);
      setFile(e.target.files[0]);
      setselectedBrand(prevProduct => ({
        ...prevProduct,
        logo: imageUrl
      }));
    }
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
      setListUser(brand.map((item) => item.id));
    }
    setSelectAll(!selectAll);
  };
  useEffect(() => {
    const fetchData = async () => {
      const response = await axios.get("/api/service/brands");
      console.log("check", response.data);
      setIsUpdate(false);
      setBrand(response.data);
    };
    fetchData();
  }, [isUpdate]);
  const openDetailModal = async () => {
    setDetailModal(true);
    try {
      const response = await axios.get(
        `/api/service/brands/${selectedBrand.id}`
      );
      console.log("Here", response.data);
    } catch (error) {
      console.error("Error fetching brand data:", error);
    }
  };
  const closeDetailModal = () => setDetailModal(false);
  const openAddModal = () => {
    setselectedBrand(null);
    setShowAddModal(true);
  };
  const closeAddModal = () => setShowAddModal(false);

  const openEditModal = (brand) => {
    setShowEditModal(true);
  };
  const closeEditModal = () => setShowEditModal(false);

  const openDeleteModal = () => {
    setShowDeleteModal(true);
  };
  const closeDeleteModal = () => setShowDeleteModal(false);

  const handleAddbrand = async (e) => {
    e.preventDefault();
    const newbrand = {
      name: e.target.name.value,
      logo: e.target.logo.value,
    };
    console.log(newbrand);
    const brand = new Blob([JSON.stringify(newbrand)], {
      type: "application/json",
    });
    formData.append("brand", brand);
    if (file) {
      formData.append("file", file);
    }

    try {
      const response = await axios.post("/api/service/brands", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      if (response.data) {
        console.log("res", response.data);
        toast.success("Brand added successfully!");
        closeAddModal();
        setIsUpdate(true);
      }
      setBrand([
        ...brand,
        {
          ...response.data,
          id: response.data.id,
        },
      ]);
    } catch (error) {
      console.log(error);
    }
  };
  const handleEditbrand = async (e) => {
    e.preventDefault();

    const updatebrand = {
      ...selectedBrand,
      name: e.target.name.value,
    };
    console.log("check update ", selectedBrand);
    const editBrand = new Blob([JSON.stringify(updatebrand)], {
      type: "application/json",
    });
    formData.append("brand", editBrand);
    if (file) {
      formData.append("file", file);
    }
    try {
      const response = await axios.put(
        `/api/service/brands/${selectedBrand.id}`,
        formData
      );
      if (response.data) {
        console.log("return", response.data);

        closeEditModal();

        setBrand(
          brand.map((emp) =>
            emp.id === selectedBrand.id
              ? (response.data)
              : emp
          )
        );
        toast.success("Brand edit successfully!");

      }
      console.log("check update", response.data);

    } catch (error) {
      console.log(error);
    }
  };

  const handleDeletebrand = async () => {
    try {
      const response = await axios.delete(
        `/api/service/brands/${selectedBrand.id}`
      );
      toast.success("Brand is deleted successfully!");
      console.log("after delete", response.data);
    } catch (error) {
      console.log(err);
    }
    setBrand(brand.filter((emp) => emp.id !== selectedBrand.id));
    closeDeleteModal();
  };

  return (
    <div className="container-xl">
      <div className="table-responsive">
        <h1 style={{ textAlign: "center", marginBottom: "12px" }}>
          Brand Management
        </h1>
        <ToastContainer />
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
            products={brand}
            onSort={handleSort}
            columns={brandColumns}
            openDetailModal={openDetailModal}
            openEditModal={openEditModal}
            openDeleteModal={openDeleteModal}
            onProductSelect={handleBrandSelect}
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
                <form onSubmit={handleAddbrand}>
                  <div className="form-group">
                    <label htmlFor="name">Name</label>
                    <input
                      type="text"
                      name="name"
                      className="form-control"
                      placeholder="name..."
                      id="name"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="logo">Logo</label>
                    <input
                      type="file"
                      name="logo"
                      className="form-control"
                      placeholder="logo..."
                      id="logo"
                      onChange={addFile}
                     
                    />
                    {selectedBrand && <div style={{ width: "80px" }}>
                      {" "}
                      <img
                        style={{ maxWidth: "100%" }}
                        src={selectedBrand.logo}
                        alt=""
                      />
                    </div>}
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
                    <th>Logo</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>{selectedBrand.name}</td>
                    <td>{selectedBrand.logo}</td>
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
                <form onSubmit={handleEditbrand}>
                  <div className="form-group">
                    <label htmlFor="name">name</label>
                    <input
                      type="text"
                      name="name"
                      className="form-control"
                      id="name"
                      defaultValue={selectedBrand.name}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="logo">logo</label>
                    <input
                      onChange={addFile}
                      type="file"
                      name="logo"
                      className="form-control"
                      id="logo"

                    />
                    <div style={{ width: "80px" }}>
                      {" "}
                      <img
                        style={{ maxWidth: "100%" }}
                        src={selectedBrand.logo}
                        alt=""
                      />
                    </div>
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
       selectedProduct={selectedBrand}
       handleDeleteproduct={handleDeletebrand}
       table={"brand"}
     />
      )}
    </div>
  );
};

export default BrandManagement;
