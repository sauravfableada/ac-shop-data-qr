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
        // Disable foreign key checks for dropping tables
        Schema::disableForeignKeyConstraints();

        // 1. Drop existing placeholder tables if they exist
        Schema::dropIfExists('service_parts');
        Schema::dropIfExists('service_images');
        Schema::dropIfExists('services');
        Schema::dropIfExists('ac_units');
        Schema::dropIfExists('spare_parts');

        // Re-enable checks
        Schema::enableForeignKeyConstraints();

        // 2. Create ac_units table
        Schema::create('ac_units', function (Blueprint $table) {
            $table->id();
            $table->foreignId('customer_id')->constrained('customers')->cascadeOnDelete();
            $table->string('ac_code')->unique();
            $table->string('brand')->nullable();
            $table->string('model')->nullable();
            $table->string('serial_number')->nullable();
            $table->string('ac_type')->nullable();
            $table->string('capacity')->nullable();
            $table->string('inverter_type')->nullable(); // e.g., Inverter, Non-Inverter
            $table->date('installation_date')->nullable();
            $table->date('purchase_date')->nullable();
            $table->date('warranty_start_date')->nullable();
            $table->date('warranty_end_date')->nullable();
            $table->string('installation_location')->nullable(); // e.g., Office, Home
            $table->string('floor')->nullable();
            $table->string('room')->nullable();
            $table->string('indoor_unit_number')->nullable();
            $table->string('outdoor_unit_number')->nullable();
            $table->string('current_condition')->nullable();
            $table->enum('status', ['active', 'inactive'])->default('active');
            $table->text('notes')->nullable();
            $table->timestamps();
            $table->softDeletes();
        });

        // 3. Create ac_qr_codes table
        Schema::create('ac_qr_codes', function (Blueprint $table) {
            $table->id();
            $table->foreignId('ac_unit_id')->constrained('ac_units')->cascadeOnDelete();
            $table->string('token')->unique();
            $table->string('qr_code_path')->nullable();
            $table->timestamp('generated_at')->useCurrent();
            $table->timestamp('last_scanned_at')->nullable();
            $table->enum('status', ['active', 'inactive'])->default('active');
            $table->timestamps();
        });

        // 4. Create service_records table
        Schema::create('service_records', function (Blueprint $table) {
            $table->id();
            $table->string('service_number')->unique();
            $table->foreignId('customer_id')->constrained('customers')->cascadeOnDelete();
            $table->foreignId('ac_unit_id')->constrained('ac_units')->cascadeOnDelete();
            $table->foreignId('staff_id')->nullable()->constrained('users')->nullOnDelete();
            $table->string('service_type')->nullable(); // Kept as string for simplicity, or could be foreignId
            $table->date('service_date');
            $table->text('complaint')->nullable();
            $table->text('diagnosis')->nullable();
            $table->text('work_performed')->nullable();
            $table->enum('status', ['pending', 'in_progress', 'completed', 'cancelled'])->default('pending');
            $table->decimal('labor_charge', 10, 2)->default(0);
            $table->decimal('parts_charge', 10, 2)->default(0);
            $table->decimal('discount', 10, 2)->default(0);
            $table->decimal('tax', 10, 2)->default(0);
            $table->decimal('total_amount', 10, 2)->default(0);
            $table->enum('payment_status', ['unpaid', 'partial', 'paid'])->default('unpaid');
            $table->date('next_service_date')->nullable();
            $table->text('technician_notes')->nullable();
            $table->text('customer_notes')->nullable();
            $table->timestamps();
            $table->softDeletes();
        });

        // 5. Create spare_parts table
        Schema::create('spare_parts', function (Blueprint $table) {
            $table->id();
            $table->string('part_code')->unique();
            $table->string('name');
            $table->string('brand')->nullable();
            $table->string('category')->nullable();
            $table->text('description')->nullable();
            $table->decimal('purchase_price', 10, 2)->default(0);
            $table->decimal('selling_price', 10, 2)->default(0);
            $table->integer('stock_quantity')->default(0);
            $table->integer('minimum_stock')->default(0);
            $table->string('unit')->default('pcs');
            $table->enum('status', ['active', 'inactive'])->default('active');
            $table->timestamps();
            $table->softDeletes();
        });

        // 6. Create service_parts table
        Schema::create('service_parts', function (Blueprint $table) {
            $table->id();
            $table->foreignId('service_id')->constrained('service_records')->cascadeOnDelete();
            $table->foreignId('spare_part_id')->constrained('spare_parts')->cascadeOnDelete();
            $table->integer('quantity')->default(1);
            $table->decimal('unit_price', 10, 2)->default(0);
            $table->decimal('total_price', 10, 2)->default(0);
            $table->timestamps();
        });

        // 7. Create service_images table
        Schema::create('service_images', function (Blueprint $table) {
            $table->id();
            $table->foreignId('service_id')->constrained('service_records')->cascadeOnDelete();
            $table->string('type')->default('general'); // e.g., before, after, general
            $table->string('file_path');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::disableForeignKeyConstraints();
        Schema::dropIfExists('service_images');
        Schema::dropIfExists('service_parts');
        Schema::dropIfExists('spare_parts');
        Schema::dropIfExists('service_records');
        Schema::dropIfExists('ac_qr_codes');
        Schema::dropIfExists('ac_units');
        Schema::enableForeignKeyConstraints();
    }
};
