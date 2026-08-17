<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class UpdateServiceRequest extends FormRequest
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
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'customer_id' => 'sometimes|required|exists:customers,id',
            'ac_unit_id' => 'sometimes|required|exists:ac_units,id',
            'technician_id' => 'nullable|exists:users,id',
            'service_date' => 'sometimes|required|date',
            'service_type' => 'sometimes|required|string|max:100',
            'complaint' => 'nullable|string',
            'diagnosis' => 'nullable|string',
            'work_performed' => 'nullable|string',
            'status' => 'nullable|in:pending,assigned,in_progress,completed,cancelled',
            'labor_charge' => 'nullable|numeric|min:0',
            'parts_charge' => 'nullable|numeric|min:0',
            'discount' => 'nullable|numeric|min:0',
            'tax' => 'nullable|numeric|min:0',
            'total' => 'nullable|numeric|min:0',
            'payment_status' => 'nullable|in:unpaid,partial,paid',
            'next_service_date' => 'nullable|date',
            'notes' => 'nullable|string',
        ];
    }
}
