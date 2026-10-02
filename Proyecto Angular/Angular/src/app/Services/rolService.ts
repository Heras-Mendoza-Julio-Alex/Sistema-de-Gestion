import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Result } from '../Interfaces/Result';
import { RolModel } from '../Interfaces/RolModel';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class rolService {
  constructor(private http: HttpClient) {}

  getall(): Observable<Result<RolModel>> {
    // indica que esta a la espera de un cambio
    return this.http.get<Result<RolModel>>('http://localhost:8080/api/rol');
  }
}
