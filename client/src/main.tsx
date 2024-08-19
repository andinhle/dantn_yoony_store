import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import LayoutUser from "./layouts/LayoutUser.tsx";
import LayoutAdmin from "./layouts/LayoutAdmin.tsx";
import DashboardAdmin from "./pages/admin/DashboardAdmin.tsx";
import CategorysAdmin from "./pages/admin/CategorysAdmin.tsx";
import ProductList from "./pages/admin/ProductAdmin.tsx";
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
            <Route path='categorys' element={<CategorysAdmin />}/>
            <Route path='products' element={<ProductList />}/>
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
