import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import instance from "../../../instance/instance";
import { IOrderUserClient } from "../../../interfaces/IOrderUserClient";

const UserOrderDetail = () => {
  const { code_order } = useParams();
  const [orderDetails, setOrderDetails] = useState<IOrderUserClient>();
  useEffect(() => {
    (async () => {
      const {
        data: { data: response },
      } = await instance.get(`order-detail/${code_order}`);
      setOrderDetails(response);
    })();
  }, []);

  console.log(orderDetails);
  return (
    <div className="grid grid-cols-7 gap-5">
      <div className="border border-[#f1f1f1] rounded-md bg-util col-span-5 p-3 space-y-4 w-full">
        <h3 className="uppercase font-medium text-sm">
          Đơn hàng <span className="text-primary">#{code_order}</span>
        </h3>
        <table className="table w-full overflow-hidden rounded-sm">
          <thead>
            <tr className="text-sm font-[400] bg-[#F3F6F9] h-10 text-secondary/65">
              <th className="font-medium text-left pl-4">Chi tiết sản phẩm</th>
              <th className="font-medium">Giá</th>
              <th className="font-medium">Số lượng</th>
              <th className="font-medium">Tổng số tiền</th>
            </tr>
          </thead>
          <tbody>
            {orderDetails &&
              orderDetails.items.map((item) => {
                return (
                  <tr className="text-secondary/75 text-sm border-b border-dashed border-input">
                    <td className="py-4">
                      <div className="flex gap-3 w-fit items-center">
                        <img
                          src={item.variant.image || item.variant.product.images[0]}
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
                            {
                              item.variant.attribute_values.map((attribute_value)=>{
                                return (
                                  <div className="text-[13px]"><span>{attribute_value.attribute.name}</span> : <span>{attribute_value.value}</span></div>
                                )
                              })
                            }
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="text-center">{item.unit_price.toLocaleString()}đ</td>
                    <td className="text-center">{item.quantity}</td>
                    <td className="text-center">{item.total_price.toLocaleString()}đ</td>
                  </tr>
                );
              })}
            <tr className="border-t border-dashed border-input">
              <td colSpan={1}></td>
              <td colSpan={3} className="px-4 pt-3.5">
                <div className="text-sm space-y-3">
                  <p className="font-medium flex justify-between">Tổng tiền: <span className="block mr-2">{orderDetails?.grand_total.toLocaleString()}đ</span></p>
                  <p className="font-medium flex justify-between">Giảm giá<span className="text-secondary/30">(ANDEPTRAI)</span>: <span className="block mr-2 text-primary">-{Number(10000).toLocaleString()}đ</span></p>
                  <p className="border-t border-dashed border-input pt-3 font-medium flex justify-between">Tổng thanh toán: <span className="block mr-2 text-[#0DD1B7]">{orderDetails?.final_total.toLocaleString()}đ</span></p>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className="border border-[#f1f1f1] rounded-md bg-util col-span-2">
        dev
      </div>
    </div>
  );
};

export default UserOrderDetail;
