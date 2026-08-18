<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class UpdateCustomerRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'customer_code' => 'sometimes|required|string|unique:customers,customer_code,' . ($this->route('customer')->id ?? $this->route('customer')),
            'full_name' => 'sometimes|required|string|max:255',
            'company_name' => 'nullable|string|max:255',
            'mobile' => 'sometimes|required|string|max:20',
            'alternate_mobile' => 'nullable|string|max:20',
            'email' => 'nullable|email|max:255',
            'address' => 'nullable|string',
            'city' => 'nullable|string|max:100',
            'state' => 'nullable|string|max:100',
            'country' => 'nullable|string|max:100',
            'pincode' => 'nullable|string|max:20',
            'gst_number' => 'nullable|string|max:50',
            'customer_type' => 'nullable|in:individual,company',
            'notes' => 'nullable|string',
            'status' => 'nullable|in:active,inactive',
            'whatsapp_no' => 'nullable|string|max:20',
            'image' => 'nullable|image|max:2048',
            'dob' => 'nullable|date',
        ];
    }
}
