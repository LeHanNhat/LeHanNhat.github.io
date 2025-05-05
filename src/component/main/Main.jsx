
import SideBar from "../../pages/main/SideBar";
import { useState } from "react";
import UserManagement from "../../section/user/UserManagement";
import ProductManagement from "../../section/product/ProductManagement";
import CategoryManagement from "../../section/category/CategoryManangement";
import BrandManagement from "../../section/brand/BrandManagement";
import SubManagement from "../../section/subcategory/SubManagement";
import StaffManagement from "../../section/staff/StaffManagement";
import HomeDashBoard from "../../section/home/HomeDashBoard";
import Profile from "../../section/profile/Profile";

const Main = () => {
    const [activeComponent, setActiveComponent] = useState("Dashboard");
    const renderComponent = () => {
        switch (activeComponent) {
            case "User":
            return <UserManagement />;
               case "User":
            return <UserManagement />;
            case "Product":
            return <ProductManagement/>;
            case "Category":
            return <CategoryManagement/>;
            case "Subcategory":
                return <SubManagement/>;
            case "Brand":
            return <BrandManagement/>;
            case "Staff":
                return <StaffManagement/>;
            case "Profile":
                    return <Profile/>;
          default:
            return <HomeDashBoard/>;
        }
      };
    return (<>
        <div className="container-fluid home_page">
            <div className="row">
                <div className="col-md-3">
                <SideBar Menu={(section) => setActiveComponent(section)} />
                </div>

                <div className="col-md-9">
                
                </div>
            </div>
        </div>

    </>)

}
export default Main;