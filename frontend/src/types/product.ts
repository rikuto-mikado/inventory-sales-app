// Type definition matching the Django Product model serializer response.
export type Product = {
    id: number;
    sku: string;
    name: string;
    description: string;
    price: string;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}