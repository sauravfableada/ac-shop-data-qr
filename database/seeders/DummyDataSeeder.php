<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Customer;
use App\Models\AcUnit;
use App\Models\ServiceRecord;
use App\Models\User;
use Illuminate\Support\Str;
use Faker\Factory as Faker;

class DummyDataSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $faker = Faker::create();
        
        $staff = User::where('email', 'staff@example.com')->first();
        if (!$staff) {
            $staff = User::first();
        }

        // Create 20 Customers
        for ($i = 1; $i <= 20; $i++) {
            $customer = Customer::create([
                'customer_code' => 'CUST-10' . str_pad($i, 2, '0', STR_PAD_LEFT),
                'full_name' => $faker->name,
                'mobile' => $faker->numerify('##########'),
                'whatsapp_no' => $faker->numerify('##########'),
                'email' => $faker->unique()->safeEmail,
                'address' => $faker->address,
                'city' => $faker->city,
                'status' => 'active'
            ]);

            // Create 1 or 2 AC Units for each customer
            $numAcs = rand(1, 2);
            for ($j = 1; $j <= $numAcs; $j++) {
                $ac = AcUnit::create([
                    'ac_code' => 'AC-' . $customer->id . '-' . $j,
                    'customer_id' => $customer->id,
                    'brand' => $faker->randomElement(['LG', 'Samsung', 'Daikin', 'Voltas', 'Blue Star', 'Mitsubishi']),
                    'model' => $faker->word . ' ' . $faker->randomElement(['1.0T', '1.5T', '2.0T']),
                    'serial_number' => strtoupper($faker->bothify('SN-####-????')),
                    'ac_type' => $faker->randomElement(['Split', 'Window', 'Cassette', 'Tower']),
                    'capacity' => $faker->randomElement(['1.0 Ton', '1.5 Ton', '2.0 Ton'])
                ]);

                \Illuminate\Support\Facades\DB::table('ac_qr_codes')->insert([
                    'ac_unit_id' => $ac->id,
                    'token' => Str::uuid()->toString(),
                    'generated_at' => now(),
                    'status' => 'active'
                ]);

                // Create 1 or 2 Service Records for each AC
                $numServices = rand(1, 2);
                for ($k = 1; $k <= $numServices; $k++) {
                    ServiceRecord::create([
                        'service_number' => 'SRV-2026-10' . str_pad($ac->id, 2, '0', STR_PAD_LEFT) . $k,
                        'customer_id' => $customer->id,
                        'ac_unit_id' => $ac->id,
                        'staff_id' => $staff ? $staff->id : null,
                        'service_date' => $faker->dateTimeBetween('-1 year', 'now'),
                        'service_type' => $faker->randomElement(['General Service', 'Deep Cleaning', 'Gas Refill', 'Repair', 'Installation']),
                        'complaint' => $faker->sentence,
                        'status' => $faker->randomElement(['completed', 'in_progress', 'pending']),
                        'labor_charge' => $faker->randomFloat(2, 20, 100),
                        'parts_charge' => 0,
                        'total_amount' => $faker->randomFloat(2, 20, 100),
                        'payment_status' => $faker->randomElement(['paid', 'unpaid'])
                    ]);
                }
            }
        }
    }
}
