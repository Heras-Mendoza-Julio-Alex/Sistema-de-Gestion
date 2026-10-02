import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Result } from '../Interfaces/result';
import { Observable } from 'rxjs';
import { ProductoModel } from '../Interfaces/productoModel';
import { HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class ProductoService {
  constructor(private http: HttpClient) {}

  getall(): Observable<Result<ProductoModel>> {
    const token = sessionStorage.getItem('token');
    return this.http.get<Result<ProductoModel>>(`http://localhost:8080/api/producto`, {
      headers: new HttpHeaders().set('Authorization', `Bearer ${token}`),
    });
  }

  getbyid(idProducto: number): Observable<Result<ProductoModel>> {
    const token = sessionStorage.getItem('token');
    return this.http.get<Result<ProductoModel>>(
      `http://localhost:8080/api/producto/${idProducto}`,
      {
        headers: new HttpHeaders().set('Authorization', `Bearer ${token}`),
      },
    );
  }

  add(producto: ProductoModel): Observable<Result<ProductoModel>> {
    const token = sessionStorage.getItem('token');
    return this.http.post<Result<ProductoModel>>(
      `http://localhost:8080/api/producto/add`,
      producto,
      {
        headers: new HttpHeaders().set('Authorization', `Bearer ${token}`),
      },
    );
  }

  update(idProducto: number, producto: ProductoModel): Observable<Result<ProductoModel>> {
    const token = sessionStorage.getItem('token');
    return this.http.put<Result<ProductoModel>>(
      `http://localhost:8080/api/producto/${idProducto}`,
      producto,
      {
        headers: new HttpHeaders().set('Authorization', `Bearer ${token}`),
      },
    );
  }

  updateImagen(idProducto: number, imagenBase64: string): Observable<any> {
    const token = sessionStorage.getItem('token');
    return this.http.patch(
      `http://localhost:8080/api/producto/${idProducto}/imagen`,
      imagenBase64,
      { responseType: 'json', headers: new HttpHeaders().set('Authorization', `Bearer ${token}`) },
    );
  }

  delete(idProducto: number): Observable<Result<ProductoModel>> {
    const token = sessionStorage.getItem('token');
    return this.http.delete<Result<ProductoModel>>(
      `http://localhost:8080/api/producto/${idProducto}`,
      {
        headers: new HttpHeaders().set('Authorization', `Bearer ${token}`),
      },
    );
  }
}
