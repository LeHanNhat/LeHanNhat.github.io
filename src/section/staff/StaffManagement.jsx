import axios from "axios";
import React, { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Delete from "../../component/action/Delete";
import SortTable from "../../component/table/SortTable";
import "./StaffManagement.css";

const StaffManagement = () => {
  const [staffs, setStaffs] = useState([]);
  const [selectedStaff, setselectedStaff] = useState(null);
  const [showChangeRole, setShowChangeRole] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showDetailModal, setDetailModal] = useState(false);
  const [check, setCheck] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const baseURL = "/api/admin";

  console.log(selectedStaff);
  const staffColumns = [
    { key: "id", label: "No." },
    // { key: "username", label: "Username" },
    { key: "fullName", label: "Full Name" },
    { key: "email", label: "Email" },
    { key: "phone", label: "Phone" },
    { key: "role", label: "Role" },
  ];

  useEffect(() => {
    const fetchData = async () => {
      const response = await axios.get(`${baseURL}/`);
      console.log("check", response.data);
      if (response.data) {
        setIsLoading(false);
        setStaffs(response.data);
      }
    };
    fetchData();
  }, [isLoading]);
  const openDetailModal = async () => {
    setDetailModal(true);
    try {
      const response = await axios.get(`${baseURL}/${selectedStaff.id}`);
      console.log("Here", response.data);
    } catch (error) {
      console.error("Error fetching staff data:", error);
    }
  };
  const handleSort = (sortedArray) => {
    setStaffs(sortedArray);
  };
  const closeDetailModal = () => setDetailModal(false);
  const openAddModal = () => {
    setShowChangeRole(true);
  };
  const closeAddModal = () => setShowChangeRole(false);

  const openEditModal = () => {
    setShowEditModal(true);
  };
  const closeEditModal = () => setShowEditModal(false);

  const openDeleteModal = () => {
    setShowDeleteModal(true);
  };
  const closeDeleteModal = () => setShowDeleteModal(false);

  const handleChangeRole = async (e) => {
    e.preventDefault();
    const newstaff = {
      username: e.target.username.value,
      password: e.target.password.value,
      email: e.target.email.value,
      phone: e.target.phone.value,
      address: e.target.address.value,
      fullName: e.target.fullName.value,
      // role: e.target.role.value,
      // status: e.target.status.value,
    };
    console.log("new staff", newstaff);

    try {
      const response = await axios.post(baseURL, newstaff);
      if (response.data) {
        closeAddModal();
        toast.success("Add staff successfully!!!");
        setIsLoading(true);
        // setStaffs([
        //   ...staffs,
        //   {
        //     ...newstaff,
        //     id: response.data.id,
        //   },
        // ]);
      
      }
    } catch (error) {
      console.log(error);
    }
  };
  const handleProductSelect = (product) => {
    setselectedStaff(product);
  };

  const handleEditstaff = async (e) => {
    e.preventDefault();

    const updatestaff = {
      ...selectedStaff,
      username: e.target.username.value,
      email: e.target.email.value,
      phone: e.target.phone.value,
      address: e.target.address.value,
      // avatar: e.target.avatar.value,
      // role: e.target.role.value,
      // status: e.target.status.value,
      fullName: e.target.fullName.value,
    };
    console.log("check update ", selectedStaff);

    try {
      const response = await axios.put(
        `${baseURL}/${selectedStaff.id}`,
        updatestaff
      );
      console.log("check update", response.data);
      setStaffs(
        staffs.map((emp) =>
          emp.id === selectedStaff.id
            ? {
              ...selectedStaff,
              ...{
                username: e.target.username.value,
                fullName:e.target.fullName.value,
                email: e.target.email.value,
                phone: e.target.phone.value,
                address: e.target.address.value,
                // avatar: e.target.avatar.value,
                role: response.data.role,
                // status: e.target.status.value,
              },
            }
            : emp
        )
      );
      closeEditModal();
      toast.success("Edit successfully!!!");
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeletestaff = async () => {
    try {
      const response = await axios.delete(
        `${baseURL}/fire/${selectedStaff.id}`
      );
     

    } catch (error) {
      console.log(error);
    }
    toast.success("Deleted Sucessully!!");
    setStaffs(staffs.filter((emp) => emp.id !== selectedStaff.id));
    closeDeleteModal();
  };

  return (
    <div className="container-xl">
      <ToastContainer/>
      <div className="table-responsive">
        <h1 style={{ textAlign: "center", marginBottom: "12px" }}>
          Staff Management
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
            products={staffs}
            onSort={handleSort}
            columns={staffColumns}
            openDetailModal={openDetailModal}
            openEditModal={openEditModal}
            openDeleteModal={openDeleteModal}
            onProductSelect={handleProductSelect}
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

      {showChangeRole && (
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
                <form onSubmit={handleChangeRole}>
                  <div className="form-group">
                    <label htmlFor="fullName">Full Name</label>
                    <input
                      type="text"
                      name="fullName"
                      className="form-control"
                      id="fullName"
                      placeholder="..."
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="username">Username</label>
                    <input
                      type="text"
                      name="username"
                      className="form-control"
                      placeholder="name..."
                      id="username"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="password">Password</label>
                    <input
                      type="password"
                      name="password"
                      className="form-control"
                      placeholder="password..."
                      id="password"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input
                      type="email"
                      name="email"
                      className="form-control"
                      id="email"
                      placeholder="email..."
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="phone">Phone</label>
                    <input
                      type="text"
                      name="phone"
                      className="form-control"
                      id="phone"
                      placeholder="phone..."
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="address">Address</label>
                    <input
                      type="text"
                      name="address"
                      className="form-control"
                      id="address"
                      placeholder="address..."
                      required
                    />
                  </div>

                  {/* <div className="form-group">
                                        <label htmlFor="role">Role</label>
                                        <select class="form-select form-select-sm" aria-label=".form-select-sm example" id="role" name="role">
                                            <option selected value="0">STAFF</option>
                                            <option value="1">ADMIN</option>
                                        </select>
                                    </div> */}
                  {/* <div className="form-group">
                    <label htmlFor="status">Status</label>
                    <div className="container">
                      <div class="form-check form-switch">
                        <input
                          onClick={() => {
                            setCheck(!check);
                          }}
                          class="form-check-input"
                          type="checkbox"
                          role="switch"
                          id="flexSwitchCheckDefault"
                          checked={check}
                          name="status"
                          value={check}
                        />
                      </div>
                    </div>
                  </div> */}
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
              <table
                cellPadding={10}
                border={1}
                className="modalDetail table table-bordered "
              >
                <tr>
                  <th>Username</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Address</th>
                  <th>Avatar</th>
                  <th>Role</th>
                  <th>Status</th>
                </tr>
                <tr>
                  <td>{selectedStaff.username}</td>
                  <td>{selectedStaff.email}</td>
                  <td>{selectedStaff.phone}</td>
                  <td>{selectedStaff.address}</td>
                  <td>
                    <div style={{ width: "80px" }}>
                      {" "}
                      <img
                        style={{ maxWidth: "100%" }}
                        src={selectedStaff.avatar}
                        alt=""
                      />
                    </div>
                  </td>
                  <td>{selectedStaff.role}</td>
                  <td>
                    <div className="product_status" style={{ width: "38px" }}>
                      {selectedStaff ? (
                        <img
                          style={{ maxWidth: "100%" }}
                          src="./assets/images/avatar/status.png"
                        />
                      ) : (
                        <img
                          style={{ maxWidth: "100%" }}
                          src="./assets/images/avatar/inactive.png"
                        />
                      )}
                    </div>
                  </td>

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
                <form onSubmit={handleEditstaff}>
                <div className="form-group">
                    <label htmlFor="fullName">Full Name</label>
                    <input
                      type="text"
                      name="fullName"
                      className="form-control"
                      id="fullName"
                      defaultValue={selectedStaff.fullName}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="username">Username</label>
                    <input
                      type="text"
                      name="username"
                      className="form-control"
                      id="username"
                      defaultValue={selectedStaff.username}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input
                      type="email"
                      name="email"
                      className="form-control"
                      id="email"
                      defaultValue={selectedStaff.email}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="phone">Phone</label>
                    <input
                      type="text"
                      name="phone"
                      className="form-control"
                      id="phone"
                      defaultValue={selectedStaff.phone}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="address">Address</label>
                    <input
                      type="text"
                      name="address"
                      className="form-control"
                      id="address"
                      defaultValue={selectedStaff.address}
                      required
                    />
                  </div>
                  {/* <div className="form-group">
                    <label htmlFor="address">Avatar</label>
                    <input
                      type="text"
                      name="avatar"
                      className="form-control"
                      id="avatar"
                      defaultValue={selectedStaff.avatar}
                      required
                    />
                  </div> */}
                  {/* <div className="form-group">
                    <label htmlFor="address">Status</label>
                    <input
                      type="text"
                      name="status"
                      className="form-control"
                      id="status"
                      defaultValue={selectedStaff.status}
                      required
                    />
                  </div> */}
                  {/* <div className="form-group">
                    <label htmlFor="address">Role</label>
                    <input
                      type="text"
                      name="role"
                      className="form-control"
                      id="role"
                      defaultValue={selectedStaff.role}
                      required
                    />
                  </div> */}

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
          selectedProduct={selectedStaff}
          handleDeleteproduct={handleDeletestaff}
          table={"staff"}
        />
      )}
    </div>
  );
};

export default StaffManagement;
