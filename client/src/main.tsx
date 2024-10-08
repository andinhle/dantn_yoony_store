import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import LayoutUser from "./layouts/LayoutUser.tsx";
import LayoutAdmin from "./layouts/LayoutAdmin.tsx";
import DashboardAdmin from "./pages/admin/DashboardAdmin.tsx";
import UsersAdmin from "./pages/admin/UserAdmin.tsx";
import CategorysAdmin from "./pages/admin/CategorysAdmin.tsx";
import Register from "./components/User/Auth/Register.tsx";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "swiper/css/free-mode";
import MainContentUser from "./pages/user/MainContentUser.tsx";
import Login from "./components/User/Auth/Login.tsx";
import ProductList from "./pages/admin/products/ProductsList.tsx";
import Orders from "./pages/admin/Order.tsx";
import Rates from "./pages/admin/Evaluate.tsx";
import OrderDetails from "./pages/admin/OrderDetails.tsx";
import Varriant from "./pages/admin/varriant/AddVarriant.tsx";
import ListVarriant from "./pages/admin/varriant/Listvarriant.tsx";
import VarriantValue from "./pages/admin/varriant/VarriantValue.tsx";
import ScrollToTop from "./utils/ScrollToTop.tsx";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import LayoutResetPassword from "./layouts/User/LayoutResetPassword.tsx";
import ResetPassRequest from "./components/User/Auth/ResetPassRequest.tsx";
import FormResetPass from "./components/User/Auth/FormResetPass.tsx";
import LayoutVoucherAdmin from "./layouts/Admin/LayoutVoucherAdmin.tsx";
import BannerList from "./pages/admin/BannerAdmin.tsx";
import LayoutBlogsAdmin from "./layouts/Admin/LayoutBlogsAdmin.tsx";
import BlogProvider from "./contexts/BlogsContext.tsx";
import UpdateBlogsAdmin from "./pages/admin/blogs/UpdateBlogAdmin.tsx";
import BlogPage from "./components/User/Blogs/BlogsPage.tsx";
import LayoutProductAdmin from "./layouts/Admin/LayoutProductAdmin.tsx";
import AddOrUpdateProduct from "./pages/admin/products/AddOrUpdateProduct.tsx";
import ShowDetailProduct from "./components/User/Show/ShowDetailProduct.tsx";
import CartListClient from "./components/User/Cart/CartListClient.tsx";
import { NextUIProvider } from "@nextui-org/react";
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <NextUIProvider>
      <BrowserRouter>
        <BlogProvider>
          <ScrollToTop />
          <Routes>
            <Route element={<App />}>
              {/* User */}
              <Route path="/" element={<LayoutUser />}>
                <Route index element={<MainContentUser />} />
                <Route path="register" element={<Register />} />
                <Route path="login" element={<Login />} />
                <Route path="reset-password" element={<LayoutResetPassword />}>
                  <Route path="" index element={<ResetPassRequest />} />
                  <Route path=":token/:email" element={<FormResetPass />} />
                </Route>
                <Route
                  path=":category/:slugproduct"
                  element={<ShowDetailProduct />}
                />
                <Route path="gio-hang" element={<CartListClient />} />
                <Route path="blogs" element={<BlogPage/>}/>
              </Route>
              {/* Admin */}
              <Route path="admin" element={<LayoutAdmin />}>
                <Route index element={<DashboardAdmin />} />
                <Route path="users" element={<UsersAdmin />} />
                <Route path="blogs" element={<LayoutBlogsAdmin />} />
                <Route path="blogs/:id" element={<UpdateBlogsAdmin />} />
                <Route path="categorys" element={<CategorysAdmin />} />
                <Route path="products" element={<LayoutProductAdmin />}>
                  <Route index element={<ProductList />} />
                  <Route path="add" element={<AddOrUpdateProduct />} />
                  <Route path="update/:id" element={<AddOrUpdateProduct />} />
                </Route>
                <Route path="orders" element={<Orders />} />
                <Route path="vouchers" element={<LayoutVoucherAdmin />} />
                <Route path="banner" element={<BannerList />} />
                <Route path="orders/orderDetails" element={<OrderDetails />} />
                <Route path="rates" element={<Rates />} />
              </Route>
            </Route>
          </Routes>
          <ToastContainer autoClose={3000} newestOnTop={true} />
        </BlogProvider>
      </BrowserRouter>
    </NextUIProvider>
  </StrictMode>
);
