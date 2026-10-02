import { Component } from '@angular/core';
import { usuarioService } from '../../Services/usuarioService';
import { UsuarioModel } from '../../Interfaces/UsuarioModel';
import { RolModel } from '../../Interfaces/RolModel';
import { rolService } from '../../Services/rolService';
import { signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-usuario',
  imports: [RouterLink,CommonModule],
  templateUrl: './usuario.html',
  styleUrl: './usuario.css',
})
export class Usuario {
  usuarios = signal<UsuarioModel[]>([]);
  usuario: UsuarioModel | null = null;
  roles = signal<RolModel[]>([]);

  constructor(
    private usuarioService: usuarioService,
    private rolService: rolService,
  ) {}

  ngOnInit() {
    this.getAll();
    this.getRoles();
  }

  getRoles() {
    this.rolService.getall().subscribe({
      next: (data) => {
        this.roles.set(data.Objects);
      },
      error: (err) => console.error('Error al cargar roles', err),
    });
  }

  getAll() {
    this.usuarioService.getall().subscribe({
      next: (data) => {
        this.usuarios.set(data.Objects);
      },
      error: (err) => {
        console.error(err);
      },
    });
  }

  deleteUsuario(idUsuario: number) {
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'Esta acción no se puede deshacer',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#198754',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      reverseButtons: true,
    }).then((result) => {
      if (result.isConfirmed) {
        this.usuarioService.delete(idUsuario).subscribe({
          next: () => {
            this.getAll();
            Swal.fire('¡Eliminado!', 'El usuario ha sido borrado correctamente.', 'success');
          },
          error: (err) => {
            console.error(err);
            Swal.fire('Error', 'No se pudo eliminar al usuario.', 'error');
          },
        });
      }
    });
  }

  bajalogica(idUsuario: number, nuevoEstatus: number) {
    const data = { estatus: nuevoEstatus };
    this.usuarioService.bajalogica(idUsuario, data).subscribe({
      next: () => {
        this.getAll();
        Swal.fire('Modificado!', 'El usuario ha sido modificado correctamente.', 'success');
      },
      error: (err) => {
        console.error(err);
      },
    });
  }

  onChangeEstatus(event: any, usuario: UsuarioModel) {
    const inputElement = event.target as HTMLInputElement;
    const nuevoValor = inputElement.checked ? 1 : 0;

    inputElement.checked = !inputElement.checked;

    Swal.fire({
      title: '¿Modificar estatus?',
      text: `El usuario pasará a estar ${nuevoValor === 1 ? 'Activo' : 'Inactivo'}`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#198754',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, cambiar',
      cancelButtonText: 'Cancelar',
      reverseButtons: true,
    }).then((result) => {
      if (result.isConfirmed) {
        this.bajalogica(usuario.idUsuario, nuevoValor);
      } else {
        console.log('Cambio de estatus cancelado');
      }
    });
  }

  buscarDinamico(nombre: string, ap: string, am: string, idRol: string) {
    const filtro = {
      nombre: nombre || '',
      apellidoPaterno: ap || '',
      apellidoMaterno: am || '',
      rol: idRol ? { idRol: Number(idRol) } : null,
    };

    this.usuarioService.getAllDinamico(filtro).subscribe({
      next: (data) => {
        if (data && data.Objects) {
          this.usuarios.set(data.Objects);
          if (data.Objects.length === 0) {
            Swal.fire('Sin resultados', 'No se encontraron coincidencias', 'info');
          }
        }
      },
      error: (err) => {
        console.error(err);
        Swal.fire('Error', 'Error al conectar con el servidor', 'error');
      },
    });
  }
}
