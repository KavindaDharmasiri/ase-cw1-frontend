import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Product } from '../../models/product.model';
import { environment } from '../../../environments/environment';

@Injectable()
export class ProductService {
  constructor(private http: HttpClient) {}

  getAllProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(`${environment.apiUrl}${environment.endpoints.products.base}`);
  }

  getProductById(id: number): Observable<Product> {
    return this.http.get<Product>(`${environment.apiUrl}${environment.endpoints.products.base}/${id}`);
  }

  createProduct(product: Product): Observable<Product> {
    return this.http.post<Product>(`${environment.apiUrl}${environment.endpoints.products.base}`, product);
  }

  updateProduct(id: number, product: Product): Observable<Product> {
    return this.http.put<Product>(`${environment.apiUrl}${environment.endpoints.products.base}/${id}`, product);
  }

  deleteProduct(id: number): Observable<any> {
    return this.http.delete(`${environment.apiUrl}${environment.endpoints.products.base}/${id}`, { responseType: 'text' });
  }

  getProductsByCategory(category: string): Observable<Product[]> {
    return this.http.get<Product[]>(`${environment.apiUrl}${environment.endpoints.products.base}/category/${category}`);
  }

  searchProducts(name: string): Observable<Product[]> {
    return this.http.get<Product[]>(`${environment.apiUrl}${environment.endpoints.products.search}?name=${name}`);
  }

  getAllCategories(): Observable<string[]> {
    return this.http.get<any[]>(`${environment.apiUrl}${environment.endpoints.categories.base}`)
      .pipe(map(categories => categories.map(cat => cat.name)));
  }

  uploadImage(file: File): Observable<{imageUrl: string}> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<{imageUrl: string}>(`${environment.apiUrl}${environment.endpoints.products.upload}`, formData);
  }
}