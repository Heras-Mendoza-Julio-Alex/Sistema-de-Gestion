import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Observable, BehaviorSubject } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import Swal from 'sweetalert2';
import { FormsModule } from '@angular/forms';
import { direccionService } from '../../Services/direccionService';
import { paisService } from '../../Services/paisService';
import { estadoService } from '../../Services/estadoService';
import { municipioService } from '../../Services/municipioService';
import { coloniaService } from '../../Services/coloniaService';
import { usuarioService } from '../../Services/usuarioService';

import { DireccionModel } from '../../Interfaces/DireccionModel';
import { UsuarioModel } from '../../Interfaces/UsuarioModel';
import { Paismodel } from '../../Interfaces/PaisModel';
import { EstadoModel } from '../../Interfaces/EstadoModel';
import { MunicipioModel } from '../../Interfaces/MunicipioModel';
import { ColoniaModel } from '../../Interfaces/ColoniaModel';

declare var bootstrap: any;

@Component({
  selector: 'app-usuario-detail',
  imports: [RouterLink, AsyncPipe, FormsModule],
  templateUrl: './usuario-detail.html',
  styleUrl: './usuario-detail.css',
})
export class UsuarioDetail implements OnInit {
  idPaisSel: number = 0;
  idEstadoSel: number = 0;
  idMunicipioSel: number = 0;
  idColoniaSel: number = 0;
  paises: Paismodel[] = [];
  estados: EstadoModel[] = [];
  municipios: MunicipioModel[] = [];
  colonias: ColoniaModel[] = [];
  usuarioSubject = new BehaviorSubject<UsuarioModel | null>(null);
  direccionSubject = new BehaviorSubject<DireccionModel | null>(null);
  usuario$ = this.usuarioSubject.asObservable();

