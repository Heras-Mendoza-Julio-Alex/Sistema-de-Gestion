import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Result } from '../Interfaces/Result';
import { Observable } from 'rxjs';
import { DireccionModel } from '../Interfaces/DireccionModel';

@Injectable({
  providedIn: 'root',
})
export class direccionService {
  private baseUrl = 'http://localhost:8080/api/direccion';

  constructor(private http: HttpClient) {}

  getbyid(idDireccion: number): Observable<Result<DireccionModel>> {
    return this.http.get<Result<DireccionModel>>(`${this.baseUrl}/${idDireccion}`);
  }

  delete(idUsuario: number, idDireccion: number): Observable<Result<DireccionModel>> {
    return this.http.delete<Result<DireccionModel>>(`${this.baseUrl}/${idUsuario}/${idDireccion}`);
  }

  add(direccion: DireccionModel, idUsuario: number): Observable<Result<DireccionModel>> {
    return this.http.post<Result<DireccionModel>>(`${this.baseUrl}/add/${idUsuario}`, direccion);
  }
  
  update(idUsuario: number, idDireccion: number, direccion: DireccionModel): Observable<Result<DireccionModel>> {
    return this.http.put<Result<DireccionModel>>(
      `${this.baseUrl}/${idUsuario}/${idDireccion}`, 
      direccion
    );
  }
}