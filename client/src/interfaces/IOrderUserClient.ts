import { IVariants } from "./IVariants";

interface ItemsOrder {
    quantity: number,
    total_price: number
    unit_price: number,
    variant: IVariants
}
export interface IOrderUserClient {
    id?: number;
    userId: number;
    grand_total: number;
    final_total: number;
    payment_method: string;
    status_order: string;
    code: string;
    notes: string;
    name: string;
    tel: string;
    address: string;
    paid_at: string;
    complete_at: string;
    created_at: string;
    updated_at: string;
    items: ItemsOrder[]
}