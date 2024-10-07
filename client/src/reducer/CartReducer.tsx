import { ICart } from "../interfaces/ICart";

type CartAction = 
  | { type: 'LIST'; payload: ICart[] }
  | { type: 'ADD'; payload: ICart }
  | { type: 'UPDATE'; payload: ICart }
  | { type: 'DELETE'; payload: number };

const CartReducer = (state: ICart[], action: CartAction): ICart[] => {
  switch (action.type) {
    case 'LIST':
      return action.payload;
    case 'ADD': {
      const existingItemIndex = state.findIndex(item => item.variant_id === action.payload.variant_id);
      if (existingItemIndex !== -1) {
        const newState = [...state];
        newState[existingItemIndex] = {
          ...newState[existingItemIndex],
          quantity: newState[existingItemIndex].quantity + action.payload.quantity
        };
        return newState;
      }
      return [action.payload, ...state];
    }
    case 'UPDATE':
      return state.map(item =>
        item.id === action.payload.id ? action.payload : item
      );
    case 'DELETE':
      return state.filter(item => item.id !== action.payload);
    default:
      return state;
  }
};

export default CartReducer;