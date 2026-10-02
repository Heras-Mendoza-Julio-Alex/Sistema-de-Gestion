import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Result } from '../Interfaces/Result';
import { EstadoModel } from '../Interfaces/estadoModel';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class EstadoService {
  constructor(private http: HttpClient) {}
   getall(): Observable<Result<EstadoModel>> {
    // indica que esta a la espera de un cambio
    return this.http.get<Result<EstadoModel>>('http://localhost:8080/api/estado');
  }
}
