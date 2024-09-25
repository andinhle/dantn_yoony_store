export interface IVoucher {
    id?: string;                // ID của voucher
    code: string;              // Mã voucher
    discount: number;          // Mức giảm giá (số % hoặc giá trị khác)
    discount_type: number;     // Loại giảm giá (ví dụ: phần trăm, số tiền cụ thể)
    min_order_value: number; // Giá trị đơn hàng tối thiểu để áp dụng voucher
    max_order_value: number;   // Giá trị đơn hàng tối đa để áp dụng voucher
    usage_limit: number;      // Giới hạn số lần sử dụng
    start_date: string;        // Ngày bắt đầu (định dạng YYYY-MM-DD)
    end_date: string;          // Ngày kết thúc (định dạng YYYY-MM-DD)
    status: boolean;           // Trạng thái voucher (kích hoạt hay không)
    is_featured: boolean;      // Đánh dấu voucher nổi bật hay không
  }
  