import { Modal, Table, ToggleSwitch, Label, Radio } from "flowbite-react";
import { useContext, useEffect, useState } from "react";

import { Avatar } from "@mui/material";
import ButtonSubmit from "../../components/Admin/ButtonSubmit";
import { useForm } from "react-hook-form";
import { UserContext } from "../../contexts/UserContext";
import { IUser } from "../../intrefaces/IUser";

const UsersAdmin = () => {
  const { users, dispatch } = useContext(UserContext);
  const [statusUser, setStautsUser] = useState<boolean>();
  const [openModal, setOpenModal] = useState(false);
  const [idUser, setIdUser] = useState<string>();

  const { register, handleSubmit, reset } = useForm<IUser>();

  // Ensure users is always an array (default to empty array if undefined)
  const usersList = users || [];

  return (
    <div className="overflow-x-auto w-full">
      <Table hoverable className="table w-full">
        <Table.Head className="text-center">
          <Table.HeadCell>STT</Table.HeadCell>
          <Table.HeadCell>Username</Table.HeadCell>
          <Table.HeadCell>Email</Table.HeadCell>
          <Table.HeadCell>Tel</Table.HeadCell>
          <Table.HeadCell>Address</Table.HeadCell>
          <Table.HeadCell>Trạng thái</Table.HeadCell>
          <Table.HeadCell>Phân quyền</Table.HeadCell>
        </Table.Head>
        <Table.Body className="divide-y">
          {usersList.map((user, index) => (
            <Table.Row
              className="bg-white dark:border-gray-700 dark:bg-gray-800 text-center"
              key={user._id}
            >
              <Table.Cell>{index + 1}</Table.Cell>
              <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white flex items-center gap-2 justify-center">
                <Avatar
                  sx={{ bgcolor: "#1b95f2" }}
                  alt={user.username.toUpperCase()}
                  src={user.avatar ? user.avatar : user.username}
                />
                {user.username}
              </Table.Cell>
              <Table.Cell>{user.email}</Table.Cell>
              <Table.Cell>{user.tel || 'N/A'}</Table.Cell>
              <Table.Cell>
                {user.address ? (
                  user.address
                ) : (
                  <span className="text-sm text-red-500">
                    Chưa cập nhật !
                  </span>
                )}
              </Table.Cell>
              <Table.Cell>
                <ToggleSwitch
                  checked={user.status}
                  sizing={'sm'}
                  className="w-fit mx-auto"
                  onChange={() => {
                    setStautsUser(!user.status);
                  }}
                />
              </Table.Cell>
              <Table.Cell>
                <button
                  className="text-primary flex flex-col items-center mx-auto"
                  onClick={() => {
                    setOpenModal(true);
                    setIdUser(user._id); // If you want to use user ID somewhere
                  }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="size-7"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M4.5 12a7.5 7.5 0 0 0 15 0m-15 0a7.5 7.5 0 1 1 15 0m-15 0H3m16.5 0H21m-1.5 0H12m-8.457 3.077 1.41-.513m14.095-5.13 1.41-.513M5.106 17.785l1.15-.964m11.49-9.642 1.149-.964M7.501 19.795l.75-1.3m7.5-12.99.75-1.3m-6.063 16.658.26-1.477m2.605-14.772.26-1.477m0 17.726-.26-1.477M10.698 4.614l-.26-1.477M16.5 19.794l-.75-1.299M7.5 4.205 12 12m6.894 5.785-1.149-.964M6.256 7.178l-1.15-.964m15.352 8.864-1.41-.513M4.954 9.435l-1.41-.514M12.002 12l-3.75 6.495"
                    />
                  </svg>
                  {user.role}
                </button>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
      <Modal
        dismissible
        show={openModal}
        onClose={() => setOpenModal(false)}
        size={"lg"}
      >
        <Modal.Header>Phân quyền</Modal.Header>
        <Modal.Body>
          <form action="" className="space-y-7">
            <fieldset className="flex max-w-md flex-col gap-4">
              <legend className="mb-4">Cài đặt quyền cho người dùng</legend>
              <div className="flex items-center gap-2.5 *:cursor-pointer">
                <Radio id="member-user" value="member" {...register("role")} />
                <Label htmlFor="member-user">Member</Label>
              </div>
              <div className="flex items-center gap-2.5 *:cursor-pointer">
                <Radio id="admin-user" {...register("role")} value="admin" />
                <Label htmlFor="admin-user">
                  Admin <sup className="text-red-500">*</sup>
                </Label>
              </div>
            </fieldset>
            <ButtonSubmit content="Cập nhật" />
          </form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default UsersAdmin;
