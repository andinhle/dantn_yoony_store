import { ConfigProvider, Table } from "antd";
import { IVariants } from "../../../interfaces/IVariants";
import type { TableColumnsType } from "antd";
import { useEffect, useState } from "react";
import { IProduct } from "../../../interfaces/IProduct";
import instance from "../../../instance/instance";
import { Link } from "react-router-dom";
import slugify from "react-slugify";
interface ExpandedDataType {
  key: React.Key;
  variant: IVariants;
  total_revenue: number;
}

interface DataType {
  key: React.Key;
  name: string;
  total_revenue: number;
  image: string;
  variants: IVariants[];
  category: string;
  productName: string;
}
const listDate = [
  { label: "Ngày", value: "day" },
  { label: "Tuần", value: "week" },
  { label: "1 Tháng", value: "month" },
  { label: "6 Tháng", value: "6months" },
  { label: "Năm", value: "year" },
];
const StatisProductAdmin = () => {
  const [statisticalProduct, setStatisticalProducts] = useState<IProduct[]>([]);
  const [select, setSelect] = useState<string>("day");
  useEffect(() => {
    (async () => {
      try {
        const { data } = await instance.get(`thong-ke/san-pham?type=${select}`);
        setStatisticalProducts(data.top_selling_products);
      } catch (error) {
        console.log(error);
      }
    })();
  }, [select]);
  const columns: TableColumnsType<DataType> = [
    {
      title: "Sản phẩm",
      dataIndex: "name",
      className: "w-[30%]",
      key: "name",
      render: (_, record) => (
        <div
          style={{ display: "flex", alignItems: "center" }}
          className="max-w-[350px] w-full"
        >
          <img
            src={record.image}
            alt={record.name}
            style={{
              width: 45,
              height: 45,
              marginRight: 10,
              objectFit: "cover",
            }}
            className="rounded-md"
          />
          <p className="text-ellipsis overflow-hidden text-nowrap">
            <Link
              to={`/${record.category}/${record.productName}`}
              className="hover:text-primary"
            >
              {record.name}
            </Link>
          </p>
        </div>
      ),
    },
    {
      title: "Tổng doanh thu",
      dataIndex: "total_revenue",
      align: "center",
      key: "total_revenue",
      render: (_, record) => {
        return <div>{Number(record.total_revenue).toLocaleString()} VNĐ</div>;
      },
    },
    {
      title: "Chi tiết",
      align: "center",
      key: "detail",
      render: (_,record) => {
        return (
          <div>
            <Link
              to={`/admin/thong-ke/san-pham/${slugify(record.name)}`}
              className="text-primary hover:text-primary/80 flex gap-2 justify-center"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                className="size-5"
                color={"currentColor"}
                fill={"none"}
              >
                <path
                  d="M4.94436 8.04069L10.8282 8.04069M2 18L7.49762 12.5862C7.70914 12.3779 8.03957 12.3544 8.27806 12.5308L12.5239 15.6712C12.774 15.8563 13.1229 15.8204 13.3306 15.5883L21.2849 6.70262M18.1084 6H20.9306C21.4785 6 21.9259 6.44077 21.9371 6.99179L22 10.0649"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              Thống kê
            </Link>
          </div>
        );
      },
    },
  ];
  const dataSource = statisticalProduct.map<DataType>((product) => ({
    key: product.id!,
    name: product.name,
    total_revenue: product.total_revenue!,
    image: product.images[0],
    variants: product.variants,
    category: product?.category?.slug,
    productName: product.slug,
  }));

  const expandedRowRender = (record: DataType) => {
    const expandColumns: TableColumnsType<ExpandedDataType> = [
      {
        dataIndex: "variant",
        key: "variant",
        render: (variant: IVariants) => (
          <p className="text-secondary/50 text-xs line-clamp-1">
            Phân loại:{" "}
            {variant.attribute_values.map((attr) => attr.value).join(" , ")}
          </p>
        ),
      },
      {
        dataIndex: "total_revenue",
        key: "total_revenue",
        render: (_, record) => (
          <p className="text-secondary/50 text-xs line-clamp-1">
            {record.total_revenue
              ? Number(record.total_revenue).toLocaleString()
              : 0}{" "}
            VNĐ
          </p>
        ),
      },
    ];

    const expandDataSource = record.variants.map<ExpandedDataType>(
      (variant) => ({
        key: variant.id!,
        variant,
        total_revenue: variant.total_revenue!,
      })
    );

    return (
      <ConfigProvider
        theme={{
          components: {
            Table: {
              headerBg: "#F4F7FA",
              colorLinkHover: "#ff9900",
              colorLink: "#ff9900",
            },
          },
        }}
      >
        <Table<ExpandedDataType>
          columns={expandColumns}
          dataSource={expandDataSource}
          pagination={false}
          size="middle"
          showHeader={false}
          className="py-2.5 px-2"
          rowHoverable={false}
        />
      </ConfigProvider>
    );
  };

  return (
    <div className="p-5 rounded-md bg-util min-h-fit grid grid-cols-12 gap-5">
      <div className="space-y-5 col-span-8">
        <div className="overflow-auto border-b border-[#f1f1f1] space-y-5">
          <h3 className="font-medium">TOP SẢN PHẨM BÁN CHẠY</h3>
          <div className="flex flex-wrap h-fit gap-3 text-secondary/75">
            {listDate.map((item) => (
              <button
                type="button"
                key={item.label}
                className={`${
                  select === item.value
                    ? "text-util bg-primary"
                    : "bg-[#F3F4F6] text-secondary"
                } px-5 py-1.5 rounded-sm transition-all`}
                onClick={() => {
                  setSelect(item.value);
                }}
              >
                {item.label}
              </button>
            ))}
          </div>
          <ConfigProvider
            theme={{
              components: {
                Table: {
                  headerBg: "#F4F7FA",
                  colorLinkHover: "#ff9900",
                  colorLink: "#ff9900",
                },
              },
            }}
          >
            <Table<DataType>
              columns={columns}
              expandable={{ expandedRowRender }}
              dataSource={dataSource}
              size="middle"
              pagination={false}
              rowHoverable={false}
            />
          </ConfigProvider>
        </div>
      </div>
      <div className="space-y-5 col-span-4">
        <h3 className="font-medium">TOP 10 SẢN PHẨM YÊU THÍCH</h3>
      </div>
    </div>
  );
};

export default StatisProductAdmin;
