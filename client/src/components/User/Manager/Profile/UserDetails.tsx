import { useEffect, useState } from "react";
import { LoadingOutlined, PlusOutlined } from "@ant-design/icons";
import { Upload, message } from "antd";
import instance from "../../../../instance/instance";
import type { GetProp, UploadFile, UploadProps } from "antd";
import ImgCrop from "antd-img-crop";
import { useForm } from "react-hook-form";
import { IUser } from "../../../../interfaces/IUser";
type FileType = Parameters<GetProp<UploadProps, "beforeUpload">>[0];

const UserDetails = () => {
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | undefined>();
  const user = JSON.parse(localStorage.getItem("userInfor")!);
  const {
    register,
    formState: { errors },
    handleSubmit,
    watch
  } = useForm<IUser>();
  const [fileList, setFileList] = useState<UploadFile[]>([
    {
      uid: "-1",
      name: "image.png",
      status: "done",
      url: user.avatar,
    },
  ]);

  const onChange: UploadProps["onChange"] = ({ fileList: newFileList }) => {
    setFileList(newFileList);
  };

  const onPreview = async (file: UploadFile) => {
    let src = file.url as string;
    if (!src) {
      src = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.readAsDataURL(file.originFileObj as FileType);
        reader.onload = () => resolve(reader.result as string);
      });
    }
    const image = new Image();
    image.src = src;
    const imgWindow = window.open(src);
    imgWindow?.document.write(image.outerHTML);
  };
  const image_type = ["image/jpeg", "image/png", "image/webp", "image/jpg"];
  const preset_key = import.meta.env.VITE_PRESET_KEY_CLOADINARY;
  const cloud_name = import.meta.env.VITE_CLOUD_NAME_CLOADINARY;

  // // Hàm xử lý upload ảnh
  // const handleFileUpload = async ({ file }: any) => {
  //     setLoading(true);

  //     // Kiểm tra định dạng file
  //     const check_type_image = image_type.some((item) => file.type === item);
  //     if (!check_type_image) {
  //         message.error("Chỉ hỗ trợ định dạng .jpg, .jpeg, .png và .webp");
  //         setLoading(false);
  //         return;
  //     }

  //     const maxSize = 5 * 1024 * 1024; // 5MB
  //     if (file.size > maxSize) {
  //         message.error("Kích thước ảnh quá lớn. Vui lòng chọn file nhỏ hơn 5MB");
  //         setLoading(false);
  //         return;
  //     }

  //     const imageupload = new FormData();
  //     imageupload.append("file", file);
  //     imageupload.append("upload_preset", preset_key);

  //     try {
  //         const uploadResponse = await axios.post(
  //             `https://api.cloudinary.com/v1_1/${cloud_name}/image/upload`,
  //             imageupload
  //         );
  //         setImageUrl(uploadResponse.data.secure_url);
  //         setUserData({
  //             ...userData,
  //             avatar: uploadResponse.data.secure_url
  //         });
  //     } catch (error) {
  //         message.error("Tải ảnh lên thất bại");
  //     }

  //     setLoading(false);
  // };

  // Đổi tên hàm handleProfileUpdate thành updateProfileHandler
  const updateProfileHandler = async () => {
    try {
      const response = await instance.put("/user/update");
      message.success(response.data.message);
    } catch (error) {
      message.error("Cập nhật thông tin thất bại");
    }
  };

  // const handlePasswordChange = async (oldPassword: string, newPassword: string) => {
  //     try {
  //         const response = await instance.post('/api/user/change-password', { oldPassword, newPassword });
  //         message.success(response.data.message);
  //     } catch (error) {
  //         message.error('Đổi mật khẩu thất bại');
  //     }
  // };

  console.log(fileList);

  useEffect(() => {
    return () => {
      
    };
  }, [])

  return (
    <div className="flex justify-start border border-[#f1f1f1] rounded-md bg-white h-[fit-content] w-full">
      <form className="flex-1 max-w-lg p-6 rounded-sm space-y-4" onSubmit={handleSubmit(updateProfileHandler)}>
        <ImgCrop rotationSlider>
          <Upload
            beforeUpload={() => {
              return false;
            }}
            listType="picture-circle"
            fileList={fileList}
            onChange={onChange}
            onPreview={onPreview}
          >
            {fileList.length < 1 && "+ Tải lên"}
          </Upload>
        </ImgCrop>
        <div className="flex items-start">
          <div className=" flex-1">
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label
                  htmlFor="username"
                  className="block text-gray-700 text-sm font-bold mb-2"
                >
                  Họ và tên
                </label>
                <input
                  type="text"
                  id="username"
                  {...register("name",{
                    required:"Tên không được để trống !"
                  })}
                  value={user.name}
                  className="appearance-none border border-gray-300 rounded-sm w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Nhập họ và tên"
                />
              </div>

              <div>
                <label
                  htmlFor="phone"
                  className="block text-gray-700 text-sm font-bold mb-2"
                >
                  Số điện thoại
                </label>
                <input
                  type='tel'
                  id="phone"
                  value={user.tel}
                  {...register("tel")}
                  className="appearance-none border border-gray-300 rounded-sm w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Nhập số điện thoại"
                />
              </div>
            </div>
            <div className="mb-4">
              <label
                htmlFor="address"
                className="block text-gray-700 text-sm font-bold mb-2"
              >
                Email
              </label>
              <input
                type="text"
                id="email"
                disabled
                value={user.email}
                {...register("email",{
                    required:"Email không được để trống !"
                })}
                className="appearance-none border border-gray-300 rounded-sm w-full bg-secondary/5 py-2 px-3 text-secondary/50 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Nhập địa chỉ"
              />
            </div>
          </div>
        </div>
        <div className="flex justify-start">
          <button
            onClick={updateProfileHandler}
            className="bg-primary hover:bg-primary text-white text-sm py-2 px-3 rounded-sm focus:outline-none focus:ring-2 focus:ring-primary flex items-center gap-1.5"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              color={"currentColor"}
              fill={"none"}
              className="text-white size-5"
            >
              <path
                d="M16.4249 4.60509L17.4149 3.6151C18.2351 2.79497 19.5648 2.79497 20.3849 3.6151C21.205 4.43524 21.205 5.76493 20.3849 6.58507L19.3949 7.57506M16.4249 4.60509L9.76558 11.2644C9.25807 11.772 8.89804 12.4078 8.72397 13.1041L8 16L10.8959 15.276C11.5922 15.102 12.228 14.7419 12.7356 14.2344L19.3949 7.57506M16.4249 4.60509L19.3949 7.57506"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinejoin="round"
              />
              <path
                d="M18.9999 13.5C18.9999 16.7875 18.9999 18.4312 18.092 19.5376C17.9258 19.7401 17.7401 19.9258 17.5375 20.092C16.4312 21 14.7874 21 11.4999 21H11C7.22876 21 5.34316 21 4.17159 19.8284C3.00003 18.6569 3 16.7712 3 13V12.5C3 9.21252 3 7.56879 3.90794 6.46244C4.07417 6.2599 4.2599 6.07417 4.46244 5.90794C5.56879 5 7.21252 5 10.5 5"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Sửa Profile
          </button>
        </div>
      </form>
      <div className="flex-1 max-w-lg p-6 rounded-sm">
        <h2 className="text-lg font-bold mb-4">Đổi mật khẩu</h2>

        <div className="mb-4">
          <label
            htmlFor="old-password"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Mật khẩu cũ
          </label>
          <input
            type="password"
            id="old-password"
            className="appearance-none border border-gray-300 rounded-sm w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Nhập mật khẩu cũ"
          />
        </div>

        <div className="mb-4">
          <label
            htmlFor="new-password"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Mật khẩu mới
          </label>
          <input
            type="password"
            id="new-password"
            className="appearance-none border  border-gray-300 rounded-sm w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Nhập mật khẩu mới"
          />
        </div>

        <div className="mb-4">
          <label
            htmlFor="confirm-password"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Nhập lại mật khẩu
          </label>
          <input
            type="password"
            id="confirm-password"
            className="appearance-none border border-gray-300 rounded-sm w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Nhập lại mật khẩu"
          />
        </div>
        <div className="flex justify-start mt-6">
          <button
            onClick={() =>
              handlePasswordChange("old-password-value", "new-password-value")
            }
            className=" bg-primary hover:bg-primary text-white text-sm py-2 px-2 rounded-sm focus:outline-none focus:ring-2 focus:ring-primary flex items-center"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              width={24}
              height={24}
              color={"#000000"}
              fill={"none"}
              className="text-white mr-2"
            >
              <path
                d="M19.5433 10.5L22 11C21.497 5.94668 17.2229 2 12.0247 2C6.48823 2 1.99999 6.47715 1.99999 12C1.99999 17.5228 6.48823 22 12.0247 22C16.1355 22 19.6684 19.5318 21.2153 16"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M10.3371 10.88C9.25713 10.88 8.71713 11.66 8.59713 12.14C8.47713 12.62 8.47713 14.36 8.54913 15.08C8.78913 15.98 9.38913 16.352 9.97713 16.472C10.5171 16.52 12.7971 16.502 13.4571 16.502C14.4171 16.52 15.1371 16.16 15.4371 15.08C15.4971 14.72 15.5571 12.74 15.4071 12.14C15.0891 11.18 14.2971 10.88 13.6971 10.88H10.3371Z"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
              <path
                d="M10.25 10.4585C10.25 10.3985 10.2582 10.0531 10.2596 9.61854C10.2609 9.22145 10.226 8.83854 10.4156 8.48814C11.126 7.07454 13.166 7.21854 13.67 8.65854C13.7573 8.89562 13.7626 9.27146 13.76 9.61854C13.7567 10.062 13.766 10.4585 13.766 10.4585"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
            Đổi mật khẩu
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserDetails;
