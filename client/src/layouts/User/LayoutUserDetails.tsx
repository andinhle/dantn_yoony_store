import { Outlet } from "react-router-dom"
import SidebarUserDetails from "../../components/User/Auth/SidebarUserDetails"

const LayoutUserDetails = () => {
    return (
        <>
            <h2 className="mt-8 mb-8 font-medium text-2xl text-primary">THÔNG TIN TÀI KHOẢN</h2>
            <div id="layou-userdetails" className="mt-4 mb-4 bg-white flex gap-8">
                <SidebarUserDetails />
                <Outlet />
            </div>
        </>

    )
}
export default LayoutUserDetails