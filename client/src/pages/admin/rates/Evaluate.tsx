
// import { Swiper, SwiperSlide } from "swiper/react";
// import { Autoplay } from "swiper/modules"; // Import chính xác Autoplay
// import "swiper/css";
// import "./index.css";
// import { Table, TableColumnsType, TableProps } from "antd";
// import { useEffect, useState } from "react";
// import { Irates } from "../../../interfaces/IRates";
// import instance from "../../../instance/instance";
// import { FaStar } from "react-icons/fa";
// interface DataType {
//     key: React.Key;
//     name: string;
//     age: number;
//     address: string;
// }
// interface ApiResponse {
//     current_page: number;
//     data: Irates[];  // The 'data' property contains the array of reviews
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
//             title: 'STT',
//             dataIndex: 'stt',
//         },
//         {
//             title: 'Đánh giá theo',
//             dataIndex: 'name',
//             filters: [
//                 {
//                     text: 'Sản phẩm',
//                     value: 'Sản phẩm',
//                 },
//                 {
//                     text: 'Người dùng',
//                     value: 'Người dùng ',
//                 },
//             ],
//         },
//         {
//             title: 'Sản phẩm',
//             dataIndex: '',
//         },
//         {
//             title: 'Nội dung',
//             dataIndex: '',
//         },
//         {
//             title: 'Thời gian',
//             dataIndex: '',
//         },
//         {
//             title: 'Lọc đánh giá',
//             dataIndex: '',
//             filters: [
//                 {
//                     text: '1 sao',
//                     value: '1 sao',
//                 },
//                 {
//                     text: '2 sao',
//                     value: '2 sao',
//                 },
//                 {
//                     text: '3 sao',
//                     value: '3 sao',
//                 },
//                 {
//                     text: '4 sao',
//                     value: '4 sao',
//                 },
//                 {
//                     text: '5 sao',
//                     value: '5 sao',
//                 },
//             ],
//         },
//     ];

//     const data: DataType[] = [];

//     const onChange: TableProps<DataType>['onChange'] = (pagination, filters, sorter, extra) => {
//         console.log('params', pagination, filters, sorter, extra);
//     };
//     const [reviews, setReviews] = useState<Irates[]>([]);

//     // Gọi API để lấy dữ liệu
//     useEffect(() => {
//         const fetchReviews = async () => {
//             try {
//                 console.log("Fetching reviews...");
//                 // Gọi API thông qua Axios instance
//                 const response = await instance.get<ApiResponse>("ratings");  // Giả sử ApiResponse là kiểu dữ liệu của phản hồi
//                 console.log("Response data:", response.data);

//                 // Kiểm tra xem response.data có tồn tại và thuộc tính 'data' có phải là mảng hay không
//                 if (response.data && Array.isArray(response.data.data)) {
//                     console.log("data:", response.data.data);  // Đây là mảng các đánh giá
//                     setReviews(response.data.data);  // Lưu mảng đánh giá vào state 'reviews'
//                 } else {
//                     console.error("Response data is not an array:", response.data);
//                     setReviews([]);  // Nếu dữ liệu không phải mảng, đặt lại state là mảng rỗng
//                 }
//             } catch (error: any) {
//                 // Xử lý và log lỗi
//                 console.error("Error fetching reviews:", error.message);
//                 setReviews([]);  // Trong trường hợp có lỗi, đặt lại state là mảng rỗng
//             }
//         };

//         fetchReviews();
//     }, []);



//     return (
//         <>
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
//                         slidesPerView={5} // Hiển thị 5 div mỗi lần
//                         slidesPerGroup={1} // Di chuyển từng 1 div
//                         className="w-full"
//                     >
//                         {reviews.map((review) => (
//                             <SwiperSlide key={review.id}>
//                                 <div className="border border-gray-300 p-4 space-y-4 rounded-md">
//                                     <div className="flex space-x-1">
//                                         {/* Tạo số sao dựa trên rating */}
//                                         {Array.from({ length: 5 }, (_, starIndex) => (
//                                             // Kiểm tra xem sao hiện tại có nhỏ hơn rating không, nếu có thì tô màu vàng (primary), ngược lại thì tô màu xám
//                                             <FaStar
//                                                 className={starIndex < review.rating ? "text-primary fill-primary" : "text-gray-300"} // Sử dụng class text-primary cho sao đã đánh giá
//                                                 key={starIndex}
//                                             />
//                                         ))}
//                                     </div>
//                                     <div>
//                                         <p className="text-sm">{review.content}</p>
//                                     </div>
//                                     <div className="flex items-center space-x-3">
//                                         <div className="w-10 h-10">
//                                             <img
//                                                 src={review.user.avatar || "https://via.placeholder.com/150"}
//                                                 alt="User Avatar"
//                                                 className="rounded-full w-full h-full object-cover"
//                                             />


