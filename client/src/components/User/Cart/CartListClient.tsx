import { useContext, useEffect, useState } from "react";
import CartContext from "../../../contexts/CartContext";
import { Table, Pagination, Popconfirm, message } from "antd";
import type {
  PopconfirmProps,
  TableColumnsType,
  TablePaginationConfig,
} from "antd";
import { IAttributeValue } from "../../../interfaces/IAttributeValue";
import axios from "axios";
import { toast } from "react-toastify";
import instance from "../../../instance/instance";
import { Link } from "react-router-dom";
interface CartItem {
  id: string;
  variant: {
    price: number;
    sale_price?: number;
    image: string;
    product: {
      name: string;
      images: string[];
    };
    attribute_values: IAttributeValue[];
  };
  quantity: number;
}

const CartListClient = () => {
  const { carts, dispatch } = useContext(CartContext);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedTotal, setSelectedTotal] = useState(0);
  const pageSize = 5;

  const calculateTotal = (item: any) => {
    return item.quantity * (item.variant.sale_price || item.variant.price);
  };

  useEffect(() => {
    const newTotal = carts
      .filter((item) => selectedRowKeys.includes(item.id))
      .reduce((acc, item) => acc + calculateTotal(item), 0);
    setSelectedTotal(newTotal);
  }, [selectedRowKeys, carts]);

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, [currentPage, selectedRowKeys]);

  const handleQuantityChange = async (
    item: any,
    newQuantity: number,
    operation: string
  ) => {
    console.log(item);
    const updatedItem = { ...item, quantity: Math.max(1, newQuantity) };
    dispatch({ type: "UPDATE", payload: updatedItem });
    try {
      if (operation === "increase") {
        await instance.patch(`cart/${item.id}/increase`);
      } else if (operation === "decrease") {
        await instance.patch(`cart/${item.id}/decrease`);
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

  const rowSelection = {
    selectedRowKeys,
    onChange: (newSelectedRowKeys: React.Key[]) => {
      setSelectedRowKeys(newSelectedRowKeys);
    },
  };
  const handleTableChange = (pagination: TablePaginationConfig) => {
    setCurrentPage(pagination.current || 1);
  };

  const confirmDeleteOneProduct: PopconfirmProps["onConfirm"] = async (
    id: number
  ) => {
    try {
      const data = await instance.delete(`cart/${id}`);

      if (data) {
        message.success("Xoá sản phẩm khỏi giỏ hàng thành công!");
        dispatch({ type: "DELETE", payload: id });
        const newTotalItems = carts.length - 1;
        const newTotalPages = Math.ceil(newTotalItems / pageSize);
        if (currentPage > newTotalPages) {
          setCurrentPage(Math.max(1, newTotalPages));
        }
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message);
      } else if (error instanceof Error) {
        console.log(error.message);
      } else {
        console.log("Đã xảy ra lỗi không mong muốn");
      }
    }
  };
  useEffect(() => {
    const totalPages = Math.ceil(carts.length / pageSize);
    if (currentPage > totalPages) {
      setCurrentPage(Math.max(1, totalPages));
    }
  }, [carts, currentPage, pageSize]);

  const confirmDeleteSelectProduct: PopconfirmProps["onConfirm"] = async (
    pagination: TablePaginationConfig
  ) => {
    try {
      const data = await instance.post("cart/delete-much", {
        ids: selectedRowKeys,
      });

      if (data) {
        message.success("Xoá sản phẩm khỏi giỏ hàng thành công!");
        dispatch({ type: "REMOVE_SELECTED", payload: selectedRowKeys });
        setCurrentPage(pagination.current || 1);
        setSelectedRowKeys([]);
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message);
      } else if (error instanceof Error) {
        console.log(error.message);
      } else {
        console.log("Đã xảy ra lỗi không mong muốn");
      }
    }
  };

  const cancelDeleteOneProduct: PopconfirmProps["onCancel"] = (e) => {
    console.log(e);
    message.error("Huỷ xoá");
  };
  // const cancelDeleteSelectProduct: PopconfirmProps["onCancel"] = (e) => {
  //   console.log(e);
  //   message.error("Huỷ xoá");
  // };

  const columns: TableColumnsType<CartItem> = [
    {
      title: "Sản phẩm",
      dataIndex: "variant",
      render: (variant, record) => (
        <div className="flex gap-3 items-center w-fit">
          <img
            src={variant.image || variant.product.images[0]}
            className="w-14 h-14 object-cover rounded-lg"
          />
          <div>
            <Link
              to={`/${variant.product.category.slug}/${variant.product.slug}`}
              className="line-clamp-1"
            >
              {variant.product?.name}
            </Link>
            <div className="flex gap-2 text-secondary/50">
              <span>
                Size:{" "}
                {variant.attribute_values.find(
                  (item: IAttributeValue) => item.attribute.slug === "size"
                )?.value || "N/A"}
              </span>
              <span>
                Màu:{" "}
                {variant.attribute_values.find(
                  (item: IAttributeValue) => item.attribute.slug === "color"
                )?.value || "N/A"}
              </span>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "Giá",
      dataIndex: "variant",
      align: "center",
      render: (variant, record) => (
        <span>
          {variant.sale_price
            .toLocaleString("vi-VN", {
              useGrouping: true,
              maximumFractionDigits: 0,
            })
            .replace(/,/g, ".")}{" "}
          VNĐ
        </span>
      ),
    },
    {
      title: "Số lượng",
      dataIndex: "quantity",
      align: "center",
      render: (quantity, record) => (
        <div className="flex items-center w-fit mx-auto">
          <button
            onClick={(e) => {
              e.preventDefault();
              handleQuantityChange(
                record,
                quantity > 1 ? quantity - 1 : 1,
                "decrease"
              );
            }}
            className="p-3 border-input rounded-es-sm rounded-ss-sm text-[#929292] border-s border-b border-t"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              className="size-3"
              color={"currentColor"}
              fill={"none"}
            >
              <path
                d="M20 12L4 12"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
          <input
            min={1}
            value={quantity}
            onChange={(e) =>
              handleQuantityChange(record, Number(e.target.value))
            }
            className="w-10 p-[7px] border border-input outline-none text-center"
          />
          <button
            onClick={(e) => {
              e.preventDefault();
              handleQuantityChange(record, quantity + 1, "increase");
            }}
            className="p-3 border-input rounded-ee-sm rounded-se-sm text-[#929292] border-e border-t border-b"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              className="size-3"
              color={"currentColor"}
              fill={"none"}
            >
              <path
                d="M12 4V20"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M4 12H20"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
      ),
    },
    {
      title: "Tổng",
      dataIndex: "id",
      align: "center",
      render: (id, record) => (
        <span>{calculateTotal(record).toLocaleString()} VNĐ</span>
      ),
    },
    {
      title: "",
      dataIndex: "id",
      align: "center",
      render: (id, record) => (
        <Popconfirm
          title="Xoá sản phẩm"
          description="Bạn có chắc chắn xoá không?"
          onConfirm={() => {
            confirmDeleteOneProduct(id);
          }}
          onCancel={cancelDeleteOneProduct}
          okText="Xoá"
          cancelText="Huỷ"
        >
          <button type="button" className="p-1.5 bg-uitl shadow rounded-md">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              className="size-5"
              color={"#ff9900"}
              fill={"none"}
            >
              <path
                d="M19.5 5.5L18.8803 15.5251C18.7219 18.0864 18.6428 19.3671 18.0008 20.2879C17.6833 20.7431 17.2747 21.1273 16.8007 21.416C15.8421 22 14.559 22 11.9927 22C9.42312 22 8.1383 22 7.17905 21.4149C6.7048 21.1257 6.296 20.7408 5.97868 20.2848C5.33688 19.3626 5.25945 18.0801 5.10461 15.5152L4.5 5.5"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
              <path
                d="M3 5.5H21M16.0557 5.5L15.3731 4.09173C14.9196 3.15626 14.6928 2.68852 14.3017 2.39681C14.215 2.3321 14.1231 2.27454 14.027 2.2247C13.5939 2 13.0741 2 12.0345 2C10.9688 2 10.436 2 9.99568 2.23412C9.8981 2.28601 9.80498 2.3459 9.71729 2.41317C9.32164 2.7167 9.10063 3.20155 8.65861 4.17126L8.05292 5.5"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
              <path
                d="M9.5 16.5L9.5 10.5"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
              <path
                d="M14.5 16.5L14.5 10.5"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </Popconfirm>
      ),
    },
  ];
  const paginatedData = carts.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  console.log(selectedRowKeys);
  localStorage.setItem("id_cart", JSON.stringify(selectedRowKeys));

  return (
    <section className="my-7 space-y-7">
      <h2 className="flex gap-1.5 text-2xl text-primary font-medium">
        <span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2.5}
            stroke="currentColor"
            className="size-7"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
            />
          </svg>
        </span>
        GIỎ HÀNG
      </h2>
      <div className="grid grid-cols-12 gap-5">
        <div className="col-span-9">
          <Table
            dataSource={paginatedData}
            rowSelection={rowSelection}
            columns={columns}
            rowKey="id"
            className="z-40 table-cart"
            pagination={false}
            onChange={handleTableChange}
          />
          <div className="flex justify-between items-center mt-5">
            <Popconfirm
              title="Xoá các sản phẩm đã chọn"
              description="Bạn có chắc chắn xoá không?"
              onConfirm={confirmDeleteSelectProduct}
              // onCancel={cancelDeleteSelectProduct}
              okText="Xoá"
              cancelText="Huỷ"
            >
              <button
                disabled={selectedRowKeys.length === 0 ? true : false}
                className={`${
                  selectedRowKeys.length === 0
                    ? "bg-primary/50 hover:cursor-not-allowed"
                    : "bg-primary hover:cursor-pointer"
                } text-util py-1.5 px-3 rounded-sm flex items-center gap-1.5`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  className="size-5"
                  color={"currentColor"}
                  fill={"none"}
                >
                  <path
                    d="M16 12L8 12"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22C17.5228 22 22 17.5228 22 12Z"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  />
                </svg>
                Xoá mục đã chọn
              </button>
            </Popconfirm>
            <Pagination
              current={currentPage}
              pageSize={pageSize}
              total={carts.length}
              showSizeChanger={false}
              onChange={(page) => setCurrentPage(page)}
            />
          </div>
        </div>
        <div className="col-span-3 border border-input p-3 rounded-md h-fit space-y-6 sticky top-20">
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
                  Khuyến mãi:{" "}
                  <span className="text-sm text-primary">0 VNĐ</span>
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
                {selectedTotal.toLocaleString()} VNĐ
              </span>
            </p>
          </div>
          <button className={`${selectedRowKeys.length <=0 ? 'bg-[#D1D1D6] pointer-events-none':'bg-primary pointer-events-auto'} w-full block rounded-sm`}>
            <Link
              to={"/check-out"}
              className={`text-center flex justify-center py-2 text-util`}
            >
              TIẾN HÀNH ĐẶT HÀNG
            </Link>
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
      </div>
    </section>
  );
};

export default CartListClient;
