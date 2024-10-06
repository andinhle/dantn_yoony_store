import { ICart } from "../interfaces/ICart";

const CartReducer = (state: any, action: any) => {
    switch (action.type) {
        case 'LIST':
            return action.payload
        case 'ADD':
            return [action.payload,...state]
        case 'UPDATE':
            return state.map((item:ICart)=>{
                if (item.id !== action.payload.id) {
                    return item
                }
                return action.payload
            })
        case 'DELETE':
            return state.filter((item:ICart)=>{
                return item.id !== action.payload
            })
    
        default:
            break;
    }
};
    
export default CartReducer;
