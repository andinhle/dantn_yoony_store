import { Tabs, ConfigProvider } from "antd";
import type { TabsProps } from "antd";
import UserRatingsPending from "./UserRatingsPending";
import UserRatingsDone from "./UserRatingsDone";

const UserRatings = () => {
  const items: TabsProps["items"] = [
    {
      key: "1",
      label: "Chưa đánh giá",
      children: <UserRatingsPending />,
    },
    {
      key: "2",
      label: "Đã đánh giá",
      children: <UserRatingsDone />,
    },
  ];

  return (
    <ConfigProvider
      theme={{
        components: {
          Tabs: {
            inkBarColor: "#ff9900",
            itemSelectedColor: "#ff9900",
            itemHoverColor: "#ff9900",
          },
        },
      }}
    >
      <div className="bg-util border border-[#f1f1f1] rounded-md px-4 min-h-screen">
        <Tabs defaultActiveKey="1" items={items} className="rating-user" />
      </div>
    </ConfigProvider>
  );
};

export default UserRatings;
