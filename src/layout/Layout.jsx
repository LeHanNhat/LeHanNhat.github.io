import Header from "../component/header/Header";
import Footer from "../component/footer/Footer";
import SideBar from "../pages/main/SideBar";
import { Outlet } from "react-router-dom"

const Layout = () => {
    
    return (
        <>
            <Header />
            <div className="container-fluid home_page">
                <div className="row">
                    <div className="col-md-2" style={{padding:"0"}}>
                        <SideBar Menu={(section) => console.log(`Menu clicked: ${section}`)
                        } />
                    </div>
                    <div className="col-md-10">
                        <Outlet />
                    </div>
                </div>
            </div>
            <Footer />
        </>
    )
}
export default Layout;  