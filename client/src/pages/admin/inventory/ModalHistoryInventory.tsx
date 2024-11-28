import { Modal } from "antd";
import { Table } from "flowbite-react";

type Props = {
  isModalOpenHistory: boolean;
  handleCancelHistory: () => void;
  setIsModalOpenHistory: (isModalOpenHistory: boolean) => void;
};

const ModalHistoryInventory = ({
  isModalOpenHistory,
  handleCancelHistory,
  setIsModalOpenHistory,
}: Props) => {
  return (
    <div>
      <Modal
        open={isModalOpenHistory}
        width={750}
        onCancel={handleCancelHistory}
        footer={[]}
      >
        <div className="space-y-7">
          <div className="flex items-center justify-between gap-5">
            <button
              className="font-medium flex items-center gap-1.5"
              onClick={() => setIsModalOpenHistory(!isModalOpenHistory)}
            >
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
              Lịch sử nhập hàng
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
                {/* {inventorys.length === 0 ? (
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
                              <Table.Cell colSpan={4}>
                                <LoadingOverlay
                                  active={isLoading}
                                  spinner
                                  text="Đang nhập hàng ..."
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
                                    <div className="flex items-center justify-between border-b border-dashed border-[#f1f1f1] pb-3">
                                      <h4 className="font-medium text-secondary">
                                        Nhập thông tin hàng hoá
                                      </h4>
                                      <div className="flex items-center gap-2">
                                        <ConfigProvider
                                          theme={{
                                            token: {
                                              colorPrimary: "#ff9900",
                                            },
                                          }}
                                        >
                                          <Checkbox
                                            checked={
                                              selectedVariantIndices.length ===
                                              fields.length
                                            }
                                            onChange={handleSelectAll}
                                          >
                                            Chọn tất cả
                                          </Checkbox>
                                        </ConfigProvider>
                                      </div>
                                    </div>
                                    <form
                                      action=""
                                      className="space-y-3"
                                      onSubmit={handleSubmit(onImportInventory)}
                                    >
                                      {fields.map((item, index) => {
                                        return (
                                          <div
                                            className="border border-[#f1f1f1] p-3 rounded-md space-y-3 bg-util"
                                            key={item.id}
                                          >
                                            <div className="flex items-center justify-between">
                                              <div className="text-sm flex items-center gap-3">
                                                <ConfigProvider
                                                  theme={{
                                                    token: {
                                                      colorPrimary: "#ff9900",
                                                    },
                                                  }}
                                                >
                                                  <Checkbox
                                                    checked={selectedVariantIndices.includes(
                                                      index
                                                    )}
                                                    onChange={() =>
                                                      handleCheckboxChange(
                                                        index
                                                      )
                                                    }
                                                  />
                                                </ConfigProvider>
                                                <span className="text-primary">
                                                  Phân loại:{" "}
                                                </span>
                                                <p className="text-secondary/50">
                                                  {renderAttributes(
                                                    item.attribute_values
                                                  )}
                                                </p>
                                                <p className="text-primary/85">
                                                  ( SL:{" "}
                                                  {item.quantity +
                                                    watch(
                                                      `variants.${index}.inventoryImports.quantity`
                                                    ) || "rỗng"}{" "}
                                                  )
                                                </p>
                                              </div>
                                              {watch(
                                                `variants.${index}.inventoryImports.quantity`
                                              ) ? (
                                                <button
                                                  type="button"
                                                  onClick={handleSubmit(
                                                    onSave(index)
                                                  )}
                                                  className="bg-primary py-1 text-util px-3 rounded-sm flex items-center gap-1"
                                                >
                                                  <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    viewBox="0 0 24 24"
                                                    className="size-4"
                                                    color={"currentColor"}
                                                    fill={"none"}
                                                  >
                                                    <path
                                                      d="M11 22C10.1818 22 9.40019 21.6698 7.83693 21.0095C3.94564 19.3657 2 18.5438 2 17.1613C2 16.7742 2 10.0645 2 7M11 22L11 11.3548M11 22C11.7248 22 12.293 21.7409 13.5 21.2226M20 7V11"
                                                      stroke="currentColor"
                                                      strokeWidth="1.5"
                                                      strokeLinecap="round"
                                                      strokeLinejoin="round"
                                                    />
                                                    <path
                                                      d="M15 17.5H22M18.5 21L18.5 14"
                                                      stroke="currentColor"
                                                      strokeWidth="1.5"
                                                      strokeLinecap="round"
                                                    />
                                                    <path
                                                      d="M7.32592 9.69138L4.40472 8.27785C2.80157 7.5021 2 7.11423 2 6.5C2 5.88577 2.80157 5.4979 4.40472 4.72215L7.32592 3.30862C9.12883 2.43621 10.0303 2 11 2C11.9697 2 12.8712 2.4362 14.6741 3.30862L17.5953 4.72215C19.1984 5.4979 20 5.88577 20 6.5C20 7.11423 19.1984 7.5021 17.5953 8.27785L14.6741 9.69138C12.8712 10.5638 11.9697 11 11 11C10.0303 11 9.12883 10.5638 7.32592 9.69138Z"
                                                      stroke="currentColor"
                                                      strokeWidth="1.5"
                                                      strokeLinecap="round"
                                                      strokeLinejoin="round"
                                                    />
                                                    <path
                                                      d="M5 12L7 13"
                                                      stroke="currentColor"
                                                      strokeWidth="1.5"
                                                      strokeLinecap="round"
                                                      strokeLinejoin="round"
                                                    />
                                                    <path
                                                      d="M16 4L6 9"
                                                      stroke="currentColor"
                                                      strokeWidth="1.5"
                                                      strokeLinecap="round"
                                                      strokeLinejoin="round"
                                                    />
                                                  </svg>
                                                  Nhập
                                                </button>
                                              ) : (
                                                <button
                                                  type="button"
                                                  onClick={handleSubmit(
                                                    onUpdateVariantProduct(
                                                      index
                                                    )
                                                  )}
                                                  className="bg-primary py-1 text-util px-3 rounded-sm flex items-center gap-1"
                                                >
                                                  <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    viewBox="0 0 24 24"
                                                    className="size-4"
                                                    color={"currentColor"}
                                                    fill={"none"}
                                                  >
                                                    <path
                                                      d="M11 22C10.1818 22 9.40019 21.6698 7.83693 21.0095C3.94564 19.3657 2 18.5438 2 17.1613C2 16.7742 2 10.0645 2 7M11 22L11 11.3548M11 22C11.3404 22 11.6463 21.9428 12 21.8285M20 7V11.5"
                                                      stroke="currentColor"
                                                      strokeWidth="1.5"
                                                      strokeLinecap="round"
                                                      strokeLinejoin="round"
                                                    />
                                                    <path
                                                      d="M18 18.0005L18.9056 17.0949M22 18C22 15.7909 20.2091 14 18 14C15.7909 14 14 15.7909 14 18C14 20.2091 15.7909 22 18 22C20.2091 22 22 20.2091 22 18Z"
                                                      stroke="currentColor"
                                                      strokeWidth="1.5"
                                                      strokeLinecap="round"
                                                      strokeLinejoin="round"
                                                    />
                                                    <path
                                                      d="M7.32592 9.69138L4.40472 8.27785C2.80157 7.5021 2 7.11423 2 6.5C2 5.88577 2.80157 5.4979 4.40472 4.72215L7.32592 3.30862C9.12883 2.43621 10.0303 2 11 2C11.9697 2 12.8712 2.4362 14.6741 3.30862L17.5953 4.72215C19.1984 5.4979 20 5.88577 20 6.5C20 7.11423 19.1984 7.5021 17.5953 8.27785L14.6741 9.69138C12.8712 10.5638 11.9697 11 11 11C10.0303 11 9.12883 10.5638 7.32592 9.69138Z"
                                                      stroke="currentColor"
                                                      strokeWidth="1.5"
                                                      strokeLinecap="round"
                                                      strokeLinejoin="round"
                                                    />
                                                    <path
                                                      d="M5 12L7 13"
                                                      stroke="currentColor"
                                                      strokeWidth="1.5"
                                                      strokeLinecap="round"
                                                      strokeLinejoin="round"
                                                    />
                                                    <path
                                                      d="M16 4L6 9"
                                                      stroke="currentColor"
                                                      strokeWidth="1.5"
                                                      strokeLinecap="round"
                                                      strokeLinejoin="round"
                                                    />
                                                  </svg>
                                                  Cập nhật
                                                </button>
                                              )}
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
                                                min={0}
                                                id="import-price"
                                                className="block text-secondary focus:!border-primary/50 h-[35px] text-sm placeholder-[#00000040] border-t-0 border-r-0 border-l-0 border-b border-[#f1f1f1] rounded-[5px] w-full focus:!shadow-none"
                                              />
                                              <Controller
                                                name={`variants.${index}.inventoryImports.quantity`}
                                                control={control}
                                                defaultValue={0}
                                                render={({
                                                  field: {
                                                    onChange,
                                                    value,
                                                    ...field
                                                  },
                                                }) => (
                                                  <input
                                                    type="number"
                                                    {...field}
                                                    value={value ?? 0}
                                                    onChange={(e) => {
                                                      const inputValue =
                                                        e.target.value;
                                                      const parsedValue =
                                                        inputValue === ""
                                                          ? 0
                                                          : Number(inputValue);
                                                      onChange(parsedValue);
                                                    }}
                                                    min={0}
                                                    placeholder="Số lượng"
                                                    className="block text-secondary focus:!border-primary/50 h-[35px] text-sm placeholder-[#00000040] border-t-0 border-r-0 border-l-0 border-b border-[#f1f1f1] rounded-[5px] w-full focus:!shadow-none"
                                                  />
                                                )}
                                              />
                                              <ConfigProvider
                                                theme={{
                                                  token: {
                                                    colorPrimary: "#ff9900",
                                                  },
                                                  components: {
                                                    Select: {
                                                      colorBorder:
                                                        "transparent",
                                                      colorPrimaryHover:
                                                        "transparent",
                                                    },
                                                  },
                                                }}
                                              >
                                                <Select
                                                  defaultValue={
                                                    item.inventoryImports
                                                      ?.supplier?.id || null
                                                  }
                                                  allowClear
                                                  showSearch
                                                  id={`supplier`}
                                                  style={{
                                                    width: "100%",
                                                    height: "35px",
                                                    border: "none",
                                                    borderBottom:
                                                      "1px solid #f1f1f1",
                                                    boxShadow: "none",
                                                  }}
                                                  placeholder={`Nhà cung cấp`}
                                                  optionFilterProp="label"
                                                  filterSort={(
                                                    optionA,
                                                    optionB
                                                  ) =>
                                                    (optionA?.label ?? "")
                                                      .toLowerCase()
                                                      .localeCompare(
                                                        (
                                                          optionB?.label ?? ""
                                                        ).toLowerCase()
                                                      )
                                                  }
                                                  onChange={(value) => {
                                                    setValue(
                                                      `variants.${index}.inventoryImports.supplier.id`,
                                                      value
                                                    );
                                                  }}
                                                  options={optionsSupplier}
                                                />
                                              </ConfigProvider>
                                              <input
                                                type="text"
                                                placeholder="Giá bán"
                                                {...register(
                                                  `variants.${index}.price`,
                                                  { valueAsNumber: true }
                                                )}
                                                defaultValue={item.price}
                                                min={0}
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
                                              <Controller
                                                name={`variants.${index}.end_sale`}
                                                control={control}
                                                render={({ field }) => (
                                                  <ConfigProvider
                                                    theme={{
                                                      token: {
                                                        colorPrimary: "#ff9900",
                                                        colorInfoHover:
                                                          "#fff5e5",
                                                        controlItemBgActiveHover:
                                                          "#fff5e5",
                                                      },
                                                    }}
                                                  >
                                                    <DatePicker
                                                      placeholder="Sale kết thúc sau"
                                                      showTime
                                                      {...field}
                                                      value={
                                                        field.value
                                                          ? dayjs(field.value)
                                                          : null
                                                      }
                                                      onChange={(date) => {
                                                        field.onChange(
                                                          date
                                                            ? date.toISOString()
                                                            : null
                                                        );
                                                      }}
                                                      className="h-[35px] text-secondary w-full border-t-0 border-r-0 border-l-0 border-b border-[#f1f1f1]"
                                                    />
                                                  </ConfigProvider>
                                                )}
                                              />
                                            </div>
                                          </div>
                                        );
                                      })}
                                      <ButtonSubmit content="Nhập tất cả lựa chọn" />
                                    </form>
                                  </div>
                                </LoadingOverlay>
                              </Table.Cell>
                            </Table.Row>
                          )}
                      </>
                    );
                  })
                )} */}
              </Table.Body>
            </Table>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ModalHistoryInventory;
