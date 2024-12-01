import { Avatar, ConfigProvider, Input, Modal, Select } from "antd";
import { Table } from "flowbite-react";
import React, { useContext, useEffect, useState } from "react";
import instance from "../../../instance/instance";
import { IProduct } from "../../../interfaces/IProduct";
import { Link, useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import { IVariants } from "../../../interfaces/IVariants";
import ButtonSubmit from "../../../components/Admin/ButtonSubmit";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { DatePicker } from "antd";
import { IAttributeValue } from "../../../interfaces/IAttributeValue";
import { LoadingOverlay } from "@achmadk/react-loading-overlay";
import { Checkbox } from "antd";
import { toast } from "react-toastify";
import * as XLSX from "xlsx";
import slugify from "react-slugify";
type Props = {
  isModalOpen: boolean;
  handleCancel: () => void;
  findNewestUpdateTime: (variants: IVariants[]) => void;
  setIsModalOpen: (isModalOpen: boolean) => void;
  idProduct:number
  isModalOpenShowDetail:boolean
};

type FormValues = {
  variants: IVariants[];
};

const ModalInventoryImport = ({
  isModalOpen,
  findNewestUpdateTime,
  handleCancel,
  setIsModalOpen,
  idProduct,
  isModalOpenShowDetail
}: Props) => {
  const { Search } = Input;
  const [valSearch, SetValSearch] = useState<string>("");
  const [inventorys, setInventorys] = useState<IProduct[]>([]);
  const [inventoryItem, setInventoryItem] = useState<IVariants[]>([]);
  const [selectedProductId, setSelectedProductId] = useState<number | null>(
    null
  );
  // const { inventorys, dispatch } = useContext(InventoryContext);
  const [optionsSupplier, setOptionsSupplier] = useState([]);
  const [selectedVariantIndices, setSelectedVariantIndices] = useState<
    number[]
  >([]);
  const [isExpandAll, setIsExpandAll] = useState(false);

  const [isLoading, setLoading] = useState<boolean>(false);
  const [selectedVariants, setSelectedVariants] = useState<IVariants[]>([]);

  const handleCheckboxChange = (index: number) => {
    setSelectedVariantIndices((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };
  const handleSelectAll = () => {
    if (selectedVariantIndices.length === fields.length) {
      setSelectedVariantIndices([]);
    } else {
      setSelectedVariantIndices(fields.map((_, index) => index));
    }
  };
  const fetchSuppliers = async () => {
    try {
      const {
        data: {
          data: { data: response },
        },
      } = await instance.get("suppliers");
      return response.map((supplier) => ({
        label: supplier.name,
        value: supplier.id,
      }));
    } catch (error) {
      console.error("Error fetching suppliers:", error);
      return [];
    }
  };

  useEffect(() => {
    const loadSuppliers = async () => {
      const suppliers = await fetchSuppliers();
      setOptionsSupplier(suppliers);
    };
    loadSuppliers();
  }, []);

  const fetchNoInventory = async () => {
    try {
      const { data } = await instance.get(`getAllProductNoImport`);
      setInventorys(data.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchNoInventory();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const {data:{data:response}} = await instance.get(`import-detail/${idProduct}`);
        
        // Đặt inventorys và chọn sản phẩm
        setInventorys([response]);
        setSelectedProductId(response.id);
        
        // Cập nhật variants và mở rộng
        if (response && response.variants && response.variants.length > 0) {
          setInventoryItem(response.variants);
          
          // Reset form với variants mới
          reset({
            variants: response.variants,
          });
        }
      } catch (error) {
        console.log(error);
        // Reset state nếu fetch lỗi
        setInventorys([]);
        setInventoryItem([]);
        setSelectedProductId(null);
      }
    };
  
    // Kiểm tra điều kiện để fetch
    if (idProduct && (isModalOpen || isModalOpenShowDetail)) {
      fetchData();
    } else {
      setSelectedProductId(null);
    }
  }, [idProduct, isModalOpen, isModalOpenShowDetail]);

  const { control, handleSubmit, register, setValue, reset, watch } = useForm<FormValues>({
    defaultValues: {
      variants: inventoryItem.map((item) => {
        const modifiedItem = { ...item };
        if (modifiedItem.inventoryImports && !isExpandAll) {
          modifiedItem.inventoryImports.quantity = 0;
        }
        return modifiedItem;
      }),
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

  const onSave = (index: number) => async (data: FormValues) => {
    setLoading(true);
    const variant = data.variants[index];
    try {
      const savedVariantData = {
        variant_id: variant.id,
        supplier_id: variant.inventoryImports?.supplier?.id || null,
        price: variant.price || null,
        sale_price: variant.sale_price || null,
        end_sale: variant.end_sale
          ? dayjs(variant.end_sale).format("YYYY-MM-DD HH:mm:ss")
          : null,
        quantity: variant.inventoryImports?.quantity || null,
        import_price: variant.inventoryImports?.import_price || null,
      };
      const { data } = await instance.post("import-orders", {
        variants: [savedVariantData],
      });
      if (data) {
        toast.success("Nhập vào kho thành công !");
        await fetchNoInventory();
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const onUpdateVariantProduct =
    (index: number) => async (data: FormValues) => {
      setLoading(true);
      const variant = data.variants[index];
      try {
        const savedVariantData = {
          variant_id: variant.id,
          supplier_id: variant.inventoryImports?.supplier?.id || null,
          price: variant.price || null,
          sale_price: variant.sale_price || null,
          end_sale: variant.end_sale
            ? dayjs(variant.end_sale).format("YYYY-MM-DD HH:mm:ss")
            : null,
          import_price: variant.inventoryImports?.import_price || null,
        };
        const { data } = await instance.put("updateVariant", {
          variants: [savedVariantData],
        });
        if (data) {
          toast.success("Cập nhật thành công !");
          await fetchNoInventory();
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

  // Hàm kiểm tra xem một variant đã được chọn chưa
  const isVariantSelected = (variant: IVariants) => {
    return selectedVariants.some((v) => v.id === variant.id);
  };

  // Hàm chọn/bỏ chọn tất cả variants của một nhóm
  const handleGroupSelect = (variants: IVariants[]) => {
    const allSelected = variants.every((v) => isVariantSelected(v));

    if (allSelected) {
      // Bỏ chọn tất cả variants trong nhóm
      setSelectedVariants((prev) =>
        prev.filter((v) => !variants.some((gv) => gv.id === v.id))
      );
    } else {
      // Chọn tất cả variants trong nhóm
      setSelectedVariants((prev) => {
        // Loại bỏ các variants đã chọn trong nhóm này
        const filteredPrev = prev.filter(
          (v) => !variants.some((gv) => gv.id === v.id)
        );
        // Thêm tất cả variants mới
        return [...filteredPrev, ...variants];
      });
    }
  };

  // Hàm chọn/bỏ chọn tất cả variants
  const handleSelectAllVariants = () => {
    const allVariants = inventorys.flatMap((product) => product.variants);

    if (selectedVariants.length === allVariants.length) {
      // Bỏ chọn tất cả
      setSelectedVariants([]);
    } else {
      // Chọn tất cả
      setSelectedVariants(allVariants);
    }
  };
  // Hàm xử lý nhập kho cho các variant đã chọn
  const handleImportSelectedVariants = async () => {
    if (selectedVariants.length === 0) {
      toast.warning("Vui lòng chọn ít nhất một variant.");
      return;
    }
  
    setLoading(true);
    try {
      // Lọc các variant phải có đủ thông tin
      const importVariants = selectedVariants.filter(variant => 
        variant.inventoryImports?.import_price && 
        variant.price && 
        variant.inventoryImports?.quantity && 
        variant.inventoryImports?.supplier?.id
      ).map((variant) => ({
        variant_id: variant.id,
        supplier_id: variant.inventoryImports?.supplier?.id || null,
        price: variant.price || null,
        sale_price: variant.sale_price || null,
        quantity: variant.inventoryImports?.quantity || null,
        end_sale: variant.end_sale
          ? dayjs(variant.end_sale).format("YYYY-MM-DD")
          : null,
        import_price: variant.inventoryImports?.import_price || null,
      }));
  
      // Kiểm tra số lượng variant hợp lệ
      if (importVariants.length === 0) {
        toast.warning("Không có variant nào đủ thông tin để nhập kho.");
        return;
      }
  
      const { data } = await instance.post("import-multiple-orders", {
        variants: importVariants,
      });
  
      if (data) {
        // Thông báo số lượng variant được nhập
        toast.success(`Nhập kho thành công ${importVariants.length} biến thể!`);
        await fetchNoInventory();
        window.location.reload();
      }
    } catch (error) {
      console.error("Lỗi nhập kho:", error);
      toast.error("Có lỗi xảy ra khi nhập kho.");
    } finally {
      setLoading(false);
    }
  };

  const onImportInventory = async (dataForm: FormValues) => {
    setLoading(true);
    try {
      const updatedVariants = dataForm.variants
        .filter((_, index) => selectedVariantIndices.includes(index))
        .map((variant) => {
          return {
            variant_id: variant.id,
            supplier_id: variant.inventoryImports?.supplier?.id || null,
            price: variant.price || null,
            sale_price: variant.sale_price || null,
            quantity: variant.inventoryImports?.quantity || null,
            end_sale: variant.end_sale
              ? dayjs(variant.end_sale).format("YYYY-MM-DD")
              : null,
            import_price: variant.inventoryImports?.import_price || null,
          };
        });
      console.log({ variants: updatedVariants });
      const { data } = await instance.post("import-multiple-orders", {
        variants: updatedVariants,
      });
      if (data) {
        toast.success("Nhập tất cả vào kho thành công !");
        await fetchNoInventory();
        window.location.reload();
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleImportExcel = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const workbook = XLSX.read(e.target?.result, { type: "binary" });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];

        // Chuyển đổi dữ liệu Excel thành mảng JSON
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

        // Xử lý dữ liệu để tạo inventorys và inventoryItem
        const processedInventorys = processExcelData(jsonData);

        // KHÔNG gộp sản phẩm, giữ nguyên mảng
        setInventorys(processedInventorys);
        setIsExpandAll(true);

        // Lấy variants từ processedInventorys
        const allVariants = processedInventorys.flatMap(
          (product) => product.variants
        );
        setInventoryItem(allVariants);
        setSelectedProductId(processedInventorys[0]?.id || null);

        toast.success("Import Excel thành công!");
      } catch (error) {
        console.error("Lỗi khi đọc file Excel:", error);
        toast.error("Có lỗi xảy ra khi import Excel");
      }
    };

    reader.readAsBinaryString(file);
  }

  const processExcelData = (data: any[]): IProduct[] => {
    const headers = data[0];
    const processedData: IProduct[] = [];
    const productColumns = {
      id: headers.indexOf("ID Sản Phẩm"),
      name: headers.indexOf("Tên Sản Phẩm"),
      slug: headers.indexOf("Slug"),
      images: headers.indexOf("Hình Ảnh"),
    };

    const variantColumns = {
      id: headers.indexOf("ID Variant"),
      price: headers.indexOf("Giá Bán"),
      salePrice: headers.indexOf("Giá Sale"),
      quantity: headers.indexOf("Số Lượng Tồn"),
      inventoryImportPrice: headers.indexOf("Giá Nhập"),
      inventoryImportQuantity: headers.indexOf("Số Lượng Nhập"),
      supplierId: headers.indexOf("Nhà Cung Cấp ID"),
    };

    
    const dynamicAttributeColumns = headers.reduce((acc, header, index) => {
      const match = header.match(/^(.*) \(Tên\)$/);
      if (match) {
        const attributeName = match[1];
        acc.push({
          name: attributeName,
          nameIndex: index,
          valueIndex: headers.findIndex(
            (h) => h === `${attributeName} (Giá Trị)`
          ),
        });
      }
      return acc;
    }, [] as Array<{ name: string; nameIndex: number; valueIndex: number }>);

    // Bắt đầu từ hàng thứ 2 (index 1)
    for (let i = 1; i < data.length; i++) {
      const rowData = data[i];
      // Kiểm tra nếu dòng rỗng
      if (rowData.every((cell) => cell == null || cell === "")) continue;

      // Tạo sản phẩm mới cho mỗi dòng
      const product: IProduct = {
        id: rowData[productColumns.id],
        name: rowData[productColumns.name],
        slug:
          rowData[productColumns.slug] || slugify(rowData[productColumns.name]),
        images: [rowData[productColumns.images]],
        variants: [],
      };

      // Tạo variant
      const variant: IVariants = {
        id: rowData[variantColumns.id],
        price: rowData[variantColumns.price],
        sale_price: rowData[variantColumns.salePrice],
        quantity: rowData[variantColumns.quantity] || 0,
        attribute_values: dynamicAttributeColumns.map((attr) => ({
          id: null,
          value: rowData[attr.valueIndex],
          attribute: {
            id: null,
            name: attr.name,
            slug: slugify(attr.name),
            type: attr.name.toLowerCase() === "color" ? "color" : "button",
          },
        })),
        inventoryImports: {
          import_price: rowData[variantColumns.inventoryImportPrice],
          quantity: rowData[variantColumns.inventoryImportQuantity] || 0,
          supplier: {
            id: rowData[variantColumns.supplierId],
          },
        },
      };
      console.log('Headers:', processedData);
      // Thêm variant vào sản phẩm
      product.variants.push(variant);

      // Thêm sản phẩm vào mảng
      processedData.push(product);
    }

    return processedData;
  };

  const modalWidth = isExpandAll ? 1240 : 750;
  return (
    <div>
      <Modal
        open={isModalOpen || isModalOpenShowDetail}
        width={modalWidth}
        onCancel={handleCancel}
        footer={[]}
      >
        <div className="space-y-7">
          <div className="flex items-center justify-between gap-5">
            <button
              className="font-medium flex items-center gap-1.5"
              onClick={()=>{
                setIsModalOpen(!isModalOpen)
              }}
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
                  style={{ width: "300px"}}
                  size="middle"
                  onChange={(e) => {
                    SetValSearch(e.target.value);
                  }}
                />
              </div>
            </ConfigProvider>
            <button className="flex gap-1.5 hover:cursor-pointer relative text-sm items-center text-util bg-[#5EB800] overflow-hidden py-2 px-4 rounded-md mr-10">
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
              <input
                type="file"
                accept=".xlsx,.xls"
                className="opacity-0 absolute flex top-0 left-0 right-0 bottom-0 hover:cursor-pointer"
                onChange={handleImportExcel}
              />
              Nhập Excel
            </button>
          </div>
          <div className={"min-h-[80vh] overflow-x-auto"}>
            {!isExpandAll ? (
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
                                        onSubmit={handleSubmit(
                                          onImportInventory
                                        )}
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
                                                  className="block text-secondary focus:!border-primary/50 h-[35px] text-sm placeholder-[#00000040] border-[#f1f1f1] rounded-[5px] w-full focus:!shadow-none"
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
                                                            : Number(
                                                                inputValue
                                                              );
                                                        onChange(parsedValue);
                                                      }}
                                                      min={0}
                                                      placeholder="Số lượng"
                                                      className="block text-secondary focus:!border-primary/50 h-[35px] text-sm placeholder-[#00000040] border-[#f1f1f1] rounded-[5px] w-full focus:!shadow-none"
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
                                                          "#f1f1f1",
                                                        colorPrimaryHover:
                                                          "#f1f1f1",
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
                                                  className="block text-secondary focus:!border-primary/50 h-[35px] text-sm placeholder-[#00000040] border-[#f1f1f1] rounded-[5px] w-full focus:!shadow-none"
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
                                                  className="block text-secondary focus:!border-primary/50 h-[35px] text-sm placeholder-[#00000040] border-[#f1f1f1] rounded-[5px] w-full focus:!shadow-none"
                                                />
                                                <Controller
                                                  name={`variants.${index}.end_sale`}
                                                  control={control}
                                                  render={({ field }) => (
                                                    <ConfigProvider
                                                      theme={{
                                                        token: {
                                                          colorPrimary:
                                                            "#ff9900",
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
                                                        className="h-[35px] text-secondary w-full border-[#f1f1f1]"
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
                  )}
                </Table.Body>
              </Table>
            ) : (
              <>
                {/* Nút chọn tất cả và nhập kho */}
                <div className="flex items-center gap-3 mb-4">
                  <ConfigProvider
                    theme={{
                      token: {
                        colorPrimary: "#ff9900",
                      },
                    }}
                  >
                    <Checkbox
                      checked={
                        inventorys.flatMap((p) => p.variants).length ===
                        selectedVariants.length
                      }
                      onChange={handleSelectAllVariants}
                    >
                      Chọn tất cả
                    </Checkbox>
                  </ConfigProvider>
                  {selectedVariants.length > 0 && (
                    <button onClick={handleImportSelectedVariants} className="bg-primary text-util py-1.5 rounded-sm px-3.5">
                      Nhập kho ({selectedVariants.length} biến thể)
                    </button>
                  )}
                </div>
                <Table className="border-b border-[#E4E7EB]">
                  <Table.Head className="text-center">
                    <Table.HeadCell className="bg-[#F4F7FA] text-left text-secondary/75 text-sm font-medium capitalize text-nowrap"></Table.HeadCell>
                    <Table.HeadCell className="bg-[#F4F7FA] text-left text-secondary/75 text-sm font-medium capitalize text-nowrap">
                      ID
                    </Table.HeadCell>
                    <Table.HeadCell className="bg-[#F4F7FA] text-left text-secondary/75 text-sm font-medium capitalize text-nowrap">
                      Tên Sản Phẩm
                    </Table.HeadCell>
                    <Table.HeadCell className="bg-[#F4F7FA] text-left text-secondary/75 text-sm font-medium capitalize text-nowrap">
                      Hình Ảnh
                    </Table.HeadCell>
                    <Table.HeadCell className="bg-[#F4F7FA] text-center text-secondary/75 text-sm font-medium capitalize text-nowrap">
                      ID Variant
                    </Table.HeadCell>

                    {/* Render động các thuộc tính */}
                    {inventoryItem.length > 0 &&
                      inventoryItem[0].attribute_values.map((attr, index) => (
                        <Table.HeadCell
                          key={index}
                          className="bg-[#F4F7FA] text-center text-secondary/75 text-sm font-medium capitalize text-nowrap"
                        >
                          {attr.attribute.name}
                        </Table.HeadCell>
                      ))}

                    <Table.HeadCell className="bg-[#F4F7FA] text-left text-secondary/75 text-sm font-medium capitalize text-nowrap">
                      Giá Bán
                    </Table.HeadCell>
                    <Table.HeadCell className="bg-[#F4F7FA] text-left text-secondary/75 text-sm font-medium capitalize text-nowrap">
                      Giá Sale
                    </Table.HeadCell>
                    <Table.HeadCell className="bg-[#F4F7FA] text-left text-secondary/75 text-sm font-medium capitalize text-nowrap">
                      Số Lượng Nhập
                    </Table.HeadCell>
                    <Table.HeadCell className="bg-[#F4F7FA] text-left text-secondary/75 text-sm font-medium capitalize text-nowrap">
                      Giá Nhập
                    </Table.HeadCell>
                    <Table.HeadCell className="bg-[#F4F7FA] text-left text-secondary/75 text-sm font-medium capitalize text-nowrap">
                      Nhà Cung Cấp ID
                    </Table.HeadCell>
                  </Table.Head>
                  <Table.Body className="divide-y">
                    {/* Nhóm các variant theo sản phẩm */}
                    {inventorys.map((product) => {
                      // Nhóm các variant có cùng thuộc tính
                      const groupedVariants = product.variants.reduce(
                        (acc, variant) => {
                          // Tạo key từ các thuộc tính
                          const key = variant.attribute_values
                            .map(
                              (attr) => `${attr.attribute.name}:${attr.value}`
                            )
                            .join("|");

                          if (!acc[key]) {
                            acc[key] = [];
                          }
                          acc[key].push(variant);
                          return acc;
                        },
                        {} as Record<string, IVariants[]>
                      );

                      return Object.entries(groupedVariants).map(
                        ([key, variants], groupIndex) => {
                          const firstVariant = variants[0];
                          // const totalQuantity = variants.reduce(
                          //   (sum, v) => sum + v.quantity,
                          //   0
                          // );
                          const totalImportPrice = variants.reduce(
                            (sum, v) =>
                              sum + (v.inventoryImports?.import_price || 0),
                            0
                          );
                          const importQuantity = variants.reduce(
                            (sum, v) =>
                              sum + (v.inventoryImports?.quantity || 0),
                            0
                          );
                          const isGroupSelected = variants.every((v) =>
                            isVariantSelected(v)
                          );
                          return (
                            <Table.Row key={`${product.id}-${groupIndex}`}>
                              {/* Thông tin sản phẩm (chỉ render 1 lần) */}
                              <Table.Cell>
                                <ConfigProvider
                                  theme={{
                                    token: {
                                      colorPrimary: "#ff9900",
                                    },
                                  }}
                                >
                                  <Checkbox
                                    checked={isGroupSelected}
                                    onChange={() => handleGroupSelect(variants)}
                                  />
                                </ConfigProvider>
                              </Table.Cell>
                              {groupIndex === 0 && (
                                <>
                                  <Table.Cell
                                    rowSpan={
                                      Object.keys(groupedVariants).length
                                    }
                                    className="text-nowrap"
                                  >
                                    {product.id}
                                  </Table.Cell>
                                  <Table.Cell
                                    rowSpan={
                                      Object.keys(groupedVariants).length
                                    }
                                    className="text-nowrap"
                                  >
                                    {product.name}
                                  </Table.Cell>
                                  <Table.Cell
                                    rowSpan={
                                      Object.keys(groupedVariants).length
                                    }
                                    className="text-nowrap flex justify-center"
                                  >
                                    <Avatar
                                      shape="square"
                                      size="large"
                                      src={product.images[0]}
                                    />
                                  </Table.Cell>
                                </>
                              )}
                              <Table.Cell className="text-nowrap text-center">
                                {variants.map((v) => v.id).join(", ")}
                              </Table.Cell>
                              {/* Render các thuộc tính */}
                              {firstVariant.attribute_values.map(
                                (attr, attrIndex) => (
                                  <Table.Cell
                                    key={attrIndex}
                                    className="text-nowrap text-center"
                                  >
                                    {attr.value}
                                  </Table.Cell>
                                )
                              )}

                              {/* Thông tin giá và số lượng */}
                              <Table.Cell className="text-nowrap">
                                {new Intl.NumberFormat("vi-VN", {
                                  style: "currency",
                                  currency: "VND",
                                }).format(firstVariant.price)}
                              </Table.Cell>
                              <Table.Cell className="text-nowrap">
                                {firstVariant.sale_price
                                  ? new Intl.NumberFormat("vi-VN", {
                                      style: "currency",
                                      currency: "VND",
                                    }).format(firstVariant.sale_price)
                                  : "Không có"}
                              </Table.Cell>
                              <Table.Cell className="text-nowrap text-center">
                                {importQuantity}
                              </Table.Cell>
                              <Table.Cell className="text-nowrap">
                                {totalImportPrice > 0
                                  ? new Intl.NumberFormat("vi-VN", {
                                      style: "currency",
                                      currency: "VND",
                                    }).format(totalImportPrice)
                                  : "Không có"}
                              </Table.Cell>
                              <Table.Cell className="text-nowrap text-center">
                                {firstVariant.inventoryImports?.supplier?.id ||
                                  "Chưa có"}
                              </Table.Cell>
                            </Table.Row>
                          );
                        }
                      );
                    })}
                  </Table.Body>
                </Table>
              </>
            )}
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ModalInventoryImport;
