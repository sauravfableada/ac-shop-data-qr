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
        Schema::table('ac_units', function (Blueprint $table) {
            $table->unsignedBigInteger('created_by')->nullable()->after('id');
            $table->unsignedBigInteger('updated_by')->nullable()->after('created_by');
            $table->unsignedBigInteger('assign_staff')->nullable()->after('updated_by');
        });

        Schema::table('service_records', function (Blueprint $table) {
            $table->dropForeign(['staff_id']);
            $table->renameColumn('staff_id', 'assign_staff');
        });

        Schema::table('service_records', function (Blueprint $table) {
            $table->unsignedBigInteger('created_by')->nullable()->after('id');
            $table->unsignedBigInteger('updated_by')->nullable()->after('created_by');
            $table->foreign('assign_staff')->references('id')->on('users')->onDelete('set null');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('ac_units', function (Blueprint $table) {
            $table->dropColumn(['created_by', 'updated_by', 'assign_staff']);
        });

        Schema::table('service_records', function (Blueprint $table) {
            $table->dropForeign(['assign_staff']);
            $table->dropColumn(['created_by', 'updated_by']);
            $table->renameColumn('assign_staff', 'staff_id');
        });
        
        Schema::table('service_records', function (Blueprint $table) {
            $table->foreign('staff_id')->references('id')->on('users')->onDelete('set null');
        });
    }
};
