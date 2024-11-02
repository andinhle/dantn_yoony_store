import { useEffect, useState } from "react";
import instance from "../../../../instance/instance";
import { IUser } from "../../../../interfaces/IUser";
import { IProduct } from "../../../../interfaces/IProduct";
import { Avatar } from "@mui/material";
import { Rate } from "antd";
import dayjs from "dayjs";
import { Link } from "react-router-dom";
type IRatingDone = {
  order_id: number;
  rates: Review[];
};

type Review = {
  id: number;
  content: string | null;
  rating: number;
  product: IProduct;
  user: IUser;
  order_id: number;
  created_at: string;
  updated_at: string;
};
const UserRatingsDone = () => {
  const [ratingDoneLists, setRatingDoneLists] = useState<IRatingDone[]>([]);
  useEffect(() => {
    (async () => {
      try {
        const { data } = await instance.get("reviews/reviewed-orders");
        setRatingDoneLists(data);
      } catch (error) {
        console.log(error);
      }
    })();
  }, []);
  const flapMapRateDoneList = ratingDoneLists.flatMap((item) => item.rates);
  console.log(flapMapRateDoneList);
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
      {flapMapRateDoneList &&
        flapMapRateDoneList.map((RateDoneItem) => {
          const attribute_values = RateDoneItem.product.variants.flatMap(
            (variant) => variant.attribute_values
          );
          return (
            <div className="border border-[#f1f1f1] rounded-md p-3">
              <div className="flex items-start gap-2">
                <Avatar
                  alt={String(RateDoneItem.user?.name).toUpperCase()}
                  src={RateDoneItem.user?.avatar || "/default-avatar.png"}
                  sx={{ width: 32, height: 32 }}
                />
                <div className="space-y-2">
                  <div className="flex flex-col">
                    <p>{RateDoneItem.user?.name}</p>
                    <Rate
                      disabled
                      defaultValue={RateDoneItem.rating}
                      className="rating-done text-[10px]"
                    />
                  </div>
                  <p className="text-xs text-secondary/50">
                    {dayjs(RateDoneItem.created_at).format("DD-MM-YYYY HH:MM")}
                  </p>
                  <div className="bg-[#F6F6F6] p-2 rounded-sm">
                    {!RateDoneItem.content ? (
                      <p className="text-sm text-secondary/50 line-clamp-4">
                        Không có
                      </p>
                    ) : (
                      <p className="text-sm text-secondary/50 line-clamp-4">
                        {RateDoneItem.content}
                      </p>
                    )}
                  </div>
                  <div className="flex gap-3 items-center w-fit bg-[#F6F6F6] p-2 rounded-sm">
                    <img
                      src={RateDoneItem.product.images[0]}
                      className="max-w-10 h-10 object-cover rounded-md w-full"
                    />
                    <div className="flex flex-col justify-between">
                      <Link
                        to={""}
                        className="line-clamp-1 hover:text-primary text-secondary/75"
                      >
                        {RateDoneItem.product.name}
                      </Link>
                      <p className=" text-secondary/50 text-xs line-clamp-1">
                        Phân loại:{" "}
                        {attribute_values.length > 0 &&
                          Object.entries(
                            attribute_values.reduce<Record<string, string[]>>(
                              (acc, attr) => {
                                const attrName = attr.attribute.name;
                                const value = attr.value;
                                if (!acc[attrName]) {
                                  acc[attrName] = [];
                                }
                                acc[attrName].push(value!);
                                return acc;
                              },
                              {}
                            )
                          )
                            .reduce<string[][]>((result, [key, values]) => {
                              if (values.length > 0) {
                                values.forEach((value, index) => {
                                  if (!result[index]) {
                                    result[index] = [];
                                  }
                                  result[index].push(value);
                                });
                              }
                              return result;
                            }, [])
                            .map((group) => group.join(", "))
                            .join(" | ")}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
    </div>
  );
};

export default UserRatingsDone;
