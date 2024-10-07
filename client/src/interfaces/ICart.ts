import { IUser } from "./IUser";
import { IVariants } from "./IVariants";

export interface ICart{
    id:number,
    quantity:number,
    variant_id:IVariants,
    user_id:IUser,
    variant:any
}