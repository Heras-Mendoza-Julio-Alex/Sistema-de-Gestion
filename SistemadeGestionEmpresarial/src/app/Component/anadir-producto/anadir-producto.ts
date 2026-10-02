import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ProductoService } from '../../Services/productoService';
import { Router, RouterLink } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-anadir-producto',
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './anadir-producto.html',
  styleUrl: './anadir-producto.css',
})
export class AnadirProducto {
  anadir!: FormGroup;
  cargando: boolean = false;
  imagenBase64: string | null = null;

  constructor(
    private fb: FormBuilder,
    private productoService: ProductoService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.anadir = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(2)]],
      precio: ['', [Validators.required]],
      stock: ['', [Validators.required]],
    });
  }

  onFileSelected(event: any): void {
    const file: File = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.imagenBase64 = (reader.result as string).split(',')[1];
      };
      reader.readAsDataURL(file);
    }
  }

  registrar(): void {
    if (this.anadir.valid) {
      this.cargando = true;

      const productoData = {
        ...this.anadir.value,
        imagen: this.imagenBase64,
      };

      this.productoService.add(productoData).subscribe({
        next: (res: any) => {
          this.cargando = false;
          if (res.correct || res.Correct) {
            Swal.fire({
              title: '¡Producto Registrado!',
              text: 'El producto se ha añadido correctamente.',
              icon: 'success',
              confirmButtonColor: '#0d6efd',
            }).then(() => {
              this.anadir.reset();
              this.imagenBase64 = null;
            });
          } else {
            Swal.fire('Error', res.errorMessage || 'No se pudo guardar.', 'error');
          }
        },
        error: (err) => {
          this.cargando = false;
          console.error('Error:', err);
          Swal.fire('Error de red', 'No se pudo conectar con el servidor.', 'error');
        },
      });
    } else {
      this.anadir.markAllAsTouched();
    }
  }
}
