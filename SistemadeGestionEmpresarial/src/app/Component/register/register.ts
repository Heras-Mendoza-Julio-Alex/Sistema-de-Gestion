import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { UsuarioService } from '../../Services/usuarioService';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-register',
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register implements OnInit {
  usuarioForm!: FormGroup;
  cargando: boolean = false;

  constructor(
    private fb: FormBuilder,
    private usuarioService: UsuarioService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.usuarioForm = this.fb.group({
      usuario: ['', [Validators.required]],
      nombre: ['', [Validators.required, Validators.minLength(2)]],
      apellidoPaterno: ['', [Validators.required, Validators.minLength(2)]],
      apellidoMaterno: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      contrasena: ['', [Validators.required, Validators.minLength(6)]],
      telefono: ['', [Validators.required]],
    });
  }

  registrar(): void {
    if (this.usuarioForm.valid) {
      this.cargando = true;

      this.usuarioService.add(this.usuarioForm.value).subscribe({
        next: (res: any) => {
          this.cargando = false;
          if (res.correct || res.Correct) {
            Swal.fire({
              title: '¡Correo enviado!',
              text: 'Te hemos enviado un enlace de activación a tu correo.',
              icon: 'success',
              confirmButtonColor: '#0d6efd',
            }).then(() => this.router.navigate(['/login']));
          } else {
            Swal.fire('Error', res.errorMessage || res.ErrorMessage, 'error');
          }
        },
        error: (err) => {
          this.cargando = false;
          console.error('Error:', err);
          Swal.fire('Error de red', 'No se pudo conectar con el servidor.', 'error');
        },
      }); 
    } else {
      this.usuarioForm.markAllAsTouched();
    }
  }
}
