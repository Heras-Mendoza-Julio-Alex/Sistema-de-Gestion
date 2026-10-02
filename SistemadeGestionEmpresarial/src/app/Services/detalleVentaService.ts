import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DetalleVentaModel } from '../Interfaces/detalleVentaModel';
import { Result } from '../Interfaces/result';
import { Observable } from 'rxjs';
import { HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class DetalleVentaService {
  constructor(private http: HttpClient) {}

  private baseUrl = 'http://localhost:8080/api/detalleventa';

  getall(): Observable<Result<DetalleVentaModel>> {
    const token = sessionStorage.getItem('token');
    return this.http.get<Result<DetalleVentaModel>>(`${this.baseUrl}`, {
      headers: new HttpHeaders().set('Authorization', `Bearer ${token}`),
    });
  }

  getbyid(idVenta: number): Observable<Result<DetalleVentaModel>> {
    const token = sessionStorage.getItem('token');
    return this.http.get<Result<DetalleVentaModel>>(`${this.baseUrl}/${idVenta}`, {
      headers: new HttpHeaders().set('Authorization', `Bearer ${token}`),
    });
  }

  add(detalleVenta: DetalleVentaModel): Observable<Result<DetalleVentaModel>> {
    const token = sessionStorage.getItem('token');
    return this.http.post<Result<DetalleVentaModel>>(`${this.baseUrl}/add`, detalleVenta, {
      headers: new HttpHeaders().set('Authorization', `Bearer ${token}`),
    });
  }

  update(
    idDetalleVenta: number,
    detalleVenta: DetalleVentaModel,
  ): Observable<Result<DetalleVentaModel>> {
    const token = sessionStorage.getItem('token');
    return this.http.put<Result<DetalleVentaModel>>(
      `${this.baseUrl}}/${idDetalleVenta}`,
      detalleVenta,
      {
        headers: new HttpHeaders().set('Authorization', `Bearer ${token}`),
      },
    );
  }
}
