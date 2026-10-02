import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Result } from '../Interfaces/Result';
import { TicketModel } from '../Interfaces/ticketModel';
import { HttpHeaders } from '@angular/common/http';


@Injectable({
  providedIn: 'root',
})
export class TicketService {
  constructor(private http: HttpClient) {}

  getall(): Observable<Result<TicketModel>> {
    return this.http.get<Result<TicketModel>>('http://localhost:8080/ticket');
  }

  getallbyidUsuario(IdUsuario: number): Observable<Result<TicketModel>> {
    return this.http.get<Result<TicketModel>>(`http://localhost:8080/ticket/${IdUsuario}`);
  }

  getallbyid(idTicket: number): Observable<Result<TicketModel>> {
    return this.http.get<Result<TicketModel>>(`http://localhost:8080/ticket/numero/${idTicket}`);
  }

  add(ticket: TicketModel): Observable<Result<TicketModel>> {
     const token = sessionStorage.getItem('token');
    return this.http.post<Result<TicketModel>>(`http://localhost:8080/ticket/add`, ticket,
      {
        headers: new HttpHeaders().set('Authorization', `Bearer ${token}`),
      });
  }
  
  update(ticket:TicketModel): Observable<Result<TicketModel>> {
    const idTicket = ticket.idTicket;
    return this.http.patch<Result<TicketModel>>(`http://localhost:8080/ticket/${idTicket}`, ticket);
  }
}
