import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import LayoutUser from "./layouts/LayoutUser.tsx";
import LayoutAdmin from "./layouts/LayoutAdmin.tsx";
import DashboardAdmin from "./pages/admin/DashboardAdmin.tsx";
import VouchersAdmin from "./pages/admin/VouchersAdmin.tsx";
import UsersAdmin from "./pages/admin/UserAdmin.tsx";
import BlogsAdmin from "./pages/admin/BlogsAdmin.tsx";
import CategorysAdmin from "./pages/admin/CategorysAdmin.tsx";
import ProductList from "./pages/admin/ProductsList.tsx";
import Orders from "./pages/admin/Order.tsx";
import Rates from "./pages/admin/Evaluate.tsx";
import OrderDetails from "./pages/admin/OrderDetails.tsx";
import AddProduct from "./pages/admin/products/AddProduct.tsx";
import EditProduct from "./pages/admin/products/EditProduct.tsx";
import Varriant from "./pages/admin/varriant/AddVarriant.tsx";
import ListVarriant from "./pages/admin/varriant/Listvarriant.tsx";
import VarriantValue from "./pages/admin/varriant/VarriantValue.tsx";
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route element={<App />}>
          {/* User */}
          <Route path="/" element={<LayoutUser />}>

          </Route>
          {/* Admin */}
          <Route path="admin" element={<LayoutAdmin />}>
            <Route index element={<DashboardAdmin />}/>
            <Route path="vouchers" element={<VouchersAdmin/>}/>
            <Route path="users" element={<UsersAdmin/>}/>
            <Route path="blogs" element={<BlogsAdmin/>}/>
            <Route path='categorys' element={<CategorysAdmin />}/>
            <Route path='products' element={<ProductList />}/>
            <Route path='products/add' element={<AddProduct />}/>
            <Route path='products/edit/:id' element={<EditProduct />}/>
            <Route path='orders' element={<Orders />}/>
            <Route path='products/varriant' element={<ListVarriant />}/>
            <Route path='products/varriant/add' element={<Varriant />}/>
            <Route path='products/varriant/addValue' element={<VarriantValue />}/>
            <Route path='orders/orderDetails' element={<OrderDetails/>}/>
            <Route path='rates' element={<Rates/>}/>
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
