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

  discount: z.number({
    required_error: "Bắt buộc !",
    invalid_type_error: "Phải là số !",
  }),
  discount_type: z.string().optional(),

  usage_limit: z.number({
    required_error: "Bắt buộc !",
    invalid_type_error: "Phải là số !",
  }),
  min_order_value: z.union([z.string().optional(), z.null().optional()]).default(null)
  .refine((val) => val === undefined || Number(val) >= 0, { 
    message: "Giá trị phải là số dương" 
  }),

  max_order_value: z.union([z.string().optional(), z.null().optional()]).default(null)
  .refine((val) => val === undefined || Number(val) >= 0, { 
    message: "Giá trị phải là số dương" 
  }),

  start_date: z.union([z.string().optional(), z.null().optional()]).default(null),
  end_date: z.union([z.string().optional(), z.null().optional()]).default(null),

  status: z.boolean().optional(),

});

export default VoucherSchemaValid;
