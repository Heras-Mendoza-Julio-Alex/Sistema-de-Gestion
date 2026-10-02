import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Result } from '../Interfaces/Result';
import { PrioridadModel } from '../Interfaces/prioridadModel';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root',
})
export class PrioridadService {
  constructor(private http: HttpClient) {}
   getall(): Observable<Result<PrioridadModel>> {
    // indica que esta a la espera de un cambio
    return this.http.get<Result<PrioridadModel>>('http://localhost:8080/api/prioridad');
  }
}
