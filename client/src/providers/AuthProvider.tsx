import {
  createContext,
  ReactNode,
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

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<IUser | null>(null);
  const [wishlists, setWishlists] = useState<ProductWishlist[]>([]);
  const {dispatch}=useContext(NotificationsContext)
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

  const fetchWishlists = async () => {
    try {
      const { data } = await instance.get("list-wishlists-check");
      setWishlists(data.wishlists);
      localStorage.setItem(WISHLIST_KEY, JSON.stringify(data.wishlists));
    } catch (error) {
      console.log(error);
      message.error('Có lỗi xảy ra khi tải danh sách wishlist');
    }
  };

  const callNotification=async () => {
    try {
      const {
        data: { data: response },
      } = await instance.get(`notification`);
      if (response) {
        dispatch({
          type: "LIST",
          payload: response,
        });
      }
    } catch (error) {
      console.log(error);
    }
  }

  const login = async (userData: IUser) => {
    try {
      // Safari strict cookie policy check
      if (!navigator.cookieEnabled) {
        message.warning('Vui lòng cho phép cookie');
        return;
      }
  
      // Explicit try-catch for localStorage
      try {
        localStorage.setItem(USER_INFO_KEY, JSON.stringify(userData));
      } catch (storageError) {
        console.error('localStorage error:', storageError);
        message.error('Lỗi lưu thông tin người dùng');
      }
  
      setUser(userData);
      await fetchWishlists();
      await callNotification()
    } catch (error) {
      console.error('Login process error:', error);
      message.error('Đăng nhập thất bại');
    }
  };

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