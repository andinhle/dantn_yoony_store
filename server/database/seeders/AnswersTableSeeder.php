<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class AnswersTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('answers')->insert([
            // Câu trả lời cho câu hỏi 1: "Cần tìm loại quần áo nam nào?"
            ['text' => 'Chúng tôi có rất nhiều mẫu áo sơ mi và quần jeans phù hợp cho nam.', 'question_id' => 1],
            ['text' => 'Bạn có thể tham khảo các loại quần short hoặc áo phông, rất thích hợp cho mùa hè.', 'question_id' => 1],

            // Câu trả lời cho câu hỏi 2: "Kích cỡ ưa thích?"
            ['text' => 'Chúng tôi có đầy đủ các size từ S đến XL, bạn thích size nào?', 'question_id' => 2],
            ['text' => 'Bạn có thể cho chúng tôi biết chiều cao và cân nặng để tư vấn size phù hợp nhất.', 'question_id' => 2],

            // Câu trả lời cho câu hỏi 3: "Màu sắc nào cho quần áo?"
            ['text' => 'Màu đen và trắng là những màu cơ bản và dễ phối đồ.', 'question_id' => 3],
            ['text' => 'Nếu bạn thích sự nổi bật, chúng tôi có màu xanh dương và đỏ.', 'question_id' => 3],

            // Câu trả lời cho câu hỏi 4: "Thêm phụ kiện đi kèm không?"
            ['text' => 'Chúng tôi có nhiều phụ kiện đi kèm như thắt lưng, mũ lưỡi trai. Bạn có muốn thêm không?', 'question_id' => 4],
            ['text' => 'Bạn có thể thêm các phụ kiện như đồng hồ hoặc túi xách để hoàn thiện bộ đồ.', 'question_id' => 4],

            // Câu trả lời cho câu hỏi 5: "Chất liệu vải?"
            ['text' => 'Chúng tôi có vải cotton mềm mại và thoáng mát, rất phù hợp cho mùa hè.', 'question_id' => 5],
            ['text' => 'Ngoài ra, vải polyester cũng là một lựa chọn bền và dễ giặt ủi.', 'question_id' => 5],
        ]);
    }
}
