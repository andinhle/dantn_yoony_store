export interface IUser{
    _id?:string,
    username:string,
    email:string,
    tel:number,
    address:string,
    avatar:string,
    status: boolean,
    password: string;
    confirmPass: string;
    role?: "member" | "admin"
}
