<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class StoreAcUnitRequest extends FormRequest
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
            'ac_code' => 'required|string|unique:ac_units',
            'customer_id' => 'required|exists:customers,id',
            'brand' => 'nullable|string|max:100',
            'model' => 'nullable|string|max:100',
            'serial_number' => 'nullable|string|max:100',
            'ac_type' => 'nullable|string|max:100',
            'capacity' => 'nullable|string|max:50',
            'is_inverter' => 'boolean',
            'installation_date' => 'nullable|date',
            'warranty' => 'nullable|string|max:100',
            'location' => 'nullable|string|max:100',
            'room' => 'nullable|string|max:100',
            'floor' => 'nullable|string|max:50',
            'indoor_unit_number' => 'nullable|string|max:100',
            'outdoor_unit_number' => 'nullable|string|max:100',
            'condition' => 'nullable|string|max:255',
            'status' => 'nullable|in:active,inactive',
        ];
    }
}
