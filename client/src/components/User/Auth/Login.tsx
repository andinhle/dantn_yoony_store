import { Label } from "flowbite-react";

const Login = () => {
  return (
    <section className="flex items-center justify-evenly mt-14 gap-5">
      <div>
        <img
          src="../../../../src/assets/images/login.svg"
          alt="sign-up-form"
        />
      </div>
      <form className="max-w-[400px] space-y-5 w-full">
        <h2 className="font-[500] text-[32px] text-primary text-center">
          ĐĂNG NHẬP
        </h2>
        <div className="space-y-2">
          <div>
            <div className="mb-2 block">
              <Label htmlFor="email" value="Email" />
            </div>
            <input
              type="text"
              placeholder="Email"
              id="email"
              className="block focus:!border-primary/50 h-10 border-input px-3 rounded-lg w-full focus:!shadow-none"
            />
          </div>
          <div>
            <div className="mb-2 block">
              <Label htmlFor="password-input" value="Mật khẩu" />
            </div>
            <input
              type="password"
              placeholder="Mật khẩu"
              id="password-input"
              className="block focus:!border-primary/50 h-10 border-input px-3 rounded-lg w-full focus:!shadow-none"
            />
          </div>
        </div>
        <button className="w-fit bg-primary py-2 px-6 rounded-md text-util mx-auto block font-[400]">
          ĐĂNG NHẬP
        </button>
      </form>
    </section>
  );
};

export default Login;
