import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Result } from '../Interfaces/Result';
import { Observable } from 'rxjs';
import { MunicipioModel } from '../Interfaces/MunicipioModel';

@Injectable({
  providedIn: 'root',
})
export class municipioService {
  constructor(private http: HttpClient) {}

  getallbyid(idEstado:number): Observable<Result<MunicipioModel>> {
    // indica que esta a la espera de un cambio
    return this.http.get<Result<MunicipioModel>>(`http://localhost:8080/api/municipio/getMunicipioByEstado/${idEstado}`);
  }
}
