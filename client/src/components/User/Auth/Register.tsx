import { Label } from "flowbite-react";

const Register = () => {
  return (
    <section className="flex items-center justify-evenly mt-14">
      <form className="max-w-[400px] space-y-5">
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
            />
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
            />
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
              />
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
              />
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
