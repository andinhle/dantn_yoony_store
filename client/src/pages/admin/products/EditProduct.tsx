const EditProduct = () => {
    return (
        <div className="container mx-auto p-6">
        <div className="bg-white p-6 rounded-lg shadow-lg">
            <div className="bg-primary px-6 py-4 my-4 rounded-xl">
                <h2 className="text-xl font-semibold text-white">Chỉnh sửa sản phẩm</h2>
            </div>
            <form>
                <div className="flex justify-between items-center mb-4 space-x-4">
                    <div className="w-1/2">
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">Tên Sản Phẩm</label>
                        <input type="text" id="name" name="name" required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                    </div>
                    <div className="w-1/2">
                        <label htmlFor="slug" className="block text-sm font-medium text-gray-700">Slug</label>
                        <input type="text" id="slug" name="slug" required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                    </div>
                </div>

                <div className="w-full mb-4">
                    <label htmlFor="category" className="block text-sm font-medium text-gray-700">Danh Mục</label>
                    <select id="category" name="category" required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                        <option value="">Chọn danh mục</option>
                        <option value="category1">Danh Mục 1</option>
                        <option value="category2">Danh Mục 2</option>
                        <option value="category3">Danh Mục 3</option>
                    </select>
                </div>
                <div className="flex items-center justify-center w-full mb-4">
                    <label
                        htmlFor="dropzone-file"
                        className="flex block text-sm font-medium text-gray-700 flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-gray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600"
                    >
                        Hình ảnh
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            <svg
                                className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400"
                                aria-hidden="true"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 20 16"
                            >
                                <path
                                    stroke="currentColor"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                                />
                            </svg>
                            <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                                <span className="font-semibold">Click to upload</span> or drag and drop
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                SVG, PNG, JPG or GIF (MAX. 800x400px)
                            </p>
                        </div>
                        <input id="dropzone-file" type="file" className="hidden" />
                    </label>
                </div>


                <div className="mb-4">
                    <label htmlFor="notes" className="block text-sm font-medium text-gray-700">Mô tả</label>
                    <textarea
                        id="notes"
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        placeholder="Nhập mô tả"
                    ></textarea>
                </div>
                <div className="flex">
                    <div className="mb-6 p-4">
                        <label className="inline-flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                className="sr-only peer"
                            />
                            <div className="relative w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-primary-300 dark:peer-focus:ring-primary-800 dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary peer-checked:after:border-white" />
                            <span className="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300">Kích Hoạt</span>
                        </label>
                    </div>
                    <div className="mb-6 p-4">
                        <label className="inline-flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                className="sr-only peer"
                            />
                            <div className="relative w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-primary-300 dark:peer-focus:ring-primary-800 dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary peer-checked:after:border-white" />
                            <span className="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300">Nổi Bật</span>
                        </label>
                    </div>
                    <div className="mb-6 p-4">
                        <label className="inline-flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                className="sr-only peer"
                            />
                            <div className="relative w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-primary-300 dark:peer-focus:ring-primary-800 dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary peer-checked:after:border-white" />
                            <span className="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300">Giá tốt</span>
                        </label>
                    </div>
                </div>
                <div className="bg-primary px-6 py-4 my-4 rounded-xl">
                    <h4 className="text-sm font-semibold text-white">Biến thể sản phẩm</h4>
                </div>
                <div className="gap-4 mb-4 border border-gray-300 rounded-md p-4">
                    <div className="flex gap-4 mb-4 w-full">
                        <div className="w-full md:w-1/3">
                            <label htmlFor="price" className="block text-sm font-medium text-gray-700">Giá</label>
                            <input
                                type="number"
                                id="price"
                                name="price"
                                required
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            />
                        </div>
                        <div className="w-full md:w-1/3">
                            <label htmlFor="salePrice" className="block text-sm font-medium text-gray-700">Giá sale</label>
                            <input
                                type="number"
                                id="salePrice"
                                name="salePrice"
                                required
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            />
                        </div>
                        <div className="w-full md:w-1/3">
                            <label htmlFor="quantity" className="block text-sm font-medium text-gray-700">Số lượng</label>
                            <input
                                type="number"
                                id="quantity"
                                name="quantity"
                                required
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            />
                        </div>
                    </div>

                    <div className="flex gap-12">
                        <div className="w-full mb-4">
                            <label htmlFor="variant1" className="block text-sm font-medium text-gray-700">Danh Mục</label>
                            <select id="variant1" name="variant1" required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                                <option value="">Chọn biến thể</option>
                                <option value="variant1">Danh Mục 1</option>
                                <option value="variant2">Danh Mục 2</option>
                                <option value="variant3">Danh Mục 3</option>
                            </select>
                        </div>
                        <div className="w-full mb-4">
                            <label htmlFor="variant2" className="block text-sm font-medium text-gray-700">Danh Mục</label>
                            <select id="variant2" name="variant2" required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                                <option value="">Chọn giá trị</option>
                                <option value="value1">Danh Mục 1</option>
                                <option value="value2">Danh Mục 2</option>
                                <option value="value3">Danh Mục 3</option>
                            </select>
                        </div>
                    </div>
                </div>

                <div className="flex justify-between">
                    <button type="submit" className="px-4 py-2 bg-primary text-white font-semibold rounded-md hover:bg-primary-dark focus:outline-none">
                        Cập nhật
                    </button>
                </div>
            </form>
        </div>
    </div>

    )
}
export default EditProduct