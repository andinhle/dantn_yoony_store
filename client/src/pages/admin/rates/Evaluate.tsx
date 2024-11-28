
// import { Swiper, SwiperSlide } from "swiper/react";
// import { Autoplay } from "swiper/modules";
// import "swiper/css";
// import "./index.css";
// import { Table, TableColumnsType, TableProps } from "antd";
// import { useEffect, useState } from "react";
// import { Irates } from "../../../interfaces/IRates";
// import instance from "../../../instance/instance";
// import { FaStar } from "react-icons/fa";
// import logoUser from "./champion.jpg"
// interface DataType {
//     key: React.Key;
//     stt: number;
//     name: string;
//     product: string;
//     content: string;
//     created_at: string;
//     rating: number;
// }

// interface ApiResponse {
//     current_page: number;
//     data: Irates[];
//     first_page_url: string;
//     from: number;
//     last_page: number;
//     last_page_url: string;
//     next_page_url: string | null;
//     path: string;
//     per_page: number;
//     prev_page_url: string | null;
//     to: number;
//     total: number;
// }

// const Rates = () => {
//     const columns: TableColumnsType<DataType> = [
//         {
//             title: "STT",
//             dataIndex: "stt",
//             width: 50,
//         },
//         {
//             title: "Đánh giá theo",
//             dataIndex: "name",
//             filters: [
//                 {
//                     text: "Sản phẩm",
//                     value: "Sản phẩm",
//                 },
//                 {
//                     text: "Người dùng",
//                     value: "Người dùng",
//                 },
//             ],
//             onFilter: (value, record) => record.name.includes(value as string),
//         },
//         {
//             title: "Sản phẩm",
//             dataIndex: "product",
//         },
//         {
//             title: "Nội dung",
//             dataIndex: "content",
//             render: (text) => <span className="line-clamp-1">{text}</span>, // Hiển thị 2 dòng
//         },
//         {
//             title: "Thời gian",
//             dataIndex: "created_at",
//         },
//         {
//             title: "Lọc đánh giá",
//             dataIndex: "rating",
//             filters: [
//                 { text: "1 sao", value: 1 },
//                 { text: "2 sao", value: 2 },
//                 { text: "3 sao", value: 3 },
//                 { text: "4 sao", value: 4 },
//                 { text: "5 sao", value: 5 },
//             ],
//             onFilter: (value, record) => record.rating === value,
//         },
//     ];

//     const [reviews, setReviews] = useState<Irates[]>([]);

//     useEffect(() => {
//         const fetchReviews = async () => {
//             try {
//                 const response = await instance.get<ApiResponse>("ratings");
//                 if (response.data && Array.isArray(response.data.data)) {
//                     console.log("data",response.data)
//                     setReviews(response.data.data);
//                 } else {
//                     console.error("Invalid response data");
//                 }
//             } catch (error: any) {
//                 console.error("Error fetching reviews:", error.message);
//             }
//         };
//         fetchReviews();
//     }, []);

//     const tableData = reviews.map((review, index) => ({
//         key: review.id,
//         stt: index + 1,
//         name: review.user?.name || "Không xác định",
//         product: review.product?.name || "Không xác định",
//         content: review.content,
//         created_at: new Date(review.created_at).toLocaleDateString("vi-VN"),
//         rating: review.rating,
//     }));

//     const onChange: TableProps<DataType>["onChange"] = (pagination, filters, sorter, extra) => {
//         console.log("params", pagination, filters, sorter, extra);
//     };
//     const [expandedContent, setExpandedContent] = useState(null); // Trạng thái mở rộng nội dung

