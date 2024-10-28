import { useState } from "react";
import { Link } from "react-router-dom";

const SidebarUserDetails = () => {
    const [selectedItem, setSelectedItem] = useState(""); // Mục mặc định là "tai-khoan"

    const handleItemClick = (item:any) => {
        setSelectedItem(item);
    };
    return (
        <div className="col-span-2">
            <div className="bg-white shadow-sm border border-gray h-screen">
                <div className="flex items-center p-4 border-b border-gray-200">
                    <img className="w-12 h-12 rounded-full" src="https://via.placeholder.com/150" alt="Avatar" />
                    <div className="ml-3">
                        <h4 className="font-semibold">Lê Đình An</h4>
                        <p className="text-sm text-primary font-medium">( Member )</p>
                    </div>
                </div>
                <nav className="mt-4">
                    <ul>
                        <li className="mb-2">
                            <Link
                                to="userDetails"
                                onClick={() => handleItemClick("tai-khoan")}
                                className={`flex items-center p-3 cursor-pointer border m-4 rounded-sm border-gray-200  ${selectedItem === "tai-khoan" ? "text-white bg-primary" : "text-gray-700 hover:bg-gray-100"}`}>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 mr-2">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                                </svg>
                                <span>Tài khoản</span>
                            </Link>
                        </li>
                        <li className="mb-2">
                            <Link
                                to="orderuser"
                                onClick={() => handleItemClick("don-hang")}
                                className={`flex items-center p-3 cursor-pointer border m-4 rounded-sm border-gray-200  ${selectedItem === "don-hang" ? "text-white bg-primary" : "text-gray-700 hover:bg-gray-100"}`}>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 mr-2">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                                </svg>
                                <span>Đơn hàng</span>
                            </Link>
                        </li>
                        <li className="mb-2">
                            <Link
                                to="wishlist"
                                onClick={() => handleItemClick("yeu-thich")}
                                className={`flex items-center p-3 cursor-pointer border m-4 rounded-sm border-gray-200  ${selectedItem === "yeu-thich" ? "text-white bg-primary" : "text-gray-700 hover:bg-gray-100"}`}>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 mr-2">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
                                </svg>
                                <span>Yêu thích</span>
                            </Link>
                        </li>
                        <li className="mb-2">
                            <Link
                                to="#"
                                onClick={() => handleItemClick("dia-chi")}
                                className={`flex items-center p-3 cursor-pointer border m-4 rounded-sm border-gray-200  ${selectedItem === "dia-chi" ? "text-white bg-primary" : "text-gray-700 hover:bg-gray-100"}`}>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 mr-2">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
                                </svg>
                                <span>Địa chỉ</span>
                            </Link>
                        </li>
                        <li className="mb-2">
                            <Link
                                to="#"
                                onClick={() => handleItemClick("cai-dat")}
                                className={`flex items-center p-3 cursor-pointer border m-4 rounded-sm border-gray-200  ${selectedItem === "cai-dat" ? "text-white bg-primary" : "text-gray-700 hover:bg-gray-100"}`}>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 mr-2">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 0 1 0 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.28a1.125 1.125 0 0 1-1.11.941H10.704a1.125 1.125 0 0 1-1.11-.94l-.214-1.282a1.125 1.125 0 0 0-.645-.87 6.467 6.467 0 0 1-.22-.127 1.125 1.125 0 0 0-1.076-.125l-1.217.456a1.125 1.125 0 0 1-1.37-.49L3.856 15.58a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.293-.24.438-.613.43-.991a7.616 7.616 0 0 1 0-.255c.009-.379-.137-.75-.43-.991l-1.003-.827a1.125 1.125 0 0 1-.26-1.431l1.296-2.247a1.125 1.125 0 0 1 1.37-.491l1.217.456c.355.133.75.072 1.076-.124a6.504 6.504 0 0 1 .22-.127c.331-.183.582-.495.645-.87l.213-1.28Z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                                </svg>
                                <span>Cài đặt</span>
                            </Link>
                        </li>
                    </ul>
                </nav>
            </div>
        </div>
        
    );
};

export default SidebarUserDetails;
