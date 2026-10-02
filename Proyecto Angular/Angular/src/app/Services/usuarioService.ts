import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UsuarioModel } from '../Interfaces/UsuarioModel';
import { Result } from '../Interfaces/Result';

@Injectable({
  providedIn: 'root',
})
export class usuarioService {
  constructor(private http: HttpClient) {}

  getall(): Observable<Result<UsuarioModel>> {
    // indica que esta a la espera de un cambio
    return this.http.get<Result<UsuarioModel>>('http://localhost:8080/api/usuario');
  }
  getbyid(IdUsuario: number): Observable<Result<UsuarioModel>> {
    return this.http.get<Result<UsuarioModel>>(`http://localhost:8080/api/usuario/${IdUsuario}`);
  }

  delete(IdUsuario: number): Observable<Result<null>> {
    return this.http.delete<Result<null>>(`http://localhost:8080/api/usuario/${IdUsuario}`);
  }

  add(formData: FormData): Observable<Result<UsuarioModel>> {
    return this.http.post<Result<UsuarioModel>>(`http://localhost:8080/api/usuario/add`, formData);
  }

  bajalogica(IdUsuario: number, usuario: any): Observable<Result<UsuarioModel>> {
    return this.http.patch<Result<UsuarioModel>>(
      `http://localhost:8080/api/usuario/${IdUsuario}/baja`,
      usuario,
    );
  }

  updateImagen(idUsuario: number, imagenBase64: string): Observable<Result<UsuarioModel>> {
    return this.http.post<Result<UsuarioModel>>(
      `http://localhost:8080/api/usuario/${idUsuario}/imagen`,
      imagenBase64,
    );
  }

  update(usuario: any, idUsuario: number): Observable<Result<UsuarioModel>> {
    return this.http.put<Result<UsuarioModel>>(
      `http://localhost:8080/api/usuario/${idUsuario}`,
      usuario,
    );
  }

  getAllDinamico(usuario: any): Observable<any> {
    return this.http.post<any>(`http://localhost:8080/api/usuario/getAllDinamico`, usuario);
  }
  
  generartoken(archivo:File): Observable<any> {
    const formData = new FormData();
    formData.append('archivo', archivo);
    return this.http.post<File>(`http://localhost:8080/api/usuario/cargamasiva`,formData )
  }

  procesarArchivo(token:string): Observable<any> {
    const headers = { 'Authorization': `Bearer ${token}` };
    return this.http.post<any>(`http://localhost:8080/api/usuario/cargamasiva/procesar`,{},{ headers } )
  }

  

}
