
import { ICategory } from "./ICategory";
import { IVariants } from "./IVariants";

export interface IProduct{
    id?:number,
    name:string,
    slug:string,
    images:string[],
    category?:ICategory
    price_range?: string;
    import_price_range?: string;
    quantity_range:string,
    description:string,
    category_id:ICategory,
    is_active:boolean,
    is_featured:boolean,
    is_variant:boolean,
    variants:IVariants[],
    total_revenue?:number,
    updated_at?:string
}