<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ProductRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        // For update, images are optional. For create, images are optional as well but must be images if provided.
        return [
            'name' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'price' => ['required', 'numeric', 'min:0'],
            'category_id' => ['required', 'exists:categories,id'],
            'status' => ['required', 'in:active,inactive'],
            'images' => ['nullable', 'array'],
            'images.*' => ['nullable', 'file', 'image', 'max:5120'], // 5MB per file
            // When editing, we can keep existing image paths from client
            'existing_images' => ['nullable', 'array'],
            'existing_images.*' => ['string'],
        ];
    }
}
