import { Modal, ToggleSwitch,  } from "flowbite-react";
import { useState } from "react";
import ListVouchersAdmin from "./ListVouchersAdmin";
import ButtonSubmit from "../../components/Admin/ButtonSubmit";
import { useForm } from "react-hook-form";
import { IVoucher } from "../../intrefaces/IVouchers";

const VouchersAdmin = () => {
  const [addOrupdate, SetAddOrUpdate] = useState("ADD");
  const [openModal, setOpenModal] = useState(false);
  const [switch1, setSwitch1] = useState(false);
  const [codeVoucher, setCodeVoucher] = useState("");
  const [AddOrUpdate] = useState<string>("ADD");

  const {
    register,
    formState: { errors },
    handleSubmit,
    setValue,
    reset,
  } = useForm<IVoucher>();

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
              <form className="space-y-3 w-full max-w-md"> 
                <div className="space-y-3">
                  <div className="space-y-1.5">
                    <label htmlFor="code" className="font-medium text-sm">
                      Code
                    </label>
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
                    <label htmlFor="discount" className="font-medium text-sm">
                    Usage limits
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
