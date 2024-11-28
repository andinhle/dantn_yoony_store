import { Outlet } from "react-router-dom";
import ProductProvider from "../../providers/ProductProvider";
import AttributeProvider from "../../providers/AttributeProvider";
import AttributeValueProvider from "../../providers/AttributeValueProvider";
import InventoryProvider from "../../providers/InventoryProvider";
import SupplierProvider from "../../providers/SupplierProvider";

const LayoutProductAdmin = () => {
  return (
    <ProductProvider>
      <AttributeValueProvider>
        <AttributeProvider>
          <InventoryProvider>
            <SupplierProvider>
              <Outlet />
            </SupplierProvider>
          </InventoryProvider>
        </AttributeProvider>
      </AttributeValueProvider>
    </ProductProvider>
  );
};

export default LayoutProductAdmin;
