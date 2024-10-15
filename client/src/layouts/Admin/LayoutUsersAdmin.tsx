import { Outlet } from "react-router-dom";
import RoleProvider from "../../providers/RoleProvider";
import ModelProvider from "../../providers/ModelProvider";
const LayoutUsersAdmin = () => {
  return (
    <RoleProvider>
      <ModelProvider>
        <div>
          <Outlet />
        </div>
      </ModelProvider>
    </RoleProvider>
  );
};

export default LayoutUsersAdmin;
