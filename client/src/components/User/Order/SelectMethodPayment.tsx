import { useEffect, useState } from "react";

const SelectMethodPayment = () => {
  const [paymentMethod, setPaymentMethod] = useState<string>("COD");

  useEffect(() => {
    const methodData = localStorage.getItem("methodPayment");
    if (methodData) {
      setPaymentMethod(JSON.parse(methodData));
    } else {
      localStorage.setItem("methodPayment", JSON.stringify("COD"));
    }
  }, []);

  const dataPayments = [
    {
      id: 1,
      method: "COD",
      title: "Thanh toán khi nhận hàng",
      description: "Ship COD toàn quốc, thanh toán khi nhận được hàng",
    },
    {
      id: 2,
      method: "VNPAY",
      title: "Thanh toán qua VNPAY",
      description: "Thanh toán online bằng QR hoặc thẻ ATM, VISA, MasterCard",
    },
  ];

  const getMethod = (method: string) => {
    setPaymentMethod(method);
    localStorage.setItem("methodPayment", JSON.stringify(method));
  };

  return (
    <div className="space-y-5">
      <h3 className="font-medium">Phương thức thanh toán</h3>
      <form className="grid grid-cols-2  lg:grid-cols-3 gap-3">
        {dataPayments.map((dataPayment) => (
          <div
            className="bg-[#f7f7f7] p-4 rounded-md flex justify-between"
            key={dataPayment.id}
          >
            <div className="space-y-2">
              <h4 className="font-medium text-sm">{dataPayment.title}</h4>
              <p className="text-sm text-secondary/65">
                {dataPayment.description}
              </p>
            </div>
            <div>
              <button
                type="button"
                onClick={() => getMethod(dataPayment.method)}
              >
                <div
                  className={`${
                    paymentMethod === dataPayment.method
                      ? "bg-primary"
                      : "bg-util"
                  } w-6 h-6 border shadow-inner rounded-sm`}
                >
                  {paymentMethod === dataPayment.method && (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      className="size-6"
                      color={"#ffffff"}
                      fill={"none"}
                    >
                      <path
                        d="M5 14.5C5 14.5 6.5 14.5 8.5 18C8.5 18 14.0588 8.83333 19 7"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  )}
                </div>
              </button>
            </div>
          </div>
        ))}
      </form>
    </div>
  );
};

export default SelectMethodPayment;
