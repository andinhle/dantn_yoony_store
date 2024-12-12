import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { IUser } from "../interfaces/IUser";
import Cookies from "js-cookie";
import { message } from "antd";
import { ProductWishlist } from "../components/User/Manager/Wishlist/Wishlist";
import instance from "../instance/instance";
import { NotificationsContext } from "../contexts/NotificationsContext";
import CartContext from "../contexts/CartContext";

interface AuthContextType {
  user: IUser | null;
  login: (userData: IUser) => void;
  logout: () => void;
  checkAuthStatus: () => void;
  wishlists: ProductWishlist[];
  setWishlists: (wishlists: ProductWishlist[]) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_COOKIE_NAME = "authToken";
const USER_INFO_KEY = "userInfor";
const WISHLIST_KEY = "wishlists";
const ADDRESS_KEY = "addressSelect";
const FINAL_TOTAL_KEY = "final_total";
const ID_CART_KEY = "id_cart";
const METHOD_PAYMENT_KEY = "methodPayment";
const ORDER_DATA_KEY = "orderData";
const VOUCHER_KEY = "selected_voucher";
const CALLBACK_KEY="callback_processed"
const CARTLOCAL_KEY="cartLocal"

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<IUser | null>(null);
  const [wishlists, setWishlists] = useState<ProductWishlist[]>([]);
  const { dispatch: dispatchNotification } = useContext(NotificationsContext);
  const { dispatch: dispatchCart } = useContext(CartContext);
  useEffect(() => {
    checkAuthStatus();
    const intervalId = setInterval(checkAuthStatus, 500);
    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    const savedWishlists = localStorage.getItem(WISHLIST_KEY);
    if (savedWishlists) {
      setWishlists(JSON.parse(savedWishlists));
    }
  }, []);

  const checkAuthStatus = () => {
    const authCookie = Cookies.get(AUTH_COOKIE_NAME);
    const userInfo = localStorage.getItem(USER_INFO_KEY);

    if (!authCookie) {
      localStorage.removeItem(USER_INFO_KEY);
      localStorage.removeItem(WISHLIST_KEY);
      setUser(null);
      setWishlists([]);
    } else if (userInfo) {
      setUser(JSON.parse(userInfo));
    }

    if (authCookie && !userInfo) {
      Cookies.remove(AUTH_COOKIE_NAME);
      localStorage.removeItem(USER_INFO_KEY);
      localStorage.removeItem(WISHLIST_KEY);
      setUser(null);
      setWishlists([]);
    } else if (!authCookie && userInfo) {
      Cookies.remove(AUTH_COOKIE_NAME);
      localStorage.removeItem(USER_INFO_KEY);
      localStorage.removeItem(WISHLIST_KEY);
      setUser(null);
      setWishlists([]);
    }
  };

  const fetchWishlists = useCallback(async () => {
    try {
      const { data } = await instance.get("list-wishlists-check");
      setWishlists(data.wishlists);
      localStorage.setItem(
        WISHLIST_KEY, 
        JSON.stringify(data.wishlists)
      );
    } catch (error) {
      console.error('Wishlist fetch error:', error);
      message.error('Không thể tải danh sách yêu thích');
    }
  }, []);

  // Fetch notifications
  const callNotification = useCallback(async (idUser:number) => {
    try {
      const { data: { data: response } } = await instance.get(`notification/${idUser}`);
      if (response) {
        dispatchNotification({
          type: "LIST",
          payload: response,
        });
      }
    } catch (error) {
      console.error('Notification fetch error:', error);
    }
  }, [dispatchNotification]);


  const addCartLocal = useCallback(async (idUser: number) => {
    try {
      const existingCart = JSON.parse(
        localStorage.getItem(CARTLOCAL_KEY) || '[]'
      );

      if (existingCart.length === 0) return;

      const formattedCart = existingCart.map(item => ({
        variant_id: item.variant_id,
        quantity: item.quantity
      }));

      const { data } = await instance.post(
        `addcartMultil/${idUser}`,
        { local_cart: formattedCart }
      );

      dispatchCart({
        type: "ADD",
        payload: data.data
      });

      localStorage.removeItem(CARTLOCAL_KEY);
    } catch (error) {
      console.error('Cart sync error:', error);
      localStorage.removeItem(CARTLOCAL_KEY);
    }
  }, [dispatchCart]);

  const login = useCallback(async (userData: IUser) => {
    try {
      // Kiểm tra cookie
      if (!navigator.cookieEnabled) {
        message.warning('Vui lòng cho phép cookie');
        return;
      }

      // Lưu thông tin người dùng
      try {
        localStorage.setItem(
          USER_INFO_KEY, 
          JSON.stringify(userData)
        );
      } catch (storageError) {
        console.error('localStorage error:', storageError);
        message.error('Lỗi lưu thông tin người dùng');
        return;
      }
      // Cập nhật state
      setUser(userData);

      // Thực hiện các tác vụ song song
      await Promise.all([
        fetchWishlists(),
        callNotification(userData.id!),
        addCartLocal(userData.id!)
      ]);
      message.success('Đăng nhập thành công');
    } catch (error) {
      console.error('Login process error:', error);
      message.error('Đăng nhập thất bại');
    }
  }, [fetchWishlists, callNotification, addCartLocal]);


  const logout = () => {
    Cookies.remove(AUTH_COOKIE_NAME);
    localStorage.removeItem(USER_INFO_KEY);
    localStorage.removeItem(WISHLIST_KEY);
    localStorage.removeItem(ADDRESS_KEY);
    localStorage.removeItem(METHOD_PAYMENT_KEY);
    localStorage.removeItem(CALLBACK_KEY);
    localStorage.removeItem(FINAL_TOTAL_KEY);
    localStorage.removeItem(ID_CART_KEY);
    localStorage.removeItem(ORDER_DATA_KEY);
    localStorage.removeItem(VOUCHER_KEY);
    localStorage.removeItem(CARTLOCAL_KEY);
    setUser(null);
    setWishlists([]);
    message.success("Đăng xuất thành công !");
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      login, 
      logout, 
      checkAuthStatus, 
      wishlists,
      setWishlists 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth phải được sử dụng trong AuthProvider");
  }
  return context;
};