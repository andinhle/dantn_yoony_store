import { Modal } from "antd";
type Props = {
  isModalOpen: boolean;
  handleCancel: () => void;
};
const ModalInventoryImport = ({ isModalOpen, handleCancel }: Props) => {
  return (
    <div>
      <Modal
        open={isModalOpen}
        onCancel={handleCancel}
        width={750}
      >
        <div>
          <button className="font-medium flex items-center gap-1.5">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              className="size-5"
              color={"currentColor"}
              fill={"none"}
            >
              <path
                d="M3.99982 11.9998L19.9998 11.9998"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M8.99963 17C8.99963 17 3.99968 13.3176 3.99966 12C3.99965 10.6824 8.99966 7 8.99966 7"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Nhập hàng
          </button>
        </div>
        <div className={"min-h-screen"}>
          ok
        </div>
      </Modal>
    </div>
  );
};

export default ModalInventoryImport;
