import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { RouterLink } from '@angular/router';
import { usuarioService } from '../../Services/usuarioService';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-carga-masiva',
  imports: [RouterLink],
  templateUrl: './carga-masiva.html',
  styleUrl: './carga-masiva.css',
})
export class CargaMasiva implements OnInit {
  listaErrores: any[] = [];
  archivoSeleccionado: File | null = null;
  tokenGenerado: string = '';

  constructor(
    private usuarioService: usuarioService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {}

  onFileChange(event: any) {
    this.archivoSeleccionado = event.target.files[0];
  }

  subirArchivo() {
    if (!this.archivoSeleccionado) {
      Swal.fire('Error', 'Selecciona un archivo primero', 'error');
      return;
    }

    Swal.fire({
      title: 'Validando archivo...',
      didOpen: () => Swal.showLoading(),
      allowOutsideClick: false,
    });

    this.usuarioService.generartoken(this.archivoSeleccionado).subscribe({
      next: (res: any) => {
        if (res.Correct) {
          this.tokenGenerado = res.Object || res.object;
          this.listaErrores = [];
          Swal.fire('Éxito', 'Archivo listo para procesar', 'success');
        } else {
          this.tokenGenerado = '';
          this.listaErrores = res.Objects || [];
        }
        this.cdr.detectChanges();
        Swal.close();
      },
    });
  }
  
  confirmarProcesar() {
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'Se realizarán los registros en la base de datos',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#198754',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, procesar',
      cancelButtonText: 'Cancelar',
      reverseButtons: true,
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: 'Procesando...',
          didOpen: () => Swal.showLoading(),
          allowOutsideClick: false,
        });

        this.usuarioService.procesarArchivo(this.tokenGenerado).subscribe({
          next: (res: any) => {
         if (res === 'CARGA_EXITOSA' || res.Correct || res.correct) {
            Swal.fire('¡Completado!', 'Los datos se han guardado.', 'success');
            this.archivoSeleccionado = null;
            this.tokenGenerado = '';
            this.listaErrores = [];
            this.cdr.detectChanges();
          }
        },
        error: (err: any) => {          
          if (err.error?.text === 'CARGA_EXITOSA' || err.status === 200) {
            Swal.fire('¡Completado!', 'Los datos se han guardado.', 'success');
            this.archivoSeleccionado = null;
            this.tokenGenerado = '';
            this.listaErrores = [];
            this.cdr.detectChanges();
          } else {
            console.error('Fallo real:', err);
            Swal.fire('Error', 'Hubo un fallo al procesar la información', 'error');
          }
        }
        });
      }
    });
  }
}
