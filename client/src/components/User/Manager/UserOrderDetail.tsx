import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import instance from "../../../instance/instance";
import { IOrderUserClient } from "../../../interfaces/IOrderUserClient";
import { Steps, Popover, Input, Radio, Space, message } from "antd";
import type { RadioChangeEvent } from "antd";
import { useForm } from "react-hook-form";
const UserOrderDetail = () => {
  const { code_order } = useParams();
  const [orderDetails, setOrderDetails] = useState<IOrderUserClient>();
  const [checkStatusCurrent, setCheckStatusCurrent] = useState<number>(0);
  const [valueReason, setValueReason] = useState<string>("");
  const {setValue,watch}=useForm<{reason:any}>()
  const onChange = (e: RadioChangeEvent) => {
    setValueReason(e.target.value);
  };

  useEffect(() => {
    (async () => {
      const {
        data: { data: response },
      } = await instance.get(`order-detail/${code_order}`);
      setOrderDetails(response);
    })();
  }, [valueReason]);
  const description = "This is a description.";
  const status = (statusOrder: string) => {
    switch (statusOrder) {
      case "pending":
        return (
          <span className="bg-[#FEF6E7] text-primary px-2 py-1 rounded-sm text-xs flex items-center gap-1">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              className="size-4"
              color={"currentColor"}
              fill={"none"}
            >
              <path
                d="M12 3V6"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
              <path
                d="M12 18V21"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
              <path
                d="M21 12L18 12"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
              <path
                d="M6 12L3 12"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
              <path
                d="M18.3635 5.63672L16.2422 7.75804"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
              <path
                d="M7.75804 16.2422L5.63672 18.3635"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
              <path
                d="M18.3635 18.3635L16.2422 16.2422"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
              <path
                d="M7.75804 7.75804L5.63672 5.63672"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
            Chờ xác nhận
          </span>
        );
      case "confirmed":
        return (
          <span className="bg-[#faf3e6] text-primary px-2 py-1 rounded-sm text-xs flex items-center gap-1">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              className="size-4"
              color={"currentColor"}
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
            Đã xác nhận
          </span>
        );
      case "preparing_goods":
        return (
          <span className="bg-[#E6EFFE] text-[#5695F7] px-2 py-1 rounded-sm text-xs flex items-center gap-1">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              className="size-4"
              color={"currentColor"}
              fill={"none"}
            >
              <path
                d="M12 22C11.1818 22 10.4002 21.6698 8.83693 21.0095C4.94564 19.3657 3 18.5438 3 17.1613C3 16.7742 3 10.0645 3 7M12 22C12.8182 22 13.5998 21.6698 15.1631 21.0095C19.0544 19.3657 21 18.5438 21 17.1613V7M12 22L12 11.3548"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M8.32592 9.69138L5.40472 8.27785C3.80157 7.5021 3 7.11423 3 6.5C3 5.88577 3.80157 5.4979 5.40472 4.72215L8.32592 3.30862C10.1288 2.43621 11.0303 2 12 2C12.9697 2 13.8712 2.4362 15.6741 3.30862L18.5953 4.72215C20.1984 5.4979 21 5.88577 21 6.5C21 7.11423 20.1984 7.5021 18.5953 8.27785L15.6741 9.69138C13.8712 10.5638 12.9697 11 12 11C11.0303 11 10.1288 10.5638 8.32592 9.69138Z"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M6 12L8 13"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M17 4L7 9"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Đang chuẩn bị hàng
          </span>
        );
      case "shipping":
        return (
          <span className="bg-[#EAF9FC] text-[#32c8db] px-2 py-1 rounded-sm text-xs flex items-center gap-1">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              className="size-4"
              color={"currentColor"}
              fill={"none"}
            >
              <circle
                cx="17"
                cy="18"
                r="2"
                stroke="currentColor"
                strokeWidth="1.5"
              />
              <circle
                cx="7"
                cy="18"
                r="2"
                stroke="currentColor"
                strokeWidth="1.5"
              />
              <path
                d="M5 17.9724C3.90328 17.9178 3.2191 17.7546 2.73223 17.2678C2.24536 16.7809 2.08222 16.0967 2.02755 15M9 18H15M19 17.9724C20.0967 17.9178 20.7809 17.7546 21.2678 17.2678C22 16.5355 22 15.357 22 13V11H17.3C16.5555 11 16.1832 11 15.882 10.9021C15.2731 10.7043 14.7957 10.2269 14.5979 9.61803C14.5 9.31677 14.5 8.94451 14.5 8.2C14.5 7.08323 14.5 6.52485 14.3532 6.07295C14.0564 5.15964 13.3404 4.44358 12.4271 4.14683C11.9752 4 11.4168 4 10.3 4H2"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M2 8H8"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M2 11H6"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M14.5 6H16.3212C17.7766 6 18.5042 6 19.0964 6.35371C19.6886 6.70742 20.0336 7.34811 20.7236 8.6295L22 11"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Đang vận chuyển
          </span>
        );
      case "delivered":
        return (
          <span className="bg-[#DBF8F4] text-[#14D1B8] px-2 py-1 rounded-sm text-xs flex items-center gap-1">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              className="size-4"
              color={"currentColor"}
              fill={"none"}
            >
              <path
                d="M21 7V12M3 7C3 10.0645 3 16.7742 3 17.1613C3 18.5438 4.94564 19.3657 8.83693 21.0095C10.4002 21.6698 11.1818 22 12 22L12 11.3548"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M15 19C15 19 15.875 19 16.75 21C16.75 21 19.5294 16 22 15"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M8.32592 9.69138L5.40472 8.27785C3.80157 7.5021 3 7.11423 3 6.5C3 5.88577 3.80157 5.4979 5.40472 4.72215L8.32592 3.30862C10.1288 2.43621 11.0303 2 12 2C12.9697 2 13.8712 2.4362 15.6741 3.30862L18.5953 4.72215C20.1984 5.4979 21 5.88577 21 6.5C21 7.11423 20.1984 7.5021 18.5953 8.27785L15.6741 9.69138C13.8712 10.5638 12.9697 11 12 11C11.0303 11 10.1288 10.5638 8.32592 9.69138Z"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M6 12L8 13"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M17 4L7 9"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Đã giao hàng
          </span>
        );
      case "canceled":
        return (
          <span className="bg-[#FFECE3] text-[#FF7F40] px-2 py-1 rounded-sm text-xs flex items-center gap-1">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              className="size-4"
              color={"currentColor"}
              fill={"none"}
            >
              <path
                d="M12 22C11.1818 22 10.4002 21.6708 8.83693 21.0123C4.94564 19.3734 3 18.5539 3 17.1754V7.54234M12 22C12.8182 22 13.5998 21.6708 15.1631 21.0123C19.0544 19.3734 21 18.5539 21 17.1754V7.54234M12 22V12.0292M21 7.54234C21 8.15478 20.1984 8.54152 18.5953 9.315L15.6741 10.7244C13.8712 11.5943 12.9697 12.0292 12 12.0292M21 7.54234C21 6.9299 20.1984 6.54316 18.5953 5.76969L17 5M3 7.54234C3 8.15478 3.80157 8.54152 5.40472 9.315L8.32592 10.7244C10.1288 11.5943 11.0303 12.0292 12 12.0292M3 7.54234C3 6.9299 3.80157 6.54317 5.40472 5.76969L7 5M6 13.0263L8 14.0234"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M10 2L12 4M12 4L14 6M12 4L10 6M12 4L14 2"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
            Đơn hàng đã bị hủy
          </span>
        );
      default:
        break;
    }
  };

  useEffect(() => {
    switch (orderDetails?.status_order) {
      case "pending":
        return setCheckStatusCurrent(0);
      case "confirmed":
        return setCheckStatusCurrent(1);
      case "preparing_goods":
        return setCheckStatusCurrent(2);
      case "shipping":
        return setCheckStatusCurrent(3);
      case "delivered":
        return setCheckStatusCurrent(4);
      default:
        break;
    }
  }, [orderDetails?.status_order]);

  const handleCancelOrder = async () => {
    try {
      const {
        data: { data: response },
      } = await instance.patch(`order-cancelation/${orderDetails?.id}`, {
        reason: valueReason ==="Khác" ? watch('reason') : valueReason,
      });
      if (response) {
        setValueReason("");
        window.scrollTo({
          top:0,
          behavior:"smooth"
        })
        message.success("Huỷ đơn hàng thành công");
      }
    } catch (error) {
      console.log(error);
    }
  };
  const content = () => {
    return (
      <div className="space-y-3">
        <Radio.Group onChange={onChange} value={valueReason}>
          <Space direction="vertical">
            <Radio value={"Đổi ý không muốn mua nữa"}>
              Đổi ý không muốn mua nữa
            </Radio>
            <Radio value={"Muốn thay đổi địa chỉ/thông tin đơn hàng"}>
              Muốn thay đổi địa chỉ/thông tin đơn hàng
            </Radio>
            <Radio value={"Tìm được sản phẩm rẻ hơn"}>
              Tìm được sản phẩm rẻ hơn
            </Radio>
            <Radio value={"Khác"}>
              Khác...
              {valueReason === "Khác" ? (
                <Input
                  style={{
                    width: 200,
                    marginInlineStart: 10,
                    height: 30,
                    borderRadius: 5,
                    fontSize: 14,
                    borderColor: "#e6e6eb",
                  }}
                  onChange={(e)=>{
                    setValue('reason',e.target.value)
                  }}
                />
              ) : null}
            </Radio>
          </Space>
        </Radio.Group>
        <button
          className="block py-1.5 px-2.5 bg-primary text-util rounded-sm"
          onClick={handleCancelOrder}
        >
          Xác nhận huỷ
        </button>
      </div>
    );
  };

  return (
    <div className="grid grid-cols-7 gap-5">
      <div className="col-span-5 w-full space-y-4">
        <div className="border border-[#f1f1f1] rounded-md bg-util p-3 space-y-4">
          <h3 className="uppercase font-medium text-sm">
            Đơn hàng <span className="text-primary">#{code_order}</span>
          </h3>
          <table className="table w-full overflow-hidden rounded-sm">
            <thead>
              <tr className="text-sm font-[400] bg-[#F3F6F9] h-10 text-secondary/65">
                <th className="font-medium text-left pl-4">
                  Chi tiết sản phẩm
                </th>
                <th className="font-medium">Giá</th>
                <th className="font-medium">Số lượng</th>
                <th className="font-medium">Tổng số tiền</th>
              </tr>
            </thead>
            <tbody>
              {orderDetails &&
                orderDetails.items.map((item,index) => {
                  return (
                    <tr className="text-secondary/75 text-sm border-b border-dashed border-input" key={index+1}>
                      <td className="py-4">
                        <div className="flex gap-3 w-fit items-center">
                          <img
                            src={
                              item.variant.image ||
                              item.variant.product.images[0]
                            }
                            className="w-14 h-14 object-cover rounded-lg"
                          />
                          <div className="space-y-1">
                            <Link
                              to={`/${item.variant.product.category?.slug}/${item.variant.product.slug}`}
                              className="line-clamp-1 text-sm hover:text-primary"
                            >
                              {item.variant.product.name}
                            </Link>
                            <div className="flex gap-3 text-secondary/50 flex-wrap">
                              {item.variant.attribute_values.map(
                                (attribute_value) => {
                                  return (
                                    <div className="text-[13px]" key={attribute_value.id}>
                                      <span>
                                        {attribute_value.attribute.name}
                                      </span>{" "}
                                      : <span>{attribute_value.value}</span>
                                    </div>
                                  );
                                }
                              )}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="text-center">
                        {item.unit_price.toLocaleString()}đ
                      </td>
                      <td className="text-center">{item.quantity}</td>
                      <td className="text-center">
                        {item.total_price.toLocaleString()}đ
                      </td>
                    </tr>
                  );
                })}
              <tr className="border-t border-dashed border-input">
                <td colSpan={1}></td>
                <td colSpan={3} className="px-4 pt-3.5">
                  <div className="text-sm space-y-3">
                    <p className="font-medium flex justify-between">
                      Tổng tiền:{" "}
                      <span className="block mr-2">
                        {orderDetails?.grand_total.toLocaleString()}đ
                      </span>
                    </p>
                    <p className="font-medium flex justify-between">
                      <span>
                        Giảm giá:{" "}
                        <span className="text-secondary/30">
                          (E0FR5RLLPWRN)
                        </span>
                      </span>
                      <span className="block mr-2 text-primary">
                        -{Number(10000).toLocaleString()}đ
                      </span>
                    </p>
                    <p className="border-t border-dashed border-input pt-3 font-medium flex justify-between">
                      Tổng thanh toán:{" "}
                      <span className="block mr-2 text-[#0DD1B7]">
                        {orderDetails?.final_total.toLocaleString()}đ
                      </span>
                    </p>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="border border-[#f1f1f1] rounded-md bg-util p-3 space-y-2">
          <div className="flex items-center justify-between pt-2 pb-4 border-b border-input/50">
            <h3 className="uppercase font-medium text-sm flex items-center gap-2">
              Trạng thái đơn hàng: {status(orderDetails?.status_order)}
            </h3>
            {orderDetails?.status_order !== "canceled" && (
              <Popover
                content={content}
                title="Lý do huỷ đơn hàng ?"
                trigger="click"
                placement={"topRight"}
              >
                <button
                  type="button"
                  className="text-[#FF7F40] bg-primary/10 py-1.5 px-2 flex items-center flex-nowrap gap-1 rounded-sm"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    className="size-5"
                    color={"currentColor"}
                    fill={"none"}
                  >
                    <path
                      d="M12 22C11.1818 22 10.4002 21.6708 8.83693 21.0123C4.94564 19.3734 3 18.5539 3 17.1754V7.54234M12 22C12.8182 22 13.5998 21.6708 15.1631 21.0123C19.0544 19.3734 21 18.5539 21 17.1754V7.54234M12 22V12.0292M21 7.54234C21 8.15478 20.1984 8.54152 18.5953 9.315L15.6741 10.7244C13.8712 11.5943 12.9697 12.0292 12 12.0292M21 7.54234C21 6.9299 20.1984 6.54316 18.5953 5.76969L17 5M3 7.54234C3 8.15478 3.80157 8.54152 5.40472 9.315L8.32592 10.7244C10.1288 11.5943 11.0303 12.0292 12 12.0292M3 7.54234C3 6.9299 3.80157 6.54317 5.40472 5.76969L7 5M6 13.0263L8 14.0234"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M10 2L12 4M12 4L14 6M12 4L10 6M12 4L14 2"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                    />
                  </svg>
                  <span>Huỷ đơn</span>
                </button>
              </Popover>
            )}
          </div>
          <div>
            {orderDetails?.status_order !== "canceled" ? (
              <Steps
                direction="vertical"
                size="small"
                current={checkStatusCurrent}
                style={{ backgroundColor: "white" }}
                items={[
                  { title: "Chờ xác nhận", description },
                  {
                    title: "Đã xác nhận",
                    description,
                  },
                  {
                    title: "Đang chuẩn bị hàng",
                    description,
                  },
                  {
                    title: "Đang vận chuyển",
                    description,
                  },
                  {
                    title: "Đã giao hàng",
                    description,
                  },
                ]}
              />
            ) : (
              <Steps
                direction="vertical"
                size="small"
                current={0}
                style={{ backgroundColor: "white" }}
                items={[
                  {
                    title: "Đơn hàng đã bị hủy",
                    description,
                    status: "error",
                  },
                ]}
              />
            )}
          </div>
        </div>
      </div>
      <div className="col-span-2 space-y-4">
        <div className="border border-[#f1f1f1] rounded-md bg-util p-3 space-y-2">
          <h3 className="uppercase font-medium text-sm flex items-center gap-2 pb-4 border-b border-input/50">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              className="size-5"
              color={"#ff9900"}
              fill={"none"}
            >
              <path
                d="M5.08069 15.2964C3.86241 16.0335 0.668175 17.5386 2.61368 19.422C3.56404 20.342 4.62251 21 5.95325 21H13.5468C14.8775 21 15.936 20.342 16.8863 19.422C18.8318 17.5386 15.6376 16.0335 14.4193 15.2964C11.5625 13.5679 7.93752 13.5679 5.08069 15.2964Z"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M13.5 7C13.5 9.20914 11.7091 11 9.5 11C7.29086 11 5.5 9.20914 5.5 7C5.5 4.79086 7.29086 3 9.5 3C11.7091 3 13.5 4.79086 13.5 7Z"
                stroke="currentColor"
                strokeWidth="1.5"
              />
              <path
                d="M17 5L22 5"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M17 8L22 8"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M20 11L22 11"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Thông tin nhận hàng
          </h3>
          <div className="space-y-2">
            <p>
              <label htmlFor="full-name" className="text-sm font-medium">
                Họ và tên:{" "}
                <span className="font-normal">{orderDetails?.name}</span>
              </label>
            </p>
            <p>
              <label htmlFor="email" className="text-sm font-medium">
                Email:{" "}
                <span className="font-normal">andinhle163@gmail.com</span>
              </label>
            </p>
            <p>
              <label htmlFor="phone" className="text-sm font-medium">
                Số điện thoại:{" "}
                <span className="font-normal">{orderDetails?.tel}</span>
              </label>
            </p>
          </div>
        </div>
        <div className="border border-[#f1f1f1] rounded-md bg-util p-3 space-y-2">
          <h3 className="uppercase font-medium text-sm flex items-center gap-2 pb-4 border-b border-input/50">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              className="size-5"
              color={"#ff9900"}
              fill={"none"}
            >
              <path
                d="M18.9108 18C19.8247 19.368 20.2113 20.203 19.8865 20.8999C19.8466 20.9854 19.7999 21.0679 19.7469 21.1467C19.1724 22 17.6875 22 14.7178 22H9.28223C6.31251 22 4.82765 22 4.25311 21.1467C4.20005 21.0679 4.15339 20.9854 4.11355 20.8999C3.78869 20.203 4.17527 19.368 5.08915 18"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M15 9.5C15 11.1569 13.6569 12.5 12 12.5C10.3431 12.5 9 11.1569 9 9.5C9 7.84315 10.3431 6.5 12 6.5C13.6569 6.5 15 7.84315 15 9.5Z"
                stroke="currentColor"
                strokeWidth="1.5"
              />
              <path
                d="M12 2C16.0588 2 19.5 5.42803 19.5 9.5869C19.5 13.812 16.0028 16.777 12.7725 18.7932C12.5371 18.9287 12.2709 19 12 19C11.7291 19 11.4629 18.9287 11.2275 18.7932C8.00325 16.7573 4.5 13.8266 4.5 9.5869C4.5 5.42803 7.9412 2 12 2Z"
                stroke="currentColor"
                strokeWidth="1.5"
              />
            </svg>
            Địa chỉ nhận hàng
          </h3>
          <p>
            <label htmlFor="full-name" className="text-sm font-medium">
              <span className="font-normal">{orderDetails?.address}</span>
            </label>
          </p>
        </div>
        <div className="border border-[#f1f1f1] rounded-md bg-util p-3">
          <h3 className="uppercase font-medium text-sm flex items-center gap-2 pb-4 border-b border-input/50">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              className="size-5"
              color={"#ff9900"}
              fill={"none"}
            >
              <path
                d="M3.3457 16.1976L16.1747 3.36866M18.6316 11.0556L16.4321 13.2551M14.5549 15.1099L13.5762 16.0886"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
              <path
                d="M3.17467 16.1411C1.60844 14.5749 1.60844 12.0355 3.17467 10.4693L10.4693 3.17467C12.0355 1.60844 14.5749 1.60844 16.1411 3.17467L20.8253 7.85891C22.3916 9.42514 22.3916 11.9645 20.8253 13.5307L13.5307 20.8253C11.9645 22.3916 9.42514 22.3916 7.85891 20.8253L3.17467 16.1411Z"
                stroke="currentColor"
                strokeWidth="1.5"
              />
              <path
                d="M4 22H20"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
            Phương thức thanh toán
          </h3>
          <div>COD</div>
        </div>
      </div>
    </div>
  );
};

export default UserOrderDetail;
