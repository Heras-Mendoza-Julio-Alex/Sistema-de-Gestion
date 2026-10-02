import { Component, signal, OnInit, computed } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';
import { ProductoModel } from '../../Interfaces/productoModel';
import { ProductoService } from '../../Services/productoService';

@Component({
  selector: 'app-productos',
  imports: [RouterLink, CommonModule],
  templateUrl: './productos.html',
  styleUrl: './productos.css',
})
export class Productos implements OnInit {
  productos = signal<ProductoModel[]>([]);
  rolUsuario: string = '';

  paginaActual = signal<number>(1);
  itemsPorPagina = signal<number>(6);

  productosPaginados = computed(() => {
    const inicio = (this.paginaActual() - 1) * this.itemsPorPagina();
    const fin = inicio + this.itemsPorPagina();
    return this.productos().slice(inicio, fin);
  });

  totalPaginas = computed(() => {
    return Math.ceil(this.productos().length / this.itemsPorPagina());
  });

  arrayPaginas = computed(() => {
    return Array.from({ length: this.totalPaginas() }, (_, i) => i + 1);
  });

  constructor(private productoService: ProductoService) {}

  ngOnInit() {
    this.getAll();
  }

  getAll() {
    this.productoService.getall().subscribe({
      next: (data) => {
        this.productos.set(data.Objects || []);
        this.paginaActual.set(1);
      },
      error: (err) => {
        console.error(err);
      },
    });
  }

  cambiarPagina(pagina: number) {
    if (pagina >= 1 && pagina <= this.totalPaginas()) {
      this.paginaActual.set(pagina);
    }
  }

  EsconderBoton(): boolean {
    const rol = this.rolUsuario;
    return rol !== 'Usuario';
  }

  confirmarEliminacion(idProducto: number) {
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'Esta acción eliminará el registro de forma permanente.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc3545',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.productoService.delete(idProducto).subscribe({
          next: (res: any) => {
            if (res.correct || res.Correct) {
              Swal.fire('¡Eliminado!', 'El registro ha sido borrado correctamente.', 'success');
              this.getAll();
            } else {
              Swal.fire('Error', res.errorMessage || 'No se pudo eliminar', 'error');
            }
          },
          error: (err) => {
            console.error('Error en Oracle:', err);
            Swal.fire('Error', 'Fallo en el servidor o base de datos.', 'error');
          },
        });
      }
    });
  }
}