import BannerFixedChild from "../../components/User/Banner/BannerFixedChild";
import BannerHome from "../../components/User/Banner/BannerHome";
import CardPolicyList from "../../components/User/Banner/CardPolicyList";
import SideBarListCategorysHome from "../../components/User/Banner/SideBarListCategorysHome";
import VoucherList from "../../components/User/Voucher/VoucherList";

const MainContentUser = () => {
  return (
    <>
      <div className="my-7 grid grid-cols-9 gap-4">
        <SideBarListCategorysHome />
        <div className="col-span-9 lg:col-span-7 flex flex-col h-fit">
          <div className="md:grid grid-cols-7 gap-4 min-h-[200px] md:min-h-[225px] lg:min-h-[250px] max-h-min">
            <BannerHome />
            <BannerFixedChild />
          </div>
          <div className="col-span-7 mt-4 flex-grow grid grid-cols-2 md:grid-cols-4 gap-4">
            <CardPolicyList />
          </div>
        </div>
      </div>
      <VoucherList />
    </>
  );
};

export default MainContentUser;
