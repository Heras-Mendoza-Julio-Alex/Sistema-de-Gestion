import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Result } from '../Interfaces/Result';
import { Observable } from 'rxjs';
import { Paismodel } from '../Interfaces/PaisModel';
@Injectable({
  providedIn: 'root',
})
export class paisService {
  constructor(private http: HttpClient) {}

  getall(): Observable<Result<Paismodel>> {
      // indica que esta a la espera de un cambio
      return this.http.get<Result<Paismodel>>('http://localhost:8080/api/pais');
    }
}
