import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Observable, BehaviorSubject } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import Swal from 'sweetalert2';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ProductoModel } from '../../Interfaces/productoModel';
import { ProductoService } from '../../Services/productoService';

@Component({
  selector: 'app-producto',
  imports: [FormsModule, CommonModule, RouterLink],
  templateUrl: './producto.html',
  styleUrl: './producto.css',
})
export class Producto implements OnInit {
  productoSubject = new BehaviorSubject<ProductoModel | null>(null);
  producto$ = this.productoSubject.asObservable();

  constructor(
    public ProductoService: ProductoService,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('idProducto'));
    if (id) {
      this.getbyid(id);
    }
  }

  getbyid(idProducto: number) {
    this.ProductoService.getbyid(idProducto).subscribe({
      next: (data) => {
        this.productoSubject.next(data.Object);
      },
      error: (err) => console.error(err),
    });
  }

  actualizarProducto(idProducto: number, nombre: string, precio: number, stock: number) {
    const productoActual = this.productoSubject.value;
    if (productoActual && productoActual.idProducto) {
      const datosActualizados: any = {
        idProducto: idProducto,
        nombre: nombre,
        precio: precio,
        stock: stock,
      };
      this.ProductoService.update(productoActual.idProducto, datosActualizados).subscribe({
        next: () => {
          Swal.fire({
            title: 'Actualizado',
            text: 'Se ha actualizado de manera correcta',
            icon: 'success',
            timer: 1500,
            showConfirmButton: false,
          });
          this.getbyid(productoActual.idProducto);
        },
        error: (err) => {
          console.log(err);
          Swal.fire('Error', 'Algo salio mal');
        },
      });
    }
  }

  esAdministrador(): boolean {
    const token = sessionStorage.getItem('token');
    if (!token) return false;
    try {
      const payload = JSON.parse(window.atob(token.split('.')[1]));
      return payload.role === 'Administrador';
    } catch (e) {
      return false;
    }
  }

  onFileSelected(event: any, idProducto: number) {
    const file: File = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const base64String = (reader.result as string).split(',')[1];

        this.ProductoService.updateImagen(idProducto, base64String).subscribe({
          next: (res) => {
            if (res.Correct) {
              Swal.fire({
                title: '¡Éxito!',
                text: 'Imagen de producto actualizada correctamente.',
                icon: 'success',
                timer: 1500,
                showConfirmButton: false,
              });
              this.getbyid(idProducto);
            } else {
              Swal.fire('Error', 'No se pudo guardar la imagen', 'error');
            }
          },
          error: (err) => {
            console.error(err);
            Swal.fire('Error', 'Fallo en la comunicación con el servidor', 'error');
          },
        });
      };
      reader.readAsDataURL(file);
    }
  }
}
