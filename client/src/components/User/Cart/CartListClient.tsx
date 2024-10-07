import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Pagination,
  getKeyValue,
} from "@nextui-org/react";
import { users } from "./data";
import { useContext, useMemo, useState } from "react";
import CartContext from "../../../contexts/CartContext";
const CartListClient = () => {
  const {carts}=useContext(CartContext)
  const [page, setPage] = useState(1);
  const rowsPerPage = 10;

  const pages = Math.ceil(users.length / rowsPerPage);

  const items = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return users.slice(start, end);
  }, [page, users]);

  console.log(carts);
  return (
    <section className="my-7 space-y-7">
      <h2 className="flex gap-1.5 text-2xl text-primary font-medium">
        <span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2.5}
            stroke="currentColor"
            className="size-7"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
            />
          </svg>
        </span>
        GIỎ HÀNG
      </h2>
      <div className="grid grid-cols-12 gap-10">
        {/* <div className="col-span-8 border p-2 rounded-md">

        </div> */}
        <Table
          className="col-span-8"
          selectionMode="multiple"
          aria-label="Pagination Cart"
          bottomContent={
            <div className="flex w-full justify-center">
              <Pagination
                isCompact
                showControls
                showShadow
                page={page}
                total={pages}
                onChange={(page) => setPage(page)}
              />
            </div>
          }
          classNames={{
            wrapper: "min-h-[222px]",
          }}
        >
          <TableHeader>
            <TableColumn key="product">SẢN PHẨM</TableColumn>
            <TableColumn key="price">GIÁ</TableColumn>
            <TableColumn key="quality">SỐ LƯỢNG</TableColumn>
            <TableColumn key="total">TỔNG</TableColumn>
          </TableHeader>
          <TableBody items={items}>
            {(item) => (
              <TableRow key={item.name}>
                {(columnKey) => (
                  <TableCell>{getKeyValue(item, columnKey)}</TableCell>
                )}
              </TableRow>
            )}
          </TableBody>
        </Table>
        <div className="col-span-4 border p-2 rounded-md">thanh toan</div>
      </div>
    </section>
  );
};

export default CartListClient;
