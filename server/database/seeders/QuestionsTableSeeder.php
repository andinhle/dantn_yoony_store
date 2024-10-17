<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class QuestionsTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('questions')->delete();

        DB::statement('ALTER TABLE questions AUTO_INCREMENT = 1');

        DB::table('questions')->insert([
            ['text' => 'Cần tìm loại quần áo nam nào?'],
            ['text' => 'Kích cỡ ưa thích?'],
            ['text' => 'Màu sắc nào cho quần áo?'],
            ['text' => 'Thêm phụ kiện đi kèm không?'],
            ['text' => 'Chất liệu vải?'],
        ]);
    }
}
