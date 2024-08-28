
import { Link } from "react-router-dom";

const ProductList: React.FC = () => {
    // State để quản lý việc hiển thị pop-up
    

    return (
        <div className="container mx-auto">
            <Link to={"/admin/products/add"}>
            <button  className="w-36 rounded-md mt-3 mb-3 h-10 bg-primary text-xs text-secondary-500 uppercase tracking-wider">
                THÊM SẢN PHẨM
            </button>
            </Link>
           
            <div className="bg-white shadow-md rounded-lg overflow-hidden">
                <table className="min-w-full bg-white">
                    <thead className="bg-primary">
                        <tr>
                            <th className="w-12 px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">STT</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">Tên Sản Phẩm</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">Slug</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">Hình Ảnh</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">Mô tả</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">Danh Mục</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">Nổi Bật</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">Kích Hoạt</th>
                            <th className="px-6 py-3 text-left text-center text-xs font-medium text-secondary-500 uppercase tracking-wider">Hoạt động</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-secondary-200">
                        <tr>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-secondary-900">1</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-secondary-900">Danh Mục 1</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-secondary-500">danh-muc-1</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-secondary-500">
                                <img src="https://via.placeholder.com/50" alt="Hình Ảnh" className="h-10 w-10 rounded-full object-cover" />
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-secondary-500">danh-muc-1</td>

                            <td className="px-6 py-4 whitespace-nowrap text-sm text-secondary-500">danh-muc-1</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-primary-600">
                                <label className="inline-flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        defaultValue=""
                                        className="sr-only peer"
                                    />
                                    <div className="relative w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-primary-300 dark:peer-focus:ring-primary-800 dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary peer-checked:after:border-white" />
                                    <span className="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300"></span>
                                </label>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-primary-600">
                                <label className="inline-flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        defaultValue=""
                                        className="sr-only peer"
                                    />
                                    <div className="relative w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-primary-300 dark:peer-focus:ring-primary-800 dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary peer-checked:after:border-white" />
                                    <span className="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300"></span>
                                </label>
                            </td>

                            <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600">
                                <div className="flex justify-center space-x-4">
                                    <Link to={"/admin/products/edit/:id"}>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                        <path className="text-green-600 cursor-pointer"  strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                                    </svg>
                                    </Link>
                                   
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                                    </svg>


                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>  
        </div>
    );
}

export default ProductList;
