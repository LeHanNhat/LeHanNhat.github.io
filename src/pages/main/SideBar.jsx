import React from "react";
import { NavLink } from "react-router-dom"; // Use NavLink for routing
import "./SideBar.css";

const SideBar = ({ Menu }) => {
    const role = localStorage.getItem("role");
    return (
        <div className="d-flex flex-column flex-shrink-0 p-3 text-white bg-dark sidebar">
            <a
                href="/"
                className="d-flex align-items-center mb-3 mb-md-0 me-md-auto text-white text-decoration-none"
            >
                <svg className="bi me-2" width="40" height="32">
                    <use xlinkHref="#bootstrap" />
                </svg>
                <span className="fs-4">Baki</span>
            </a>
            <hr />
            <ul className="nav nav-pills flex-column mb-auto">
                <li className="nav-item">

                    <NavLink
                        to=""
                        className="nav-link"
                        activeClassName="active"
                        end
                    >
                        <svg className="bi me-2" width="16" height="16">
                            {/* <use xlinkHref="#home" /> */}
                        </svg>
                        DashBoard
                    </NavLink>
                </li>
                <li className="nav-item">
                    <NavLink
                        to="user"
                        className="nav-link"
                        activeClassName="active"
                    >
                        <svg className="bi me-2" width="16" height="16">
                            <use xlinkHref="#grid" />
                        </svg>
                        Users
                    </NavLink>
                </li>
                <li className="nav-item">
                    <NavLink
                        to="disable"
                        className="nav-link"
                        activeClassName="active"
                    >
                        <svg className="bi me-2" width="16" height="16">
                            <use xlinkHref="#grid" />
                        </svg>
                        Disable Users
                    </NavLink>
                </li>
                {role && role === "ADMIN" && (<li>
                    <NavLink
                        to="staff"
                        className="nav-link"
                        activeClassName="active"
                    >
                        <svg className="bi me-2" width="16" height="16">
                            <use xlinkHref="#people-circle" />
                        </svg>
                        Staff
                    </NavLink>
                </li>)}

                <li>
                    <NavLink
                        to="product"
                        className="nav-link"
                        activeClassName="active"
                    >
                        <svg className="bi me-2" width="16" height="16">
                            <use xlinkHref="#grid" />
                        </svg>
                        Product
                    </NavLink>
                </li>
                <li>
                    <NavLink
                        to="stock"
                        className="nav-link"
                        activeClassName="active"
                    >
                        <svg className="bi me-2" width="16" height="16">
                            <use xlinkHref="#grid" />
                        </svg>
                        Stock
                    </NavLink>
                </li>
                <li>
                    <NavLink
                        to="order"
                        className="nav-link"
                        activeClassName="active"
                    >
                        <svg className="bi me-2" width="16" height="16">
                            <use xlinkHref="#grid" />
                        </svg>
                        Order
                    </NavLink>
                </li>
                <li>
                    <NavLink
                        to="brand"
                        className="nav-link"
                        activeClassName="active"
                    >
                        <svg className="bi me-2" width="16" height="16">
                            <use xlinkHref="#grid" />
                        </svg>
                        Brand
                    </NavLink>
                </li>
                <li>
                    <NavLink
                        to="category"
                        className="nav-link"
                        activeClassName="active"
                    >
                        <svg className="bi me-2" width="16" height="16">
                            <use xlinkHref="#grid" />
                        </svg>
                        Category
                    </NavLink>
                </li>
                <li>
                    <NavLink
                        to="subcategory"
                        className="nav-link"
                        activeClassName="active"
                    >
                        <svg className="bi me-2" width="16" height="16">
                            <use xlinkHref="#grid" />
                        </svg>
                        SubCategory
                    </NavLink>
                </li>
                <li>
                    <NavLink
                        to="discount"
                        className="nav-link"
                        activeClassName="active"
                    >
                        <svg className="bi me-2" width="16" height="16">
                            <use xlinkHref="#grid" />
                        </svg>
                        Discount Code
                    </NavLink>
                </li>
                <li>
                    <NavLink
                        to="review"
                        className="nav-link"
                        activeClassName="active"
                    >
                        <svg className="bi me-2" width="16" height="16">
                            <use xlinkHref="#grid" />
                        </svg>
                        Review
                    </NavLink>
                </li>
                <li>
                    <NavLink
                        to="profile"
                        className="nav-link"
                        activeClassName="active"
                    >
                        <svg className="bi me-2" width="16" height="16">
                            <use xlinkHref="#grid" />
                        </svg>
                        Profile
                    </NavLink>
                </li>
               
            </ul>
            <hr />
        </div>
    );
};

export default SideBar;
