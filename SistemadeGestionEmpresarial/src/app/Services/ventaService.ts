import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Result } from '../Interfaces/result';
import { VentaModel } from '../Interfaces/ventaModel';
import { HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class VentaService {
  private baseUrl = 'http://localhost:8080/api/venta';

  constructor(private http: HttpClient) {}

  getall(): Observable<Result<VentaModel>> {
    const token = sessionStorage.getItem('token');
    return this.http.get<Result<VentaModel>>(`${this.baseUrl}`, {
      headers: new HttpHeaders().set('Authorization', `Bearer ${token}`),
    });
  }

  getbyid(idVenta: number): Observable<Result<VentaModel>> {
    const token = sessionStorage.getItem('token');
    return this.http.get<Result<VentaModel>>(`${this.baseUrl}/${idVenta}`, {
      headers: new HttpHeaders().set('Authorization', `Bearer ${token}`),
    });
  }

  add(venta: VentaModel): Observable<Result<VentaModel>> {
    return this.http.post<Result<VentaModel>>(`${this.baseUrl}/add`, venta);
  }

  update(venta: VentaModel, idVenta: number): Observable<Result<VentaModel>> {
    return this.http.put<Result<VentaModel>>(`${this.baseUrl}${idVenta}`, venta);
  }

  notificarCompra(ventaDTO: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/notificar`, ventaDTO);
  }

  delete(idVenta: number): Observable<Result<VentaModel>> {
    const token = sessionStorage.getItem('token');
    return this.http.delete<Result<VentaModel>>(
      `http://localhost:8080/api/venta/${idVenta}`,
      {
        headers: new HttpHeaders().set('Authorization', `Bearer ${token}`),
      },
    );
  }
}
