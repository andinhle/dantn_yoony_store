import { ConfigProvider, Table } from "antd";
import { IVariants } from "../../../interfaces/IVariants";
import type { TableColumnsType } from "antd";
import { useEffect, useState } from "react";
import { IProduct } from "../../../interfaces/IProduct";
import instance from "../../../instance/instance";
import { Link } from "react-router-dom";
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

const StatisticalProductTopSell = () => {
  const [statisticalProduct, setStatisticalProducts] = useState<IProduct[]>([]);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await instance.get("thong-ke/san-pham");
        setStatisticalProducts(data.top_selling_products);
        console.log(data);
      } catch (error) {
        console.log(error);
      }
    })();
  }, []);
  const columns: TableColumnsType<DataType> = [
    {
      title: "Sản phẩm",
      dataIndex: "name",
      key: "name",
      render: (_, record) => (
        <div style={{ display: "flex", alignItems: "center" }}>
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
          <Link to={`/${record.category}/${record.productName}`}>{record.name}</Link>
        </div>
      ),
    },
    {
      title: "Tổng doanh thu",
      dataIndex: "total_revenue",
      key: "total_revenue",
      render: (_, record) => {
        return <div>{Number(record.total_revenue).toLocaleString()} VNĐ</div>;
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
          token: {
            colorPrimary: "#ff9900",
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
    <div className="col-span-8">
      <ConfigProvider
        theme={{
          token: {
            colorPrimary: "#ff9900",
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
  );
};

export default StatisticalProductTopSell;
