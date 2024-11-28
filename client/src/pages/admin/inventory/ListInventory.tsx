import { Avatar, Checkbox, ConfigProvider, Input, Modal, Pagination } from "antd";
import type { CheckboxProps } from "antd";
import { Table } from "flowbite-react";
import { useContext, useEffect, useState } from "react";
import InventoryContext from "../../../contexts/InventoryContext";
import instance from "../../../instance/instance";
import dayjs from "dayjs";
import { IVariants } from "../../../interfaces/IVariants";
import { Link, useSearchParams } from "react-router-dom";
import { IMeta } from "../../../interfaces/IMeta";
import ModalInventoryImport from "./ModalInventoryImport";
const plainOptionsCategory = ["Apple", "Pear", "Orange"];
const plainOptionsInventory = [
  "Dưới định mức tồn (SL: 50)",
  "Vượt định mức tồn (SL: 500)",
  "Còn hàng trong kho",
  "Hết hàng trong kho",
];
const ListInventory = () => {
  const [valSearch, SetValSearch] = useState<string>("");
  const { Search } = Input;
  const [checkedListCategory, setCheckedListCategory] = useState<string[]>([]);
  const [checkedListInventory, setCheckedListInventory] = useState<string[]>(
    []
  );
  const [searchParams, setSearchParams] = useSearchParams();
  const page = parseInt(searchParams.get("page") || "1");
  const [meta, setMeta] = useState<IMeta>();

  const { inventorys, dispatch } = useContext(InventoryContext);

  const onChangeCategories = (list: string[]) => {
    setCheckedListCategory(list);
  };
  const onChangeInventory = (list: string[]) => {
    setCheckedListInventory(list);
  };

  const checkAll = plainOptionsInventory.length === checkedListInventory.length;
  const indeterminate =
    checkedListInventory.length > 0 &&
    checkedListInventory.length < plainOptionsInventory.length;

  const onCheckAllChange: CheckboxProps["onChange"] = (e) => {
    setCheckedListInventory(e.target.checked ? plainOptionsInventory : []);
  };

  // list danh sách nhập hàng rồi
  useEffect(() => {
    (async () => {
      try {
        setSearchParams({ page: String(page) });
        const { data } = await instance.get(
          `productsWithInventoryImports?page=${page}`
        );

        if (data) {
          dispatch({
            type: "LIST",
            payload: data.data,
          });
          setMeta(data.meta);
        }
      } catch (error) {
        console.log(error);
      }
    })();
  }, [page]);

  function findNewestUpdateTime(variants: IVariants[]): string | null {
    let newestUpdate = "";

    variants.forEach((variant) => {
      const updatedAt = variant.updated_at;
      if (!newestUpdate || updatedAt > newestUpdate) {
        newestUpdate = updatedAt;
      }
    });

    return newestUpdate || null;
  }

  const [isModalOpen, setIsModalOpen] = useState(false);

  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="grid grid-cols-12 gap-5 min-h-screen">
      <div className="col-span-3 bg-util rounded-md p-5 space-y-8">
        <div className="space-y-2">
          <h3 className="text-sm font-medium">Tìm kiếm</h3>
          <ConfigProvider
            theme={{
              token: {
                colorPrimary: "#ff9900",
              },
            }}
          >
            <Search
              placeholder="Tên hàng hoá"
              allowClear
              size="middle"
              onChange={(e) => {
                SetValSearch(e.target.value);
              }}
            />
          </ConfigProvider>
        </div>
        <div className="space-y-2">
          <h3 className="text-sm font-medium">Nhóm hàng</h3>
          <ConfigProvider theme={{ token: { colorPrimary: "#ff9900" } }}>
            <Checkbox.Group
              options={plainOptionsCategory}
              onChange={onChangeCategories}
              value={checkedListCategory}
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 5,
              }}
            />
          </ConfigProvider>
        </div>
        <div className="space-y-2">
          <h3 className="text-sm font-medium">Tồn kho</h3>
          <ConfigProvider theme={{ token: { colorPrimary: "#ff9900" } }}>
            <Checkbox
              indeterminate={indeterminate}
              onChange={onCheckAllChange}
              checked={checkAll}
            >
              Tất cả
            </Checkbox>
            <Checkbox.Group
              options={plainOptionsInventory}
              onChange={onChangeInventory}
              value={checkedListInventory}
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 5,
              }}
            />
          </ConfigProvider>
        </div>
      </div>
      <div className="col-span-9 bg-util rounded-md p-5 space-y-5">
        <div className="flex justify-between items-center">
          <h2 className="font-medium text-lg">Hàng hoá</h2>
          <div className="flex items-center gap-2.5">
            <button className="flex gap-1.5 text-sm items-center text-util bg-primary py-2 px-4 rounded-md" onClick={showModal}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                className="size-5"
                color={"currentColor"}
                fill={"none"}
              >
                <path
                  d="M12 4V20M20 12H4"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              Thêm mới
            </button>
            <button className="flex gap-1.5 text-sm items-center text-util bg-[#5EB800] py-2 px-4 rounded-md">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                className="size-5"
                color={"currentColor"}
                fill={"none"}
              >
                <path
                  d="M12 4.5L12 14.5M12 4.5C11.2998 4.5 9.99153 6.4943 9.5 7M12 4.5C12.7002 4.5 14.0085 6.4943 14.5 7"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M20 16.5C20 18.982 19.482 19.5 17 19.5H7C4.518 19.5 4 18.982 4 16.5"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              Nhập Excel
            </button>
            <button className="flex gap-1.5 text-sm items-center text-util bg-secondary/75 py-2 px-4 rounded-md">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                className="size-5"
                color={"currentColor"}
                fill={"none"}
              >
                <path
                  d="M12 15L12 5M12 15C11.2998 15 9.99153 13.0057 9.5 12.5M12 15C12.7002 15 14.0085 13.0057 14.5 12.5"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M5 19H19.0001"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              Xuất file
            </button>
          </div>
        </div>
        <div className="overflow-x-auto ">
          <Table className="border-b border-[#E4E7EB]">
            <Table.Head className="text-center">
              <Table.HeadCell
                style={{
                  width: "5%",
                }}
                className="bg-[#F4F7FA] text-left text-secondary/75 text-sm font-medium capitalize text-nowrap"
              >
                STT
              </Table.HeadCell>
              <Table.HeadCell className="bg-[#F4F7FA] text-left text-secondary/75 text-sm font-medium capitalize text-nowrap">
                Hàng hoá
              </Table.HeadCell>
              <Table.HeadCell className="bg-[#F4F7FA] text-left text-secondary/75 text-sm font-medium capitalize text-nowrap">
                Giá bán
              </Table.HeadCell>
              <Table.HeadCell className="bg-[#F4F7FA] text-left text-secondary/75 text-sm font-medium capitalize text-nowrap">
                Giá vốn
              </Table.HeadCell>
              <Table.HeadCell className="bg-[#F4F7FA] text-left text-secondary/75 text-sm font-medium capitalize text-nowrap">
                Tồn kho
              </Table.HeadCell>
              <Table.HeadCell
                className="bg-[#F4F7FA] text-secondary/75 text-sm font-medium capitalize text-nowrap"
                style={{
                  width: "20%",
                }}
              >
                Hành động
              </Table.HeadCell>
            </Table.Head>
            <Table.Body className="divide-y">
              {inventorys.length === 0 ? (
                <Table.Row>
                  <Table.Cell colSpan={6}>
                    <div className="flex flex-col items-center text-secondary/20 space-y-2 justify-center min-h-[50vh]">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="size-16"
                        viewBox="0 0 64 41"
                      >
                        <g
                          fill="none"
                          fillRule="evenodd"
                          transform="translate(0 1)"
                        >
                          <ellipse
                            cx="32"
                            cy="33"
                            fill="#f5f5f5"
                            rx="32"
                            ry="7"
                          ></ellipse>
                          <g fillRule="nonzero" stroke="#d9d9d9">
                            <path d="M55 12.76L44.854 1.258C44.367.474 43.656 0 42.907 0H21.093c-.749 0-1.46.474-1.947 1.257L9 12.761V22h46v-9.24z"></path>
                            <path
                              fill="#fafafa"
                              d="M41.613 15.931c0-1.605.994-2.93 2.227-2.931H55v18.137C55 33.26 53.68 35 52.05 35h-40.1C10.32 35 9 33.259 9 31.137V13h11.16c1.233 0 2.227 1.323 2.227 2.928v.022c0 1.605 1.005 2.901 2.237 2.901h14.752c1.232 0 2.237-1.308 2.237-2.913v-.007z"
                            ></path>
                          </g>
                        </g>
                      </svg>
                      <p>Không có hàng hoá nào</p>
                    </div>
                  </Table.Cell>
                </Table.Row>
              ) : (
                inventorys.map((inventory) => {
                  return (
                    <Table.Row>
                      <Table.Cell className="text-center">
                        {inventory.id}
                      </Table.Cell>
                      <Table.Cell className="text-center">
                        <div className="flex gap-2.5">
                          <Avatar
                            shape="square"
                            src={inventory.images[0]}
                            size={45}
                          />
                          <div className="max-w-[300px] space-y-0.5">
                            <Link
                              to={`/${inventory.category?.slug}/${inventory.slug}`}
                              className="text-left hover:text-primary/90 font-medium text-nowrap text-ellipsis overflow-hidden"
                            >
                              {inventory.name}
                            </Link>
                            <p className="text-left text-nowrap text-ellipsis overflow-hidden text-sm text-secondary/50">
                              Cập nhật:{" "}
                              <span className="text-primary/75">
                                {dayjs(
                                  findNewestUpdateTime(inventory.variants)
                                ).format("DD-MM-YYYY")}
                              </span>
                            </p>
                          </div>
                        </div>
                      </Table.Cell>
                      <Table.Cell className="text-center text-nowrap">
                        {inventory.price_range}đ
                      </Table.Cell>
                      <Table.Cell className="text-center text-nowrap">
                        {inventory.import_price_range}đ
                      </Table.Cell>
                      <Table.Cell className="text-center text-nowrap">
                        {inventory.quantity_range}
                      </Table.Cell>
                      <Table.Cell className="text-center text-nowrap">
                        <div className="flex gap-2 justify-center">
                          <button className="bg-util shadow py-2 px-3 rounded-md">
                            <svg
                              className="size-5"
                              fill="none"
                              viewBox="0 0 20 20"
                            >
                              <path
                                stroke="#1FD178"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeMiterlimit="10"
                                strokeWidth="1.5"
                                d="M11.05 3l-6.842 7.242c-.258.275-.508.816-.558 1.191l-.308 2.7c-.109.975.591 1.642 1.558 1.475l2.683-.458c.375-.067.9-.342 1.159-.625l6.841-7.242c1.184-1.25 1.717-2.675-.125-4.416C13.625 1.142 12.233 1.75 11.05 3zM9.908 4.208A5.105 5.105 0 0014.45 8.5M2.5 18.333h15"
                              ></path>
                            </svg>
                          </button>
                        </div>
                      </Table.Cell>
                    </Table.Row>
                  );
                })
              )}
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
          showTotal={(total, range) =>
            `${range[0]}-${range[1]} của ${total} mục`
          }
          align="end"
        />
      </div>
      <ModalInventoryImport isModalOpen={isModalOpen} findNewestUpdateTime={findNewestUpdateTime} handleCancel={handleCancel}  />
    </div>
  );
};

export default ListInventory;
