<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\Product;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\Request;

class StatisticalController extends Controller
{
    public function doanhThu(Request $request)
    {
        $type = $request->type;
    
        $query = Order::query()->where('status_order', 'delivered');
    
        // Xử lý theo kiểu phân loại thời gian
        switch ($type) {
            case 'day':
                $query->whereDate('created_at', today());
                break;
            case 'month':
                $query->whereMonth('created_at', now()->month)
                      ->whereYear('created_at', now()->year);
                break;
            case '6months':
                $query->whereBetween('created_at', [
                    now()->subMonths(6)->startOfMonth(),
                    now()->endOfMonth()
                ]);
                break;
            case 'year':
                $query->whereYear('created_at', now()->year);
                break;
            case 'last_month':
                $query->whereMonth('created_at', now()->subMonth()->month)
                      ->whereYear('created_at', now()->year);
                break;
            case 'all':
            default:
                break;
        }
    
        // Tính tổng doanh thu
        $totalRevenue = $query->sum('final_total');

        // Lấy tất cả các đơn hàng thỏa mãn điều kiện
        $orders = $query->get(['created_at', 'final_total']);
    
        // Tạo mảng kết quả với định dạng [epoch_time, total_revenue]
        $result = $orders->map(function ($order) {
            return [
                Carbon::parse($order->created_at)->timestamp * 1000,
                (float)$order->final_total
            ];
        });
    
        return response()->json([
            'data' => $result,
            'total_revenue' => (float)$totalRevenue
        ]);
    }

    public function thongKeSanPham(Request $request)
{
    $type = $request->type ?? 'all';

    if (!in_array($type, ['all', 'day', 'month', '6months', 'year', 'last_month'])) {
        return response()->json([
            'error' => 'Tham số type không hợp lệ. Chỉ chấp nhận: all, day, month, 6months, year, last_month.',
        ], 400);
    }

    $totalProducts = Product::count();

    // Lấy điều kiện thời gian dựa trên tham số 'type'
    $dateCondition = $this->getDateCondition($type);

    // Thống kê doanh thu sản phẩm
    $topSellingProducts = Product::query()
        ->with([
            'variants' => function ($query) use ($dateCondition) {
                $query->withSum(['orderItems' => function ($query) use ($dateCondition) {
                    $query->select('order_items.total_price') // Chỉ select total_price
                        ->join('orders', 'orders.id', '=', 'order_items.order_id');
                    if ($dateCondition) {
                        $dateCondition($query, 'orders.created_at');
                    }
                }], 'total_price');
            }
        ])
        ->get()
        ->map(function ($product) {
            $product->total_revenue = $product->variants->sum('order_items_sum_total_price') ?? 0;
            $product->images = json_decode($product->images, true);
            return $product;
        })
        ->sortByDesc('total_revenue')
        ->values()
        ->take(10);

    // Thống kê sản phẩm theo đánh giá cao nhất
    $topRatedProductsQuery = Product::query()
        ->withAvg('rates', 'rating')
        ->having('rates_avg_rating', '>', 0);
    
    if ($dateCondition) {
        $topRatedProductsQuery->whereHas('rates', function($query) use ($dateCondition) {
            $dateCondition($query, 'rates.created_at');
        });
    }

    $topRatedProducts = $topRatedProductsQuery
        ->orderByDesc('rates_avg_rating')
        ->take(10)
        ->get();

    // Thống kê sản phẩm theo đánh giá thấp nhất
    $lowestRatedProductsQuery = Product::query()
        ->withAvg('rates', 'rating')
        ->having('rates_avg_rating', '>', 0);
    
    if ($dateCondition) {
        $lowestRatedProductsQuery->whereHas('rates', function($query) use ($dateCondition) {
            $dateCondition($query, 'rates.created_at');
        });
    }

    $lowestRatedProducts = $lowestRatedProductsQuery
        ->orderBy('rates_avg_rating')
        ->take(10)
        ->get();

    return response()->json([
        'total_products' => $totalProducts,
        'top_selling_products' => $topSellingProducts,
        'top_rated_products' => $topRatedProducts,
        'lowest_rated_products' => $lowestRatedProducts,
    ]);
}

private function getDateCondition($type)
{
    switch ($type) {
        case 'day':
            return function ($query, $dateColumn) {
                $query->whereDate($dateColumn, today());
            };
        case 'month':
            return function ($query, $dateColumn) {
                $query->whereMonth($dateColumn, now()->month)
                    ->whereYear($dateColumn, now()->year);
            };
        case '6months':
            return function ($query, $dateColumn) {
                $query->whereBetween($dateColumn, [
                    now()->subMonths(6)->startOfMonth(),
                    now()->endOfMonth()
                ]);
            };
        case 'year':
            return function ($query, $dateColumn) {
                $query->whereYear($dateColumn, now()->year);
            };
        case 'last_month':
            return function ($query, $dateColumn) {
                $query->whereMonth($dateColumn, now()->subMonth()->month)
                    ->whereYear($dateColumn, now()->year);
            };
        default:
            return null;
    }
}



    //thống kê đơn hangf
    public function thongKeDonHang(Request $request)
    {
        $type = $request->query('type', 'all'); // Loại thống kê: 'all', 'day', 'month', '6months', 'year', 'last_month'

        // Tạo query cơ bản để áp dụng điều kiện thời gian
        $baseQuery = Order::query();

        if (!in_array($type, ['all', 'day', 'month', '6months', 'year', 'last_month'])) {
            return response()->json([
                'error' => 'Tham số type không hợp lệ. Chỉ chấp nhận: all, day, month, 6months, year, last_month.',
            ], 400);
        }

        // Áp dụng điều kiện thời gian
        $baseQuery->when($type === 'day', fn($q) => $q->whereDate('created_at', now()))
            ->when($type === 'month', fn($q) => $q->whereMonth('created_at', now()->month)
                ->whereYear('created_at', now()->year))
            ->when($type === '6months', fn($q) => $q->whereBetween('created_at', [
                now()->subMonths(6)->startOfDay(),
                now()->endOfDay()
            ]))
            ->when($type === 'year', fn($q) => $q->whereYear('created_at', now()->year))
            ->when($type === 'last_month', fn($q) => $q->whereMonth('created_at', now()->subMonth()->month)
                ->whereYear('created_at', now()->subMonth()->year));

        // Tổng số đơn hàng
        $totalOrders = $baseQuery->count();

        // Đơn hàng đã giao
        $deliveredOrders = (clone $baseQuery)
            ->where('status_order', Order::STATUS_ORDER_DELIVERED)
            ->count();

        // Đơn hàng bị hủy
        $canceledOrders = (clone $baseQuery)
            ->where('status_order', Order::STATUS_ORDER_CANCELED)
            ->count();

        // Thống kê theo phương thức thanh toán
        $paymentMethods = $baseQuery->select('payment_method', DB::raw('COUNT(*) as count'))
            ->groupBy('payment_method')
            ->get();

        return response()->json([
            'total_orders' => $totalOrders,
            'delivered_orders' => $deliveredOrders,
            'canceled_orders' => $canceledOrders,
            'payment_methods' => $paymentMethods,
        ]);
    }






}
