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
        Schema::table('service_records', function (Blueprint $table) {
            $table->string('payment_method')->nullable()->after('payment_status');
            $table->decimal('copper_pipe_charge', 10, 2)->default(0)->after('parts_charge');
            $table->decimal('miter_charge', 10, 2)->default(0)->after('copper_pipe_charge');
            $table->dropColumn('discount');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('service_records', function (Blueprint $table) {
            $table->dropColumn(['payment_method', 'copper_pipe_charge', 'miter_charge']);
            $table->decimal('discount', 10, 2)->default(0)->after('parts_charge');
        });
    }
};