  constructor(
    public usuarioService: usuarioService,
    public direccionService: direccionService,
    private paisServ: paisService,
    private estadoServ: estadoService,
    private municipioServ: municipioService,
    private coloniaServ: coloniaService,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('idUsuario'));
    if (id) {
      this.getbyid(id);
    }
    this.cargarPaises();
  }

  getbyid(IdUsuario: number) {
    this.usuarioService.getbyid(IdUsuario).subscribe({
      next: (data) => {
        this.usuarioSubject.next(data.object);
      },
      error: (err) => console.error(err),
    });
  }

  cargarPaises() {
    this.paisServ.getall().subscribe({
      next: (res: any) => {
        this.paises = res.Objects || res.objects;
        this.cdr.detectChanges();
      },
    });
  }

  onPaisChange(event: any) {
    const id = Number(event.target?.value || event);
    this.estados = [];
    this.municipios = [];
    this.colonias = [];
    if (id > 0) {
      this.estadoServ.getallbyid(id).subscribe({
        next: (res: any) => {
          this.estados = res.Objects || res.objects;
          this.cdr.detectChanges();
        },
      });
    }
  }

  onEstadoChange(event: any) {
    const id = Number(event.target?.value || event);
    this.municipios = [];
    this.colonias = [];
    if (id > 0) {
      this.municipioServ.getallbyid(id).subscribe({
        next: (res: any) => {
          this.municipios = res.Objects || res.objects;
          this.cdr.detectChanges();
        },
      });
    }
  }

  onMunicipioChange(event: any) {
    const id = Number(event.target?.value || event);
    this.colonias = [];
    if (id > 0) {
      this.coloniaServ.getallbyid(id).subscribe({
        next: (res: any) => {
          this.colonias = res.Objects || res.objects;
          this.cdr.detectChanges();
        },
      });
    }
  }

  buscarDireccion(idDireccion: number) {
    this.direccionService.getbyid(idDireccion).subscribe({
      next: (data: any) => {
        const dir = data.object;
        this.direccionSubject.next(dir);

        if (dir.Colonia?.Municipio?.Estado?.Pais) {
          this.idPaisSel = dir.Colonia.Municipio.Estado.Pais.idPais;
          this.idEstadoSel = dir.Colonia.Municipio.Estado.idEstado;
          this.idMunicipioSel = dir.Colonia.Municipio.idMunicipio;
          this.idColoniaSel = dir.Colonia.idColonia;

          this.estadoServ.getallbyid(this.idPaisSel).subscribe((resE: any) => {
            this.estados = resE.Objects || resE.objects;
            this.municipioServ.getallbyid(this.idEstadoSel).subscribe((resM: any) => {
              this.municipios = resM.Objects || resM.objects;
              this.coloniaServ.getallbyid(this.idMunicipioSel).subscribe((resC: any) => {
                this.colonias = resC.Objects || resC.objects;
                this.cdr.detectChanges();
              });
            });
          });
        }
      },
    });
  }

  guardarDireccion(
    idUsuario: number,
    calle: string,
    nInt: string,
    nExt: string,
    idColonia: string,
  ) {
    const dirActual = this.direccionSubject.value;
    if (!idColonia || idColonia === '0') {
      Swal.fire('Atención', 'Debes seleccionar una Colonia', 'warning');
      return;
    }
    const datos: any = {
      calle: calle,
      numeroInterior: nInt,
      numeroExterior: nExt,
      Colonia: { idColonia: Number(idColonia) },
    };

    if (dirActual && dirActual.idDireccion) {
      this.direccionService.update(idUsuario, dirActual.idDireccion, datos).subscribe({
        next: () => {
          this.getbyid(idUsuario);
          this.finalizarOperacionDireccion(idUsuario, 'Actualizada');
        },
        error: () => Swal.fire('Error', 'No se pudo actualizar', 'error'),
      });
    } else {
      this.direccionService.add(datos, idUsuario).subscribe({
        next: () => {
          this.getbyid(idUsuario);
          this.finalizarOperacionDireccion(idUsuario, 'Guardada');
        },
        error: () => Swal.fire('Error', 'No se pudo guardar', 'error'),
      });
    }
  }

  private finalizarOperacionDireccion(idUsuario: number, texto: string) {
    Swal.fire({
      title: '¡Éxito!',
      text: `Dirección ${texto} correctamente`,
      icon: 'success',
      timer: 1500,
      showConfirmButton: false,
    });
    const modalEl = document.getElementById('modalEditDireccion');
    if (modalEl) {
      const modal = bootstrap.Modal.getInstance(modalEl) || new bootstrap.Modal(modalEl);
      modal.hide();
    }
    this.limpiarModal();
  }

  limpiarModal() {
    this.direccionSubject.next(null);
    this.estados = [];
    this.municipios = [];
    this.colonias = [];
    this.cdr.detectChanges();
  }

  actualizarUsuario(
    nombre: string,
    apellidopaterno: string,
    apellidomaterno: string,
    usernam: string,
    sexo: string,
    correo: string,
    telefono: string,
    celular: string,
  ) {
    const usuarioActual = this.usuarioSubject.value;
    if (usuarioActual && usuarioActual.idUsuario) {
      const datosActualizados: any = {
        idUsuario: usuarioActual.idUsuario,
        nombre: nombre,
        apellidoPaterno: apellidopaterno,
        apellidoMaterno: apellidomaterno,
        username: usernam,
        sexo: sexo,
        email: correo,
        telefono: telefono,
        celular: celular,
        imagen: usuarioActual.imagen,
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

  onFotoSelected(event: any, idUsuario: number) {
    const archivo = event.target.files[0];
    if (archivo) {
      if (!archivo.type.startsWith('image/')) {
        Swal.fire('Error', 'El archivo debe ser una imagen', 'error');
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        const base64Raw = reader.result as string;
        const cleanBase64 = base64Raw.split(',')[1];
        this.usuarioService.updateImagen(idUsuario, cleanBase64).subscribe({
          next: () => {
            Swal.fire({
              title: '¡Actualizada!',
              text: 'La foto de perfil se ha actualizado correctamente.',
              icon: 'success',
              timer: 2000,
              showConfirmButton: false,
            });
            this.getbyid(idUsuario);
          },
          error: (err) => {
            console.error(err);
            Swal.fire('Error', 'No se pudo subir la imagen', 'error');
          },
        });
      };
      reader.readAsDataURL(archivo);
    }
  }

  deleteDireccion(idUsuario: number, idDireccion: number) {
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
        this.direccionService.delete(idUsuario, idDireccion).subscribe({
          next: () => {
            this.getbyid(idUsuario);
            Swal.fire('¡Eliminado!', 'La direccion ha sido borrada correctamente.', 'success');
          },
          error: (err) => {
            console.error(err);
            Swal.fire('Error', 'No se pudo eliminar la direccion.', 'error');
          },
        });
      }
    });
  }
}
