import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Orders } from "../../interfaces/IOrders";
import instance from "../../instance/instance";
import { toast } from "react-toastify";

const OrderDetails = () => {
    const [showCancelModal, setShowCancelModal] = useState(false);
    const [cancelReason, setCancelReason] = useState('');
    const [orderDetail, setOrderDetail] = useState<Orders>();
    const [selectedStatus, setSelectedStatus] = useState(orderDetail?.status_order || '');
    const { code } = useParams<{ code: string }>();
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
    const handleConfirmCancel = async () => {
        try {
            // Gửi yêu cầu hủy đơn hàng với lý do hủy
            await instance.patch(`admin/order-cancelation/${code}`, { reason: cancelReason });
            toast.success("Hủy đơn hàng thành công!");
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
            await instance.patch(`admin/order-detail/${code}`);
            toast.success("Cập nhật trạng thái đơn hàng thành công!");
            fetchOrderDetail(code as string); // Refresh lại thông tin đơn hàng sau khi cập nhật
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
            console.log("data:", data)
            //   toast.success('Successfully fetched order details');
        } catch (error: any) {
            // Kiểm tra lỗi phản hồi từ server
            if (error.response) {
                console.error("Error response from server:", error.response.data); // Nội dung lỗi từ server
                console.error("Status code:", error.response.status); // Mã trạng thái (vd: 404, 500)
                toast.error(`Server Error: ${error.response.data.message || "Unknown server error"}`);
            }
            // Kiểm tra lỗi mạng
            else if (error.request) {
                console.error("No response received from server:", error.request);
                toast.error("Network Error: No response from server. Please check your connection.");
            }
            // Lỗi cấu hình hoặc thiết lập request
            else {
                console.error("Error setting up request:", error.message);
                toast.error(`Request Error: ${error.message}`);
            }
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
                                    <th className="px-4 py-3 text-left text-xs font-medium text-secondary-600 uppercase tracking-wider border-b">Tên sản phẩm</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-secondary-600 uppercase tracking-wider border-b">Màu</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-secondary-600 uppercase tracking-wider border-b">Size</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-secondary-600 uppercase tracking-wider border-b">Loại vải</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-secondary-600 uppercase tracking-wider border-b">Số lượng</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-secondary-600 uppercase tracking-wider border-b">Đơn giá</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-secondary-600 uppercase tracking-wider border-b">Tổng</th>
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
                                    console.log("item", item?.variant?.attribute_values)
                                    // console.log("name:")

                                    return (
                                        <tr key={item.id}>
                                            <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-secondary-900">{index + 1}</td>
                                            <td className="px-4 py-4 text-sm text-secondary-900 break-words">
                                                {item?.variant?.product?.name}
                                            </td>
                                            {item?.variant?.attribute_values.map((i) => {
                                                return (
                                                    <>
                                                        <td className="px-4 py-4 whitespace-nowrap text-sm text-secondary-500">{i.value}</td>
                                                    </>
                                                )
                                            }
                                            )}
                                            <td className="px-4 py-4 whitespace-nowrap text-sm text-secondary-900">{item?.quantity}</td>
                                            <td className="px-4 py-4 whitespace-nowrap text-sm text-secondary-900">{item?.variant?.price}</td>
                                            <td className="px-4 py-4 whitespace-nowrap text-sm text-secondary-900">{item?.total_price}</td>
                                        </tr>
                                    )
                                }
                                )}

                                <tr>
                                    <td colSpan="7" className="px-4 py-4  text-right text-sm font-semibold text-secondary-900">Voucher giảm giá:</td>
                                    <td className="px-4 py-4 whitespace-nowrap  text-sm font-semibold text-secondary-900">500,000 VND</td>
                                </tr>
                                <tr className="bg-gray-100">
                                    <td colSpan="7" className="px-4 py-4  text-right text-sm font-semibold text-secondary-900">Tổng thanh toán:</td>
                                    {orderDetail?.items?.map((item) => {
                                        return (
                                            <td className="px-4 py-4 whitespace-nowrap  text-sm font-semibold text-secondary-900">{item?.total_price}</td>
                                        )
                                    })}

                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <div className="flex">
                        <div className="mb-6 bg-white  rounded-lg  w-full h-max lg:w-2/3 mr-4">
                            <label htmlFor="orderStatus" className="block text-sm font-medium text-primary px-4 py-4">Cập nhật trạng thái đơn hàng</label>
                            <select
                                id="orderStatus"
                                value={selectedStatus}
                                onChange={handleStatusChange}
                                className="mt-1 block mx-4  border-gray-300 rounded-md min-w-max shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                            >
                                <option value="pending">Chờ xác nhận</option>
                                <option value="confirmed">Đã xác thật</option>
                                <option value="preparing_goods">Đang vận chuyển</option>
                                <option value="delivered">Đã giao hàng</option>
                                <option value="canceled">Đơn hàng đã bị hủy</option>
                            </select>
                        </div>
                        <div>
                            <button onClick={handleUpdateStatus} type="submit" className="cursor-pointer focus:outline-none my-12 mx-20 w-full text-white bg-primary hover:bg-primary focus:ring-4 focus:ring-primary font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-primary dark:hover:bg-primary dark:focus:ring-primary">Cập nhật</button>
                        </div>
                        <div>
                            <button onClick={handleCancelOrder} type="submit" className="cursor-pointer focus:outline-none my-12 mx-24 text-white bg-red-700 focus:ring-4 focus:ring-red-700 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-primary dark:hover:bg-primary dark:focus:ring-primary">Hủy</button>
                        </div>
                        {showCancelModal && (
                            <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
                                <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
                                    <h3 className="text-lg font-semibold mb-4">Lý do hủy đơn hàng</h3>
                                    <textarea
                                        className="w-full p-2 border border-gray-300 rounded-md"
                                        rows="4"
                                        value={cancelReason}
                                        onChange={(e) => setCancelReason(e.target.value)}
                                        placeholder="Nhập lý do hủy..."
                                    ></textarea>
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
                        <div className="mb-4">
                            <label htmlFor="totalPrice" className="block text-sm font-medium text-secondary-600">Giảm giá</label>
                            <input
                                type="text"
                                id="totalPrice"
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-primary focus:ring-primary sm:text-sm"

                                disabled
                            />
                        </div>
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