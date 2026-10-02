import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Observable, BehaviorSubject } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import Swal from 'sweetalert2';
import { FormsModule } from '@angular/forms';
import { UsuarioService } from '../../Services/usuarioService';
import { UsuarioModel } from '../../Interfaces/usuarioModel';
import { CommonModule } from '@angular/common';

declare var bootstrap: any;

@Component({
  selector: 'app-usuario',
  imports: [RouterLink, CommonModule, FormsModule],
  templateUrl: './usuario.html',
  styleUrl: './usuario.css',
})
export class Usuario implements OnInit {
  usuarioSubject = new BehaviorSubject<UsuarioModel | null>(null);
  usuario$ = this.usuarioSubject.asObservable();

  constructor(
    public usuarioService: UsuarioService,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('idUsuario'));
    if (id) {
      this.getbyid(id);
    }
  }

  getbyid(IdUsuario: number) {
    this.usuarioService.getbyid(IdUsuario).subscribe({
      next: (data) => {
        this.usuarioSubject.next(data.Object);
      },
      error: (err) => console.error(err),
    });
  }

  actualizarUsuario(
    nombre: string,
    apellidopaterno: string,
    apellidomaterno: string,
    usernam: string,
    telefono: string,
  ) {
    const usuarioActual = this.usuarioSubject.value;
    if (usuarioActual && usuarioActual.idUsuario) {
      const datosActualizados: any = {
        idUsuario: usuarioActual.idUsuario,
        nombre: nombre,
        apellidoPaterno: apellidopaterno,
        apellidoMaterno: apellidomaterno,
        usuario: usernam,
        telefono:telefono
      };
      this.usuarioService.update(datosActualizados, usuarioActual.idUsuario).subscribe({
        next: () => {
          Swal.fire({
            title: '¡Actualizado!',
            text: 'Los datos se guardaron correctamente.',
            icon: 'success',
            timer: 1500,
            showConfirmButton: false,
          });
          this.getbyid(usuarioActual.idUsuario);
        },

        error: (err) => {
          console.error(err);
          Swal.fire('Error', 'No se pudo actualizar el usuario.', 'error');
        },
      });
    }
  }
}
