import { useFieldArray, useFormContext } from "react-hook-form";
import { IProduct } from "../../../interfaces/IProduct";
import { Label } from "flowbite-react";
import { Select } from "antd";
import { useContext } from "react";
import { AttributeContext } from "../../../contexts/AttributeContext";

type Prop = {
  index: number;
};

const Attribute_Value_Variant = ({ index }: Prop) => {
  const {attributes} =useContext(AttributeContext)
  const { register, control,watch,setValue } = useFormContext<IProduct>();
  const { fields, append, remove } = useFieldArray({
    control,
    name: `variants.${index}.attribute_values` as any,
  });

  const optionsAttribute = attributes.map((attribute) => ({
    value: attribute.id,
    label: attribute.name,
  }));
  return fields.map((field, attrIndex) => {
    return (
      <div className="grid grid-cols-3 gap-[15px]" key={field.id}>
        <div>
          <div className="mb-2 block">
            <Label htmlFor="attribute" value={`Tên thuộc tính ${attrIndex+1}`} />
          </div>
          <Select
            // onChange={(e) => setValue("attribute_id", e)}
            showSearch
            // value={watch("attribute_id")}
            id="attribute"
            style={{ width: "100%" }}
            placeholder={`Tên thuộc tính ${attrIndex+1}`}
            optionFilterProp="label"
            filterSort={(optionA, optionB) =>
              (optionA?.label ?? "")
                .toLowerCase()
                .localeCompare((optionB?.label ?? "").toLowerCase())
            }
            options={optionsAttribute}
          />
        </div>
        <div>
          <div className="mb-2 block">
            <Label htmlFor="attribute-value" value={`Giá trị thuộc tính ${attrIndex+1}`} />
          </div>
          <Select
            {...register(`variants.${index}.attribute_values.${attrIndex}`)}
            onChange={(e) => {
              setValue(`variants.${index}.attribute_values.${attrIndex}`, e);
            }}
            showSearch
            id="attribute-value"
            style={{ width: "100%" }}
            placeholder={`Giá trị thuộc tính ${attrIndex+1}`}
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
          <button type="button" onClick={()=>{
            append({})
          }}>
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
            <button
              onClick={() => {
                remove(attrIndex);
              }}
            >
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
  });
};

export default Attribute_Value_Variant;