//     const toggleContent = (id) => {
//         setExpandedContent((prev) => (prev === id ? null : id)); // Đóng nếu đã mở, mở nếu chưa
//     };
//     return (
//         <>
//             {/* Swiper Section */}
//             <div className="bg-white shadow-md rounded-lg overflow-hidden">
//                 <div className="p-4">
//                     <h2 className="text-left font-bold text-xl mb-6">Đánh giá mới</h2>
//                     <Swiper
//                         modules={[Autoplay]}
//                         autoplay={{
//                             delay: 3000,
//                             disableOnInteraction: false,
//                         }}
//                         loop={true}
//                         spaceBetween={16}
//                         slidesPerView={5}
//                         slidesPerGroup={1}
//                         className="w-full"
//                     >
//                         {reviews.slice(0, 10).map((review) => (
//                             <SwiperSlide key={review.id}>
//                                 <div className="border border-gray-300 p-4 space-y-4 rounded-md">
//                                     <div className="flex space-x-1">
//                                         {Array.from({ length: 5 }, (_, starIndex) => (
//                                             <FaStar
//                                                 className={
//                                                     starIndex < review.rating
//                                                         ? "text-primary fill-primary"
//                                                         : "text-gray-300"
//                                                 }
//                                                 key={starIndex}
//                                             />
//                                         ))}
//                                     </div>
//                                     <div>
//                                         <p className="text-sm truncate-content">
//                                             {expandedContent === review.id
//                                                 ? review.content
//                                                 : review.content.length > 50
//                                                     ? `${review.content.slice(0, 50)}...`
//                                                     : review.content}
//                                         </p>
//                                         {review.content.length > 50 && (
//                                             <button
//                                                 className="text-primary font-medium mt-2"
//                                                 onClick={() => toggleContent(review.id)}
//                                             >
//                                                 {expandedContent === review.id ? "Ẩn bớt" : "Xem thêm"}
//                                             </button>
//                                         )}
//                                     </div>
//                                     <div className="flex items-center space-x-3">
//                                         <div className="w-10 h-10">
//                                             <img
//                                                 src={
//                                                     review.user.avatar ||
//                                                     logoUser
//                                                 }
//                                                 alt="User Avatar"
//                                                 className="rounded-full w-full h-full object-cover"
//                                             />
//                                         </div>
//                                         <div>
//                                             <p className="font-medium">{review.user?.name}</p>
//                                             <p className="text-sm text-gray-500">
//                                                 {new Date(review.created_at).toLocaleDateString("vi-VN")}
//                                             </p>

//                                         </div>
//                                     </div>
//                                 </div>
//                             </SwiperSlide>
//                         ))}
//                     </Swiper>
//                 </div>
//             </div>

//             {/* Table Section */}
//             <div className="mt-6">
//                 <Table<DataType>
//                     columns={columns}
//                     dataSource={tableData}
//                     onChange={onChange}
//                     pagination={{ pageSize: 10 }}
//                     scroll={{ x: 800 }}
//                 />
//             </div>
//         </>
//     );
// };
// export default Rates;

