import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Result } from '../Interfaces/Result';
import { Observable } from 'rxjs';
import { EstadoModel } from '../Interfaces/EstadoModel';

@Injectable({
  providedIn: 'root',
})
export class estadoService {
  constructor(private http: HttpClient) {}

  getallbyid(idPais: number): Observable<Result<EstadoModel>> {
    // indica que esta a la espera de un cambio
    return this.http.get<Result<EstadoModel>>(`http://localhost:8080/api/estado/getEstadosByPais/${idPais}`);
  }
}
