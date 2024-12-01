import { z } from "zod";

const VoucherSchemaValid = z.object({
  code: z
    .string({
      required_error: "Không được để trống !",
    })
    .min(3, "Tối thiểu 3 kí tự !"),

  name: z.string({
    required_error: "Không được để trống !",
  }).min(10, "Tối thiểu 10 kí tự !"),

  description: z.string({
    required_error: "Không được để trống !",
  }).min(10, "Tối thiểu 10 kí tự !"),

  discount: z.coerce.number({
    required_error: "Bắt buộc !",
    invalid_type_error: "Phải là số !",
  }).min(0, "Giá trị phải là số dương"),

  discount_type: z.enum(["fixed", "percentage"], {
    required_error: "Phải chọn loại giảm giá !",
  }),

  usage_limit: z.coerce.number({
    required_error: "Bắt buộc !",
    invalid_type_error: "Phải là số !",
  }).min(0, "Giới hạn sử dụng phải là số dương"),

  min_order_value: z.coerce.number({
    invalid_type_error: "Giá trị đơn tối thiểu"
  }).min(0, "Giá trị đơn tối thiểu phải là số dương").optional(),

  max_order_value: z.coerce.number({
    invalid_type_error: "Giá trị đơn tối đa"
  }).min(0, "Giá trị đơn tối đa phải là số dương").optional(),

  start_date: z.union([
    z.string().optional(), 
    z.null().optional()
  ]),

  end_date: z.union([
    z.string().optional(), 
    z.null().optional()
  ]),

  status: z.boolean().optional().default(true),
}).refine((data) => {
  if (data.start_date && data.end_date) {
    return new Date(data.end_date) > new Date(data.start_date);
  }
  return true;
}, {
  message: "Ngày kết thúc phải sau ngày bắt đầu",
  path: ["end_date"]
}).transform((data) => {
  // Loại bỏ các trường rỗng
  return Object.fromEntries(
    Object.entries(data).filter(([_, value]) => 
      value !== '' && value !== null && value !== undefined
    )
  );
});

export default VoucherSchemaValid;