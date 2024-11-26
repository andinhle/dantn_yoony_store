import { IAttributeValue } from "./IAttributeValue";
import { InventoryImport } from "./InventoryImport";
import { IProduct } from "./IProduct";

export interface IVariants{
    id?:number,
    price:number,
    sale_price?:number,
    end_sale?:string,
    image:string,
    attribute_values:IAttributeValue[],
    product:IProduct,
    total_revenue?:number,
    inventoryImports: InventoryImport[];
    updated_at?:string
}


