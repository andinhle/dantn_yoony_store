import { useEffect, useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import instance from "../../../instance/instance";
import { message } from "antd";
import { useAuth } from "../../../providers/AuthProvider";
import Cookies from "js-cookie";
import { LoadingOverlay } from "@achmadk/react-loading-overlay";

const CallBackLoginGoogle = () => {
    const navigate = useNavigate();
    const { login } = useAuth();
    const location = useLocation();
    const [isLoading, setLoading] = useState<boolean>(false);
    const hasFetchedRef = useRef(false); 

    useEffect(() => {
        const fetchLoginInfo = async () => {
            const params = new URLSearchParams(location.search);
            const code = params.get("code");
            if (code && !hasFetchedRef.current) { 
                hasFetchedRef.current = true;
                try {
                    setLoading(true);
                    const { data: responseLoginInfor } = await instance.get(
                        `auth/google/callback?code=${encodeURIComponent(code)}`
                    );
                    if (responseLoginInfor && responseLoginInfor.token) {
                        setLoading(false);
                        Cookies.set("authToken", responseLoginInfor.token, {
                            expires: 1 / 12,
                            secure: true,
                            sameSite: "strict",
                        });
                    
                        localStorage.setItem("userInfor", JSON.stringify(responseLoginInfor.user));
                      
                        login(responseLoginInfor.user);
                        navigate("/"); 
                    }
                } catch (error) {
                    console.error("Error fetching login info:", error);
                    setLoading(false);
                }
            }
        };

        fetchLoginInfo();
    }, [location]);

    return (
        <div>
            <LoadingOverlay
                active={isLoading}
                spinner
                text="Đang đăng nhập ..."
                styles={{
                    overlay: (base) => ({
                        ...base,
                        background: "rgba(255, 255, 255, 0.75)",
                        backdropFilter: "blur(4px)",
                    }),
                    spinner: (base) => ({
                        ...base,
                        width: "40px",
                        "& svg circle": {
                            stroke: "rgba(255, 153, 0,5)",
                            strokeWidth: "3px",
                        },
                    }),
                }}
            >
            </LoadingOverlay>
        </div>
    );
}

export default CallBackLoginGoogle;