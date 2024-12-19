import { message } from "antd";
import Cookies from "js-cookie";
const AUTH_COOKIE_NAME = "authToken";
const USER_INFO_KEY = "userInfor";
const WISHLIST_KEY = "wishlists";
const ADDRESS_KEY = "addressSelect";
const FINAL_TOTAL_KEY = "final_total";
const ID_CART_KEY = "id_cart";
const METHOD_PAYMENT_KEY = "methodPayment";
const ORDER_DATA_KEY = "orderData";
const VOUCHER_KEY = "selected_voucher";
const CALLBACK_KEY = "callback_processed";
const CARTLOCAL_KEY = "cartLocal";
const Logout = () => {
  const clearStorage = () => {
    const keysToClear = [
      USER_INFO_KEY,
      WISHLIST_KEY,
      ADDRESS_KEY,
      METHOD_PAYMENT_KEY,
      CALLBACK_KEY,
      FINAL_TOTAL_KEY,
      ID_CART_KEY,
      ORDER_DATA_KEY,
      VOUCHER_KEY,
      CARTLOCAL_KEY,
    ];

    keysToClear.forEach((key) => localStorage.removeItem(key));
    Cookies.remove(AUTH_COOKIE_NAME);
  };
  
  return ()=>{
    clearStorage();
    window.dispatchEvent(new Event("auth-change"));
    message.success("Đăng xuất thành công");
  };
};

export default Logout;
