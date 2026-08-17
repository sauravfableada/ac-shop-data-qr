<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Role;
use App\Models\Permission;
use App\Models\Customer;
use App\Models\AcUnit;
use App\Models\SparePart;
use App\Models\Service;
use App\Models\ServicePart;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // 1. Roles & Permissions
        $adminRole = Role::create(['name' => 'admin']);
        $staffRole = Role::create(['name' => 'staff']);
        
        $permView = Permission::create(['name' => 'service.view']);
        $permCreate = Permission::create(['name' => 'service.create']);
        $permCust = Permission::create(['name' => 'customer.view']);
        $permAc = Permission::create(['name' => 'ac.view']);
        $permDashAdmin = Permission::create(['name' => 'dashboard.admin']);
        
        $adminRole->permissions()->attach([$permView->id, $permCreate->id, $permCust->id, $permAc->id, $permDashAdmin->id]);
        $staffRole->permissions()->attach([$permView->id, $permCust->id, $permAc->id]);

        // 2. Users (Admin and Staff)
        $admin = User::create([
            'name' => 'Admin User',
            'email' => 'admin@example.com',
            'password' => Hash::make('password'),
        ]);
        $admin->roles()->attach($adminRole->id);

        $staff = User::create([
            'name' => 'Tech Staff',
            'email' => 'staff@example.com',
            'password' => Hash::make('password'),
        ]);
        $staff->roles()->attach($staffRole->id);

        // 3. Customers
        $customer1 = Customer::create([
            'customer_code' => 'CUST-001',
            'full_name' => 'John Doe',
            'mobile' => '1234567890',
            'city' => 'New York',
            'status' => 'active'
        ]);
        
        $customer2 = Customer::create([
            'customer_code' => 'CUST-002',
            'full_name' => 'Acme Corp',
            'company_name' => 'Acme Corp',
            'mobile' => '9876543210',
            'customer_type' => 'company',
            'status' => 'active'
        ]);

        // 4. AC Units
        $ac1 = AcUnit::create([
            'ac_code' => 'AC-001',
            'customer_id' => $customer1->id,
            'qr_token' => Str::uuid()->toString(),
            'brand' => 'Daikin',
            'model' => 'Inverter 1.5T',
            'status' => 'active'
        ]);

        $ac2 = AcUnit::create([
            'ac_code' => 'AC-002',
            'customer_id' => $customer2->id,
            'qr_token' => Str::uuid()->toString(),
            'brand' => 'LG',
            'model' => 'Dual Inverter 2.0T',
            'status' => 'active'
        ]);

        // 5. Spare Parts
        $part1 = SparePart::create([
            'name' => 'Compressor 1.5T',
            'part_code' => 'COMP-15',
            'price' => 120.00,
            'quantity' => 10,
        ]);
        
        $part2 = SparePart::create([
            'name' => 'R32 Refrigerant',
            'part_code' => 'GAS-R32',
            'price' => 45.50,
            'quantity' => 50,
        ]);

        // 6. Services
        $service1 = Service::create([
            'service_number' => 'SRV-2026-00001',
            'customer_id' => $customer1->id,
            'ac_unit_id' => $ac1->id,
            'technician_id' => $staff->id,
            'service_date' => now()->subDays(2),
            'service_type' => 'Deep Cleaning',
            'status' => 'completed',
            'labor_charge' => 50.00,
            'total' => 50.00,
            'payment_status' => 'paid',
        ]);

        $service2 = Service::create([
            'service_number' => 'SRV-2026-00002',
            'customer_id' => $customer2->id,
            'ac_unit_id' => $ac2->id,
            'technician_id' => $staff->id,
            'service_date' => now(),
            'service_type' => 'Gas Refill',
            'status' => 'assigned',
            'labor_charge' => 40.00,
            'parts_charge' => 45.50,
            'total' => 85.50,
            'payment_status' => 'unpaid',
        ]);

        ServicePart::create([
            'service_id' => $service2->id,
            'spare_part_id' => $part2->id,
            'quantity' => 1,
            'price' => 45.50,
        ]);
    }
}
