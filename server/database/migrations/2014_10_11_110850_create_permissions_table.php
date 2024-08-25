<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('permissions', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->boolean('category_management')->default(false);
            $table->boolean('product_management')->default(false);
            $table->boolean('account_management')->default(false);
            $table->boolean('order_management')->default(false);
            $table->boolean('coupon_management')->default(false);
            $table->boolean('rate_management')->default(false);
            $table->boolean('blog_management')->default(false);
            $table->boolean('banner_management')->default(false);
            $table->boolean('statistical')->default(false);
            $table->boolean('all')->default(false);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('permissions');
    }
};
