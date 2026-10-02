import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Result } from '../Interfaces/Result';
import { Observable } from 'rxjs';
import { ColoniaModel } from '../Interfaces/ColoniaModel';

@Injectable({
  providedIn: 'root',
})
export class coloniaService {
  constructor(private http: HttpClient) {}

  getallbyid(idMunicipio: number): Observable<Result<ColoniaModel>> {
    // indica que esta a la espera de un cambio
    return this.http.get<Result<ColoniaModel>>(
      `http://localhost:8080/api/colonia/getColoniaByMunicipio/${idMunicipio}`,
    );
  }
}
