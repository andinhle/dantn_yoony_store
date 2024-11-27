import { Outlet } from "react-router-dom";
import ProductProvider from "../../providers/ProductProvider";
import AttributeProvider from "../../providers/AttributeProvider";
import AttributeValueProvider from "../../providers/AttributeValueProvider";
import InventoryProvider from "../../providers/InventoryProvider";

const LayoutProductAdmin = () => {
  return (
    <ProductProvider>
      <AttributeValueProvider>
        <AttributeProvider>
          <InventoryProvider>
            <Outlet />
          </InventoryProvider>
        </AttributeProvider>
      </AttributeValueProvider>
    </ProductProvider>
  );
};

export default LayoutProductAdmin;
