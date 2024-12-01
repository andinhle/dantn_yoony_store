import { Table } from "flowbite-react";
import { useContext, useEffect, useState } from "react";
import TrashContext from "../../../contexts/TrashContext";
import { Avatar, Checkbox, ConfigProvider, Pagination } from "antd";
import { Link, useSearchParams } from "react-router-dom";
import dayjs from "dayjs";
import { toast } from "react-toastify";
import axios from "axios";
import instance from "../../../instance/instance";
import { IMeta } from "../../../interfaces/IMeta";
import type { CheckboxProps } from "antd";

const CheckboxGroup = Checkbox.Group;

const ListTrashProducts = () => {
  const { trashProducts, dispatch } = useContext(TrashContext);
  const [searchParams, setSearchParams] = useSearchParams();
  const page = parseInt(searchParams.get("page") || "1");
  const [meta, setMeta] = useState<IMeta>();
  const plainOptions = [1, 1, 1];
  const [checkedList, setCheckedList] = useState<number[]>([]);

  const checkAll = plainOptions.length === checkedList.length;
  const indeterminate =
    checkedList.length > 0 && checkedList.length < plainOptions.length;

  const onChange = (list: number[]) => {
    setCheckedList(list);
  };

  const onCheckAllChange: CheckboxProps["onChange"] = (e) => {
    setCheckedList(e.target.checked ? plainOptions : []);
  };

  console.log(checkedList);
  const handleRestoreProduct = async (id: number) => {
    try {
      const data = await instance.patch(`product/restore/${id}`);
      if (data) {
        toast.success("Khôi phục sản phẩm thành công !");
        dispatch({
          type: "DELETE",
          payload: id,
        });
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
    (async () => {
      try {
        setSearchParams({ page: String(page) });
        const { data } = await instance.get("listDelete");
        dispatch({
          type: "LIST",
          payload: data.data,
        });
        setMeta(data.meta);
      } catch (error) {
        if (axios.isAxiosError(error)) {
          toast.error(error.response?.data?.message);
        } else if (error instanceof Error) {
          console.log(error.message);
        } else {
          console.log("Đã xảy ra lỗi không mong muốn");
        }
      }
    })();
  }, []);
  return (
    <div className="space-y-5 bg-util p-5 rounded-md">
      <div className="rounded-lg overflow-hidden border-b border-[#f1f1f1]">
        <Table>
          <Table.Head className="text-center">
            <Table.HeadCell
              style={{ width: "5%" }}
              className="bg-[#F4F7FA] text-left text-secondary/75 text-sm font-medium capitalize text-nowrap"
            >
              <ConfigProvider
                theme={{
                  token: {
                    colorPrimary: "#ff9900",
                  },
                }}
              >
                <Checkbox
                  indeterminate={indeterminate}
                  onChange={onCheckAllChange}
                  checked={checkAll}
                ></Checkbox>
              </ConfigProvider>
            </Table.HeadCell>
            <Table.HeadCell className="bg-[#F4F7FA] text-left text-secondary/75 text-sm font-medium capitalize text-nowrap">
              Tên sản phẩm
            </Table.HeadCell>
            <Table.HeadCell className="bg-[#F4F7FA] text-secondary/75 text-sm font-medium capitalize text-nowrap">
              Danh mục
            </Table.HeadCell>
            <Table.HeadCell className="bg-[#F4F7FA] text-secondary/75 text-sm font-medium capitalize text-nowrap">
              Hành động
            </Table.HeadCell>
          </Table.Head>
          <Table.Body className="divide-y">
            {trashProducts.map((product, index) => {
              return (
                <Table.Row
                  className="bg-white dark:border-gray-700 dark:bg-gray-800 text-center"
                  key={product.id}
                >
                  <Table.Cell className="font-medium text-primary text-base border-[#f5f5f5] border-r ">
                    <ConfigProvider
                      theme={{
                        token: {
                          colorPrimary: "#ff9900",
                        },
                      }}
                    >
                      <CheckboxGroup
                        options={product.id!}
                        value={product.id}
                        onChange={onChange}
                      />
                    </ConfigProvider>
                  </Table.Cell>
                  <Table.Cell className="whitespace-nowrap font-medium text-secondary/70 dark:text-white text-left">
                    <div className="flex gap-2">
                      <Avatar
                        shape="square"
                        src={product.images[0]}
                        size={46}
                        className="w-full"
                      />
                      <p className="space-y-1 max-w-[300px] w-full">
                        <Link
                          to={`/${product.category?.slug}/${product?.slug}`}
                        >
                          <p className="text-ellipsis text-nowrap overflow-hidden">
                            {product.name}
                          </p>
                          <p className="text-sm font-normal text-secondary/50">
                            Cập nhật:{" "}
                            <span className="text-primary/75">
                              {dayjs(product.updated_at).format("DD-MM-YYYY")}
                            </span>
                          </p>
                        </Link>
                      </p>
                    </div>
                  </Table.Cell>
                  <Table.Cell>{product?.category?.name}</Table.Cell>
                  <Table.Cell>
                    <div className="flex gap-2 justify-center">
                      <button
                        className="bg-util shadow py-1.5 px-3 rounded-md text-primary"
                        onClick={() => {
                          swal({
                            title: "Khôi phục sản phẩm",
                            text: "Sau khi khôi phục sản phẩm có thể được bán trở lại !",
                            icon: "warning",
                            buttons: ["Hủy", "Khôi phục"],
                            dangerMode: true,
                            className: "my-swal",
                          }).then((willDelete) => {
                            if (willDelete) {
                              handleRestoreProduct(product.id!);
                            }
                          });
                        }}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          className="size-6"
                          color={"currentColor"}
                          fill={"none"}
                        >
                          <path
                            d="M3.25 5H8.67963C9.34834 5 9.9728 4.6658 10.3437 4.1094L11.1563 2.8906C11.5272 2.3342 12.1517 2 12.8204 2H17.3085C18.1693 2 18.9336 2.55086 19.2058 3.36754L19.75 5M21.25 5H8.25"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                          />
                          <path
                            d="M19.75 5L19.25 11.5M4.75 5L5.35461 15.5362C5.50945 18.1069 5.58688 19.3923 6.22868 20.3166C6.546 20.7736 6.9548 21.1593 7.42905 21.4492C8.01127 21.8051 8.71343 21.945 9.75 22"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                          />
                          <path
                            d="M11.25 15.498L12.3863 16.9638C12.958 14.8299 15.1514 13.5636 17.2852 14.1353C18.3775 14.428 19.2425 15.1456 19.75 16.0626M21.25 20.498L20.1137 19.0343C19.5419 21.1682 17.3486 22.4345 15.2147 21.8627C14.1478 21.5769 13.2977 20.8856 12.7859 19.999"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </button>
                      {/* <button
                        className="bg-util shadow py-1.5 px-3 rounded-md text-primary"
                        onClick={() => {
                          swal({
                            title: "Di chuyển tới thùng rác",
                            text: "Sau khi di chuyển sản phẩm sẽ xoá tạm thời !",
                            icon: "warning",
                            buttons: ["Hủy", "Thùng rác"],
                            dangerMode: true,
                            className: "my-swal",
                          }).then((willDelete) => {
                            if (willDelete) {
                              handleRestoreProduct(product.id!);
                            }
                          });
                        }}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          className="size-6"
                          color={"currentColor"}
                          fill={"none"}
                        >
                          <path
                            d="M4.47461 6.10018L5.31543 18.1768C5.40886 19.3365 6.28178 21.5536 8.51889 21.8022C10.756 22.0507 15.2503 21.9951 16.0699 21.9951C16.8895 21.9951 19.0128 21.4136 19.0128 19.0059C19.0128 16.5756 16.9833 15.9419 15.7077 15.9635H12.0554M12.0554 15.9635C12.0607 15.7494 12.1515 15.5372 12.3278 15.3828L14.487 13.4924M12.0554 15.9635C12.0497 16.1919 12.1412 16.4224 12.33 16.5864L14.487 18.4609M19.4701 5.82422L19.0023 13.4792"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M3 5.49561H21M16.0555 5.49561L15.3729 4.08911C14.9194 3.15481 14.6926 2.68766 14.3015 2.39631C14.2148 2.33168 14.1229 2.2742 14.0268 2.22442C13.5937 2 13.0739 2 12.0343 2C10.9686 2 10.4358 2 9.99549 2.23383C9.89791 2.28565 9.80479 2.34547 9.7171 2.41265C9.32145 2.7158 9.10044 3.20004 8.65842 4.16854L8.05273 5.49561"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </button> */}
                    </div>
                  </Table.Cell>
                </Table.Row>
              );
            })}
          </Table.Body>
        </Table>
      </div>
      <Pagination
        current={page}
        onChange={(page) => {
          setSearchParams({ page: String(page) });
        }}
        total={meta?.total || 0}
        pageSize={meta?.per_page || 10}
        showSizeChanger={false}
        showTotal={(total, range) => `${range[0]}-${range[1]} của ${total} mục`}
        align="end"
      />
    </div>
  );
};

export default ListTrashProducts;
