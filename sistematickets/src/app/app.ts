import { Component, signal, OnInit } from '@angular/core';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { AuthService } from './Services/authService';
import { filter } from 'rxjs/operators';
import { toSignal } from '@angular/core/rxjs-interop'; 
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App implements OnInit {
  rutaActual = signal<string>('');
  protected readonly title = signal('sistematickets');
  usuarioId = signal<string>('');
  correo = signal<string>('');
  rol = signal<string>('');

  constructor(private authService: AuthService, private router: Router) {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      this.rutaActual.set(event.urlAfterRedirects);
      this.cargarDatos();
    });
  }

  ngOnInit(): void {
    this.cargarDatos();
  }

  cargarDatos() {
    const token = sessionStorage.getItem('token');
    if (token) {
      try {
        const payload = JSON.parse(window.atob(token.split('.')[1]));

        const ahora = Math.floor(Date.now() / 1000); 
        
        if (payload.exp && payload.exp < ahora) {
          console.warn('Token expirado detectado en la navegación');
          this.onSalir(); 
          return;
        }
        this.usuarioId.set(payload.id || '');
        this.correo.set(payload.sub || '');
        this.rol.set(payload.role || '');
      } catch (e) {
        console.error('Error al decodificar token', e);
        this.limpiarSignals();
      }
    } else {
      this.limpiarSignals();
    }
  }

  limpiarSignals() {
    this.usuarioId.set('');
    this.correo.set('');
    this.rol.set('');
  }

  onSalir() {
    this.authService.logout();
    this.limpiarSignals();
  }
  
}
