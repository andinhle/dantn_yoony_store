import { Table } from "flowbite-react";
import { useEffect, useState } from "react";
import { IVoucher } from "../../intrefaces/IVouchers";
import instance from "../../instance/instance";
import { toast } from "react-toastify";

const ListVouchersAdmin = () => {
  const [coupons, setCoupons] = useState<IVoucher[]>();

  const fetchVouchers = async () => {
    try {
      const { data } = await instance.get("coupon");
      console.log("API Response:", data); // Log để kiểm tra cấu trúc dữ liệu trả về
      // Nếu cấu trúc của dữ liệu trả về là khác thì điều chỉnh ở đây
      setCoupons(data.data.vouchers || []); // Điều chỉnh để lấy đúng mảng vouchers
    } catch (error) {
      console.error("Error fetching coupons:", error);
      toast.error("Không thể tải danh mục.");
    }
  };

  useEffect(() => {
    fetchVouchers(); // Chỉ gọi fetchVouchers trong useEffect
  }, []);
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
        <Table.Body className="text-center">
          {Array.isArray(coupons) && coupons.length > 0 ? (
            coupons.map((voucher, index) => (
              <Table.Row key={voucher.id} className="bg-white border-b">
                <Table.Cell>{index + 1}</Table.Cell>
                <Table.Cell>{voucher.code}</Table.Cell>
                <Table.Cell>{voucher.discount}%</Table.Cell>
                <Table.Cell>
                  {voucher.status ? (
                    <span className="text-green-500">Kích hoạt</span>
                  ) : (
                    <span className="text-red-500">Chưa kích hoạt</span>
                  )}
                </Table.Cell>
                <Table.Cell>{new Date(voucher.start_date).toLocaleDateString()}</Table.Cell>
                <Table.Cell>{new Date(voucher.end_date).toLocaleDateString()}</Table.Cell>
                <Table.Cell>
                  <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-4 rounded">
                    Sửa
                  </button>
                  <button className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-4 ml-2 rounded">
                    Xóa
                  </button>
                </Table.Cell>
              </Table.Row>
            ))
          ) : (
            <Table.Row>
              <Table.Cell colSpan={7} className="text-center">
                Không có dữ liệu
              </Table.Cell>
            </Table.Row>
          )}
        </Table.Body>
      </Table>
    </div>
  );
};

export default ListVouchersAdmin;
