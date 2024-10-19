import axios from "axios";
import { toast } from "react-toastify";
import instance from "../../../instance/instance";

type Prop = {
  current: number;
};

const ConfirmOrder = ({ current }: Prop) => {
  const final_total = JSON.parse(localStorage.getItem("final_total")!);
  const submitOrder = async () => {
    const orderDataRaw = localStorage.getItem("orderData");
    const orderData = orderDataRaw ? JSON.parse(orderDataRaw) : null;
    try {
      const { data } = await instance.post("order", {
        name: orderData.fullName,
        tel: orderData.phone,
        ...orderData,
      });
      console.log(data);
      if (data) {
        toast.success(data.message);
        localStorage.removeItem("final_total");
        localStorage.removeItem("id_cart");
        localStorage.removeItem("addressOrderFormData");
        localStorage.removeItem("methodPayment");
        localStorage.removeItem("orderData");
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message);
      } else if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Đã xảy ra lỗi không mong muốn");
      }
    }
  };
  return (
    <div className="col-span-3 border border-input p-3 rounded-md h-fit space-y-6 sticky top-20 bg-util">
      <form action="">
        <div className="space-y-2">
          <div className="block">
            <label htmlFor="voucher" className="flex gap-1">
              Nhập mã voucher{" "}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="#ff9900"
                className="size-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M16.5 6v.75m0 3v.75m0 3v.75m0 3V18m-9-5.25h5.25M7.5 15h3M3.375 5.25c-.621 0-1.125.504-1.125 1.125v3.026a2.999 2.999 0 0 1 0 5.198v3.026c0 .621.504 1.125 1.125 1.125h17.25c.621 0 1.125-.504 1.125-1.125v-3.026a2.999 2.999 0 0 1 0-5.198V6.375c0-.621-.504-1.125-1.125-1.125H3.375Z"
                />
              </svg>
            </label>
          </div>
          <div className="flex w-auto items-center rounded-[5px] overflow-hidden">
            <input
              type="text"
              placeholder="Nhập code"
              id="value-voucher"
              className="block  max-w-[73%] h-[35px] focus:!border-primary/50 focus:!border-r-transparent rounded-[5px] rounded-r-none border-r-transparent border border-input text-sm placeholder-[#00000040] focus:!shadow-none"
            />
            <button
              type="button"
              className="block bg-primary w-full h-[35px] px-2 text-sm text-util"
            >
              Áp dụng
            </button>
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-sm block">
              Khuyến mãi: <span className="text-sm text-primary">0 VNĐ</span>
            </label>
            <label className="text-sm block">
              Phí vận chuyển:{" "}
              <span className="text-sm text-primary">Miễn phí</span>
            </label>
          </div>
        </div>
      </form>
      <div className="space-y-2">
        <p className="font-medium">
          Tổng thanh toán:{" "}
          <span className="text-primary">
            {final_total.toLocaleString()} VNĐ
          </span>
        </p>
      </div>
      <button
        className={`${
          current !== 2
            ? "bg-[#D1D1D6] pointer-events-none"
            : "bg-primary pointer-events-auto"
        } w-full block rounded-sm py-2 text-util`}
        onClick={submitOrder}
      >
        TIẾN HÀNH THANH TOÁN
      </button>
      <div className="space-y-2.5">
        <img
          src="../../../../src/assets/images/images-payment.svg"
          className="w-fit mx-auto"
          alt="image-payment"
        />
        <p className="text-sm text-center text-secondary/75">
          Đảm bảo an toàn và bảo mật
        </p>
      </div>
    </div>
  );
};

export default ConfirmOrder;
