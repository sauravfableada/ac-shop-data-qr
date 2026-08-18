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

        $this->call([
            DummyDataSeeder::class,
        ]);
    }
}
