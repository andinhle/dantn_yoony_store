import { Avatar, ConfigProvider, Input, Modal } from "antd";
import { Table } from "flowbite-react";
import { useContext, useEffect, useState } from "react";
import instance from "../../../instance/instance";
import { IProduct } from "../../../interfaces/IProduct";
import { Link } from "react-router-dom";
import dayjs from "dayjs";
import { IVariants } from "../../../interfaces/IVariants";
import ButtonSubmit from "../../../components/Admin/ButtonSubmit";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { DatePicker } from "antd";
import { IAttributeValue } from "../../../interfaces/IAttributeValue";
import { LoadingOverlay } from "@achmadk/react-loading-overlay";
type Props = {
  isModalOpen: boolean;
  handleCancel: () => void;
  findNewestUpdateTime: (variants: IVariants[]) => void;
};

type FormValues = {
  variants: (IVariants & {
    supplier_id?: number;
  })[];
};

const ModalInventoryImport = ({
  isModalOpen,
  findNewestUpdateTime,
  handleCancel,
}: Props) => {
  const { Search } = Input;
  const [valSearch, SetValSearch] = useState<string>("");
  const [inventorys, setInventorys] = useState<IProduct[]>([]);
  const [inventoryItem, setInventoryItem] = useState<IVariants[]>([]);
  const [selectedProductId, setSelectedProductId] = useState<number | null>(
    null
  );

  useEffect(() => {
    (async () => {
      try {
        const { data } = await instance.get(`getAllProductNoImport`);
        setInventorys(data.data);
      } catch (error) {
        console.log(error);
      }
    })();
  }, []);

  const { control, handleSubmit, register, setValue, reset } =
    useForm<FormValues>({
      defaultValues: {
        variants: inventoryItem,
      },
    });
  const { fields } = useFieldArray({
    control,
    name: "variants",
  });

  const handleUpdateVariantIventory = (id: number) => {
    const inventoryItem =
      inventorys.find((item) => item.id === id)?.variants || [];

    reset({
      variants: inventoryItem,
    });

    setInventoryItem(inventoryItem);
  };

  const handleToggleVariants = (id: number) => {
    if (selectedProductId === id) {
      setSelectedProductId(null);
    } else {
      setSelectedProductId(id);
      handleUpdateVariantIventory(id);
    }
  };

  useEffect(() => {
    if (inventoryItem.length > 0) {
      setValue("variants", inventoryItem);
    }
  }, [inventoryItem, setValue]);

  const renderAttributes = (attributeValues?: IAttributeValue[]) => {
    if (!attributeValues || !Array.isArray(attributeValues)) {
      return "Không có phân loại";
    }
    return attributeValues
      .map((attr) => {
        return attr.value;
      })
      .join(", ");
  };
  const onSubmit = (data: FormValues) => {
    const updatedVariants = data.variants.map((variant) => {
      return {
        ...variant,
        inventoryImports: {
          ...variant.inventoryImports,
          quantity: variant.inventoryImports.quantity || null,
          import_price: variant.inventoryImports.import_price || null,
        },
        price: variant.price || null,
        sale_price: variant.sale_price || null,
        end_sale: variant.end_sale || null,
      };
    });

    console.log({ variants: updatedVariants });
  };
  return (
    <div>
      <Modal open={isModalOpen} width={750} onCancel={handleCancel} footer={[]}>
        <div className="space-y-7">
          <div className="flex items-center justify-between gap-5">
            <button className="font-medium flex items-center gap-1.5">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                className="size-5"
                color={"currentColor"}
                fill={"none"}
              >
                <path
                  d="M3.99982 11.9998L19.9998 11.9998"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M8.99963 17C8.99963 17 3.99968 13.3176 3.99966 12C3.99965 10.6824 8.99966 7 8.99966 7"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              Nhập hàng
            </button>
            <ConfigProvider
              theme={{
                token: {
                  colorPrimary: "#ff9900",
                },
              }}
            >
              <div className="max-w-[600px]">
                <Search
                  placeholder="Tên hàng hoá"
                  allowClear
                  style={{ width: "300px" }}
                  size="middle"
                  onChange={(e) => {
                    SetValSearch(e.target.value);
                  }}
                />
              </div>
            </ConfigProvider>
            <button className="flex gap-1.5 text-sm items-center text-util bg-[#5EB800] py-2 px-4 rounded-md mr-7">
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
          </div>
          <div className={"min-h-[80vh] overflow-x-auto"}>
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
                <Table.HeadCell className="bg-[#F4F7FA] text-center text-secondary/75 text-sm font-medium capitalize text-nowrap">
                  Giá vốn
                </Table.HeadCell>
                <Table.HeadCell className="bg-[#F4F7FA] text-left text-secondary/75 text-sm font-medium capitalize text-nowrap">
                  Tồn kho
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
                  inventorys.map((inventory, index) => {
                    return (
                      <>
                        <Table.Row
                          className="hover:cursor-pointer"
                          onClick={() => handleToggleVariants(inventory.id!)}
                        >
                          <Table.Cell className="text-center">
                            {index + 1}
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
                            {inventory.import_price_range === "0 - 0"
                              ? "Chưa nhập"
                              : `${inventory.import_price_range}đ`}
                          </Table.Cell>
                          <Table.Cell className="text-center text-nowrap">
                            {inventory.quantity_range}
                          </Table.Cell>
                        </Table.Row>
                        {selectedProductId === inventory.id &&
                          inventoryItem.length !== 0 && (
                            <Table.Row>
                              <Table.Cell colSpan={4} className="px-20">
                                <LoadingOverlay
                                  active={false}
                                  spinner
                                  text="Đang cập nhật ..."
                                  styles={{
                                    overlay: (base) => ({
                                      ...base,
                                      background: "rgba(255, 255, 255, 0.75)",
                                      backdropFilter: "blur(4px)",
                                    }),
                                    spinner: (base) => ({
                                      ...base,
                                      width: "40px",
                                      "& svg circle": {
                                        stroke: "rgba(255, 153, 0,5)",
                                        strokeWidth: "3px",
                                      },
                                    }),
                                  }}
                                >
                                  <div className="border border-[#f1f1f1] rounded-md p-3 space-y-4">
                                    <h4 className="font-medium text-secondary border-b border-dashed border-[#f1f1f1] pb-3">
                                      Nhập thông tin hàng hoá
                                    </h4>
                                    <form
                                      action=""
                                      className="space-y-3"
                                      onSubmit={handleSubmit(onSubmit)}
                                    >
                                      {fields.map((item, index) => {
                                        return (
                                          <div
                                            className="border border-[#f1f1f1] p-3 rounded-md space-y-3 bg-util"
                                            key={item.id}
                                          >
                                            <div className="flex items-center justify-between">
                                              <div className="text-sm flex items-center gap-1">
                                                <span className="text-primary">
                                                  Phân loại:{" "}
                                                </span>
                                                <p className="text-secondary/50">
                                                  {renderAttributes(
                                                    item.attribute_values
                                                  )}
                                                </p>
                                              </div>
                                              <button className="bg-primary py-1 text-util px-3 rounded-sm flex items-center gap-1">
                                                <svg
                                                  xmlns="http://www.w3.org/2000/svg"
                                                  viewBox="0 0 24 24"
                                                  className="size-4"
                                                  color={"currentColor"}
                                                  fill={"none"}
                                                >
                                                  <path
                                                    d="M3 17.9808V12.7075C3 9.07416 3 7.25748 4.09835 6.12874C5.1967 5 6.96447 5 10.5 5C14.0355 5 15.8033 5 16.9017 6.12874C18 7.25748 18 9.07416 18 12.7075V17.9808C18 20.2867 18 21.4396 17.2755 21.8523C15.8724 22.6514 13.2405 19.9852 11.9906 19.1824C11.2657 18.7168 10.9033 18.484 10.5 18.484C10.0967 18.484 9.73425 18.7168 9.00938 19.1824C7.7595 19.9852 5.12763 22.6514 3.72454 21.8523C3 21.4396 3 20.2867 3 17.9808Z"
                                                    stroke="currentColor"
                                                    strokeWidth="1.5"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                  />
                                                  <path
                                                    d="M9 2H11C15.714 2 18.0711 2 19.5355 3.46447C21 4.92893 21 7.28595 21 12V18"
                                                    stroke="currentColor"
                                                    strokeWidth="1.5"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                  />
                                                </svg>
                                                Lưu
                                              </button>
                                            </div>

                                            <div className="grid grid-cols-3 gap-3">
                                              <input
                                                type="number"
                                                placeholder="Giá nhập"
                                                {...register(
                                                  `variants.${index}.inventoryImports.import_price`,
                                                  { valueAsNumber: true }
                                                )}
                                                defaultValue={
                                                  item.inventoryImports
                                                    ?.import_price
                                                }
                                                id="import-price"
                                                className="block text-secondary focus:!border-primary/50 h-[35px] text-sm placeholder-[#00000040] border-t-0 border-r-0 border-l-0 border-b border-[#f1f1f1] rounded-[5px] w-full focus:!shadow-none"
                                              />
                                              <input
                                                type="number"
                                                placeholder="Số lượng"
                                                {...register(
                                                  `variants.${index}.inventoryImports.quantity`,
                                                  { valueAsNumber: true }
                                                )}
                                                defaultValue={
                                                  item.inventoryImports
                                                    ?.quantity
                                                }
                                                id="import-stock"
                                                className="block text-secondary focus:!border-primary/50 h-[35px] text-sm placeholder-[#00000040] border-t-0 border-r-0 border-l-0 border-b border-[#f1f1f1] rounded-[5px] w-full focus:!shadow-none"
                                              />
                                              <input
                                                type="text"
                                                placeholder="Nhà cung cấp"
                                                id="supplier"
                                                className="block text-secondary focus:!border-primary/50 h-[35px] text-sm placeholder-[#00000040] border-t-0 border-r-0 border-l-0 border-b border-[#f1f1f1] rounded-[5px] w-full focus:!shadow-none"
                                              />
                                              <input
                                                type="text"
                                                placeholder="Giá bán"
                                                {...register(
                                                  `variants.${index}.price`,
                                                  { valueAsNumber: true }
                                                )}
                                                defaultValue={item.price}
                                                id="sell-price"
                                                className="block text-secondary focus:!border-primary/50 h-[35px] text-sm placeholder-[#00000040] border-t-0 border-r-0 border-l-0 border-b border-[#f1f1f1] rounded-[5px] w-full focus:!shadow-none"
                                              />
                                              <input
                                                type="text"
                                                placeholder="Giá sale"
                                                {...register(
                                                  `variants.${index}.sale_price`,
                                                  { valueAsNumber: true }
                                                )}
                                                defaultValue={item.sale_price}
                                                id="sale-price"
                                                className="block text-secondary focus:!border-primary/50 h-[35px] text-sm placeholder-[#00000040] border-t-0 border-r-0 border-l-0 border-b border-[#f1f1f1] rounded-[5px] w-full focus:!shadow-none"
                                              />
                                              <ConfigProvider
                                                theme={{
                                                  token: {
                                                    colorPrimary: "#ff9900",
                                                    colorInfoHover: "#fff5e5",
                                                    controlItemBgActiveHover:
                                                      "#fff5e5",
                                                  },
                                                }}
                                              >
                                                <DatePicker
                                                  placeholder="Sale kết thúc sau"
                                                  showTime
                                                  {...register(
                                                    `variants.${index}.end_sale`
                                                  )}
                                                  defaultValue={
                                                    item.end_sale
                                                      ? dayjs(item.end_sale)
                                                      : null
                                                  }
                                                  className="h-[35px] text-secondary w-full border-t-0 border-r-0 border-l-0 border-b border-[#f1f1f1]"
                                                />
                                              </ConfigProvider>
                                            </div>
                                          </div>
                                        );
                                      })}
                                      <ButtonSubmit content="Cập nhật" />
                                    </form>
                                  </div>
                                </LoadingOverlay>
                              </Table.Cell>
                            </Table.Row>
                          )}
                      </>
                    );
                  })
                )}
              </Table.Body>
            </Table>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ModalInventoryImport;
