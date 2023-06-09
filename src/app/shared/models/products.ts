export interface Product {
  id?: string;
  title: string;
  price: number;
  categoryId: string;
  imageUrl: string;
  description?: string;
}

export interface CartProduct {
  id?: string;
  title: string;
  price: number;
  categoryId: string;
  imageUrl: string;
  description?: string;
  quantity: number;
}
