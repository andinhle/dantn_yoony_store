import { ReactNode, useEffect, useReducer } from "react";
import CartContext from "../contexts/CartContext";
import { ICart } from "../interfaces/ICart";
import CartReducer from "../reducer/CartReducer";
import instance from "../instance/instance";

type Props = {
  children: ReactNode;
};
const CartProvider = ({ children }: Props) => {
  const [carts, dispatch] = useReducer(CartReducer, [] as ICart[]);
  useEffect(() => {
    (async () => {
      try {
        const {data:{data:response}} = await instance.get('cart')
        dispatch({
          type:"LIST",
          payload:response
        })
      } catch (error) {
        console.log(error)
      }
    })()
  }, [])
  return (
    <CartContext.Provider value={{ carts, dispatch }}>
      {children}
    </CartContext.Provider>
  );
};

export default CartProvider;
