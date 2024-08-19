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
        Schema::create('orders', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
            $table->integer('grand_total');
            $table->integer('final_total')->nullable();
            $table->string('payment_method');
            $table->string('payment_status')->default('pending');
            $table->string('status')->default('new');
            $table->text('notes')->nullable();
            $table->string('full_name');
            $table->string('phone_number');
            $table->string('city');
            $table->string('district');
            $table->string('address');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('orders');
    }
};
