import { Outlet } from "react-router-dom";
import HeaderUser from "../components/User/Header/HeaderUser";
import Footer from "../components/User/Footer/Footer";
import CartProvider from "../providers/CartProvider";
import { AuthProvider } from "../providers/AuthProvider";
import NotificationsProvider from "../providers/NotificationsProvider";
import UserRoleListener from "../components/Middleware/UserRoleListener";
import isAuthenticated from "../components/Middleware/isAuthenticated";
import { useState } from "react";

const LayoutUser = () => {
  document.body.style.backgroundColor = "#FFFFFF";
  const [isLoggedIn] = useState(isAuthenticated());
  return (
    <NotificationsProvider>
      <CartProvider>
        <AuthProvider>
          {isLoggedIn && <UserRoleListener />}
          <div id="layout-user">
            <HeaderUser />
            <main className="container-main min-h-[100vh]">
              <Outlet />
            </main>
            <Footer />
          </div>
        </AuthProvider>
      </CartProvider>
    </NotificationsProvider>
  );
};

export default LayoutUser;
