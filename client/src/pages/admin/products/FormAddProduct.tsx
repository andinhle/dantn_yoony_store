import { Select } from "antd";
import { Label, ToggleSwitch } from "flowbite-react";
import JoditEditor from "jodit-react";
import { useMemo, useRef, useState } from "react";
import { useFieldArray, useForm,FormProvider } from "react-hook-form";
import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode } from "swiper/modules";
import { IProduct } from "../../../interfaces/IProduct";
import ButtonSubmit from "../../../components/Admin/ButtonSubmit";

const FormAddProduct = () => {
  const editor = useRef(null);
  const [descProduct, setDescProduct] = useState("");
  const config = useMemo(
    () => ({
      readonly: false,
      placeholder: "Mô tả sản phẩm ...",
      height: 200,
      width: "100%",
      enableDragAndDropFileToEditor: true,
      buttons: [
        "bold",
        "italic",
        "underline",
        "strikethrough",
        "|",
        "font",
        "fontsize",
        "brush",
        "paragraph",
        "|",
        "ul",
        "ol",
        "|",
        "align",
        "|",
        "link",
        "image",
        "|",
        "undo",
        "redo",
        "|",
        "eraser",
        "fullsize",
      ],
      buttonsMD: [
        "bold",
        "italic",
        "underline",
        "strikethrough",
        "|",
        "font",
        "fontsize",
        "brush",
        "paragraph",
        "|",
        "ul",
        "ol",
        "|",
        "align",
        "|",
        "link",
        "image",
        "|",
        "undo",
        "redo",
        "|",
        "eraser",
        "fullsize",
      ],
      buttonsSM: [
        "bold",
        "italic",
        "underline",
        "|",
        "font",
        "fontsize",
        "|",
        "ul",
        "ol",
        "|",
        "align",
        "|",
        "link",
        "image",
        "|",
        "undo",
        "redo",
      ],
      buttonsXS: [
        "bold",
        "italic",
        "|",
        "font",
        "fontsize",
        "|",
        "ul",
        "ol",
        "|",
        "link",
        "image",
      ],
      uploader: {
        insertImageAsBase64URI: true,
      },
      showXPathInStatusbar: false,
      showCharsCounter: false,
      showWordsCounter: false,
      toolbarAdaptive: true,
      toolbarSticky: true,
      allowResizeY: false,
      spellcheck: true,
      editorCssClass: "product-description-editor",
      iframe: false,
      askBeforePasteHTML: false,
      askBeforePasteFromWord: false,
      defaultActionOnPaste: "insert_clear_html",
    }),
    []
  );
  const method = useForm<IProduct>({
    defaultValues: {
      name: undefined,
      slug: undefined,
      images: [],
      description: undefined,
      category_id: undefined,
      is_active: true,
      is_featured: false,
      is_good_deal: false,
      variants: [
        {
          price: undefined,
          sale_price: undefined,
          quantity: undefined,
          attribute_values: [
            undefined
          ],
        },
      ],
      is_variant: false,
    },
    mode: "onChange",
  });
  const {
    register,
    formState: { errors },
    handleSubmit,
    watch,
    setValue,
    control,
  }=method
  const { fields, append, remove } = useFieldArray({
    control,
    name: "variants",
  });
  const onSubmit = (dataForm: IProduct) => {
    console.log(dataForm);
  };
  return (
    <FormProvider {...method} >
    <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
      <div className="grid grid-cols-3 gap-[15px]">
        <div>
          <div className="mb-2 block">
            <Label htmlFor="value-product" value="Tên sản phẩm" />
          </div>
          <input
            type="text"
            placeholder="Tên sản phẩm"
            id="value-product"
            {...register("name")}
            className="block focus:!border-primary/50 h-[35px] text-sm placeholder-[#00000040] border-input rounded-[5px] w-full focus:!shadow-none"
          />
        </div>
        <div>
          <div className="mb-2 block">
            <Label htmlFor="slug-product" value="Slug" />
          </div>
          <input
            type="text"
            placeholder="Slug"
            id="slug-product"
            disabled
            className="block focus:!border-primary/50 h-[35px] text-sm placeholder-[#00000040] text-[#00000040] bg-gray-100 border-input rounded-[5px] w-full focus:!shadow-none"
          />
        </div>
        <div>
          <div className="mb-2 block">
            <Label htmlFor="categorys" value="Danh mục" />
          </div>
          <Select
            {...register("category_id")}
            onChange={(e) => setValue("category_id", e)}
            showSearch
            value={watch("category_id")}
            style={{ width: "100%" }}
            placeholder="Chọn danh mục"
            optionFilterProp="label"
            filterSort={(optionA, optionB) =>
              (optionA?.label ?? "")
                .toLowerCase()
                .localeCompare((optionB?.label ?? "").toLowerCase())
            }
            options={[
              {
                value: 1,
                label: "Sámung",
              },
              {
                value: 2,
                label: "Apple",
              },
            ]}
          />
        </div>
      </div>
      <div className="grid grid-cols-12 gap-[15px]">
        <div className="col-span-4">
          <div className="block mb-2">
            <Label htmlFor="images-product" value="Album ảnh" />
          </div>
          <div className="border overflow-hidden h-full max-h-[100px] rounded-[5px] flex relative mb-4">
            <input
              type="file"
              multiple
              id="images-product"
              className="hover:cursor-pointer opacity-0 z-50"
            />
            <div className="absolute z-40 top-[50%] left-[50%] -translate-x-[50%] -translate-y-[50%]">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M22 6.75C22.4142 6.75 22.75 6.41421 22.75 6C22.75 5.58579 22.4142 5.25 22 5.25V6.75ZM14 5.25C13.5858 5.25 13.25 5.58579 13.25 6C13.25 6.41421 13.5858 6.75 14 6.75V5.25ZM18.75 2C18.75 1.58579 18.4142 1.25 18 1.25C17.5858 1.25 17.25 1.58579 17.25 2H18.75ZM17.25 10C17.25 10.4142 17.5858 10.75 18 10.75C18.4142 10.75 18.75 10.4142 18.75 10H17.25ZM22 5.25H18V6.75H22V5.25ZM18 5.25H14V6.75H18V5.25ZM17.25 2V6H18.75V2H17.25ZM17.25 6V10H18.75V6H17.25Z"
                  fill="#FF9900"
                />
                <path
                  d="M11.5 3C7.02166 3 4.78249 3 3.39124 4.39124C2 5.78249 2 8.02166 2 12.5C2 16.9783 2 19.2175 3.39124 20.6088C4.78249 22 7.02166 22 11.5 22C15.9783 22 18.2175 22 19.6088 20.6088C21 19.2175 21 16.9783 21 12.5V12"
                  stroke="#FF9900"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
                <path
                  d="M2 14.1354C2.61902 14.0455 3.24484 14.0011 3.87171 14.0027C6.52365 13.9466 9.11064 14.7729 11.1711 16.3342C13.082 17.7821 14.4247 19.7749 15 22"
                  stroke="#FF9900"
                  strokeWidth="1.5"
                  strokeLinejoin="round"
                />
                <path
                  d="M21 16.8962C19.8246 16.3009 18.6088 15.9988 17.3862 16.0001C15.5345 15.9928 13.7015 16.6733 12 18"
                  stroke="#FF9900"
                  strokeWidth="1.5"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </div>
          <Swiper
            slidesPerView={3.5}
            spaceBetween={20}
            freeMode={true}
            modules={[FreeMode]}
            className="mySwiper px-5"
          >
            <SwiperSlide className="pb-1 px-0.5">
              <div className="flex-shrink-0 w-[65px] h-[65px]">
                <div className="w-full h-full rounded-full border overflow-hidden">
                  <img
                    className="w-full h-full object-cover"
                    src="https://media.istockphoto.com/id/1664169659/vi/anh/%C4%91%C3%B4i-gi%C3%A0y-th%E1%BB%83-thao-%C4%91%E1%BA%A7y-m%C3%A0u-s%E1%BA%AFc-s%C3%A0nh-%C4%91i%E1%BB%87u-b%E1%BB%8B-c%C3%B4-l%E1%BA%ADp-tr%C3%AAn-n%E1%BB%81n-tr%E1%BA%AFng.jpg?s=612x612&w=0&k=20&c=4KviOMVQ9l_TYVyJFG4YgQfYuU3h7Y0c7Dg1g-3-pl0="
                    alt="Image 1"
                    loading="lazy"
                  />
                </div>
              </div>
            </SwiperSlide>
            <SwiperSlide className="pb-1 px-0.5">
              <div className="flex-shrink-0 w-[65px] h-[65px]">
                <div className="w-full h-full rounded-full border overflow-hidden">
                  <img
                    className="w-full h-full object-cover"
                    src="https://media.istockphoto.com/id/1664169659/vi/anh/%C4%91%C3%B4i-gi%C3%A0y-th%E1%BB%83-thao-%C4%91%E1%BA%A7y-m%C3%A0u-s%E1%BA%AFc-s%C3%A0nh-%C4%91i%E1%BB%87u-b%E1%BB%8B-c%C3%B4-l%E1%BA%ADp-tr%C3%AAn-n%E1%BB%81n-tr%E1%BA%AFng.jpg?s=612x612&w=0&k=20&c=4KviOMVQ9l_TYVyJFG4YgQfYuU3h7Y0c7Dg1g-3-pl0="
                    alt="Image 1"
                    loading="lazy"
                  />
                </div>
              </div>
            </SwiperSlide>
            <SwiperSlide className="pb-1 px-0.5">
              <div className="flex-shrink-0 w-[65px] h-[65px]">
                <div className="w-full h-full rounded-full border overflow-hidden">
                  <img
                    className="w-full h-full object-cover"
                    src="https://media.istockphoto.com/id/1664169659/vi/anh/%C4%91%C3%B4i-gi%C3%A0y-th%E1%BB%83-thao-%C4%91%E1%BA%A7y-m%C3%A0u-s%E1%BA%AFc-s%C3%A0nh-%C4%91i%E1%BB%87u-b%E1%BB%8B-c%C3%B4-l%E1%BA%ADp-tr%C3%AAn-n%E1%BB%81n-tr%E1%BA%AFng.jpg?s=612x612&w=0&k=20&c=4KviOMVQ9l_TYVyJFG4YgQfYuU3h7Y0c7Dg1g-3-pl0="
                    alt="Image 1"
                    loading="lazy"
                  />
                </div>
              </div>
            </SwiperSlide>
            <SwiperSlide className="pb-1 px-0.5">
              <div className="flex-shrink-0 w-[65px] h-[65px]">
                <div className="w-full h-full rounded-full border overflow-hidden">
                  <img
                    className="w-full h-full object-cover"
                    src="https://media.istockphoto.com/id/1664169659/vi/anh/%C4%91%C3%B4i-gi%C3%A0y-th%E1%BB%83-thao-%C4%91%E1%BA%A7y-m%C3%A0u-s%E1%BA%AFc-s%C3%A0nh-%C4%91i%E1%BB%87u-b%E1%BB%8B-c%C3%B4-l%E1%BA%ADp-tr%C3%AAn-n%E1%BB%81n-tr%E1%BA%AFng.jpg?s=612x612&w=0&k=20&c=4KviOMVQ9l_TYVyJFG4YgQfYuU3h7Y0c7Dg1g-3-pl0="
                    alt="Image 1"
                    loading="lazy"
                  />
                </div>
              </div>
            </SwiperSlide>
            <SwiperSlide className="pb-1 px-0.5">
              <div className="flex-shrink-0 w-[65px] h-[65px]">
                <div className="w-full h-full rounded-full border overflow-hidden">
                  <img
                    className="w-full h-full object-cover"
                    src="https://media.istockphoto.com/id/1664169659/vi/anh/%C4%91%C3%B4i-gi%C3%A0y-th%E1%BB%83-thao-%C4%91%E1%BA%A7y-m%C3%A0u-s%E1%BA%AFc-s%C3%A0nh-%C4%91i%E1%BB%87u-b%E1%BB%8B-c%C3%B4-l%E1%BA%ADp-tr%C3%AAn-n%E1%BB%81n-tr%E1%BA%AFng.jpg?s=612x612&w=0&k=20&c=4KviOMVQ9l_TYVyJFG4YgQfYuU3h7Y0c7Dg1g-3-pl0="
                    alt="Image 1"
                    loading="lazy"
                  />
                </div>
              </div>
            </SwiperSlide>
            <SwiperSlide className="pb-1 px-0.5">
              <div className="flex-shrink-0 w-[65px] h-[65px]">
                <div className="w-full h-full rounded-full border overflow-hidden">
                  <img
                    className="w-full h-full object-cover"
                    src="https://media.istockphoto.com/id/1664169659/vi/anh/%C4%91%C3%B4i-gi%C3%A0y-th%E1%BB%83-thao-%C4%91%E1%BA%A7y-m%C3%A0u-s%E1%BA%AFc-s%C3%A0nh-%C4%91i%E1%BB%87u-b%E1%BB%8B-c%C3%B4-l%E1%BA%ADp-tr%C3%AAn-n%E1%BB%81n-tr%E1%BA%AFng.jpg?s=612x612&w=0&k=20&c=4KviOMVQ9l_TYVyJFG4YgQfYuU3h7Y0c7Dg1g-3-pl0="
                    alt="Image 1"
                    loading="lazy"
                  />
                </div>
              </div>
            </SwiperSlide>
          </Swiper>
        </div>
        <div className="col-span-8">
          <div className="mb-2 block">
            <Label htmlFor="desc-product" value="Mô tả sản phẩm" />
          </div>
          <JoditEditor
            value={descProduct}
            ref={editor}
            onBlur={(e) => {
              setDescProduct(e);
            }}
            config={config}
            id={"desc-product"}
          />
        </div>
      </div>
      <div className="flex gap-16">
        <div className="flex gap-3 items-center">
          <div className="block">
            <Label htmlFor="status-product" value="Trạng thái" />
          </div>
          <div>
            <ToggleSwitch
              sizing={"sm"}
              id="status-product"
              checked={watch("is_active")}
              {...register("is_active")}
              onChange={(e) => {
                setValue("is_active", e);
              }}
            />
          </div>
        </div>
        <div className="flex gap-3 items-center">
          <div className="block">
            <Label htmlFor="featured-product" value="Nổi bật" />
          </div>
          <div>
            <ToggleSwitch
              sizing={"sm"}
              id="featured-product"
              checked={watch("is_featured")}
              {...register("is_featured")}
              onChange={(e) => {
                setValue("is_featured", e);
              }}
            />
          </div>
        </div>
        <div className="flex gap-3 items-center">
          <div className="block">
            <Label htmlFor="good-deal-product" value="Giá tốt" />
          </div>
          <div>
            <ToggleSwitch
              sizing={"sm"}
              id="good-deal-product"
              checked={watch("is_good_deal")}
              {...register("is_good_deal")}
              onChange={(e) => {
                setValue("is_good_deal", e);
              }}
            />
          </div>
        </div>
        <div className="flex gap-3 items-center">
          <div className="block">
            <Label htmlFor="is_variant-product" value="Có biến thể" />
          </div>
          <div>
            <ToggleSwitch
              sizing={"sm"}
              id="is_variant-product"
              checked={watch("is_variant")}
              {...register("is_variant")}
              onChange={(e) => {
                setValue("is_variant", e);
              }}
            />
          </div>
        </div>
      </div>
      <div className="space-y-3">
        {fields.map((field, index) => {
          return (
            <div
              key={field.id}
              className="bg-white border p-3 rounded-[5px] relative space-y-3"
            >
              <div className="grid grid-cols-3 gap-[15px]">
                <div>
                  <div className="mb-2 block">
                    <Label htmlFor="price-product" value="Giá" />
                  </div>
                  <input
                    type="number"
                    placeholder="Giá"
                    id="price-product"
                    {...register(`variants.${index}.price`)}
                    className="block focus:!border-primary/50 h-[35px] text-sm placeholder-[#00000040] border-input rounded-[5px] w-full focus:!shadow-none"
                  />
                </div>
                <div>
                  <div className="mb-2 block">
                    <Label htmlFor="sale_price-product" value="Giá sale" />
                  </div>
                  <input
                    type="number"
                    placeholder="Giá sale"
                    id="sale_price-product"
                    {...register(`variants.${index}.sale_price`)}
                    className="block focus:!border-primary/50 h-[35px] text-sm placeholder-[#00000040] border-input rounded-[5px] w-full focus:!shadow-none"
                  />
                </div>
                <div>
                  <div className="mb-2 block">
                    <Label htmlFor="quality-product" value="Số lượng" />
                  </div>
                  <input
                    type="number"
                    placeholder="Số lượng"
                    id="quality-product"
                    {...register(`variants.${index}.quantity`)}
                    className="block focus:!border-primary/50 h-[35px] text-sm placeholder-[#00000040] border-input rounded-[5px] w-full focus:!shadow-none"
                  />
                </div>
              </div>
              {field.attribute_values.map((attr, attrIndex) => {
                return (
                  <div className="grid grid-cols-3 gap-[15px]" key={attrIndex}>
                    <div>
                      <div className="mb-2 block">
                        <Label htmlFor="attribute" value="Tên thuộc tính" />
                      </div>
                      <Select
                        // onChange={(e) => setValue("attribute_id", e)}
                        showSearch
                        // value={watch("attribute_id")}
                        id="attribute"
                        style={{ width: "100%" }}
                        placeholder="Tên thuộc tính"
                        optionFilterProp="label"
                        filterSort={(optionA, optionB) =>
                          (optionA?.label ?? "")
                            .toLowerCase()
                            .localeCompare((optionB?.label ?? "").toLowerCase())
                        }
                        options={[
                          {
                            value: "select",
                            label: "Select",
                          },
                          {
                            value: "color",
                            label: "Color",
                          },
                          {
                            value: "button",
                            label: "Button",
                          },
                          {
                            value: "radio",
                            label: "Radio",
                          },
                        ]}
                      />
                    </div>
                    <div>
                      <div className="mb-2 block">
                        <Label
                          htmlFor="attribute-value"
                          value="Giá trị thuộc tính"
                        />
                      </div>
                      <Select
                        {...register(
                          `variants.${index}.attribute_values.${attrIndex}`
                        )}
                        onChange={(e) => {
                          setValue(
                            `variants.${index}.attribute_values.${attrIndex}`,
                            e
                          );
                        }}
                        value={watch(
                          `variants.${index}.attribute_values.${attrIndex}`
                        )}
                        showSearch
                        id="attribute-value"
                        style={{ width: "100%" }}
                        placeholder="Giá trị thuộc tính"
                        optionFilterProp="label"
                        filterSort={(optionA, optionB) =>
                          (optionA?.label ?? "")
                            .toLowerCase()
                            .localeCompare((optionB?.label ?? "").toLowerCase())
                        }
                        options={[
                          {
                            value: 1,
                            label: "Select",
                          },
                          {
                            value: 2,
                            label: "Color",
                          },
                        ]}
                      />
                    </div>
                    <div className="flex items-center gap-3 mt-7">
                      <button >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          className="size-6"
                          color={"#34C759"}
                          fill={"none"}
                        >
                          <path
                            d="M12 8V16M16 12L8 12"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M2 12C2 17.5228 6.47715 22 12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M2.5 8.5C2.86239 7.67056 3.3189 6.89166 3.85601 6.17677M6.17681 3.85598C6.89168 3.31888 7.67058 2.86239 8.5 2.5"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </button>
                      {attrIndex > 0 && (
                        <button onClick={()=>{remove(attrIndex)}}>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            className="size-6"
                            color={"#FF9900"}
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
                      )}
                    </div>
                  </div>
                );
              })}
              {index > 0 && (
                <button
                  type="button"
                  className="absolute right-1 -top-2 bg-white shadow-sm rounded-full p-1 text-[#ed6c03] transition-all hover:bg-primary hover:text-white"
                  onClick={() => {
                    remove(index);
                  }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    className="size-3.5"
                    color={"currentColor"}
                    fill={"none"}
                  >
                    <path
                      d="M19.0005 4.99988L5.00049 18.9999M5.00049 4.99988L19.0005 18.9999"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
              )}
            </div>
          );
        })}
        <button
          type="button"
          onClick={() => {
            append({
              price: null!,
              sale_price: null!,
              quantity: null!,
              image: null!,
              attribute_values: [null!],
            });
          }}
          className="mx-auto w-fit block"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            className="size-7"
            color={"#ff9900"}
            fill={"none"}
          >
            <path
              d="M12 8V16M16 12L8 12"
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
        </button>
        <ButtonSubmit content="Thêm sản phẩm" />
      </div>
    </form>
    </FormProvider>
  );
};

export default FormAddProduct;
