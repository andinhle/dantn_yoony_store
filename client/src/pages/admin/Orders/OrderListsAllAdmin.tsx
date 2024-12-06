import { ConfigProvider } from "antd";
import { Table } from "flowbite-react";
import { useEffect, useState } from "react";
import instance from "../../../instance/instance";
const OrderListsAllAdmin = () => {
  const [valSearch, SetValSearch] = useState<string>("");
  useEffect(() => {
    (async()=>{
        try {
            const {data}=await instance.get('admin/orders')
            console.log(data);
        } catch (error) {
            console.log(error);
        }
    })()
  }, [])
  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: "#ff9900",
        },
      }}
    >
      <div className="space-y-5">
        <div className="flex items-center gap-1 bg-[#F4F7FA] px-4 rounded-sm py-1 overflow-hidden">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            className="size-5 text-secondary/50"
            color={"currentColor"}
            fill={"none"}
          >
            <path
              d="M14 14L16.5 16.5"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinejoin="round"
            />
            <path
              d="M16.4333 18.5252C15.8556 17.9475 15.8556 17.0109 16.4333 16.4333C17.0109 15.8556 17.9475 15.8556 18.5252 16.4333L21.5667 19.4748C22.1444 20.0525 22.1444 20.9891 21.5667 21.5667C20.9891 22.1444 20.0525 22.1444 19.4748 21.5667L16.4333 18.5252Z"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
            <path
              d="M16 9C16 5.13401 12.866 2 9 2C5.13401 2 2 5.13401 2 9C2 12.866 5.13401 16 9 16C12.866 16 16 12.866 16 9Z"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinejoin="round"
            />
          </svg>
          <input
            type="search"
            placeholder="Bạn có thể tìm kiếm theo Mã đơn hàng hoặc Tên Sản phẩm, Trạng thái đơn hàng"
            className="block focus:!border-none bg-[#F4F7FA] placeholder:text-[#a3a3a3] h-[35px] text-sm border-none rounded-[5px] w-full focus:!shadow-none"
          />
        </div>
        <div className="overflow-x-auto rounded-lg">
          <Table className="border-b border-[#E4E7EB]">
            <Table.Head className="text-center">
              <Table.HeadCell className="bg-[#F4F7FA] text-left text-secondary/75 text-sm font-medium capitalize text-nowrap">
                STT
              </Table.HeadCell>
              <Table.HeadCell className="bg-[#F4F7FA] text-secondary/75 text-sm font-medium capitalize text-nowrap">
                Mã đơn hàng
              </Table.HeadCell>
              <Table.HeadCell className="bg-[#F4F7FA] text-secondary/75 text-sm font-medium capitalize text-nowrap">
                Người đặt
              </Table.HeadCell>
              <Table.HeadCell className="bg-[#F4F7FA] text-secondary/75 text-sm font-medium capitalize text-nowrap">
                Ngày đặt
              </Table.HeadCell>
              <Table.HeadCell className="bg-[#F4F7FA] text-secondary/75 text-sm font-medium capitalize text-nowrap">
                Tổng tiền
              </Table.HeadCell>
              <Table.HeadCell className="bg-[#F4F7FA] text-secondary/75 text-sm font-medium capitalize text-nowrap">
                Trạng thái
              </Table.HeadCell>
              <Table.HeadCell className="bg-[#F4F7FA] text-secondary/75 text-sm font-medium capitalize text-nowrap">
                Hành động
              </Table.HeadCell>
            </Table.Head>
            <Table.Body className="divide-y">
                
            </Table.Body>
          </Table>
        </div>
      </div>
    </ConfigProvider>
  );
};

export default OrderListsAllAdmin;
