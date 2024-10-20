import { useContext, useEffect, useState } from "react";
import CartContext from "../../../contexts/CartContext";
import { ICart } from "../../../interfaces/ICart";
import { Link } from "react-router-dom";
import { IAttributeValue } from "../../../interfaces/IAttributeValue";

const OrderSummary = () => {
  const { carts } = useContext(CartContext);
  const [listSelectCartItem, setListSelectCartItem] = useState<ICart[]>([]);
  const [orderData, setOrderData] = useState();
  const [totalAmount, setTotalAmount] = useState(0);

  useEffect(() => {
    const idCarts = JSON.parse(localStorage.getItem("id_cart")!);
    const OrderFormData = JSON.parse(
      localStorage.getItem("addressOrderFormData")!
    );
    const methodPayment = JSON.parse(localStorage.getItem("methodPayment")!);
    OrderFormData.payment_method = methodPayment;
    OrderFormData.selected_items = idCarts;
    const cartList = idCarts.flatMap((idCart: number) => {
      return carts.filter((cart) => {
        return cart.id === idCart;
      });
    });
    setListSelectCartItem(cartList);

    const total = cartList.reduce((sum, item) => {
      return (
        sum + item.quantity * (item.variant.sale_price || item.variant.price)
      );
    }, 0);

    setTotalAmount(total);
    setOrderData({
      ...OrderFormData,
      final_total: total,
    });
  }, [carts]);

  useEffect(() => {
    if (orderData) {
      localStorage.setItem("orderData", JSON.stringify(orderData));
    }
  }, [orderData]);

  return (
    <div className="space-y-5">
      <h3 className="font-medium">Tổng quan đơn hàng</h3>
      <table className="table w-full text-left">
        <thead>
          <tr>
            <th className="font-normal text-secondary/65">Sản phẩm</th>
            <th className="font-normal text-secondary/65">Đơn giá</th>
            <th className="font-normal text-secondary/65 text-center">
              Số lượng
            </th>
            <th className="font-normal text-secondary/65 text-center">
              Thành tiền
            </th>
          </tr>
        </thead>
        <tbody className="my-5">
          {listSelectCartItem.map((itemCart) => {
            return (
              <tr key={itemCart.id} className="border-b border-[#f2f2f2]">
                <td className="py-3 text-sm">
                  <div className="flex gap-3 items-center w-fit ">
                    <img
                      src={
                        itemCart.variant.image ||
                        itemCart.variant.product.images[0]
                      }
                      className="w-14 h-14 object-cover rounded-lg"
                      alt={itemCart.variant.product?.name}
                    />
                    <div className="space-y-1">
                      <Link
                        to={`/${itemCart.variant.product.category.slug}/${itemCart.variant.product.slug}`}
                        className="line-clamp-1 hover:text-primary text-sm"
                      >
                        {itemCart.variant.product?.name}
                      </Link>
                      <div className="flex gap-2 text-secondary/50 text-sm">
                        <span>
                          Size:{" "}
                          {itemCart.variant.attribute_values.find(
                            (item: IAttributeValue) =>
                              item.attribute.slug === "size"
                          )?.value || "N/A"}
                        </span>
                        <span>
                          Màu:{" "}
                          {itemCart.variant.attribute_values.find(
                            (item: IAttributeValue) =>
                              item.attribute.slug === "color"
                          )?.value || "N/A"}
                        </span>
                      </div>
                    </div>
                  </div>
                </td>
                <td className="py-3 text-sm">
                  <span>
                    {(itemCart.variant.sale_price || itemCart.variant.price)
                      .toLocaleString("vi-VN", {
                        useGrouping: true,
                        maximumFractionDigits: 0,
                      })
                      .replace(/,/g, ".")}{" "}
                    đ
                  </span>
                </td>
                <td className="py-3 text-sm text-center">
                  <span>{itemCart.quantity}</span>
                </td>
                <td className="py-3 text-sm text-center">
                  <span>
                    {(
                      itemCart.quantity *
                      (itemCart.variant.sale_price || itemCart.variant.price)
                    )
                      .toLocaleString("vi-VN", {
                        useGrouping: true,
                        maximumFractionDigits: 0,
                      })
                      .replace(/,/g, ".")}{" "}
                    đ
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <div className="flex justify-between items-center border-t border-[#f2f2f2] pt-4">
        <span className="font-medium">Tổng cộng:</span>
        <span className="font-medium text-primary">
          {totalAmount
            .toLocaleString("vi-VN", {
              useGrouping: true,
              maximumFractionDigits: 0,
            })
            .replace(/,/g, ".")}{" "}
          đ
        </span>
      </div>
    </div>
  );
};

export default OrderSummary;
