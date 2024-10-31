import { useEffect, useState } from "react";
import instance from "../../../../instance/instance";
import { IOrderUserClient } from "../../../../interfaces/IOrderUserClient";
import { Link } from "react-router-dom";
const UserRatingsPending = () => {
  const [listRatingsPending, setListRatingsPending] = useState<IOrderUserClient[]>([]);
  useEffect(() => {
    (async () => {
      try {
        const { data } = await instance.get("orders/pending-reviews");
        setListRatingsPending(data);
      } catch (error) {
        console.log(error);
      }
    })();
  }, []);
  return (
    <div className="max-w-[500px] w-full bg-util">
      <div className="space-y-3">
        {listRatingsPending &&
          listRatingsPending.map((ratingPending) => {
            console.log(ratingPending);
            return (
              <div className="border border-[#f1f1f1] rounded-md p-3 flex justify-between">
                <div className="flex gap-3 items-center w-fit">
                  <img
                    src={
                      ratingPending.items[0].variant.image ||
                      ratingPending.items[0].variant.product.images[0]
                    }
                    className="w-14 h-14 object-cover rounded-lg"
                  />
                  <div>
                    <Link
                      to={`/${ratingPending.items[0].variant.product.category?.slug}/${ratingPending.items[0].variant.product.slug}`}
                      className="line-clamp-1 hover:text-primary"
                    >
                      {ratingPending.items[0].variant.product.name}
                    </Link>
                  </div>
                </div>
                <div className="flex flex-col justify-end">
                  <Link to="#" className="py-1 px-3 bg-primary text-util rounded-md hover:text-util">
                    Đánh giá
                  </Link>
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default UserRatingsPending;

// border border-[#f1f1f1] rounded-md
