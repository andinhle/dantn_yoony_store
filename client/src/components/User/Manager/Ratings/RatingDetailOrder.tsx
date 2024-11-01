import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { message, Rate } from "antd";
import instance from "../../../../instance/instance";
import { IRatingOrder } from "../../../../interfaces/IRating";

// Constants
const RATING_DATA = [
  { value: 1, text: "Tệ", color: "#FF9900" },
  { value: 2, text: "Không hài lòng", color: "#FFA940" },
  { value: 3, text: "Bình thường", color: "#FAAD14" },
  { value: 4, text: "Hài lòng 👍", color: "#52C41A" },
  { value: 5, text: "Tuyệt vời 🎉", color: "#28A745" },
] as const;

// Types
interface RatingItemProps {
  image: string;
  name: string;
  categorySlug?: string;
  productSlug: string;
  initialRating?: number;
  onSubmit: (data: { rating: number; content: string }) => void;
}

const ProductRatingItem = ({
  image,
  name,
  categorySlug,
  productSlug,
  initialRating = undefined,
  onSubmit,
}: RatingItemProps) => {
  const [rating, setRating] = useState(initialRating);
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleRatingChange = (newValue: number) => {
    setRating(newValue);
  };

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
  };

  const handleSubmit = async () => {
    if (!rating) {
        message.error("Vui lòng chọn số sao đánh giá!");
      return;
    }

    if (!content.trim()) {
      message.error("Vui lòng nhập nội dung đánh giá!");
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit({ rating, content });
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="border border-[#f1f1f1] rounded-md p-3 space-y-3">
      <div className="flex gap-3 items-center w-fit">
        <img
          src={image}
          alt={name}
          className="h-14 w-14 object-cover rounded-lg"
        />
        <div className="flex flex-col justify-between gap-1">
          <Link
            to={`/${categorySlug}/${productSlug}`}
            className="line-clamp-1 hover:text-primary"
          >
            {name}
          </Link>
        </div>
      </div>
      <div>
        <Rate value={rating} onChange={handleRatingChange} />
        {rating && rating !==0 ? (
          <span
            className="ml-2"
            style={{ color: RATING_DATA[rating - 1].color }}
          >
            {RATING_DATA[rating - 1].text}
          </span>
        ):""}
      </div>
      <div>
        <textarea
          className="w-full placeholder:text-sm p-2 border border-gray-200 rounded-md min-h-[100px] focus:outline-none focus:border-primary resize-none"
          placeholder="Chia sẻ đánh giá của bạn về sản phẩm..."
          value={content}
          onChange={handleContentChange}
        />
      </div>

      <div className=" flex justify-end">
        <button
          className={`py-1.5 px-3 text-sm bg-primary text-white rounded-md hover:bg-primary/90 transition-colors
            ${isSubmitting ? "opacity-50 cursor-not-allowed" : ""}`}
          onClick={handleSubmit}
          disabled={isSubmitting}
        >
          {isSubmitting ? "Đang gửi..." : "Gửi đánh giá"}
        </button>
      </div>
    </div>
  );
};

const useRatingDetail = (codeOrder: string) => {
  const [ratingDetail, setRatingDetail] = useState<IRatingOrder>();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchRatingDetail = async () => {
      try {
        const { data } = await instance.get(
          `orders/detail-reviews/${codeOrder}`
        );
        setRatingDetail(data);
      } catch (err) {
        setError(err as Error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRatingDetail();
  }, [codeOrder]);

  return { ratingDetail, isLoading, error };
};

const RatingDetailOrder = () => {
  const { code_order } = useParams<{ code_order: string }>();
  const { ratingDetail, isLoading, error } = useRatingDetail(code_order!);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  if (!ratingDetail) return <div>Dữ liệu rỗng</div>;

  const handleSubmitRating = (productId: number,orderId:number) => async (data: { rating: number; content: string }) => {
    try {
      await instance.post(`ratings/review`, {
        order_id: orderId,
        review:[
            {
                product_id:productId,
                rating: data.rating,
                content: data.content,
            }
        ]
      });
      message.success("Đánh giá thành công!");
    } catch (error) {
      console.error("Error submitting rating:", error);
      throw error;
    }
  };

  return (
    <div className="bg-util border border-[#f1f1f1] rounded-md p-4 min-h-screen space-y-5">
      <h3 className="uppercase font-medium text-sm border-b pb-4 border-[#f1f1f1]">
        Đánh giá đơn hàng <span className="text-primary">#{code_order}</span>
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {ratingDetail.items.map((item, index) => {
          const isMultipleVariants = item.variant_lists.length !== 1;
          if (isMultipleVariants) {
            return (
              <ProductRatingItem
                key={`product-${index}`}
                image={item.product.images[0]}
                name={item.product.name}
                categorySlug={item.product.category?.slug}
                productSlug={item.product.slug}
                onSubmit={handleSubmitRating(item.product.id,ratingDetail.order_id)}
              />
            );
          }

          const variant = item.variant_lists[0].variant;
          return (
            <ProductRatingItem
              key={`variant-${index}`}
              image={variant.image || variant.product.images[0]}
              name={variant.product.name}
              categorySlug={variant.product.category?.slug}
              productSlug={variant.product.slug}
              onSubmit={handleSubmitRating(variant.product.id,ratingDetail.order_id)}
            />
          );
        })}
      </div>
    </div>
  );
};

export default RatingDetailOrder;
