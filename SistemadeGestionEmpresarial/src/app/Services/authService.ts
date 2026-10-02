import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(
    private http: HttpClient,
    private router: Router,
  ) {}

  login(credentials: any): Observable<any> {
    return this.http.post(`http://localhost:8080/api/login`, credentials).pipe(
      tap((res: any) => {
        if (res && (res.token || res.accessToken)) {
          const token = res.token || res.accessToken;
          sessionStorage.setItem('token', token);
          sessionStorage.setItem('usuario', JSON.stringify(res.usuario || res.user));
        }
      }),
    );
  }

  logout() {
    sessionStorage.clear();
    localStorage.clear();
    this.router.navigate(['/login']);
  }
}
