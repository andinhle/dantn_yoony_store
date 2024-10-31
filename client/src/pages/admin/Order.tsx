import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import type { Orders } from "../../interfaces/IOrders";
import instance from "../../instance/instance";
import { toast } from "react-toastify";
import { Input, Space } from 'antd';
const Orders = () => {
  const [orders, setOrders] = useState<Orders[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchDate, setSearchDate] = useState("");
  // Hàm xử lý tìm kiếm
  const handleSearch = (value: string) => {
    setSearchTerm(value);
  };
  const handleDateSearch = (value: string) => {
    setSearchDate(value);
  };
  // Lọc danh sách đơn hàng theo mã sản phẩm
  const filteredOrders = orders.filter((item) => {
    const matchesCode = item.code.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDate = searchDate
      ? new Date(item.created_at).toLocaleDateString("vi-VN") === searchDate
      : true;
    return matchesCode && matchesDate;
  });
  const { Search } = Input;

  const getStatusBackground = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-500 bg-opacity-50"; // Chờ xử lý
      case "confirmed":
        return "bg-blue-500 bg-opacity-50"; // Đã xác nhận
      case "preparing_goods":
        return "bg-yellow-600 bg-opacity-50"; // Đang chuẩn bị hàng
      case "delivered":
        return "bg-green-500 bg-opacity-50"; // Đã giao
      case "canceled":
        return "bg-red-500 bg-opacity-50"; // Đã hủy
      default:
        return "bg-gray-500 bg-opacity-50"; // Trạng thái không xác định
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "text-yellow-500"; // Chờ xử lý
      case "confirmed":
        return "text-blue-500"; // Đã xác nhận
      case "preparing_goods":
        return "text-yellow-800"; // Đang chuẩn bị hàng
      case "delivered":
        return "text-green-500"; // Đã giao
      case "canceled":
        return "text-red-600"; // Đã hủy
      default:
        return "text-red-500"; // Trạng thái không xác định
    }
  };
  const fetchOrders = async () => {
    try {
      const { data: { data: { data: respone } } } = await instance.get("admin/orders");
      // console.log("data:", respone);
      // toast.success("Successfully");
      // Kiểm tra xem data.data có phải là mảng không
      if (Array.isArray(respone)) {
        setOrders(respone);
      } else {
        console.warn("Dữ liệu không phải là một mảng:", respone);
      }
    } catch (error: any) {
      if (error.response) {
        console.error("Server responded with:", error.response.data);
        console.error("Status code:", error.response.status);
      } else if (error.request) {
        console.error("No response from server:", error.request);
      } else {
        console.error("Error in setting up request:", error.message);
      }
      toast.error("Xảy ra lỗi");
    }
  };
  useEffect(() => {
    fetchOrders();
  }, [])
  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden">
      <div className="m-4 flex space-x-4">
        <Space direction="vertical" className="">
          <Search
            placeholder="Mã đơn hàng (code)"
            allowClear
            enterButton="Search"
            size="large"
            onSearch={handleSearch}
          />
        </Space>
        <Space direction="vertical" className="">
          <Search
            placeholder="Ngày đặt hàng"
            allowClear
            enterButton="Search"
            size="large"
            onSearch={handleDateSearch}
          />
        </Space>
      </div>
      <table className="min-w-full bg-white">
        <thead className="bg-primary">
          <tr>
            <th className="py-3 px-4 text-left text-xs text-white font-bold uppercase tracking-wider">STT</th>
            <th className="py-3 px-4 text-left text-xs text-white font-bold uppercase tracking-wider">Mã đơn hàng</th>
            <th className="py-3 px-4 text-left text-xs text-white font-bold uppercase tracking-wider">Tổng tiền</th>
            <th className="py-3 px-4 text-left text-xs text-white font-bold uppercase tracking-wider">Ngày đặt hàng</th>
            <th className="py-3 px-4 text-left text-xs text-white font-bold uppercase tracking-wider">Trạng thái</th>
            <th className="py-3 px-4 text-left text-xs text-white font-bold uppercase tracking-wider">Hoạt động</th>
          </tr>
        </thead>
        {/* <tbody className="divide-y divide-secondary-200">
          {orders.map((item, index) => (
            <tr key={item.id}>
              <td className="px-4 py-3 whitespace-nowrap text-sm font-bold text-secondary-900 text-primary">{index + 1}</td>
              <td className="px-4 py-3 whitespace-nowrap text-sm">
                <span className="inline-block px-3 py-1 rounded-full border border-primary text-primary font-semibold">
                  {item.code}
                </span>
              </td>
              <td className="px-4 py-3 whitespace-nowrap text-sm text-primary font-bold">
                {new Intl.NumberFormat('vi-VN', {
                  style: 'currency',
                  currency: 'VND',
                  minimumFractionDigits: 0,
                }).format(item.grand_total)}
              </td>
              <td className="px-4 py-3 whitespace-nowrap text-sm text-primary font-bold">
                {new Date(item.created_at).toLocaleDateString('vi-VN', {
                  year: 'numeric',
                  month: 'numeric',
                  day: 'numeric',
                })}
              </td>
              <td className={`px-4 py-3 whitespace-nowrap text-sm ${getStatusColor(item.status_order)}`}>
                <span className={`inline-block px-3 py-1 rounded-full ${getStatusBackground(item.status_order)} ${getStatusColor(item.status_order)}`}>
                  {item.status_order}
                </span>
              </td>
              <td className="px-10 py-3 whitespace-nowrap text-sm text-red-600">
                <div className="flex justify-start">
                  <Link to={`orderDetails/${item.code}`}>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-6 h-6 text-green-600 cursor-pointer"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M16.862 4.487l1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
                      />
                    </svg>
                  </Link>
                </div>
              </td>
            </tr>
          ))}
        </tbody> */}
        <tbody className="divide-y divide-secondary-200">
          {filteredOrders.map((item, index) => (
            <tr key={item.id}>
              <td className="px-4 py-3 whitespace-nowrap text-sm font-bold text-secondary-900 text-primary">
                {index + 1}
              </td>
              <td className="px-4 py-3 whitespace-nowrap text-sm">
                <span className="inline-block px-3 py-1 rounded-full border border-primary text-primary font-semibold">
                  {item.code}
                </span>
              </td>
              <td className="px-4 py-3 whitespace-nowrap text-sm text-primary font-bold">
                {new Intl.NumberFormat("vi-VN", {
                  style: "currency",
                  currency: "VND",
                  minimumFractionDigits: 0,
                }).format(item.grand_total)}
              </td>
              <td className="px-4 py-3 whitespace-nowrap text-sm text-primary font-bold">
                {new Date(item.created_at).toLocaleDateString("vi-VN", {
                  year: "numeric",
                  month: "numeric",
                  day: "numeric",
                })}
              </td>
              <td
                className={`px-4 py-3 whitespace-nowrap text-sm ${getStatusColor(
                  item.status_order
                )}`}
              >
                <span
                  className={`inline-block px-3 py-1 rounded-full ${getStatusBackground(
                    item.status_order
                  )} ${getStatusColor(item.status_order)}`}
                >
                  {item.status_order}
                </span>
              </td>
              <td className="px-10 py-3 whitespace-nowrap text-sm text-red-600">
                <div className="flex justify-start">
                  <Link to={`orderDetails/${item.code}`}>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-6 h-6 text-green-600 cursor-pointer"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M16.862 4.487l1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
                      />
                    </svg>
                  </Link>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
export default Orders

