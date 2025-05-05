import Layout from "./layout/Layout";
import SignIn from "./pages/authentication/SignIn";
import { useAuthentication } from "./pages/authentication/AuthProvider.jsx";
import { rootPaths } from "./routes/paths";
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import CategoryManagement from "./section/category/CategoryManangement";
import SubManagement from "./section/subcategory/SubManagement";
import UserManagement from "./section/user/UserManagement";
import ProductManagement from "./section/product/ProductManagement";
import BrandManagement from "./section/brand/BrandManagement";
import HomeDashBoard from "./section/home/HomeDashBoard";
import StaffManagement from "./section/staff/StaffManagement";
import Profile from "./section/profile/Profile";
import { AuthProvider } from "./pages/authentication/AuthProvider.jsx";
import UserDisableManagement from "./section/disableUser/UserDisableManagement.jsx";
import OrderManagemet from "./section/order/OrderManagement.jsx";
import StockManagement from "./section/stock/StockManagement.jsx";
import ReviewManagement from "./section/review/ReviewManagement.jsx";
import DiscountManagement from "./section/discount/DiscountManagement.jsx";




const PrivateRoute = ({ children }) => {
  const { isAuthenticated } = useAuthentication(); 
  console.log("check",isAuthenticated);
  

  return isAuthenticated ? children : <Navigate to="authentication/signIn" />;
};

const App = () => (
<AuthProvider>
<Router>
  <Routes>
    <Route path={rootPaths.authRoot}>
      <Route path="signIn" element={<SignIn />} />
    </Route>
    <Route path={rootPaths.root} element={
      <PrivateRoute>
        <Layout />
      </PrivateRoute>
    }>
      <Route index element={<HomeDashBoard />} />
      <Route path="disable" element={<UserDisableManagement/>}/>
      <Route path="user" element={<UserManagement />} />
      <Route path="order" element={<OrderManagemet />} />
      <Route path="staff" element={<StaffManagement />} />
      <Route path="product" element={<ProductManagement />} />
      <Route path="stock" element={< StockManagement/>} />
      <Route path="brand" element={<BrandManagement />} />
      <Route path="category" element={<CategoryManagement />} />
      <Route path="subcategory" element={<SubManagement />} />
      <Route path="discount" element={<DiscountManagement />} />
      <Route path="review" element={<ReviewManagement />} />
      <Route path="profile" element={<Profile />} />
    </Route>
  </Routes>
</Router>
</AuthProvider>
);

export default App;