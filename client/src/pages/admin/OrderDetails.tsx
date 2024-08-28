const OrderDetails = () => {
    return (
        <div className="flex">
            <div className="bg-white shadow-md rounded-lg overflow-hidden w-full h-max lg:w-2/3 mr-4">
                <div className="bg-primary px-6 py-4">
                    <h2 className="text-xl font-semibold text-white">Đơn hàng : #456wetcvv</h2>
                </div>
                <div className="flex flex-col">
                    <div className="overflow-x-auto flex-1">
                        <table className="w-full bg-white">
                            <thead className="bg-secondary-100">
                                <tr>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-secondary-600 uppercase tracking-wider">STT</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-secondary-600 uppercase tracking-wider">Tên sản phẩm</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-secondary-600 uppercase tracking-wider">Số lượng</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-secondary-600 uppercase tracking-wider">Đơn giá</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-secondary-600 uppercase tracking-wider">Tổng</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td colSpan="5" className="p-0">
                                        <hr className="border-secondary-300" />
                                    </td>
                                </tr>
                            </tbody>
                            <tbody className="divide-y divide-secondary-200">
                                <tr>
                                    <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-secondary-900">1</td>
                                    <td className="px-4 py-4 whitespace-nowrap text-sm text-secondary-900">Giày Sneaker Xám</td>
                                    <td className="px-4 py-4 whitespace-nowrap text-sm text-secondary-500">2</td>
                                    <td className="px-4 py-4 whitespace-nowrap text-sm text-secondary-500">1,000,000 VND</td>
                                    <td className="px-4 py-4 whitespace-nowrap text-sm text-secondary-900">2,000,000 VND</td>
                                </tr>
                                <tr>
                                    <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-secondary-900">2</td>
                                    <td className="px-4 py-4 whitespace-nowrap text-sm text-secondary-900">Áo Thun Nam</td>
                                    <td className="px-4 py-4 whitespace-nowrap text-sm text-secondary-500">1</td>
                                    <td className="px-4 py-4 whitespace-nowrap text-sm text-secondary-500">500,000 VND</td>
                                    <td className="px-4 py-4 whitespace-nowrap text-sm text-secondary-900">500,000 VND</td>
                                </tr>
                                <tr>
                                    <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-secondary-900">2</td>
                                    <td className="px-4 py-4 whitespace-nowrap text-sm text-secondary-900">Áo Thun Nam</td>
                                    <td className="px-4 py-4 whitespace-nowrap text-sm text-secondary-500">1</td>
                                    <td className="px-4 py-4 whitespace-nowrap text-sm text-secondary-500">500,000 VND</td>
                                    <td className="px-4 py-4 whitespace-nowrap text-sm text-secondary-900">500,000 VND</td>
                                </tr>
                                <tr>
                                    <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-secondary-900">2</td>
                                    <td className="px-4 py-4 whitespace-nowrap text-sm text-secondary-900">Áo Thun Nam</td>
                                    <td className="px-4 py-4 whitespace-nowrap text-sm text-secondary-500">1</td>
                                    <td className="px-4 py-4 whitespace-nowrap text-sm text-secondary-500">500,000 VND</td>
                                    <td className="px-4 py-4 whitespace-nowrap text-sm text-secondary-900">500,000 VND</td>
                                </tr>
                                <tr>
                                    <td colSpan="4" className="px-4 py-4  text-right text-sm font-semibold text-secondary-900">Voucher giảm giá:</td>
                                    <td className="px-4 py-4 whitespace-nowrap  text-sm font-semibold text-secondary-900">500,000 VND</td>
                                </tr>
                                <tr className="bg-gray-100">
                                    <td colSpan="4" className="px-4 py-4  text-right text-sm font-semibold text-secondary-900">Tổng thanh toán:</td>
                                    <td className="px-4 py-4 whitespace-nowrap  text-sm font-semibold text-secondary-900">2,000,000 VND</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <div className="flex">
                        <div className="mb-6 bg-white  rounded-lg  w-full h-max lg:w-2/3 mr-4">
                            <label htmlFor="orderStatus" className="block text-sm font-medium text-primary px-4 py-4">Cập nhật trạng thái đơn hàng</label>
                            <select
                                id="orderStatus"
                                className="mt-1 block mx-4  border-gray-300 rounded-md min-w-max shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                            >
                                <option value="">Chọn trạng thái</option>
                                <option value="pending">Chờ xử lý</option>
                                <option value="inProgress">Đang xử lý</option>
                                <option value="shipped">Đã giao hàng</option>
                                <option value="completed">Hoàn tất</option>
                                <option value="canceled">Hủy bỏ</option>
                            </select>
                        </div>
                        <div>
                        <button type="button" className="focus:outline-none my-12 mx-24 text-white bg-primary hover:bg-primary focus:ring-4 focus:ring-primary font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-primary dark:hover:bg-primary dark:focus:ring-primary">Cập nhật</button>
                        </div>
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
                                placeholder="Nguyễn Đình Bắc"
                            />
                        </div>

                        <div className="mb-4">
                            <label htmlFor="totalPrice" className="block text-sm font-medium text-secondary-600">Tổng giá tiền</label>
                            <input
                                type="text"
                                id="totalPrice"
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                                placeholder="2,500,000 VND"
                            />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="totalPrice" className="block text-sm font-medium text-secondary-600">Giảm giá</label>
                            <input
                                type="text"
                                id="totalPrice"
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                                placeholder="500,000 VND"
                            />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="finalPrice" className="block text-sm font-medium text-secondary-600">Giá cuối</label>
                            <input
                                type="text"
                                id="finalPrice"
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                                placeholder="2,500,000 VND"
                            />
                        </div>

                        <div className="mb-4">
                            <label htmlFor="paymentMethod" className="block text-sm font-medium text-secondary-600">Phương thức thanh toán</label>
                            <select
                                id="paymentMethod"
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                            >
                                <option value="">Chọn phương thức</option>
                                <option value="creditCard">Thẻ tín dụng</option>
                                <option value="paypal">PayPal</option>
                                <option value="bankTransfer">Chuyển khoản ngân hàng</option>
                            </select>
                        </div>

                        <div className="mb-4">
                            <label htmlFor="notes" className="block text-sm font-medium text-secondary-600">Ghi chú</label>
                            <textarea
                                id="notes"
                                rows="3"
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                                placeholder="Nhập ghi chú ở đây"
                            ></textarea>
                        </div>

                        <div className="mb-4">
                            <label htmlFor="phone" className="block text-sm font-medium text-secondary-600">Số điện thoại</label>
                            <input
                                type="tel"
                                id="phone"
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                                placeholder="0123 456 789"
                            />
                        </div>

                        <div className="mb-4">
                            <label htmlFor="address" className="block text-sm font-medium text-secondary-600">Địa chỉ</label>
                            <input
                                type="text"
                                id="address"
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                                placeholder="123 Đường ABC, Quận XYZ, TP. HCM"
                            />
                        </div>
                    </form>
                </div>
            </div>

        </div>




    )
}
export default OrderDetails