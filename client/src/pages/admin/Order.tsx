import { Link } from "react-router-dom"

const Orders = () => {
  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden">
      <table className="min-w-full bg-white">
        <thead className="bg-primary">
          <tr>
            <th className="w-12 px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">STT</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">Đơn hàng</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">Sản Phẩm</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">Tổng tiền</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">Ngày đặt hàng</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">Trạng thái</th>
            <th className="px-6 py-3 text-left text-center text-xs font-medium text-secondary-500 uppercase tracking-wider">Hoạt động</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-secondary-200">
          <tr>
            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-secondary-900">1</td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-secondary-900">03ertgjnb7899</td>
            <td className="px-6 py-4 whitespace-nowrap text-sm  text-secondary-500">5</td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-secondary-500">3,000,000 VND</td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-secondary-500">22/08/2024</td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600 text-secondary-500">Đã hoàn thành</td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600">
              <div className="flex justify-center space-x-4">
                <Link to={"orderDetails"}>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                    <path className="text-green-600 cursor-pointer" strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                  </svg>
                </Link>

              </div>
            </td>
          </tr>
          <tr>
            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-secondary-900">2 </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-secondary-900">03ertgjnb7899</td>
            <td className="px-6 py-4 whitespace-nowrap text-sm  text-secondary-500">5</td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-secondary-500">3,000,000 VND</td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-secondary-500">22/08/2024</td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600 text-secondary-500">Đã hủy</td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600">
              <div className="flex justify-center space-x-4">
                <Link to={"orderDetails"}>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                    <path className="text-green-600 cursor-pointer" strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                  </svg>
                </Link>

              </div>
            </td>
          </tr>
          <tr>
            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-secondary-900">3</td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-secondary-900">03ertgjnb7899</td>
            <td className="px-6 py-4 whitespace-nowrap text-sm  text-secondary-500">5</td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-secondary-500">3,000,000 VND</td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-secondary-500">22/08/2024</td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-yellow-600 text-secondary-500">Đang chờ xử lí</td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600">
              <div className="flex justify-center space-x-4">
                <Link to={"orderDetails"}>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                    <path className="text-green-600 cursor-pointer" strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                  </svg>
                </Link>

              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>




  )
}
export default Orders

