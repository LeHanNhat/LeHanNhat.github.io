import axios from "axios";
import React, { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import SortTable from "../../component/table/SortTable";
import Delete from "../../component/action/Delete";

const UserDisableManagement = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEnableModal, setShowEnableModal] = useState(false);
  const [showDetailModal, setDetailModal] = useState(false);
  const [selectAll, setSelectAll] = useState(false);
  const [listUser, setListUser] = useState([]);
  const[isLoading,setLoading] = useState(false);
  console.log(selectedUser);
  console.log("list", listUser);

  const baseURL = "/api/users/disableUsers";

  const handleSubSort = (sortedArray) => {
    setUsers(sortedArray);
  };
  const userColumns = [
    { key: "id", label: "No." },
    { key: "username", label: "Name" },
    { key: "email", label: "Email" },
    { key: "phone", label: "Phone" },
    { key: "fullName", label: "Full Name" },
  ];
  const handleUserSelect = (user) => {
    setSelectedUser(user);
  };

  useEffect(() => {
    const fetchData = async () => {
      const response = await axios.get(baseURL);
      console.log("check", response.data);
      setUsers(response.data);
      setLoading(false);
    };
    fetchData();
  }, [isLoading]);

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
      setListUser(users.map((item) => item.id));
    }
    setSelectAll(!selectAll);
  };
  const openDetailModal = async () => {
    setDetailModal(true);
    try {
      const response = await axios.get(`/api/user/${selectedUser.id}`);
      console.log("Here", response.data);
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };
  const closeDetailModal = () => setDetailModal(false);
  const openAddModal = () => {
    setShowAddModal(true);
  };
  const closeAddModal = () => setShowAddModal(false);

  const openEditModal = (employee) => {
    setShowEditModal(true);
  };
  const closeEditModal = () => setShowEditModal(false);

  const openDeleteModal = () => {
    setShowDeleteModal(true);
  };
  const closeDeleteModal = () => setShowDeleteModal(false);

  const openEnableModal = () => {
    setShowEnableModal(true);
  };
  const closeEnableModal = () => setShowEnableModal(false);

  const handleAddEmployee = async (e) => {
    e.preventDefault();
    const newEmployee = {
      fullName: e.target.fullName.value,
      username: e.target.username.value,
      password: e.target.password.value,
      email: e.target.email.value,
      phone: e.target.phone.value,
      address: e.target.address.value,
    };
    try {
      const response = await axios.post("/api/users/register", newEmployee);
      if (response.data) {
        toast.success("User is added successfully!");
      }
      setLoading(true);
      closeAddModal();
    } catch (error) {
      console.log(err);
    }
  };

  const handleEditEmployee = async (e) => {
    e.preventDefault();

    const updateEmployee = {
      ...selectedUser,
      username: e.target.username.value,
      password: e.target.password.value,
      email: e.target.email.value,
      phone: e.target.phone.value,
      address: e.target.address.value,
    };
    console.log("check update ", selectedUser);

    try {
      const response = await axios.put(
        `/api/users/${selectedUser.id}`,
        updateEmployee
      );
      if (response.data) {
        toast.success("User is edited successfully!");
      }
      console.log("check update", response.data);
      setUsers(
        users.map((emp) =>
          emp.id === selectedUser.id
            ? {
                ...selectedUser,
                ...{
                  username: e.target.username.value,
                  password: e.target.password.value,
                  email: e.target.email.value,
                  phone: e.target.phone.value,
                  address: e.target.address.value,
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

  const handleEnableEmployee = async () => {
    try {
      const response = await axios.put(
        `/api/users/enable/${selectedUser.id}`,
        {}
      );
      if (response.data) {
        toast.success("User is enabled successfully!");
      }
    } catch (error) {
      console.error("Error disabling user:", error);
    }
    const filteredUser = users.filter((user) => user.id != selectedUser.id);
    setUsers(filteredUser);
    closeEnableModal();
  };
  const handleDeleteEmployee = async () => {
    try {
      const response = await axios.delete(
        `/api/users/${selectedUser.id}`,{
          withCredentials: true, 
          headers: {
            "Content-Type":"application/json" 
          },}
      );
      if (response.data) {
        toast.success("User is deleted successfully!");
      }
    } catch (error) {
      console.error("Error disabling user:", error);
    }
    const filteredUser = users.filter((user) => user.id != selectedUser.id);
    setUsers(filteredUser);
    closeDeleteModal();
  };

  return (
    <>
      <div className="container-xl">
        <div className="table-responsive">
          <ToastContainer />
          <h1 style={{ textAlign: "center", marginBottom: "12px" }}>
            Disable User Management
          </h1>
          <div className="table-wrapper">
            <div className="table-title">
              <div className="row">
                <div className="col-sm-6"></div>
                <div className="col-sm-6">
                  <button onClick={openAddModal} className="btn btn-success">
                    <i className="material-icons">&#xE147;</i>{" "}
                    <span>Add New User</span>
                  </button>
                  <button
                    onClick={() => openDeleteModal()}
                    className="btn btn-danger"
                  >
                    <i className="material-icons">&#xE15C;</i>{" "}
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            </div>
            <SortTable
              products={users}
              onSort={handleSubSort}
              columns={userColumns}
              openDetailModal={openDetailModal}
              openEditModal={openEditModal}
              openDeleteModal={openDeleteModal}
              onProductSelect={handleUserSelect}
              tableName={"user_disable"}
              openEnableModal={openEnableModal}
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
                  <form onSubmit={handleAddEmployee}>
                  <div className="form-group">
                      <label htmlFor="fullName">Full Name</label>
                      <input
                        type="text"
                        name="fullName"
                        className="form-control"
                        placeholder="fullname..."
                        id="fullName"
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
            tabIndex="-1"
            role="dialog"
            aria-labelledby="myLargeModalLabel"
            aria-hidden="true"
          >
            <div class="modal-dialog modal-lg">
              <div class="modal-content">
                <table class="table table-bordered modalDetail">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Username</th>
                      <th>Email</th>
                      <th>Phone</th>
                      <th>Address</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>{selectedUser.id}</td>
                      <td>{selectedUser.username}</td>
                      <td>{selectedUser.email}</td>
                      <td>{selectedUser.phone}</td>
                      <td>{selectedUser.address}</td>
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
                  <form onSubmit={handleEditEmployee}>
                    <div className="form-group">
                      <label htmlFor="username">Username</label>
                      <input
                        type="text"
                        name="username"
                        className="form-control"
                        id="username"
                        defaultValue={selectedUser.username}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="password">Password</label>
                      <input
                        type="password"
                        name="password"
                        className="form-control"
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
                        defaultValue={selectedUser.email}
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
                        defaultValue={selectedUser.phone}
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
                        defaultValue={selectedUser.address}
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
            selectedProduct={selectedUser}
            handleDeleteproduct={handleDeleteEmployee}
            table={"user"}
          />
        )}
          {showEnableModal && (
           <Delete
           closeDeleteModal={closeEnableModal}
           selectedProduct={selectedUser}
           handleDeleteproduct={handleEnableEmployee}
           table={"user"}
           action={"enable"}
         />
        )}
      </div>
      
    </>
  );
};

export default UserDisableManagement;
