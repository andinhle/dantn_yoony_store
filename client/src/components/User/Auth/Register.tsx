import { Label } from "flowbite-react";
import { IUser } from "../../../intrefaces/IUser";
import { useForm } from "react-hook-form";
import registerValidScheme from "../../../validations/registerValidScheme";
import { zodResolver } from '../../../../node_modules/@hookform/resolvers/zod/src/zod';
import instance from "../../../instance/instance";
import { toast } from "react-toastify";
import axios from "axios";

const Register = () => {
  const {register,formState:{errors},handleSubmit,reset}=useForm<IUser>({
    resolver:zodResolver(registerValidScheme)
  })
  //Xử lý Đăng ký
  const onSubmit= async(dataForm:IUser)=>{
    try {
      const {name,email,password}=dataForm
      const data=await instance.post('register',{
        name,email,password
      })
      if (data) {
        reset()
        toast.success('Đăng ký tài khoản thành công!')
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message);
      } else if (error instanceof Error) {
        console.log(error.message);
      } else {
        console.log('An unexpected error occurred');
      }
    }
  }
  return (
    <section className="flex items-center justify-evenly mt-14">
      <form className="max-w-[400px] space-y-5" onSubmit={handleSubmit(onSubmit)}>
        <h2 className="font-[500] text-[32px] text-primary text-center">
          ĐĂNG KÝ
        </h2>
        <div className="space-y-4">
          <div>
            <div className="mb-2 block">
              <Label htmlFor="username-input" value="Username" />
            </div>
            <input
              type="text"
              placeholder="Username"
              id="username-input"
              className="block focus:!border-primary/50 h-10 border-input px-3 rounded-lg w-full focus:!shadow-none"
              {...register('name')}
            />
            <span className="block text-sm text-red-500 mt-1">{errors.name?.message}</span>
          </div>
          <div>
            <div className="mb-2 block">
              <Label htmlFor="email-input" value="Email" />
            </div>
            <input
              type="text"
              placeholder="Email"
              id="email-input"
              className="block focus:!border-primary/50 h-10 border-input px-3 rounded-lg w-full focus:!shadow-none"
              {...register('email')}
            />
            <span className="block text-sm text-red-500 mt-1">{errors.email?.message}</span>
          </div>
          <div className="flex justify-between gap-2">
            <div>
              <div className="mb-2 block">
                <Label htmlFor="pass-input" value="Mật khẩu" />
              </div>
              <input
                type="password"
                placeholder="Mật khẩu"
                id="pass-input"
                className="block focus:!border-primary/50 h-10 border-input px-3 rounded-lg w-full focus:!shadow-none"
                {...register('password')}
              />
              <span className="block text-sm text-red-500 mt-1">{errors.password?.message}</span>
            </div>
            <div>
              <div className="mb-2 block">
                <Label htmlFor="confirmPass-input" value="Nhập lại mật khẩu" />
              </div>
              <input
                type="password"
                placeholder="Nhập lại mật khẩu"
                id="confirmPass-input"
                className="block focus:!border-primary/50 h-10 border-input px-3 rounded-lg w-full focus:!shadow-none"
                {...register('confirmPass')}
              />
              <span className="block text-sm text-red-500 mt-1">{errors.confirmPass?.message}</span>
            </div>
          </div>
        </div>
        <button className="w-fit bg-primary py-2 px-6 rounded-md text-util mx-auto block font-[400]">ĐĂNG KÝ</button>
      </form>
      <div>
        <img src="../../../../src/assets/images/sign-up-form.svg" alt="sign-up-form" />
      </div>
    </section>
  );
};

export default Register;
