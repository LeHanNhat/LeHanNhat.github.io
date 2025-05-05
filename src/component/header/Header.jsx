import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuthentication } from "../../pages/authentication/AuthProvider";
import "./Header.css";

const Header = () => {
    const username = localStorage.getItem("username");
    const navigation = useNavigate();
    const logOutURL = "/api/auth/logout"
    const {logout} =  useAuthentication();
    const handleLogout = async () => {
        console.log("click");
        
        try {
            const response = await axios.post(logOutURL);
            if(response.data){
                logout();
                navigation("/baki-admin/authentication/signIn");
            }
        } catch (error) {
            console.log(error);
            
        }
    }
    return (
        <header>
            <div className="container-fluid ">
                <div className="row">
                    <div className="col-md-3">
                        <div className="logo" style={{ width: "100px", height: "80px" }}>
                            <img src="./assets/images/logo/logo.png" style={{ maxWidth: "100%", height: "100%", borderRadius: "50%" }} />
                        </div>

                    </div>
                    <div className="col-md-9">
                        <nav class="layout-navbar container-xxl navbar navbar-expand-xl navbar-detached align-items-center bg-navbar-theme" id="layout-navbar">
                            <div class="navbar-nav-right d-flex align-items-center" id="navbar-collapse">
                                <div class="serach_field-area d-flex align-items-center">
                                    <div class="search_inner">
                                        <form action="#">
                                            <div class="search_field">
                                                <input type="text" placeholder="Search here..." />
                                            </div>
                                            <button type="submit"><span><i class="fa-solid fa-magnifying-glass"></i></span> </button>
                                        </form>
                                    </div>
                                    <span class="f_s_14 f_w_400 ml_25 white_text text_white">Apps</span>
                                </div>

                                <ul class="navbar-nav flex-row align-items-center ms-auto">
                                    <li class="nav-item lh-1 me-4">
                                        <span></span>
                                    </li>


                                    <li class="nav-item navbar-dropdown dropdown-user dropdown">
                                        <a class="nav-link dropdown-toggle hide-arrow p-0" href="javascript:void(0);" data-bs-toggle="dropdown" aria-expanded="false">
                                            <div class="avatar avatar-online" style={{ width: "50px" }} >
                                                <img src="./assets/images/avatar/avatar.jpg" alt="" class="" width="40"
                                                    height="40"
                                                    className="rounded-circle me-2" />
                                            </div>
                                        </a>
                                        <ul class="dropdown-menu dropdown-menu-end mt-3 py-2">
                                            <li>
                                                <a class="dropdown-item waves-effect" href="#">
                                                    <div class="d-flex align-items-center">
                                                        <div class="flex-shrink-0 me-2">
                                                            <div class="avatar avatar-online" style={{ width: "50px" }} >
                                                                <img src="./assets/images/avatar/avatar.jpg" alt="" class="" width="40"
                                                                    height="40"
                                                                    className="rounded-circle me-2" />
                                                            </div>
                                                        </div>
                                                        <div class="flex-grow-1">
                                                            <h6 class="mb-0 small">{username}</h6>
                                                            <small class="text-muted">Admin</small>
                                                        </div>
                                                    </div>
                                                </a>
                                            </li>
                                            <li>
                                                <div class="dropdown-divider"></div>
                                            </li>
                                            <li>
                                                <a class="dropdown-item waves-effect" href="/baki-admin/profile">
                                                    <i class="ri-user-3-line ri-22px me-2"></i>
                                                    <span class="align-middle">My Profile</span>
                                                </a>
                                            </li>
                                            <li>
                                                <a class="dropdown-item waves-effect" href="#">
                                                    <i class="ri-settings-4-line ri-22px me-2"></i>
                                                    <span class="align-middle">Settings</span>
                                                </a>
                                            </li>
                                            <li>
                                                <a class="dropdown-item waves-effect" href="#">
                                                    <span class="d-flex align-items-center align-middle">
                                                        <i class="flex-shrink-0 ri-file-text-line ri-22px me-3"></i>
                                                        <span class="flex-grow-1 align-middle">Billing</span>
                                                        <span class="flex-shrink-0 badge badge-center rounded-pill bg-danger h-px-20 d-flex align-items-center justify-content-center">4</span>
                                                    </span>
                                                </a>
                                            </li>
                                            <li>
                                                <div class="dropdown-divider"></div>
                                            </li>
                                            <li>
                                                <div class="d-grid px-4 pt-2 pb-1">
                                                    <a class="btn btn-danger d-flex waves-effect waves-light" onClick={handleLogout} >
                                                        <small class="align-middle">Logout</small>
                                                        <i class="ri-logout-box-r-line ms-2 ri-16px"></i>
                                                    </a>
                                                </div>
                                            </li>
                                        </ul>
                                    </li>



                                </ul>
                            </div>




                        </nav>
                    </div>
                </div>
            </div>
        </header>





    )

}
export default Header;