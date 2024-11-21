import { CiStar } from "react-icons/ci";
import avatar from "./champion.jpg";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules"; // Import chính xác Autoplay
import "swiper/css";
import "./index.css";
import { Table, TableColumnsType, TableProps } from "antd";

interface DataType {
    key: React.Key;
    name: string;
    age: number;
    address: string;
}

const Rates = () => {
    const columns: TableColumnsType<DataType> = [
        {
            title: 'STT',
            dataIndex: 'stt',
        },
        {
            title: 'Đánh giá theo',
            dataIndex: 'name',
            filters: [
                {
                    text: 'Sản phẩm',
                    value: 'Joe',
                },
                {
                    text: 'Người dùng',
                    value: 'Category 1',
                },
            ],
        },
        {
            title: 'Sản phẩm',
            dataIndex: 'stt',
        },
        {
            title: 'Nội dung',
            dataIndex: 'stt',
        },
        {
            title: 'Thời gian',
            dataIndex: 'stt',
        },
        {
            title: 'Lọc đánh giá',
            dataIndex: 'address',
            filters: [
                {
                    text: '1 sao',
                    value: 'London',
                },
                {
                    text: '2 sao',
                    value: 'New York',
                },
                {
                    text: '3 sao',
                    value: 'New York',
                },
                {
                    text: '4 sao',
                    value: 'New York',
                },
                {
                    text: '5 sao',
                    value: 'New York',
                },
            ],
        },
    ];

    const data: DataType[] = [];

    const onChange: TableProps<DataType>['onChange'] = (pagination, filters, sorter, extra) => {
        console.log('params', pagination, filters, sorter, extra);
    };

    return (
        <>
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
                        slidesPerView={5} // Hiển thị 5 div mỗi lần
                        slidesPerGroup={1} // Di chuyển từng 1 div
                        className="w-full"
                    >
                        {Array(10).fill("").map((_, index) => (
                            <SwiperSlide key={index}>
                                <div className="border border-gray-300 p-4 space-y-4 rounded-md">
                                    <div className="flex space-x-1">
                                        <CiStar className="text-primary" />
                                        <CiStar className="text-primary" />
                                        <CiStar className="text-primary" />
                                        <CiStar className="text-primary" />
                                        <CiStar className="text-primary" />
                                    </div>
                                    <div>
                                        <p className="text-sm">Review body {index + 1}</p>
                                    </div>
                                    <div className="flex items-center space-x-3">
                                        <div className="w-10 h-10">
                                            <img
                                                src={avatar}
                                                alt=""
                                                className="rounded-full w-full h-full object-cover"
                                            />
                                        </div>
                                        <div>
                                            <p className="font-medium">LE DINH AN</p>
                                            <p className="text-sm text-gray-500">Date</p>
                                        </div>
                                    </div>
                                </div>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div>
            </div>
            <div className="mt-6">
                <Table<DataType> columns={columns} dataSource={data} onChange={onChange} />
            </div>
        </>
    );
};

export default Rates;
