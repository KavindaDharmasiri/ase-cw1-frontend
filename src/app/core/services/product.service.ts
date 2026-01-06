import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product } from '../../models/product.model';

@Injectable()
export class ProductService {
  private apiUrl = 'http://localhost:5000/api/products';

  constructor(private http: HttpClient) {}

  getAllProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(this.apiUrl);
  }

  getProductById(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}/${id}`);
  }

  createProduct(product: Product): Observable<Product> {
    return this.http.post<Product>(this.apiUrl, product);
  }

  updateProduct(id: number, product: Product): Observable<Product> {
    return this.http.put<Product>(`${this.apiUrl}/${id}`, product);
  }

  deleteProduct(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  getProductsByCategory(category: string): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}/category/${category}`);
  }

  searchProducts(name: string): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}/search?name=${name}`);
  }

  getAllCategories(): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}/categories`);
  }

  uploadImage(file: File): Observable<{imageUrl: string}> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<{imageUrl: string}>('http://localhost:5000/api/files/upload', formData);
  }
}