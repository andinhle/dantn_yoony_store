import { Modal, ToggleSwitch,  } from "flowbite-react";
import { useState } from "react";
import ListVouchersAdmin from "./ListVouchersAdmin";
import ButtonSubmit from "../../components/Admin/ButtonSubmit";
import { useForm } from "react-hook-form";
import { IVoucher } from "../../interfaces/IVouchers";
import { zodResolver } from "@hookform/resolvers/zod/src/zod.js";
import { VoucherContext } from "../../contexts/VouchersContext";
import VoucherSchemaValid from "../../validations/voucherValidSchema";
import instance from "../../instance/instance";
import { toast } from "react-toastify";
import ListVouchersAdmin from "./ListVouchersAdmin";
import { Label, Select } from "flowbite-react";
import ramdom from "random-string-generator";

const VouchersAdmin = () => {
  const [addOrupdate, SetAddOrUpdate] = useState("ADD");
  const [openModal, setOpenModal] = useState(false);
  const [switch1, setSwitch1] = useState(false);
  const [codeVoucher, setCodeVoucher] = useState("");
  const { dispatch } = useContext(VoucherContext);
  const [AddOrUpdate, setAddOrUpdate] = useState<string>("ADD");
  const [idVoucher, setIdVoucher] = useState<number>();
  const handleRamdomVoucher = () => { 
    const randomCode = ramdom("uppernumeric");
    setCodeVoucher(randomCode);
    setValue("code", randomCode);
  };
  const {
    register,
    formState: { errors },
    handleSubmit,
    setValue,
    reset,
  } = useForm<IVoucher>({
    resolver: zodResolver(VoucherSchemaValid),
  });

  const onSubmit = async (dataForm: IVoucher) => {
    try {
      if (AddOrUpdate === "ADD") {
        const { data } = await instance.post("coupon", dataForm);
        dispatch({
          type: "ADD",
          payload: data.data,
        });
        toast.success("Thêm coupon thành công !");
      } else {
        const { data } = await instance.put(`coupon/${idVoucher}`, dataForm);
        dispatch({
          type: "UPDATE",
          payload: data.data,
        });
        toast.success("Sửa coupon thành công !");
      }
      setOpenModal(false);
      reset();
      setCodeVoucher("");
      setStatus(true);
    } catch (error) {
      console.error("Error response:", error.response?.data || error.message);
      toast.error("Có lỗi xảy ra khi lưu coupon.");
    }
  };

  useEffect(() => {
    if (!openModal) {
      reset({});
      setCodeVoucher("");
      setStatus(true);
      setAddOrUpdate("ADD");
    }
  }, [openModal]);
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
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-3 w-full max-w-md">
                <div className="space-y-3 w-full">
                  <div className="space-y-1.5"> 
                    <div className="flex justify-between ">
                    <label htmlFor="code" className="font-medium text-sm">
                      Code
                    </label>
                    <button
                        className="flex items-center text-sm gap-1 text-primary"
                        type="button"
                        onClick={handleRamdomVoucher}
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
                      type="number"
                      className="block border border-[#d9d9d9] px-2 py-2 rounded-md w-full h-10 text-sm"
                      placeholder="%"
                      {...register("discount", {
                        required: true,
                      })}
                    />
                    <span className="text-sm text-red-400">
                      {errors.discount?.message}
                    </span>
                  </div>
                  <div className="space-y-1.5">
                    <label htmlFor="discount_type" className="font-medium text-sm">
                      Discount Type
                    </label>
                    <Select id="discount_type" required {...register("discount_type")}>
                      <option>percentage</option>
                      <option>fixed</option>
                    </Select>
                    <span className="text-sm text-red-400">
                      {errors.discount_type?.message}
                    </span>
                  </div>
                  <div className="space-y-1.5">
                    <label htmlFor="usage_limits" className="font-medium text-sm">
                      Usage Limits
                    </label>
                    <input
                      type="number"
                      className="block border border-[#d9d9d9] px-2 py-2 rounded-md w-full h-10 text-sm"
                      placeholder="Usage Limits"
                      {...register("usage_limit", {
                        valueAsNumber: true,
                      })}
                    />
                    <span className="text-sm text-red-400">
                      {errors.usage_limit?.message}
                    </span>
                  </div>
                  <div className="space-y-1.5">
                    <label htmlFor="min_order_value" className="font-medium text-sm">
                      Min Order Value
                    </label>
                    <input
                      type="number"
                      className="block border border-[#d9d9d9] px-2 py-2 rounded-md w-full h-10 text-sm"
                      placeholder="limit"
                      {...register("Usage_limits", {
                        valueAsNumber: true,
                      })}
                    />
                    <span className="text-sm text-red-400">
                      {errors.min_order_value?.message}
                    </span>
                  </div>
                  <div className="space-y-1.5">
                    <label htmlFor="start_date" className="font-medium text-sm">
                      Star-date
                    </label>
                    <input
                      type="text"
                      className="block border border-[#d9d9d9] px-2 py-2 rounded-md w-full h-10 text-sm"
                      placeholder="Date"
                      {...register("start_date", {
                        valueAsNumber: true,
                      })}
                    />
                    <span className="text-sm text-red-400">
                      {errors.max_order_value?.message}
                    </span>
                  </div>
                  <div className="space-y-1.5">
                    <label htmlFor="start_date" className="font-medium text-sm">
                      Start Date
                    </label>
                    <input
                      type="date"
                      className="block border border-[#d9d9d9] px-2 py-2 rounded-md w-full h-10 text-sm"
                      {...register("start_date")}
                    />
                    <span className="text-sm text-red-400">
                      {errors.start_date?.message}
                    </span>
                  </div>
                  <div className="space-y-1.5">
                    <label htmlFor="end_date" className="font-medium text-sm">
                      End-date
                    </label>
                    <input
                      type="date"
                      className="block border border-[#d9d9d9] px-2 py-2 rounded-md w-full h-10 text-sm"
                      placeholder="Date"
                      {...register("end_date", {
                        valueAsNumber: true,
                      })}
                    />
                    <span className="text-sm text-red-400">
                      {errors.end_date?.message}
                    </span>
                  </div>
                  <div className="space-y-1.5">
                    <ToggleSwitch
                      label="Trạng thái"
                      {...register("status")}
                      checked={status}
                      onChange={() => {
                        setStatus(!status);
                        setValue("status", !status);
                      }}
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
      <ListVouchersAdmin
        vouchers={vouchers || []}
        setOpenModal={setOpenModal}
        reset={reset}
        setStatus={setStatus}
        setCodeVoucher={setCodeVoucher}
        setIdVoucher={setIdVoucher}
        setAddOrUpdate={setAddOrUpdate}
      />

    </div>
  );
};

export default VouchersAdmin;
