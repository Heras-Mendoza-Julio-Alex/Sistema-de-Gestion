import { Component, signal, OnInit, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ProductoService } from '../../Services/productoService';
import { VentaService } from '../../Services/ventaService';
import { DetalleVentaService } from '../../Services/detalleVentaService';
import Swal from 'sweetalert2';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-venta',
  imports: [CommonModule],
  templateUrl: './venta.html',
  styleUrl: './venta.css',
})
export class Venta implements OnInit {
  productos = signal<any[]>([]);
  carrito = signal<any[]>([]);
  cargando: boolean = false;

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

  total = computed(() => this.carrito().reduce((acc, p) => acc + p.precio * p.cantidad, 0));

  constructor(
    private productoService: ProductoService,
    private ventaService: VentaService,
    private detalleVentaService: DetalleVentaService,
    private http: HttpClient,
  ) {}

  ngOnInit() {
    this.getAllProductos();
  }

  getAllProductos() {
    this.productoService.getall().subscribe({
      next: (data) => {
        this.productos.set([...(data.Objects || [])]);
        this.paginaActual.set(1);
      },
      error: (err) => {
        console.error('Error al cargar catálogo:', err);
      },
    });
  }

  cambiarPagina(pagina: number) {
    if (pagina >= 1 && pagina <= this.totalPaginas()) {
      this.paginaActual.set(pagina);
    }
  }

  agregarAlCarrito(producto: any) {
    const actual = this.carrito();
    const existe = actual.find((p) => p.idProducto === producto.idProducto);

    if (existe) {
      if (existe.cantidad < producto.stock) {
        this.carrito.set(
          actual.map((p) =>
            p.idProducto === producto.idProducto ? { ...p, cantidad: p.cantidad + 1 } : p,
          ),
        );
      } else {
        Swal.fire({
          title: 'Sin stock',
          text: 'No hay más unidades disponibles',
          icon: 'warning',
          confirmButtonColor: '#198754',
        });
      }
    } else {
      this.carrito.set([...actual, { ...producto, cantidad: 1 }]);
    }
  }

  finalizarCompra() {
    if (this.carrito().length === 0) return;

    const token = sessionStorage.getItem('token');
    let idDelUsuario = 0;
    let emailDelUsuario = '';
    let nombreDelUsuario = '';

    if (token) {
      try {
        const payload = JSON.parse(window.atob(token.split('.')[1]));
        idDelUsuario = payload.id || 0;
        emailDelUsuario = payload.sub || '';
        nombreDelUsuario = payload.sub ? payload.sub.split('@')[0] : 'Usuario';
      } catch (e) {
        console.error('Error al decodificar el token', e);
      }
    }

    const dtoNotificacion = {
      venta: {
        idVenta: 0,
        fechaRegistro: new Date().toISOString().split('T')[0],
        totalVenta: String(this.total()),
        usuario: {
          idUsuario: idDelUsuario,
          email: emailDelUsuario,
          nombre: nombreDelUsuario,
        },
      },
      detalles: this.carrito().map((item) => ({
        idDetalleVenta: 0,
        cantidad: item.cantidad,
        producto: {
          idProducto: Number(item.idProducto),
          nombre: item.nombre,
        },
      })),
    };

    Swal.fire({
      title: '¿Confirmar Venta?',
      text: `Total: $${this.total()}`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#198754',
      confirmButtonText: 'Aceptar',
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: 'Enviando correo de validación...',
          text: 'Por favor espera.',
          allowOutsideClick: false,
          showConfirmButton: false,
          didOpen: () => {
            Swal.showLoading();
          },
        });

        this.ventaService.notificarCompra(dtoNotificacion).subscribe({
          next: (res: any) => {
            if (res.Correct) {
              Swal.update({
                title: 'Esperando confirmación...',
                text: 'Por favor, ve a tu correo electrónico y haz clic en "Confirmar Compra" para finalizar.',
              });

              const intervalo = setInterval(() => {
                this.ventaService.getall().subscribe({
                  next: (statusRes: any) => {
                    const ventaConfirmada = statusRes.Objects?.find(
                      (v: any) =>
                        v.usuario?.idUsuario === idDelUsuario &&
                        v.totalVenta === String(this.total()),
                    );

                    if (ventaConfirmada) {
                      clearInterval(intervalo);
                      Swal.close();
                      Swal.fire({
                        title: '¡Éxito!',
                        text: 'Compra validada desde el correo correctamente.',
                        icon: 'success',
                        confirmButtonColor: '#198754',
                        confirmButtonText: 'Aceptar',
                      }).then((result) => {
                        if (result.isConfirmed || result.isDismissed) {
                          this.carrito.set([]);
                          this.getAllProductos();
                        }
                      });
                      this.carrito.set([]);
                      this.getAllProductos();
                    }
                  },
                  error: () => {
                    console.log('Esperando interacción...');
                  },
                });
              }, 3000);
            } else {
              Swal.close();
              Swal.fire('Error', 'No se pudo enviar el correo de validación', 'error');
            }
          },
          error: (err) => {
            Swal.close();
            Swal.fire('Error');
          },
        });
      }
    });
  }
}
