import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { ICategory } from "../../intrefaces/ICategory";
import instance from "../../instance/instance";
import { toast } from "react-toastify";
import swal from 'sweetalert'
const CategoryList: React.FC = () => {
  // State để quản lý việc hiển thị pop-up
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isPopupOpenUpdate, setIsPopupOpenUpdate] = useState(false);
  const [slug, setSlug] = useState("");
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [currentCategory, setCurrentCategory] = useState<ICategory | null>(null);
  // Hàm mở pop-up
  const openPopup = () => {
    setIsPopupOpen(true);
  };
  const openUpdate = (category: ICategory) => {
    setCurrentCategory(category);
    setIsPopupOpenUpdate(true);
  };
  // Hàm đóng pop-up
  const closePopup = () => {
    setIsPopupOpen(false);
  };
  const closeUpdate = () => {
    setIsPopupOpenUpdate(false);
  }
  const {
    register,
    handleSubmit,
    watch,
    reset,
    setValue,
    formState: { errors },
  } = useForm<ICategory>();
  const name = watch("name");
  useEffect(() => {
    (async () => {
      const { data } = await instance.get("category");
      console.log(data)
      setCategories(data.data);
    })();
  }, []);
  useEffect(() => {
    (() => {
      reset({
        name: "",
        slug: "",
        is_active: true
      })
    })()
    setImageUrl("")
  }, [isPopupOpen === false]);
  const fetchCategories = async () => {
    try {
      const { data } = await instance.get("category");
      setCategories(data.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
      toast.error("Không thể tải danh mục.");
    }
  };
  useEffect(() => {
    if (name) {
      const generatedSlug = name.toLowerCase().replace(/ /g, '-');
      setSlug(generatedSlug);
    }
  }, [name]);
  const preset_key = import.meta.env.VITE_PRESET_KEY_CLOADINARY;
  const cloud_name = import.meta.env.VITE_CLOUD_NAME_CLOADINARY;
  const image_type = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
  const [imageCategory, setImageCategory] = useState<string>("");
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const file = e.target.files?.[0];
      if (!file) {
        toast.error("Vui lòng chọn một file để upload");
        return;
      }
      if (file) {
        // Create a URL for the selected image
        const url = URL.createObjectURL(file);
        setImageUrl(url);
      }
      // Kiểm tra loại file
      console.log(file.type);
      const check_type_image = image_type.some((item) => file.type === item);
      if (!check_type_image) {
        toast.error("Chỉ hỗ trợ định dạng .jpg, .jpeg, .png và .webp");
        return;
      }
      // Kiểm tra kích thước file (giới hạn 5MB)
      const maxSize = 5 * 1024 * 1024; // 5MB
      if (file.size > maxSize) {
        toast.error("Kích thước ảnh quá lớn. Vui lòng chọn file nhỏ hơn 5MB");
        return;
      }
      // Upload ảnh lên Cloudinary
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", preset_key);
      const { data } = await instance.post(
        `https://api.cloudinary.com/v1_1/${cloud_name}/image/upload`,
        formData
      );
      // Lưu URL ảnh sau khi upload thành công
      setImageCategory(data.secure_url);
      toast.success("Upload ảnh thành công!");
    } catch (error: any) {
      console.log("Error during image upload:", error.response ? error.response.data : error.message);
      // Hiển thị lỗi cụ thể hơn nếu có phản hồi từ server
      toast.error("Đã xảy ra lỗi khi upload ảnh: " + (error.response?.data?.message || error.message));
    }
  };
  const handleDelete = async (_id: string) => {
    try {
      const willDelete = await swal({
        title: "Bạn có chắc chắn muốn xóa?",
        text: "Hành động này sẽ không thể hoàn tác!",
        icon: "warning",
        buttons: ["Hủy", "Xóa"],
        dangerMode: true,
      })
      if (willDelete) {
        await instance.delete(`category/${_id}`)
        fetchCategories();
        toast.success("Deleted")
      }
    } catch (error) {
      toast.error("Có lỗi xảy ra");
      console.log(error);
    }
  }
  const onSubmit = async (dataForm: ICategory) => {
    try {
      const formData = new FormData();
      formData.append('name', dataForm.name);
      formData.append('slug', slug); // Sử dụng slug đã tạo
      formData.append('is_active', dataForm.is_active ? '1' : '0');
      formData.append('image', imageCategory)
      await instance.post('category', formData);
      console.log("formData", formData);
      reset();
      setImageCategory('');
      toast.success("Thêm danh mục thành công");
      setIsPopupOpen(false);
      fetchCategories()
    } catch (error: any) {
      if (error.response && error.response.data) {
        console.log(error);
        toast.error(`Lỗi: ${error.response.data.message || "Có lỗi xảy ra"}`);
      } else {
        toast.error("Có lỗi xảy ra");
      }
    }
  };
  const handleToggleActive = async (id: string, isActive: boolean) => {
    try {
      await instance.patch(`category/${id}/is-active`, { is_active: isActive ? 1 : 0 });
      fetchCategories();
      toast.success("Cập nhật trạng thái thành công");
    } catch (error) {
      toast.error("Có lỗi xảy ra khi cập nhật trạng thái");
      console.log(error);
    }
  };
  const handleSlug = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const updatedName = e.target.value;
    const generatedSlug = updatedName.toLowerCase().replace(/ /g, '-');
    setSlug(generatedSlug);
  }
  useEffect(() => {
    if (currentCategory) {
      console.log('Current Category:', currentCategory);
      reset({
        name: currentCategory.name,
        slug: currentCategory.slug,
        is_active: currentCategory.is_active,
      });
      setSlug(currentCategory.slug);
      setImageCategory(currentCategory.image || "");
    }
  }, [currentCategory, reset, setSlug]);
  const handleUpdate = async (dataForm: ICategory) => {
    console.log('Form Data:', dataForm);
    try {
      await instance.put(`category/${currentCategory?.id}`, {
        name: dataForm.name,
        slug: slug,
        image: imageCategory,
        is_active: dataForm.is_active
      });
      setImageCategory('')
      toast.success("Cập nhật danh mục thành công");
      setIsPopupOpenUpdate(false); // Đóng popup sau khi cập nhật
      fetchCategories(); // Tải lại danh sách danh mục
    } catch (error: any) {
      console.error('Error:', error);
      if (error.response && error.response.data) {
        toast.error(`Lỗi: ${error.response.data.message || "Có lỗi xảy ra"}`);
      } else {
        toast.error("Có lỗi xảy ra");
      }
    }
  };
  return (
    <div className="container mx-auto">
      <button onClick={openPopup} className="w-36 rounded-md mt-3 mb-3 h-10 bg-primary text-xs text-secondary-500 uppercase tracking-wider">
        THÊM DANH MỤC
      </button>
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="min-w-full bg-white">
          <thead className="bg-primary">
            <tr>
              <th className="w-12 px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">STT</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">Tên Danh Mục</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">Slug</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">Hình Ảnh</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">Kích Hoạt</th>
              <th className="px-6 py-3 text-left text-center text-xs font-medium text-secondary-500 uppercase tracking-wider">Hoạt động</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-secondary-200">
            {categories.map((category, index) => (
              <tr key={category.id} >
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-secondary-900">{index + 1}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-secondary-900">{category.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-secondary-500">{category.slug}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-secondary-500">
                  <img src={category.image} className="h-10 w-10 rounded-full object-cover" />
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-primary-600">
                  <label className="inline-flex items-center cursor-pointer">
                    <input
                      checked={category.is_active}
                      onChange={() => handleToggleActive(category.id, !category.is_active)}
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
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                      <path className="text-green-600 cursor-pointer" onClick={() => openUpdate(category)} strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                    </svg>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                      <path onClick={() => {
                        handleDelete(category.id)
                      }} className="cursor-pointer" strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                    </svg>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {isPopupOpen && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center">
          <div className="relative bg-white p-6 rounded-lg shadow-lg w-full max-w-md mt-20">
            <button
              type="button"
              onClick={closePopup}
              className="absolute top-6 right-2 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5"
            >
              <svg
                className="w-3 h-3"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 14 14"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                />
              </svg>
              <span className="sr-only">Close</span>
            </button>
            <h2 className="text-xl font-bold mb-4">Thêm Danh Mục Mới</h2>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="mb-4">
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">Tên Danh Mục</label>
                <input type="text"
                  {...register("name", {
                    required: "Tên danh mục là bắt buộc",
                    minLength: {
                      value: 6,
                      message: "Tên danh mục phải có ít nhất 6 ký tự"
                    },
                  })}
                  id="name"
                  name="name"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                {errors.name && (
                  <span className="text-primary text-sm">
                    {errors.name.message}
                  </span>
                )}
              </div>
              <div className="mb-4">
                <label htmlFor="slug" className="block text-sm font-medium text-gray-700">Slug</label>
                <input
                  type="text"
                  id="slug"
                  value={slug}
                  {...register("slug")}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                {errors.slug && (
                  <span className="text-primary text-sm">
                    {errors.slug.message}
                  </span>
                )}
              </div>
              <div className="mb-4 flex items-start">
                <div className="relative border-2 border-dashed border-gray-300 rounded-lg p-4 cursor-pointer hover:border-indigo-500 transition-colors w-1/2">
                  <input
                    type="file"
                    id="image"
                    accept="image/*"
                    {...register("image", { required: !imageUrl ? "Hình ảnh là bắt buộc" : false })}
                    onChange={handleImageUpload}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <div className="text-center">
                    <svg
                      className="mx-auto h-12 w-12 text-gray-400"
                      stroke="currentColor"
                      fill="none"
                      viewBox="0 0 48 48"
                      aria-hidden="true"
                    >
                      <path
                        d="M28 8H20L18 12H10a2 2 0 00-2 2v24a2 2 0 002 2h28a2 2 0 002-2V14a2 2 0 00-2-2h-8l-2-4zM16 28a4 4 0 118 0 4 4 0 01-8 0zm10 0a4 4 0 118 0 4 4 0 01-8 0zm-6-4l-6 8h20l-6-8H20z"
                      />
                    </svg>
                    <div className="text-sm text-gray-500">
                      <p>Kéo thả hoặc nhấn để chọn ảnh</p>
                      <p className="text-xs text-gray-400">.jpg, .jpeg, .png, .webp</p>
                    </div>
                  </div>
                </div>
                <div className="ml-4 w-1/2 flex items-center">
                  {errors.image && (
                    <span className="text-red-600 text-sm">
                      {errors.image.message}
                    </span>
                  )}
                  {imageUrl && (
                    <div className="w-full h-full flex justify-center items-center">
                      <img
                        src={imageUrl}
                        alt="Uploaded preview"
                        className="w-[140px] h-[140px] object-cover border border-gray-300 rounded-md"
                      />
                    </div>
                  )}
                </div>
              </div>
              <div className="mb-6">
                <label className="inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    id="isActive"
                    {...register("is_active")}
                    className="sr-only peer"
                  />
                  <div className="relative w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-primary-300 dark:peer-focus:ring-primary-800 dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary peer-checked:after:border-white" />
                  <span className="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300">Kích Hoạt</span>
                </label>
              </div>
              <div className="flex justify-between">
                <button type="submit" className="px-4 py-2 bg-primary text-white font-semibold rounded-md hover:bg-primary focus:outline-none">
                  Thêm
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {
        isPopupOpenUpdate && currentCategory && (
          <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center">
            <div className="relative bg-white p-6 rounded-lg shadow-lg w-full max-w-md mt-20">
              <button
                type="button"
                onClick={closeUpdate}
                className="absolute top-6 right-2 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5"
              >
                <svg
                  className="w-3 h-3"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 14 14"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                  />
                </svg>
                <span className="sr-only">Close</span>
              </button>
              <h2 className="text-xl font-bold mb-4">Chỉnh sửa danh mục</h2>
              <form onSubmit={handleSubmit(handleUpdate)}>
                <div className="mb-4">
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">Tên Danh Mục</label>
                  <input
                    type="text"
                    id="name"
                    defaultValue={currentCategory.name || ""}
                    {...register("name", {
                      required: "Tên danh mục là bắt buộc",
                      minLength: {
                        value: 6,
                        message: "Tên danh mục phải có ít nhất 6 ký tự"
                      },
                    })}
                    onChange={(e) => {
                      handleSlug(e);
                      // Gọi hàm watch để theo dõi sự thay đổi
                      setValue("name", e.target.value); // Cập nhật giá trị name trong form
                    }}
                    value={watch("name")}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                  {errors.name && (
                    <span className="text-primary text-sm">
                      {errors.name.message}
                    </span>
                  )}
                </div>
                <div className="mb-4">
                  <label htmlFor="slug" className="block text-sm font-medium text-gray-700">Slug</label>
                  <input type="text"
                    id="slug"
                    value={slug}
                    {...register("slug", { required: "Slug là bắt buộc" })}

                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                </div>
                <div className="mb-4">
                  <label htmlFor="image" className="block text-sm font-medium text-gray-700">Hình Ảnh</label>
                  <div className="relative border-2 border-dashed border-gray-300 rounded-lg p-4 cursor-pointer hover:border-indigo-500 transition-colors">
                    <input
                      type="file"
                      id="image"
                      accept="image/*"
                      {...register("image")}
                      onChange={handleImageUpload}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />

                    <div className="text-center">
                      <svg
                        className="mx-auto h-12 w-12 text-gray-400"
                        stroke="currentColor"
                        fill="none"
                        viewBox="0 0 48 48"
                        aria-hidden="true"
                      >
                        <path
                          d="M28 8H20L18 12H10a2 2 0 00-2 2v24a2 2 0 002 2h28a2 2 0 002-2V14a2 2 0 00-2-2h-8l-2-4zM16 28a4 4 0 118 0 4 4 0 01-8 0zm10 0a4 4 0 118 0 4 4 0 01-8 0zm-6-4l-6 8h20l-6-8H20z"
                        />
                      </svg>
                      <div className="text-sm text-gray-500">
                        <p>Kéo thả hoặc nhấn để chọn ảnh</p>
                        <p className="text-xs text-gray-400">.jpg, .jpeg, .png, .webp</p>
                      </div>
                    </div>
                  </div>

                  {errors.image && (
                    <span className="text-red-600 text-sm mt-2 block">
                      {errors.image.message}
                    </span>
                  )}
                  {imageUrl || currentCategory.image ? (
                    <div className="mt-4">
                      <img
                        src={imageUrl || currentCategory.image}
                        alt="Uploaded preview"
                        className="w-12 h-12 border border-gray-300 rounded-md"
                        style={{ width: "50px", height: "50px" }} // Đặt chiều rộng và chiều cao thành 50px
                      />
                    </div>
                  ) : null}
                </div>
                <div className="mb-6">
                  <label className="inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      defaultValue=""
                      defaultChecked={currentCategory.is_active}
                      {...register("is_active")}

                      className="sr-only peer"
                    />
                    <div className="relative w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-primary-300 dark:peer-focus:ring-primary-800 dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary peer-checked:after:border-white" />
                    <span className="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300"></span>
                  </label>
                </div>
                <div className="flex justify-between">
                  <button type="submit" className="px-4 py-2 bg-primary text-white font-semibold rounded-md hover:bg-primary focus:outline-none">
                    Cập nhật
                  </button>
                </div>
              </form>
            </div>
          </div>
        )
      }
    </div>
  );
}
export default CategoryList







