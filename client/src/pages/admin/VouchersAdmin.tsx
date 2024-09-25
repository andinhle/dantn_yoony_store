import { Modal, ToggleSwitch, } from "flowbite-react";
import { useEffect, useState } from "react";
import ListVouchersAdmin from "./ListVouchersAdmin";
import ButtonSubmit from "../../components/Admin/ButtonSubmit";
import { useForm } from "react-hook-form";
import { IVoucher } from "../../intrefaces/IVouchers";
import instance from "../../instance/instance";
import { toast } from "react-toastify";

import axios from "axios";

const VouchersAdmin = () => {
  const [addOrupdate, SetAddOrUpdate] = useState("ADD");
  const [openModal, setOpenModal] = useState(false);
  const [switch1, setSwitch1] = useState(false);
  const [switch2, setSwitch2] = useState(false);
  const [codeVoucher, setCodeVoucher] = useState("");
  const [AddOrUpdate] = useState<string>("ADD");
  const [coupons, setCoupons] = useState<IVoucher[]>([])
  const [idUpdate, setIdUpdate] = useState<string>()
  const [isActive, setActive] = useState(false);
  const {
    register,
    formState: { errors },
    handleSubmit,
    setValue,
    reset,
  } = useForm<IVoucher>();
  const fetchVouchers = async () => {
    try {
      const { data } = await instance.get("coupon");
      setCoupons(data.data);
    } catch (error) {
      console.error("Error fetching coupons:", error);
      toast.error("Không thể tải danh mục.");
    }
  };
  useEffect(() => {
    fetchVouchers()
  }, []);
  useEffect(() => {
    SetAddOrUpdate("ADD");
    reset({
      status: true
    });
  }, [openModal === false]);
  const onSubmit = async (dataForm: IVoucher) => {
    try {
     
      if (addOrupdate == "ADD") {
        const payload = {
          code: dataForm.code,
          discount: dataForm.discount,
          discount_type: dataForm.discount_type,
          min_order_value: dataForm.min_order_value,
          max_order_value: dataForm.max_order_value,
          usage_limit: dataForm.usage_limit,
          start_date: dataForm.start_date,
          end_date: dataForm.end_date,
          status: dataForm.status ? 1 : 0,
          is_featured: dataForm.is_featured ? 1 : 0,
        };
        await instance.post("coupon", payload);
        console.log("Payload sent:", payload);
        reset();
        toast.success("Thêm Voucher thành công");
        setOpenModal(false);
        fetchVouchers();
        setActive(false);
      } else if (addOrupdate === "UPDATE") {
        await instance.put(`coupon/${idUpdate}`, {
          code: dataForm.code,
          discount: dataForm.discount,
          discount_type: dataForm.discount_type,
          usage_limit: dataForm.usage_limit,
          start_date: dataForm.start_date,
          end_date: dataForm.end_date,
          status: dataForm.status
        });
        toast.success("Sửa Voucher thành công");
        setOpenModal(false);
        fetchVouchers();
        setActive(false);
        SetAddOrUpdate("ADD");
      }
    } catch (error) {
      setActive(false);
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message);
        console.log('Error response data:', error.response?.data);
      } else if (error instanceof Error) {
        console.log(error.message);
      } else {
        console.log("Đã xảy ra lỗi không mong muốn");
      }
    }
  };
  return (
    <div>
      <div>
        <button
          onClick={() => setOpenModal(true)}
          className="flex items-center py-2 px-4 bg-primary text-util rounded-md hover:bg-util hover:text-primary hover:outline hover:outline-primary transition-all"
        >
          Thêm mã giảm giá
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="size-6"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
        </button>
        <Modal
          dismissible
          show={openModal}
          onClose={() => setOpenModal(false)}
          className="h-full"
          size={"md"}
        >
          <Modal.Header>
            {AddOrUpdate === "ADD" ? "Thêm" : "Sửa"} voucher
          </Modal.Header>
          <Modal.Body>
            <div className="flex justify-center px-3 pb-2">
              <form className="space-y-3 w-full max-w-md" onSubmit={handleSubmit(onSubmit)}>
                <div className="space-y-3">
                  <div className="space-y-1.5">
                    <div className="flex justify-between">
                      <label htmlFor="code" className="font-medium text-sm">
                        Code
                      </label>
                      <button
                        className="flex items-center text-sm gap-1 text-primary"
                        type="button"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="size-5"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M19.5 12c0-1.232-.046-2.453-.138-3.662a4.006 4.006 0 0 0-3.7-3.7 48.678 48.678 0 0 0-7.324 0 4.006 4.006 0 0 0-3.7 3.7c-.017.22-.032.441-.046.662M19.5 12l3-3m-3 3-3-3m-12 3c0 1.232.046 2.453.138 3.662a4.006 4.006 0 0 0 3.7 3.7 48.656 48.656 0 0 0 7.324 0 4.006 4.006 0 0 0 3.7-3.7c.017-.22.032-.441.046-.662M4.5 12l3 3m-3-3-3 3"
                          />
                        </svg>
                        Random
                      </button>
                    </div>
                    <input
                      type="text"
                      className="block px-2 py-2 border border-[#d9d9d9] rounded-md w-full h-10 text-sm"
                      value={codeVoucher}
                      placeholder="Code: "
                      {...register("code", {
                        onChange(event) {
                          setCodeVoucher(event.target.value);
                        },
                      })}
                    />
                    <span className="text-sm text-red-400">
                      {errors.code?.message}
                    </span>
                  </div>
                  <div className="space-y-1.5">
                    <label htmlFor="discount" className="font-medium text-sm">
                      % giảm giá
                    </label>
                    <input
                      type="text"
                      className="block border border-[#d9d9d9] px-2 py-2 rounded-md w-full h-10 text-sm"
                      placeholder="%"
                      {...register("discount", {
                        required: true,
                      })}
                      min={0}
                    />
                    <span className="text-sm text-red-400">
                      {errors.discount?.message}
                    </span>
                  </div>
                  <div className="space-y-1.5">
                    <label htmlFor="discount" className="font-medium text-sm">
                      Loại giảm giá
                    </label>
                    <input
                      type="text"
                      className="block border border-[#d9d9d9] px-2 py-2 rounded-md w-full h-10 text-sm"
                      placeholder=""
                      {...register("discount_type", {
                        required: true,
                      })}
                      min={0}
                    />
                    <span className="text-sm text-red-400">
                      {errors.discount_type?.message}
                    </span>
                  </div>
                  <div className="space-y-1.5">
                    <label htmlFor="discount" className="font-medium text-sm">
                      Số lần sử dụng
                    </label>
                    <input
                      type="text"
                      className="block border border-[#d9d9d9] px-2 py-2 rounded-md w-full h-10 text-sm"
                      placeholder="limit"
                      {...register("usage_limit", {
                        required: true,
                      })}
                      max={2}
                    />
                    <span className="text-sm text-red-400">
                      {errors.usage_limit?.message}
                    </span>
                  </div>
                  <div className="space-y-1.5">
                    <label htmlFor="discount" className="font-medium text-sm">
                      Giá trị đơn hàng tối thiểu để áp dụng Voucher
                    </label>
                    <input
                      type="text"
                      className="block border border-[#d9d9d9] px-2 py-2 rounded-md w-full h-10 text-sm"
                      placeholder=""
                      {...register("min_order_value", {
                        required: true,
                      })}
                      max={2}
                    />
                    <span className="text-sm text-red-400">
                      {errors.min_order_value?.message}
                    </span>
                  </div>
                  <div className="space-y-1.5">
                    <label htmlFor="discount" className="font-medium text-sm">
                      Giá trị đơn hàng tối đa để áp dụng Voucher
                    </label>
                    <input
                      type="text"
                      className="block border border-[#d9d9d9] px-2 py-2 rounded-md w-full h-10 text-sm"
                      placeholder=""
                      {...register("max_order_value", {
                        required: true,
                      })}
                      max={2}
                    />
                    <span className="text-sm text-red-400">
                      {errors.max_order_value?.message}
                    </span>
                  </div>
                  <div className="space-y-1.5">
                    <label htmlFor="start_date" className="font-medium text-sm">
                      Ngày bắt đầu
                    </label>
                    <input
                      type="date"
                      className="block border border-[#d9d9d9] px-2 py-2 rounded-md w-full h-10 text-sm"
                      placeholder="Date"
                      {...register("start_date", {
                        required: true,
                      })}
                    />
                    <span className="text-sm text-red-400">
                      {errors.start_date?.message}
                    </span>
                  </div>
                  <div className="space-y-1.5">
                    <label htmlFor="end_date" className="font-medium text-sm">
                      Ngày kết thúc
                    </label>
                    <input
                      type="date"
                      className="block border border-[#d9d9d9] px-2 py-2 rounded-md w-full h-10 text-sm"
                      placeholder="Date"
                      {...register("end_date", {
                        required: true,
                      })}
                    />
                    <span className="text-sm text-red-400">
                      {errors.end_date?.message}
                    </span>
                  </div>
                  <div>
                    <ToggleSwitch
                      label="trạng thái"
                      {...register("status")}
                      checked={switch1}
                      onChange={setSwitch1}
                      sizing={"sm"}
                      className="my-8"
                    />
                  </div>
                  <div>
                    <ToggleSwitch
                      label="trạng thái"
                      {...register("is_featured")}
                      checked={switch2}
                      onChange={setSwitch2}
                      sizing={"sm"}
                      className="my-8"
                    />
                  </div>
                </div>
                <ButtonSubmit content={`${AddOrUpdate === "ADD" ? "Thêm" : "Sửa"} voucher`} />
              </form>
            </div>
          </Modal.Body>
        </Modal>
      </div>
      {/* listcommont */}
      <ListVouchersAdmin />
    </div>
  );
};

export default VouchersAdmin;
