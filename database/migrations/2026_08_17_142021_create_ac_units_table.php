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
        Schema::create('ac_units', function (Blueprint $table) {
            $table->id();
            $table->string('ac_code')->unique();
            $table->foreignId('customer_id')->constrained()->cascadeOnDelete();
            $table->string('qr_token')->unique(); // For secure QR scanning
            $table->string('brand')->nullable();
            $table->string('model')->nullable();
            $table->string('serial_number')->nullable();
            $table->string('ac_type')->nullable(); // Split, Window, Cassette, etc.
            $table->string('capacity')->nullable(); // 1 Ton, 1.5 Ton, 2 Ton
            $table->boolean('is_inverter')->default(false);
            $table->date('installation_date')->nullable();
            $table->string('warranty')->nullable(); // e.g., 1 Year Comprehensive, 5 Years Compressor
            $table->string('location')->nullable(); // e.g., Office, Home
            $table->string('room')->nullable(); // e.g., Master Bedroom, Server Room
            $table->string('floor')->nullable();
            $table->string('indoor_unit_number')->nullable();
            $table->string('outdoor_unit_number')->nullable();
            $table->string('condition')->nullable(); // e.g., Good, Needs Repair, Gas Leak
            $table->enum('status', ['active', 'inactive'])->default('active');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('ac_units');
    }
};
