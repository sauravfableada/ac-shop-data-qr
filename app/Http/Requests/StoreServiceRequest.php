<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class StoreServiceRequest extends FormRequest
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
    public function prepareForValidation()
    {
        // Auto-populate customer_id from ac_unit_id
        if ($this->has('ac_unit_id') && !$this->has('customer_id')) {
            $acUnit = \App\Models\AcUnit::find($this->ac_unit_id);
            if ($acUnit) {
                $this->merge([
                    'customer_id' => $acUnit->customer_id,
                ]);
            }
        }
        
        // Map frontend fields to backend fields
        if ($this->has('work_done')) {
            $this->merge(['work_performed' => $this->work_done]);
        }
        if ($this->has('next_maintenance_date')) {
            $this->merge(['next_service_date' => $this->next_maintenance_date]);
        }
    }

    public function rules(): array
    {
        return [
            'customer_id' => 'required|exists:customers,id',
            'ac_unit_id' => 'required|exists:ac_units,id',
            'technician_id' => 'nullable|exists:users,id',
            'service_date' => 'required|date',
            'service_type' => 'required|string|max:100',
            'complaint' => 'nullable|string',
            'diagnosis' => 'nullable|string',
            'work_performed' => 'nullable|string',
            'status' => 'nullable|in:pending,assigned,in_progress,completed,cancelled',
            'labor_charge' => 'nullable|numeric|min:0',
            'parts_charge' => 'nullable|numeric|min:0',
            'discount' => 'nullable|numeric|min:0',
            'tax' => 'nullable|numeric|min:0',
            'total_amount' => 'nullable|numeric|min:0',
            'payment_status' => 'nullable|in:unpaid,partial,paid',
            'next_service_date' => 'nullable|date',
            'technician_notes' => 'nullable|string',
        ];
    }
}
