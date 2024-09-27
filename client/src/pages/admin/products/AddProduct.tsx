import AttributeProvider from "../../../providers/AttributeProvider";
import AddAttribute from "./AddAttribute";
import AddAttributeValue from "./AddAttributeValue";
import FormAddProduct from "./FormAddProduct";

const AddProduct = () => {
  return (
    <>
      <AttributeProvider>
        <section className="flex justify-between gap-7">
          <div className="max-w-[250px] w-full space-y-5">
            <AddAttribute />
            <AddAttributeValue />
          </div>
          <div className="w-full bg-util px-4 py-5 rounded-lg h-fit">
            <FormAddProduct />
          </div>
        </section>
      </AttributeProvider>
    </>
  );
};
export default AddProduct;
