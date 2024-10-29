export interface IOrderUserClient{
    id?:number;
    userId:number;
    grand_total:number;
    final_total:number;
    payment_method:string;
    status_order:string;
    code:string;
    notes:string;
    name:string;
    tel:string;
    address:string;
    paid_at:string;
    complete_at:string;
    created_at:string;
    updated_at:string;
}