import { useState, useEffect } from "react";
import { Rate, Table, TableColumnsType } from "antd";
import { FaStar } from "react-icons/fa";
import instance from "../../../instance/instance";
import { Irates } from "../../../interfaces/IRates";
import { FaEye, FaEyeSlash, FaUser, FaBox } from "react-icons/fa";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";
import logoUser from "./champion.jpg"
import { MdRateReview } from "react-icons/md";
import { TiArrowSyncOutline } from "react-icons/ti";
interface DataType {
    key: React.Key;
    stt: number;
    name: string;
    product: string;
    content: string;
    created_at: string;
    rating: number;
}
interface ApiResponse {
    current_page: number;
    data: Irates[];
    first_page_url: string;
    from: number;
    last_page: number;
    last_page_url: string;
    next_page_url: string | null;
    path: string;
    per_page: number;
    prev_page_url: string | null;
    to: number;
    total: number;
}
const Rates = () => {
    const [reviews, setReviews] = useState<Irates[]>([]);
    const [selectedView, setSelectedView] = useState<"product" | "user">("product");
    const [loading, setLoading] = useState<boolean>(true);
    const [isHidden, setIsHidden] = useState<boolean>(false); // Trạng thái ẩn/hiện
    const [expandedContent, setExpandedContent] = useState(null); // Trạng thái mở rộng nội dung
    useEffect(() => {
        const fetchReviews = async () => {
            setLoading(true);
            try {
                const response = await instance.get<ApiResponse>("ratings");
                if (response.data && Array.isArray(response.data.data)) {
                    setReviews(response.data.data);
                } else {
                    console.error("Invalid response data");
                }
            } catch (error: any) {
                console.error("Error fetching reviews:", error.message);
            } finally {
                setLoading(false);
            }
        };
        fetchReviews();
    }, []);

    const tableData = reviews.map((review, index) => ({
        key: review.id,
        stt: index + 1,
        name: review.user?.name || "Không xác định",
        product: review.product?.name || "Không xác định",
        content: review.content,
        created_at: new Date(review.created_at).toLocaleDateString("vi-VN"),
        rating: review.rating,
    }));
    // Tạo dữ liệu bảng
    const generateTableData = (filterType: "product" | "user") => {
        const uniqueValues = reviews
            .map((review) => (filterType === "product" ? review.product?.name : review.user?.name))
            .filter((value, index, self) => self.indexOf(value) === index && value);

        return uniqueValues.map((value, index) => ({
            key: index + 1,
            stt: index + 1,
            name: value || "",
            reviews: reviews.filter((review) =>
                filterType === "product"
                    ? review.product?.name === value
                    : review.user?.name === value
            ),
        }));
    };
    const columnsAll: TableColumnsType<DataType> = [
        {
            title: "STT",
            dataIndex: "stt",
            width: 50,
        },
        {
            title: "Tên người dùng",
            dataIndex: "name",
        },
        {
            title: "Sản phẩm",
            dataIndex: "product",
        },
        {
            title: "Nội dung",
            dataIndex: "content",
            render: (text) => <span className="">{text}</span>, // Hiển thị 1 dòng
        },
        {
            title: "Thời gian",
            dataIndex: "created_at",
        },
        {
            title: "Số sao",
            dataIndex: "rating",
            filters: [
                { text: "1 sao", value: 1 },
                { text: "2 sao", value: 2 },
                { text: "3 sao", value: 3 },
                { text: "4 sao", value: 4 },
                { text: "5 sao", value: 5 },
            ],
            onFilter: (value, record) => record.rating === value,
            render: (rating: number) => (
                <Rate
                    value={rating}
                    disabled
                    className="text-primary" // Màu từ Tailwind
                />
            )
        },
    ];
    // Cột bảng cho Ant Design Table
    const columns = [
        {
            title: "STT",
            dataIndex: "stt",
            key: "stt",
            align: "center" as const,
        },
        {
            title: selectedView === "product" ? "Tên sản phẩm" : "Tên người dùng",
            dataIndex: "name",
            key: "name",
        },
        {
            title: "Đánh giá",
            key: "reviews",
            render: (_: any, record: any) => (
                <div>
                    {record.reviews.map((review: Irates, index: number) => (
                        <div key={index} className="mb-4 border-b pb-2">
                            <div className="flex items-center space-x-2">
                                <strong>{selectedView === "product" ? review.user?.name : review.product?.name}</strong>
                                <div className="flex">
                                    {Array.from({ length: 5 }, (_, starIndex) => (
                                        <FaStar
                                            key={starIndex}
                                            className={
                                                starIndex < review.rating
                                                    ? "text-primary fill-primary"
                                                    : "text-gray-300"
                                            }
                                        />
                                    ))}
                                </div>
                            </div>
                            <p>{review.content}</p>
                            <p className="text-sm text-gray-500">
                                {new Date(review.created_at).toLocaleDateString("vi-VN")}
                            </p>
                        </div>
                    ))}
                </div>
            ),
        },
    ];

    // Chuyển đổi giữa đánh giá theo sản phẩm và người dùng
    const toggleView = (view: "product" | "user") => {
        setSelectedView(view);
    };

    // Chuyển đổi trạng thái ẩn/hiện
    const toggleHidden = () => {
        setIsHidden(!isHidden);
    };
    const [showTable, setShowTable] = useState(false); // Quản lý trạng thái ẩn/hiện

    const handleToggleTable = () => {
        setShowTable((prev) => !prev); // Đảo trạng thái
    };
    return (
        <>
            <div className="bg-white shadow-md rounded-lg overflow-hidden">
                <div className="p-4">
                    <div className="mb-6">
                        <button
                            disabled
                            className="bg-primary text-white flex items-center px-2 py-2 border rounded-lg font-normal text-sm transition"
                        >
                            <TiArrowSyncOutline className="text-lg" />
                            <span className="ml-2">Top đánh giá mới</span>
                        </button>
                    </div>
                    <Swiper
                        modules={[Autoplay]}
                        autoplay={{
                            delay: 3000,
                            disableOnInteraction: false,
                        }}
                        loop={true}
                        spaceBetween={16}
                        slidesPerView={5}
                        slidesPerGroup={1}
                        className="w-full"
                    >
                        {reviews.slice(0, 10).map((review) => (
                            <SwiperSlide key={review.id}>
                                <div className="border border-gray-300 p-4 space-y-4 rounded-md">
                                    <div className="flex space-x-1">
                                        {Array.from({ length: 5 }, (_, starIndex) => (
                                            <FaStar
                                                className={
                                                    starIndex < review.rating
                                                        ? "text-primary fill-primary"
                                                        : "text-gray-300"
                                                }
                                                key={starIndex}
                                            />
                                        ))}
                                    </div>
                                    <div>
                                        <p className="text-sm truncate whitespace-nowrap overflow-hidden text-ellipsis">
                                            {expandedContent === review.id
                                                && review.content}
                                        </p>
                                    </div>
                                    <div className="flex items-center space-x-3">
                                        <div className="w-10 h-10">
                                            <img
                                                src={
                                                    review.user.avatar ||
                                                    logoUser
                                                }
                                                alt="User Avatar"
                                                className="rounded-full w-full h-full object-cover"
                                            />
                                        </div>
                                        <div>
                                            <p className="font-medium">{review.user?.name}</p>
                                            <p className="text-sm text-gray-500">
                                                {new Date(review.created_at).toLocaleDateString("vi-VN")}
                                            </p>

                                        </div>
                                    </div>
                                </div>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div>
            </div>
            <div className="mt-4 mb-4">
                <button
                    onClick={handleToggleTable}
                    className="bg-primary text-white flex items-center gap-2 px-6 py-2 border rounded-lg font-normal text-sm transition duration-300 ease-in-out transform hover:scale-105 hover:shadow-lg"
                >
                    <MdRateReview />
                    {showTable ? "Ẩn bảng đánh giá tổng quan" : "Hiện bảng đánh giá quan"}
                </button>
            </div>
            {showTable && (
                <Table
                    columns={columnsAll}
                    dataSource={tableData}
                    pagination={{ pageSize: 10 }}
                    scroll={{ x: 800 }}
                />
            )}
            {/* <div className="mt-6">
                <div className="mt-4 mb-4">
                    <button className="bg-primary text-white flex items-center gap-2 px-4 py-2 border rounded-lg font-normal text-sm transition">
                        <MdRateReview />
                        Tổng quan đánh giá
                    </button>
                </div>

                <Table<DataType>
                    columns={columnsAll}
                    dataSource={tableData}
                    pagination={{ pageSize: 10 }}
                    scroll={{ x: 800 }}
                />
            </div> */}
            {/* Các tùy chọn chuyển đổi giữa đánh giá theo sản phẩm và người dùng */}
            <div className="mb-4 flex space-x-4">
                {/* Nút Đánh giá theo sản phẩm */}
                <button
                    onClick={() => toggleView("product")}
                    className={`flex items-center px-4 py-2 border rounded-lg font-normal text-sm transition duration-300 ease-in-out transform hover:scale-105 hover:shadow-lg ${selectedView === "product"
                        ? "bg-primary text-white border-primary"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`}
                >
                    <FaBox className="inline mr-2" />
                    Đánh giá theo sản phẩm
                </button>

                {/* Nút Đánh giá theo người dùng */}
                <button
                    onClick={() => toggleView("user")}
                    className={`flex items-center px-4 py-2 border rounded-lg font-normal text-sm transition duration-300 ease-in-out transform hover:scale-105 hover:shadow-lg ${selectedView === "user"
                        ? "bg-primary text-white border-primary"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`}
                >
                    <FaUser className="inline mr-2" />
                    Đánh giá theo người dùng
                </button>

                {/* Nút Ẩn/Hiện đánh giá */}
                <button
                    onClick={toggleHidden}
                    className="flex items-center px-4 py-2 border rounded-lg font-normal text-sm bg-red-500 text-white hover:bg-red-600 duration-300 ease-in-out transform hover:scale-105 hover:shadow-lg"
                >
                    {isHidden ? (
                        <>
                            <FaEye className="inline mr-2" />
                            Hiện đánh giá
                        </>
                    ) : (
                        <>
                            <FaEyeSlash className="inline mr-2" />
                            Ẩn đánh giá
                        </>
                    )}
                </button>
            </div>

            {/* Hiển thị bảng đánh giá nếu không bị ẩn */}
            {!isHidden && (
                <Table
                    columns={columns}
                    dataSource={generateTableData(selectedView)}
                    loading={loading}
                    pagination={{
                        pageSize: 5,
                    }}
                    bordered
                />
            )}
        </>
    );
};

export default Rates;
