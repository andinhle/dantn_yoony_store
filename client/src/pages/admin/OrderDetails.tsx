import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Orders } from "../../interfaces/IOrders";
import instance from "../../instance/instance";
import { toast } from "react-toastify";

const OrderDetails = () => {
    const navigate = useNavigate();
    const [showCancelModal, setShowCancelModal] = useState(false);
    const [cancelReason, setCancelReason] = useState('');
    const [orderDetail, setOrderDetail] = useState<Orders>();
    const [selectedStatus, setSelectedStatus] = useState(orderDetail?.status_order || '');
    const { code } = useParams<{ code: string }>();
    const orderStatuses = [
        { value: "pending", label: "pending" },
        { value: "confirmed", label: "confirmed" },
        { value: "preparing_goods", label: "preparing_goods" },
        { value: "delivered", label: "delivered" },
        { value: "canceled", label: "canceled" },
    ];
    const handleCancelOrder = () => {
        // Hiển thị modal khi người dùng nhấn vào nút "Hủy"
        setShowCancelModal(true);
    };
    const handleCloseModal = () => {
        setShowCancelModal(false);
        setCancelReason(''); // Reset lý do hủy
    };
    const handleStatusChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedStatus(event.target.value);
    };
    console.log(selectedStatus)
    const handleConfirmCancel = async () => {
        if (!cancelReason) {
            toast.warning("Vui lòng chọn lý do hủy đơn hàng.");
            return;
        }
        try {
            // Gửi yêu cầu hủy đơn hàng với lý do hủy
            await instance.patch(`admin/order-cancelation/${code}`, { reason: cancelReason });
            console.log("reason")
            toast.success("Hủy đơn hàng thành công!");
            setSelectedStatus("canceled");
            setOrderDetail((prev) => prev ? { ...prev, status_order: "canceled" } : prev);
            // Gọi lại fetchOrderDetail để cập nhật thông tin đơn hàng nếu cần
            fetchOrderDetail(code as string);
        } catch (error: any) {
            console.error("Error cancelling order:", error);
            toast.error(`Error cancelling order: ${error.response?.data?.message || "Unknown error"}`);
        } finally {
            handleCloseModal(); // Đóng modal sau khi xác nhận hủy
        }
    };
    const handleUpdateStatus = async () => {
        try {
            // Gửi yêu cầu cập nhật trạng thái
            await instance.patch(`admin/order-detail/${code}`, { status: selectedStatus });
            toast.success("Cập nhật trạng thái đơn hàng thành công!");
            fetchOrderDetail(code as string); // Refresh lại thông tin đơn hàng sau khi cập nhật
            navigate("/admin/orders")
        } catch (error: any) {
            // Log lỗi chi tiết hơn
            console.error("Error updating status:", error);
            console.error("Error response data:", error.response?.data); // Ghi log dữ liệu phản hồi
            console.error("Error status:", error.response?.status); // Ghi log mã trạng thái phản hồi

            // Hiển thị thông báo lỗi cho người dùng
            toast.error(`Error updating status: ${error.response?.data?.message || "Unknown error"}`);
        }
    };
    const fetchOrderDetail = async (code: string) => {
        try {
            const { data } = await instance.get(`admin/order-detail/${code}`);
            setOrderDetail(data.data);
            console.log("data:", data.data)
            // Đảm bảo rằng bạn set selectedStatus bằng với status_order của đơn hàng
            const currentStatus = data.data.status_order; // Trạng thái hiện tại
            const statusExists = orderStatuses.some(status => status.value === currentStatus);

            setSelectedStatus(statusExists ? currentStatus : "pending"); // Nếu trạng thái không hợp lệ, fallback về "pending"
        } catch (error: any) {
            toast.error(`Error fetching order details: ${error.response?.data?.message || "Unknown error"}`);
        }
    };

    useEffect(() => {
        if (code) {
            fetchOrderDetail(code); // Gọi hàm với mã đơn hàng
        }
    }, [code])

    return (
        <div className="flex">
            <div className="bg-white shadow-md rounded-lg overflow-hidden w-full h-max lg:w-2/3 mr-4">
                <div className="bg-primary px-6 py-4">
                    <h2 className="text-xl font-semibold text-white">Chi tiết đơn hàng : {orderDetail?.code}</h2>
                </div>
                <div className="flex flex-col">
                    <div className="overflow-x-auto flex-1">
                        <table className="w-full bg-white">
                            <thead className="bg-secondary-100">
                                <tr>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-secondary-600 uppercase tracking-wider border-b">STT</th>
                                    <th className="px-4 py-3 text-center text-xs font-medium text-secondary-600 uppercase tracking-wider border-b">Sản phẩm</th>
                                    {/* <th className="px-4 py-3 text-left text-xs font-medium text-secondary-600 uppercase tracking-wider border-b">Ảnh sản phẩm</th> */}
                                    {/* <th className="px-4 py-3 text-left text-xs font-medium text-secondary-600 uppercase tracking-wider border-b">Màu</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-secondary-600 uppercase tracking-wider border-b">Size</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-secondary-600 uppercase tracking-wider border-b">Loại vải</th> */}
                                    <th className="px-4 py-3 text-left text-xs font-medium text-secondary-600 uppercase tracking-wider border-b">Số lượng</th>
                                    <th className="px-4 py-3 text-center text-xs font-medium text-secondary-600 uppercase tracking-wider border-b">Đơn giá</th>
                                    <th className="px-4 py-3 text-center text-xs font-medium text-secondary-600 uppercase tracking-wider border-b">Tổng</th>
                                </tr>
                            </thead>

                            <tbody>
                                <tr>
                                    <td colSpan={6} className="p-0">
                                        <hr className="border-secondary-300" />
                                    </td>
                                </tr>
                            </tbody>
                            <tbody className="divide-y divide-secondary-200">
                                {orderDetail?.items?.map((item, index) => {
                                    // console.log("item", item?.variant?.attribute_values)
                                    // console.log("name:")

                                    return (
                                        // <tr key={item.id}>
                                        //     <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-secondary-900">{index + 1}</td>
                                        //     <td className="px-4 py-4 text-sm text-secondary-900 break-words">
                                        //         {item?.variant?.product?.name}
                                        //     </td>
                                        //     <td className="px-4 py-4 text-sm text-secondary-900 break-words">
                                        //         <img src={item?.variant?.product?.images} alt="" />
                                        //     </td>
                                        //     {item?.variant?.attribute_values.map((i) => {
                                        //         return (
                                        //             <>
                                        //                 <td className="px-4 py-4 whitespace-nowrap text-sm text-secondary-500">{i.value}</td>
                                        //             </>
                                        //         )
                                        //     }
                                        //     )}
                                        //     <td className="px-4 py-4 whitespace-nowrap text-sm text-secondary-900">{item?.quantity}</td>
                                        //     <td className="px-4 py-4 whitespace-nowrap text-sm text-secondary-900">{item?.variant?.price}</td>
                                        //     <td className="px-4 py-4 whitespace-nowrap text-sm text-secondary-900">{item?.total_price}</td>
                                        // </tr>
                                        <tr key={item.id} className="border-b border-gray-200 hover:bg-gray-50 transition">
                                            <td className="px-4 py-4 whitespace-nowrap text-sm font-semibold text-primary text-center">{index + 1}</td>

                                            {/* Tên sản phẩm */}
                                            <td className="px-4 py-3 text-sm font-medium break-words text-primary flex items-center space-x-4">
                                                <div>
                                                    <img
                                                        src={item?.variant?.product?.images}
                                                        alt={item?.variant?.product?.name || 'Product Image'}
                                                        className="w-16 h-16 object-cover rounded-md border border-gray-300"
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <div>
                                                        {item?.variant?.product?.name || 'N/A'}
                                                    </div>
                                                    <div className="text-uppercase">
                                                        <td className="text-gray-400 text-uppercase whitespace-nowrap text-sm text-left">
                                                            {item?.variant?.attribute_values
                                                                .map((i) => {
                                                                    switch (i.attribute_id) {
                                                                        case 2:
                                                                            return `Màu : ${i.value}`;
                                                                        case 1:
                                                                            return `Size : ${i.value}`;
                                                                        case 3:
                                                                            return `Loại vải : ${i.value}`;
                                                                        default:
                                                                            return '';
                                                                    }
                                                                })
                                                                .filter((text) => text !== '') // Lọc bỏ các giá trị rỗng
                                                                .map((text, index, array) => (
                                                                    <span key={index}>
                                                                        {text}
                                                                        {index < array.length - 1 && (
                                                                            <span className="text-black px-2"> | </span>
                                                                        )}
                                                                    </span>
                                                                ))}
                                                        </td>
                                                    </div>
                                                </div>

                                            </td>

                                            {/* Số lượng */}
                                            <td className="px-4 py-4 whitespace-nowrap text-sm font-semibold text-primary text-center">
                                                {item?.quantity || 0}
                                            </td>

                                            {/* Giá */}
                                            <td className="px-4 py-4 whitespace-nowrap text-sm font-semibold text-primary text-center">
                                                {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item?.variant?.price || 0)}
                                            </td>

                                            {/* Tổng giá */}
                                            <td className="px-4 py-4 whitespace-nowrap text-sm font-semibold text-primary text-center">
                                                {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item?.total_price|| 0)}
                                            </td>
                                        </tr>

                                    )
                                }
                                )}

                                {/* <tr>
                                    <td colSpan="5" className="px-4 py-4  text-right text-sm font-semibold text-secondary-900">Voucher giảm giá:</td>
                                    <td className="px-4 py-4 whitespace-nowrap  text-sm font-semibold text-secondary-900">500,000 VND</td>
                                </tr> */}
                                <tr className="bg-gray-100">
                                    <td colSpan="4" className="px-4 py-4 text-primary  text-right text-sm font-semibold text-secondary-900">Tổng thanh toán:</td>
                                            <td className="px-4 py-4 whitespace-nowrap text-primary  text-sm font-semibold text-secondary-900">
                                                {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(orderDetail?.final_total || 0)}
                                            </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <div className="flex">
                        <div className="mb-6 bg-white rounded-lg w-full h-max lg:w-2/3 mr-4">
                            <label htmlFor="orderStatus" className="block text-sm font-medium text-primary px-4 py-4">
                                Cập nhật trạng thái đơn hàng
                            </label>
                            <select
                                id="orderStatus"
                                value={selectedStatus}
                                onChange={handleStatusChange}
                                className="mt-1 block mx-4 border-gray-300 rounded-md min-w-max shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                            >
                                {orderStatuses.map((status) => (
                                    <option key={status.value} value={status.value}>
                                        {status.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <button onClick={handleUpdateStatus} type="submit" className="cursor-pointer focus:outline-none my-12 mx-20 w-full text-white bg-primary hover:bg-primary focus:ring-4 focus:ring-primary font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-primary dark:hover:bg-primary dark:focus:ring-primary">Cập nhật</button>
                        </div>
                        <div>
                            <button onClick={handleCancelOrder} type="submit" className="cursor-pointer focus:outline-none my-12 mx-24 text-white bg-red-700 focus:ring-4 focus:ring-red-700 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-primary dark:hover:bg-primary dark:focus:ring-primary">Hủy</button>
                        </div>
                        {showCancelModal && (
                            <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50 overflow-hidden">
                                <div className="bg-white p-6 rounded-lg shadow-lg w-1/3 max-h-screen overflow-y-auto">
                                    <h3 className="text-lg font-semibold mb-4">Lý do hủy đơn hàng</h3>
                                    <div className="space-y-2">
                                        {["Hàng không đúng mẫu", "Giao hàng chậm quá số ngày quy định", "Sai chính sách"].map((reason, idx) => (
                                            <button
                                                key={idx}
                                                className={`w-full p-2 border border-gray-300 rounded-md text-left ${cancelReason === reason ? "bg-gray-200" : ""
                                                    }`}
                                                onClick={() => setCancelReason(reason)}
                                            >
                                                {reason}
                                            </button>
                                        ))}
                                    </div>
                                    <div className="flex justify-end mt-4">
                                        <button
                                            onClick={handleCloseModal}
                                            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md mr-2"
                                        >
                                            Đóng
                                        </button>
                                        <button
                                            onClick={handleConfirmCancel}
                                            className="px-4 py-2 bg-red-600 text-white rounded-md"
                                        >
                                            Xác nhận hủy
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                    </div>

                </div>

            </div>

            <div className="bg-white shadow-md rounded-lg overflow-hidden w-full lg:w-1/3">
                <div className="bg-primary px-6 py-4">
                    <h2 className="text-xl font-semibold text-white">Thông tin đơn hàng</h2>
                </div>
                <div className="p-6">
                    <form>
                        <div className="mb-4">
                            <label htmlFor="userName" className="block text-sm font-medium text-secondary-600">Tên người dùng</label>
                            <input
                                type="text"
                                id="userName"
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                                value={orderDetail?.name}
                                disabled
                            />
                        </div>

                        <div className="mb-4">
                            <label htmlFor="totalPrice" className="block text-sm font-medium text-secondary-600">Tổng giá tiền</label>
                            <input
                                type="text"
                                id="totalPrice"
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                                value={orderDetail?.grand_total.toLocaleString() + " VND"}
                                disabled
                            />
                        </div>
                        {/* <div className="mb-4">
                            <label htmlFor="totalPrice" className="block text-sm font-medium text-secondary-600">Giảm giá</label>
                            <input
                                type="text"
                                id="totalPrice"
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-primary focus:ring-primary sm:text-sm"

                                disabled
                            />
                        </div> */}
                        <div className="mb-4">
                            <label htmlFor="finalPrice" className="block text-sm font-medium text-secondary-600">Giá cuối</label>
                            <input
                                type="text"
                                id="finalPrice"
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                                value={orderDetail?.final_total.toLocaleString() + " VND"}
                                disabled
                            />
                        </div>

                        <div className="mb-4">
                            <label htmlFor="paymentMethod" className="block text-sm font-medium text-secondary-600">Phương thức thanh toán</label>
                            <input
                                type="text"
                                id="userName"
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                                value={orderDetail?.payment_method}
                                disabled
                            />
                        </div>

                        <div className="mb-4">
                            <label htmlFor="notes" className="block text-sm font-medium text-secondary-600">Ghi chú</label>
                            <textarea
                                id="notes"
                                rows={3}
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                                value={orderDetail?.notes}
                                disabled
                            ></textarea>
                        </div>

                        <div className="mb-4">
                            <label htmlFor="phone" className="block text-sm font-medium text-secondary-600">Số điện thoại</label>
                            <input
                                type="tel"
                                id="phone"
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                                value={orderDetail?.tel}
                                disabled
                            />
                        </div>

                        <div className="mb-4">
                            <label htmlFor="address" className="block text-sm font-medium text-secondary-600">Địa chỉ</label>
                            <textarea
                                id="address"
                                rows={3}
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                                value={orderDetail?.address}
                                disabled
                            ></textarea>
                        </div>
                    </form>
                </div>
            </div>

        </div>




    )
}
export default OrderDetails