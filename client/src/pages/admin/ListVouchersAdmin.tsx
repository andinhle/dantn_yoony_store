import { Table, ToggleSwitch } from "flowbite-react";
import { useContext } from "react";
import { VoucherContext } from "../../contexts/VouchersContext";
import instance from "../../instance/instance";
import { toast } from "react-toastify";
import { IVoucher } from "../../interfaces/IVouchers";

const ListVouchersAdmin = () => {

  const fillDataVoucher = async (id: number) => {
    try {
      const { data } = await instance.get(`coupon/${id}`)
      setAddOrUpdate("UPDATE")
      reset(data.data)
      setStatus(data.data.status)
      setCodeVoucher(data.data.code)
      setIdVoucher(data.data.id)
    } catch (error) {
      toast.error(error.response.data.message);
    }
  }
  return (
    <div className="overflow-x-auto w-full mt-8">
      <Table hoverable className="table w-full">
        <Table.Head className="text-center">
          <Table.HeadCell>STT</Table.HeadCell>
          <Table.HeadCell>Mã voucher</Table.HeadCell>
          <Table.HeadCell>Giảm giá</Table.HeadCell>
          <Table.HeadCell>Giảm giá loại</Table.HeadCell>
          <Table.HeadCell>Giới hạn sử dụng</Table.HeadCell>
          <Table.HeadCell>Mã giảm min</Table.HeadCell>
          <Table.HeadCell>Mã giảm max</Table.HeadCell>
          <Table.HeadCell>Ngày bắt đầu</Table.HeadCell>
          <Table.HeadCell>Ngày kết thúc</Table.HeadCell>
          <Table.HeadCell>Trạng thái</Table.HeadCell>
          <Table.HeadCell>Hành động</Table.HeadCell>
        </Table.Head>
      
      </Table>
    </div>
  );
};

export default ListVouchersAdmin;
