import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { UsuarioService } from '../../Services/usuarioService';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-formulario',
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './formulario.html',
  styleUrl: './formulario.css',
})
export class Formulario implements OnInit {
  usuarioForm!: FormGroup;
  cargando: boolean = false;

  constructor(
    private fb: FormBuilder,
    private usuarioService: UsuarioService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.usuarioForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(2)]],
      apellidoPaterno: ['', [Validators.required, Validators.minLength(2)]],
      apellidoMaterno: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      contrasena: ['', [Validators.required, Validators.minLength(6)]],      
    });
  }

  registrar(): void {
    if (this.usuarioForm.valid) {
      this.cargando = true;

      this.usuarioService.add(this.usuarioForm.value).subscribe({
        next: (res: any) => {
          if (res.Correct || res.correct) {
            Swal.fire({
              title: '¡Registro Exitoso!',
              text: 'Tu cuenta ha sido creada. Ahora puedes iniciar sesión.',
              icon: 'success',
              confirmButtonColor: '#0d6efd',
              confirmButtonText: 'Ir al Login',
            }).then((result) => {
              if (result.isConfirmed) {
                this.router.navigate(['/login']);
              }
            });
          } else {
            Swal.fire({
              title: 'Error al registrar',
              text: res.ErrorMessage || 'No se pudo crear el usuario',
              icon: 'error',
              confirmButtonColor: '#dc3545',
            });
          }
          this.cargando = false;
        },
        error: (err) => {
          console.error('Error al registrar usuario:', err);

          Swal.fire({
            title: 'Error de servidor',
            text: 'Hubo un problema al conectar con la base de datos Oracle.',
            icon: 'warning',
            confirmButtonColor: '#ffc107',
          });
          this.cargando = false;
        },
      });
    } else {
      Swal.fire({
        title: 'Formulario incompleto',
        text: 'Por favor, revisa que todos los campos sean correctos.',
        icon: 'info',
        toast: true,
        position: 'top-end',
        timer: 3000,
        showConfirmButton: false,
      });
    }
  }
}
