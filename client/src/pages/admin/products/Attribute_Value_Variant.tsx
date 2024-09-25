import { useFieldArray, useFormContext } from "react-hook-form";
import { IProduct } from "../../../interfaces/IProduct";

type Prop = {
  index: string;
};

const Attribute_Value_Variant = ({ index }: Prop) => {
  const { register, control } = useFormContext<IProduct>();
  const { fields, append, remove } = useFieldArray({
    control,
    name: `variants.${index}.attribute_values`,
  });
  return <div>Attribute_Value_Variant</div>;
};

export default Attribute_Value_Variant;
