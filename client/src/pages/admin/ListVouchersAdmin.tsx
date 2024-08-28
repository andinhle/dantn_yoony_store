import { Table } from "flowbite-react";



const ListVouchersAdmin = () => {

  return (
    <div className="overflow-x-auto w-full mt-8">
      <Table hoverable className="table w-full">
        <Table.Head className="text-center">
          <Table.HeadCell>STT</Table.HeadCell>
          <Table.HeadCell>Mã voucher</Table.HeadCell>
          <Table.HeadCell>Giảm giá</Table.HeadCell>
          <Table.HeadCell>Trạng thái</Table.HeadCell>
          <Table.HeadCell>Ngày bắt đầu</Table.HeadCell>
          <Table.HeadCell>Ngày kết thúc</Table.HeadCell>
          <Table.HeadCell>Hành động</Table.HeadCell>
        </Table.Head>
      
      </Table>
    </div>
  );
};

export default ListVouchersAdmin;
