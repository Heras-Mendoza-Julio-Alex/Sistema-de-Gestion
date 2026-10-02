import { Component, signal, OnInit, computed } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';
import { VentaService } from '../../Services/ventaService';
import { DetalleVentaService } from '../../Services/detalleVentaService';
import { VentaModel } from '../../Interfaces/ventaModel';
import { DetalleVentaModel } from '../../Interfaces/detalleVentaModel';

@Component({
  selector: 'app-detalleventa',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './detalleventa.html',
  styleUrl: './detalleventa.css',
})
export class Detalleventa implements OnInit {
  Ventas = signal<VentaModel[]>([]);
  ventaSeleccionada = signal<VentaModel | null>(null);
  detallesDeVenta = signal<DetalleVentaModel[]>([]);

  paginaActual = signal<number>(1);
  itemsPorPagina = signal<number>(6);

  ventasPaginadas = computed(() => {
    const inicio = (this.paginaActual() - 1) * this.itemsPorPagina();
    const fin = inicio + this.itemsPorPagina();
    return this.Ventas().slice(inicio, fin);
  });

  totalPaginas = computed(() => {
    return Math.ceil(this.Ventas().length / this.itemsPorPagina());
  });

  arrayPaginas = computed(() => {
    return Array.from({ length: this.totalPaginas() }, (_, i) => i + 1);
  });

  constructor(
    private ventaService: VentaService,
    private detalleVentaService: DetalleVentaService,
  ) {}

  ngOnInit() {
    this.getAll();
  }

  getAll() {
    this.ventaService.getall().subscribe({
      next: (data: any) => {
        if (data && Array.isArray(data.Objects)) {
          const mapeado: VentaModel[] = data.Objects.map((item: any) => ({
            idVenta: item.idVenta,
            fechaRegistro: item.fechaRegistro,
            totalVenta: item.totalVenta,
            idUsuario: item.usuario,
          }));
          this.Ventas.set(mapeado);
          this.paginaActual.set(1);
        }
      },
      error: (err) => {
        console.error(err);
        Swal.fire('Error', 'No se pudieron cargar las ventas', 'error');
      },
    });
  }

  cambiarPagina(pagina: number) {
    if (pagina >= 1 && pagina <= this.totalPaginas()) {
      this.paginaActual.set(pagina);
    }
  }

  verDetalle(venta: VentaModel) {
    this.ventaSeleccionada.set(venta);
    this.detalleVentaService.getall().subscribe({
      next: (data: any) => {
        if (data && Array.isArray(data.Objects)) {
          const filtrados = data.Objects.filter((item: any) => {
            return item.venta && item.venta.idVenta === venta.idVenta;
          });

          const mapeadoDetalles: DetalleVentaModel[] = filtrados.map((item: any) => ({
            idDetalleVenta: item.idDetalleVenta,
            cantidad: item.cantidad,
            idProducto: item.producto,
            idVenta: item.venta,
          }));

          this.detallesDeVenta.set(mapeadoDetalles);
        }
      },
      error: (err) => {
        console.error(err);
        Swal.fire('Error', 'No se pudieron cargar los productos de esta venta', 'error');
      },
    });
  }

  confirmarEliminacion(idVenta: number) {
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
        this.ventaService.delete(idVenta).subscribe({
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

  regresarAListado() {
    this.ventaSeleccionada.set(null);
    this.detallesDeVenta.set([]);
  }
}
