import { useEffect, useReducer, useState } from "react";
import { IProduct } from "../interfaces/IProduct";
import { NotificationsContext, Props } from "../contexts/NotificationsContext";
import NotificationsReducer from "../reducer/NotificationsReducer";
import instance from "../instance/instance";
import isAuthenticated from "../components/Middleware/isAuthenticated";
const NotificationsProvider = (props: Props) => {
  const [notifications, dispatch] = useReducer(
    NotificationsReducer,
    [] as IProduct[]
  );
  const [isLoggedIn, setIsLoggedIn] = useState(isAuthenticated());
  
  useEffect(() => {
    (async () => {
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
  )()
  }, [])
  return (
    <NotificationsContext.Provider value={{ notifications, dispatch }}>
      {props.children}
    </NotificationsContext.Provider>
  );
};

export default NotificationsProvider;
