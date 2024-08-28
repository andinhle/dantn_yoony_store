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
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
