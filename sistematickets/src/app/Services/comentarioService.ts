import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Result } from '../Interfaces/Result';
import { ComentarioModel } from '../Interfaces/comentarioModel';
@Injectable({
  providedIn: 'root',
})
export class ComentarioService {
  constructor(private http: HttpClient) {}

  getallbyidticket(idTicket: number): Observable<Result<ComentarioModel>> {
    return this.http.get<Result<ComentarioModel>>(
      `http://localhost:8080/api/comentario/${idTicket}`,
    );
  }

  add(component: ComentarioModel): Observable<Result<ComentarioModel>> {
    return this.http.post<Result<ComentarioModel>>(
      `http://localhost:8080/api/comentario/add`,
      component,
    );
  }
}