//                                         </div>
//                                         <div>
//                                             <p className="font-medium">{review.user?.name}</p>  {/* Tên người dùng */}
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
//             <div className="mt-6">
//                 <Table<DataType> columns={columns} dataSource={data} onChange={onChange} />
//             </div>
//         </>
//     );
// };

// export default Rates;





import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";
import "./index.css";
import { Table, TableColumnsType, TableProps } from "antd";
import { useEffect, useState } from "react";
import { Irates } from "../../../interfaces/IRates";
import instance from "../../../instance/instance";
import { FaStar } from "react-icons/fa";

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
    const columns: TableColumnsType<DataType> = [
        {
            title: "STT",
            dataIndex: "stt",
            width: 50,
        },
        {
            title: "Đánh giá theo",
            dataIndex: "name",
            filters: [
                {
                    text: "Sản phẩm",
                    value: "Sản phẩm",
                },
                {
                    text: "Người dùng",
                    value: "Người dùng",
                },
            ],
            onFilter: (value, record) => record.name.includes(value as string),
        },
        {
            title: "Sản phẩm",
            dataIndex: "product",
        },
        {
            title: "Nội dung",
            dataIndex: "content",
            render: (text) => <span className="line-clamp-1">{text}</span>, // Hiển thị 2 dòng
        },
        {
            title: "Thời gian",
            dataIndex: "created_at",
        },
        {
            title: "Lọc đánh giá",
            dataIndex: "rating",
            filters: [
                { text: "1 sao", value: 1 },
                { text: "2 sao", value: 2 },
                { text: "3 sao", value: 3 },
                { text: "4 sao", value: 4 },
                { text: "5 sao", value: 5 },
            ],
            onFilter: (value, record) => record.rating === value,
        },
    ];

    const [reviews, setReviews] = useState<Irates[]>([]);

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const response = await instance.get<ApiResponse>("ratings");
                if (response.data && Array.isArray(response.data.data)) {
                    setReviews(response.data.data);
                } else {
                    console.error("Invalid response data");
                }
            } catch (error: any) {
                console.error("Error fetching reviews:", error.message);
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

    const onChange: TableProps<DataType>["onChange"] = (pagination, filters, sorter, extra) => {
        console.log("params", pagination, filters, sorter, extra);
    };
    const [expandedContent, setExpandedContent] = useState(null); // Trạng thái mở rộng nội dung

    const toggleContent = (id) => {
        setExpandedContent((prev) => (prev === id ? null : id)); // Đóng nếu đã mở, mở nếu chưa
    };
    return (
        <>
            {/* Swiper Section */}
            <div className="bg-white shadow-md rounded-lg overflow-hidden">
                <div className="p-4">
                    <h2 className="text-left font-bold text-xl mb-6">Đánh giá mới</h2>
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
                                        <p className="text-sm truncate-content">
                                            {expandedContent === review.id
                                                ? review.content
                                                : review.content.length > 50
                                                    ? `${review.content.slice(0, 50)}...`
                                                    : review.content}
                                        </p>
                                        {review.content.length > 50 && (
                                            <button
                                                className="text-primary font-medium mt-2"
                                                onClick={() => toggleContent(review.id)}
                                            >
                                                {expandedContent === review.id ? "Ẩn bớt" : "Xem thêm"}
                                            </button>
                                        )}
                                    </div>
                                    <div className="flex items-center space-x-3">
                                        <div className="w-10 h-10">
                                            <img
                                                src={
                                                    review.user.avatar ||
                                                    "https://images.via.com/static/img/general/New_UI_Images/Top_routes/Himachal.png"
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

            {/* Table Section */}
            <div className="mt-6">
                <Table<DataType>
                    columns={columns}
                    dataSource={tableData}
                    onChange={onChange}
                    pagination={{ pageSize: 10 }}
                    scroll={{ x: 800 }}
                />
            </div>
        </>
    );
};
export default Rates;


