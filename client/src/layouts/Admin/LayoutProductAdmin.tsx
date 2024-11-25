import { Outlet } from "react-router-dom";
import ProductProvider from "../../providers/ProductProvider";
import AttributeProvider from "../../providers/AttributeProvider";
import AttributeValueProvider from "../../providers/AttributeValueProvider";

const LayoutProductAdmin = () => {
  return (
    <ProductProvider>
      <AttributeValueProvider>
        <AttributeProvider>
          <Outlet />
        </AttributeProvider>
      </AttributeValueProvider>
    </ProductProvider>
  );
};

export default LayoutProductAdmin;
