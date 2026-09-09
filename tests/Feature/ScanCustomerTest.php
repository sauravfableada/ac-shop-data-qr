<?php

namespace Tests\Feature;

use App\Models\AcUnit;
use App\Models\Customer;
use App\Models\Permission;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ScanCustomerTest extends TestCase
{
    use RefreshDatabase;

    protected function migrateFreshUsing(): array
    {
        // The repository contains duplicate Passport migrations; these tests use actingAs.
        return ['--path' => array_values(array_filter(
            glob(database_path('migrations/*.php')),
            fn ($path) => !str_contains(basename($path), 'oauth_')
        )), '--realpath' => true];
    }
    private function signIn(bool $authorized = true): User
    {
        $user = User::factory()->create();
        if ($authorized) {
            foreach (['qr.view', 'customer.create', 'ac.edit', 'ac.view'] as $name) {
                $user->permissions()->attach(Permission::firstOrCreate(['name' => $name], ['module' => 'AC Unit']));
            }
        }
        $this->actingAs($user, 'api');
        return $user;
    }

    public function test_customer_is_created_linked_and_returned_in_ac_selection(): void
    {
        $this->signIn();
        $unit = AcUnit::create(['ac_code' => 'AC-SCAN-1']);
        $response = $this->postJson("/api/ac-units/{$unit->id}/customer", ['full_name' => 'Scan Customer', 'mobile' => '9876543210']);
        $response->assertOk()->assertJsonPath('data.customer.full_name', 'Scan Customer');
        $this->assertSame($response->json('data.customer.id'), $unit->fresh()->customer_id);
        $this->getJson('/api/ac-units')->assertOk()->assertJsonPath('data.data.0.customer.full_name', 'Scan Customer');
    }

    public function test_existing_phone_is_reused_without_renaming_customer(): void
    {
        $this->signIn();
        $customer = Customer::create(['customer_code' => 'CUST-1', 'full_name' => 'Existing', 'mobile' => '9876543210']);
        $unit = AcUnit::create(['ac_code' => 'AC-SCAN-2']);
        $this->postJson("/api/ac-units/{$unit->id}/customer", ['full_name' => 'Different Name', 'mobile' => '9876543210'])
            ->assertOk()->assertJsonPath('data.customer.id', $customer->id)->assertJsonPath('data.customer.full_name', 'Existing');
        $this->assertDatabaseCount('customers', 1);
    }

    public function test_repeat_save_does_not_replace_assigned_customer(): void
    {
        $this->signIn();
        $customer = Customer::create(['customer_code' => 'CUST-1', 'full_name' => 'Existing', 'mobile' => '9876543210']);
        $unit = AcUnit::create(['ac_code' => 'AC-SCAN-3', 'customer_id' => $customer->id]);
        $this->postJson("/api/ac-units/{$unit->id}/customer", ['full_name' => 'Other', 'mobile' => '9876543211'])
            ->assertOk()->assertJsonPath('data.customer.id', $customer->id);
        $this->assertDatabaseCount('customers', 1);
    }

    public function test_invalid_input_cannot_create_customer_or_link_unit(): void
    {
        $this->signIn();
        $unit = AcUnit::create(['ac_code' => 'AC-SCAN-4']);
        $this->postJson("/api/ac-units/{$unit->id}/customer", ['full_name' => ' ', 'mobile' => 'invalid'])
            ->assertUnprocessable()->assertJsonValidationErrors(['full_name', 'mobile']);
        $this->assertDatabaseCount('customers', 0);
        $this->assertNull($unit->fresh()->customer_id);
    }

    public function test_missing_permissions_prevent_customer_assignment(): void
    {
        $this->signIn(false);
        $unit = AcUnit::create(['ac_code' => 'AC-SCAN-5']);
        $this->postJson("/api/ac-units/{$unit->id}/customer", ['full_name' => 'Other', 'mobile' => '9876543210'])->assertForbidden();
        $this->assertDatabaseCount('customers', 0);
    }
}