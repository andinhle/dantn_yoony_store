import HeaderAdmin from "../components/Admin/HeaderAdmin";
import SideBarAdmin from "../components/Admin/SideBarAdmin";
import MainContentAdmin from "./Admin/MainContentAdmin";

const LayoutAdmin = () => {
  document.body.style.backgroundColor = "#FFFCF7";
  return (
    <div id="layout-admin">
      <SideBarAdmin />
      <div className="lg:ml-[225px]">
        <HeaderAdmin />
        <MainContentAdmin />
      </div>
    </div>
  );
};

export default LayoutAdmin;
