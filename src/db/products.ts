import { randomUUID } from 'crypto';

export interface Product {
    id: string;
    name: string;
    description: string;
    price: number;
    category: string;
    inStock: boolean;
}

export const products: Product[] = [];

export const createProduct = (data: Omit<Product, 'id'>): Product => {
    const newProduct = { 
        id: randomUUID(),
        ...data
    };

    products.push(newProduct);
    return newProduct;
}