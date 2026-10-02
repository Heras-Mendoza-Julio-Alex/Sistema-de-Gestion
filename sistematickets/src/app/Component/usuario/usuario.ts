import { Component, signal, OnInit } from '@angular/core';
import { RouterLink, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { UsuarioModel } from '../../Interfaces/usuarioModel';
import { RolModel } from '../../Interfaces/rolModel';
import { rolService } from '../../Services/rolService';
import { UsuarioService } from '../../Services/usuarioService';
import Swal from 'sweetalert2';
declare var bootstrap: any;

@Component({
  selector: 'app-usuario',
  imports: [CommonModule, RouterLink, ReactiveFormsModule],
  templateUrl: './usuario.html',
  styleUrl: './usuario.css',
})
export class Usuario implements OnInit {
  roles = signal<RolModel[]>([]);
  usuarios = signal<UsuarioModel[]>([]);
  cargando = signal<boolean>(true);
  usuarioForm: FormGroup;
  idSeleccionado: number = 0;

  constructor(
    private fb: FormBuilder,
    private usuarioService: UsuarioService,
    private rolService: rolService,
  ) {
    this.usuarioForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(2)]],
      apellidoPaterno: ['', Validators.required],
      apellidoMaterno: ['', Validators.required],
      idRol: [null, Validators.required],
    });
  }

  ngOnInit() {
    this.cargarUsuarios();
    this.cargarRoles();
  }

  cargarUsuarios() {
    this.cargando.set(true);
    this.usuarioService.getall().subscribe({
      next: (res: any) => {
        if (res.Correct || res.correct) {
          this.usuarios.set(res.Objects || res.objects || []);
        }
        this.cargando.set(false);
      },
      error: (err) => {
        console.error('Error al cargar usuarios:', err);
        this.cargando.set(false);
        Swal.fire('Error', 'No se pudo conectar con el servidor', 'error');
      },
    });
  }

  cargarRoles() {
    this.rolService.getall().subscribe({
      next: (res: any) => {
        if (res.Correct || res.correct) {
          this.roles.set(res.Objects || res.objects || []);
        }
      },
      error: (err) => console.error('Error al cargar roles:', err),
    });
  }

  prepararEdicion(user: any) {
    this.idSeleccionado = user.idUsuario;

    this.usuarioForm.patchValue({
      nombre: user.nombre,
      apellidoPaterno: user.apellidoPaterno,
      apellidoMaterno: user.apellidoMaterno,
      idRol: user.Rol?.idRol || 3,
    });

    const modalElement = document.getElementById('modalUsuario');
    if (modalElement) {
      const modal = new bootstrap.Modal(modalElement);
      modal.show();
    }
  }

  actualizar() {
    if (this.usuarioForm.invalid) {
      Swal.fire('Atención', 'Por favor, completa todos los campos correctamente.', 'warning');
      return;
    }

    const usuarioEditado: any = {
      idUsuario: this.idSeleccionado,
      nombre: this.usuarioForm.value.nombre,
      apellidoPaterno: this.usuarioForm.value.apellidoPaterno,
      apellidoMaterno: this.usuarioForm.value.apellidoMaterno,
      Rol: { idRol: Number(this.usuarioForm.value.idRol) },
    };

    this.usuarioService.update(usuarioEditado).subscribe({
      next: (res: any) => {
        if (res.Correct || res.correct) {
          this.cargarUsuarios();

          const modalElement = document.getElementById('modalUsuario');
          const modal = bootstrap.Modal.getInstance(modalElement);
          if (modal) modal.hide();

          Swal.fire('¡Actualizado!', 'Datos guardados correctamente en Oracle.', 'success');
        } else {
          Swal.fire('Error', res.ErrorMessage || 'No se pudo actualizar', 'error');
        }
      },
      error: (err) => {
        Swal.fire('Error', 'Ocurrió un error al procesar la solicitud', 'error');
      },
    });
  }
}
