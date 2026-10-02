import { Component, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../Services/authService';

@Component({
  selector: 'app-login',
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  loginForm: FormGroup;
  cargando = false;
  errorMensaje: string | null = null;
  submitted = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private cdr: ChangeDetectorRef,
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      contrasena: ['', [Validators.required]],
    });
  }

  onLogin() {
    this.errorMensaje = null;
    this.submitted = false;

    if (this.loginForm.invalid) {
      this.submitted = true;
      this.loginForm.markAllAsTouched();
      return;
    }

    this.cargando = true;

    this.authService.login(this.loginForm.value).subscribe({
      next: (respuesta) => {
        this.cargando = false;
        if (respuesta && respuesta.token) {
          sessionStorage.setItem('token', respuesta.token);
          const payload = JSON.parse(atob(respuesta.token.split('.')[1]));
          const userRole = payload.role;
          console.log(userRole)

          if (userRole === 'Administrador') {
            this.router.navigate(['/usuarios']);
          } else {            
            this.router.navigate(['/carrito']);
          }
        }
      },
      error: (err) => {
        this.cargando = false;

        this.errorMensaje = 'Correo o contraseña incorrectos.';
        this.submitted = true;
        this.cdr.detectChanges();
      },
    });
  }
}

