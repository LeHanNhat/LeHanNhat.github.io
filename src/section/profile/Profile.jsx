import { Box, Button, FormLabel, Popover, TextField, Typography } from '@mui/material';
import axios from "axios";
import { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./Profile.css";

const Profile = () => {
  const [userProfile, setUserProfile] = useState({});
  const [newProfile, setNewProfile] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [activePopup, setActivePopup] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [file, setFile] = useState(null);
  const baseURL = "/api/admin/profile";

  console.log("newProfile", userProfile);
  console.log(" go file", file);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(baseURL);
        console.log("user", response.data);
        if (response.data) {
          setUserProfile(response.data);
          setNewProfile(response.data);
          setIsLoading(false);
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, [isLoading]);

  const handleUpdate = async (event) => {
    event.preventDefault();
    const newUpdate = {
      ...userProfile,
      fullName:event.target.fullName.value,
      username: event.target.username.value,
      email: event.target.email.value,
      phone: event.target.phone.value,
      address: event.target.address.value,
    };
    console.log("check neww", newUpdate);

    try {
      const response = await axios.put(baseURL, newUpdate);
      console.log("user", response.data);
      if (response.data) {
        handleClose();
        setUserProfile(response.data);
        toast.success("Update Profile successfully!!!")

      }
    } catch (error) {
      console.log(error);
    }
  };
  const handleFileChange = async (event) => {
    event.preventDefault();
    if (event.target && event.target.files && event.target.files.length > 0) {
      const newFile = event.target.files[0];
      const formData = new FormData();
      formData.append("file", newFile);
      try {
        const response = await axios.put(
          "/api/admin/upload",
          formData
        );
        console.log(response.data);
        if (response.data) {
          setIsLoading(true);
          toast.success("Avatar is modified successfully!");
        }

        // setProducts([...products, {
        //     ...response.data,
        //     productID: response.data.productID
        // }]);
        closeAddModal();
      } catch (error) {
        console.log(error);
      }
    } else {
      toast.error(" File is not choosen !!!");
    }
  };
  const handleAvatar = async () => {
    const avatar = document.getElementById("avatarInput");
    if (avatar) {
      avatar.click();
    }
  };
  const handlePopUp = (event) => {
    setAnchorEl(event.currentTarget);
    setActivePopup(true);
  }
  const handleClose = () => {
    setActivePopup(false);
  }
  const ProfilePopup = () => {
    return (
      <Popover
        open={activePopup}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorReference="anchorPosition"
        anchorPosition={{ top: 400, left: 1200 }}
        anchorOrigin={{
          vertical: 'center',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'center',
          horizontal: 'center',
        }}
      >
        <Box
          onSubmit={handleUpdate}
          mt={1}
          px={4}
          py={4}
          mb={1}
          component="form"
          sx={{ '& .MuiTextField-root': { m: 1, width: '25ch' } }}
          noValidate
          autoComplete="off"
        >
          <Typography sx={{ textAlign: 'center', marginBottom: "10px" }} variant="h4" component="h2">
            Update Profile
          </Typography>
          <div>
            <FormLabel sx={{ mt: 2 }}>Username</FormLabel>
            <TextField
              label="Username"
              id="outlined-size-small"
              defaultValue={userProfile.username}
              name="username"
              size="small"
              disabled
            />
          </div>
        
          <div>
            <FormLabel sx={{ mt: 2 }}>Email</FormLabel>
            <TextField
              label="Email"
              id="outlined-size-small"
              defaultValue={userProfile.email}
              name="email"
              size="small"
              disabled
            />
          </div>
          <div>
            <FormLabel sx={{ mt: 2 }}>Full Name</FormLabel>
            <TextField
              label="fullName"
              id="outlined-size-small"
              defaultValue={userProfile.fullName}
              name="fullName"
              size="small"
             
            />
          </div>
          <div>
            <FormLabel sx={{ mt: 2 }}>Phone</FormLabel>
            <TextField
              label="Phone"
              id="outlined-size-small"
              defaultValue={userProfile.phone}
              name="phone"
              size="small"
            />
          </div>
          <div>
            <FormLabel sx={{ mt: 2 }}>Address</FormLabel>
            <TextField
              label="Address"
              id="outlined-size-small"
              defaultValue={userProfile.address}
              name="address"
              size="small"
            />
          </div>
          <Button sx={{ display: "flex", justifyContent: "center", marginTop: "10px" }} variant="contained" type="submit">Update</Button>
        </Box>
      </Popover>
    )
  }
  return (
    <>
      <div class="page-breadcrumb bg-white">
        <div class="row align-items-center">
          <div class="col-md-12">
            <h4 class="page-title">Profile page</h4>
          </div>
        </div>
      </div>
      <ToastContainer />
      <div class="container-fluid">
        <div class="row">
          <div class="col-lg-4 col-xlg-3 col-md-12">
            <div class="white-box">
              <div class="user-bg">
                <img
                  width="100%"
                  alt="user"
                  src="./assets/images/avatar/avatar.jpg"
                />
                <div class="overlay-box">
                  {userProfile ? (
                    <div class="user-content">
                      <a onClick={handleAvatar}>
                        <input
                          type="file"
                          id="avatarInput"
                          style={{ display: "none" }}
                          onChange={handleFileChange}
                        />
                        {newProfile.avatar ? (
                          <img
                            src={userProfile.avatar}
                            className="thumb-lg img-circle"
                            alt="Avatar"
                          />
                        ) : (
                          <img
                            src="./assets/images/avatar/avatar.jpg"
                            className="thumb-lg img-circle"
                            alt="Avatar"
                          />
                        )}
                      </a>
                      <h4 class="text-white mt-2">{userProfile.username}</h4>
                      <h5 class="text-white mt-2">{userProfile.email}</h5>
                    </div>
                  ) : (
                    <p>Loading...</p>
                  )}
                </div>
              </div>
              <div class="user-btm-box mt-5 d-md-flex">
                <div class="col-md-4 col-sm-4 text-center">
                  <h1>20</h1>
                </div>
                <div class="col-md-4 col-sm-4 text-center">
                  <h1>12</h1>
                </div>
                <div class="col-md-4 col-sm-4 text-center">
                  <h1>2001</h1>
                </div>
              </div>
            </div>
          </div>

          <div class="col-lg-8 col-xlg-9 col-md-12">
            <div class="card">
              <div class="card-body">
                {userProfile ? (
                  <form class="form-horizontal form-material">
                     <div class="form-group mb-4">
                      <label class="col-md-12 p-0">Full Name</label>
                      <div class="col-md-12 border-bottom p-0">
                        <input
                          type="text"
                          name="fullName"
                          placeholder={userProfile.fullName}
                          class="form-control p-0 border-0"
                          defaultValue={userProfile.fullName}
                          readOnly
                        />
                      </div>
                    </div>
                    <div class="form-group mb-4">
                      <label class="col-md-12 p-0">User Name</label>
                      <div class="col-md-12 border-bottom p-0">
                        <input
                          type="text"
                          name="username"
                          placeholder={userProfile.username}
                          class="form-control p-0 border-0"
                          defaultValue={userProfile.username}
                          readOnly

                        />
                      </div>
                    </div>
                    <div class="form-group mb-4">
                      <label for="example-email" class="col-md-12 p-0">
                        Email
                      </label>
                      <div class="col-md-12 border-bottom p-0">
                        <input
                          type="email"
                          name="email"
                          placeholder="johnathan@admin.com"
                          class="form-control p-0 border-0"
                          id="example-email"
                          defaultValue={userProfile.email}
                          readOnly
                        />
                      </div>
                    </div>
                    <div class="form-group mb-4">
                      <label class="col-md-12 p-0">Password</label>
                      <div class="col-md-12 border-bottom p-0">
                        <input
                          type="password"
                          name="password"
                          value="password"
                          class="form-control p-0 border-0"
                          defaultValue={"*******"}
                          readOnly
                        />
                      </div>
                    </div>
                    <div class="form-group mb-4">
                      <label class="col-md-12 p-0">Phone No</label>
                      <div class="col-md-12 border-bottom p-0">
                        <input
                          type="text"
                          name="phone"
                          placeholder="123 456 7890"
                          class="form-control p-0 border-0"
                          defaultValue={userProfile.phone}
                          readOnly
                        />
                      </div>
                    </div>
                    <div class="form-group mb-4">
                      <label class="col-md-12 p-0">Address</label>
                      <div class="col-md-12 border-bottom p-0">
                        <input
                          type="text"
                          name="address"
                          placeholder="123 456 7890"
                          class="form-control p-0 border-0"
                          defaultValue={userProfile.address}
                          readOnly
                        />
                      </div>
                    </div>
                    <div class="form-group mb-4">
                      <div class="col-sm-12">
                        <Button
                          class="btn btn-success"
                          variant="contained"
                          onClick={(event) => handlePopUp(event)}
                        >
                          Update Profile
                        </Button>
                      </div>
                    </div>
                  </form>
                ) : (
                  <p>Loading...</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      {activePopup && (<ProfilePopup />)}
    </>
  );
};
export default Profile;
