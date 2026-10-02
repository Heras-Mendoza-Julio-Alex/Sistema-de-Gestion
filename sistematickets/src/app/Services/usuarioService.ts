import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UsuarioModel } from '../Interfaces/usuarioModel';
import { Result } from '../Interfaces/Result';
import { HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class UsuarioService {
  constructor(private http: HttpClient) {}

  getall(): Observable<Result<UsuarioModel>> {
    const token = sessionStorage.getItem('token');

    return this.http.get<Result<UsuarioModel>>('http://localhost:8080/usuario', {
      headers: new HttpHeaders().set('Authorization', `Bearer ${token}`),
    });
  }
  add(usuario: UsuarioModel): Observable<Result<UsuarioModel>> {
    return this.http.post<Result<UsuarioModel>>(`http://localhost:8080/usuario/add`, usuario);
  }
  update(usuario: UsuarioModel): Observable<Result<UsuarioModel>> {
    const token = sessionStorage.getItem('token');
    return this.http.put<Result<UsuarioModel>>(
      `http://localhost:8080/usuario/${usuario.idUsuario}`,
      usuario,
      {
        headers: new HttpHeaders().set('Authorization', `Bearer ${token}`),
      },
    );
  }
}
