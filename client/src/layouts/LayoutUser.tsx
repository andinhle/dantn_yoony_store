import { Outlet } from "react-router-dom";
import HeaderUser from "../components/User/Header/HeaderUser";
import Footer from "../components/User/Footer/Footer";

const LayoutUser = () => {
  document.body.style.backgroundColor = "#FFFFFF";
  return (
    <div id="layout-user">
      <HeaderUser />
      <main className="container-main min-h-[100vh]">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default LayoutUser;
