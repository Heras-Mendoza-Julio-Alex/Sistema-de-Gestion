import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Result } from '../Interfaces/result';
import { UsuarioModel } from '../Interfaces/usuarioModel';
import { HttpClient } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class UsuarioService {
  private baseUrl = 'http://localhost:8080/api/usuario';

  constructor(private http: HttpClient) {}

  getall(): Observable<Result<UsuarioModel>> {
    const token = sessionStorage.getItem('token');
    return this.http.get<Result<UsuarioModel>>(`${this.baseUrl}`, {
      headers: new HttpHeaders().set('Authorization', `Bearer ${token}`),
    });
  }

  getbyid(idUsuario: number): Observable<Result<UsuarioModel>> {
    const token = sessionStorage.getItem('token');
    return this.http.get<Result<UsuarioModel>>(`${this.baseUrl}/${idUsuario}`, {
      headers: new HttpHeaders().set('Authorization', `Bearer ${token}`),
    });
  }

  add(usuario: UsuarioModel): Observable<Result<UsuarioModel>> {
    return this.http.post<Result<UsuarioModel>>(`${this.baseUrl}/add`, usuario);
  }

  update(usuario: any, idUsuario: number): Observable<Result<UsuarioModel>> {
    const token = sessionStorage.getItem('token');
    return this.http.put<Result<UsuarioModel>>(
      `http://localhost:8080/api/usuario/${idUsuario}`,
      usuario,
      {
        headers: new HttpHeaders().set('Authorization', `Bearer ${token}`),
      },
    );
  }
  bajalogica(IdUsuario: number, usuario: any): Observable<Result<UsuarioModel>> {
    const token = sessionStorage.getItem('token');
    return this.http.patch<Result<UsuarioModel>>(
      `http://localhost:8080/api/usuario/${IdUsuario}/baja`,
      usuario,
      {
        headers: new HttpHeaders().set('Authorization', `Bearer ${token}`),
      },
    );
  }

  delete(IdUsuario: number): Observable<Result<UsuarioModel>> {
    const token = sessionStorage.getItem('token');
    return this.http.delete<Result<UsuarioModel>>(
      `http://localhost:8080/api/usuario/${IdUsuario}`,
      {
        headers: new HttpHeaders().set('Authorization', `Bearer ${token}`),
      },
    );
  }
}
