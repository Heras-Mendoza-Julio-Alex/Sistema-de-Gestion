import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Result } from '../Interfaces/result';
import { RolModel } from '../Interfaces/rolModel';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class rolService {
  constructor(private http: HttpClient) {}

  getall(): Observable<Result<RolModel>> {
    return this.http.get<Result<RolModel>>('http://localhost:8080/api/rol');
  }
}
