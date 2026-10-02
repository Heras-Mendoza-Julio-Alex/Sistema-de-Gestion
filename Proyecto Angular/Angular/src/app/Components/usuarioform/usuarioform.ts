import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { paisService } from '../../Services/paisService';
import { estadoService } from '../../Services/estadoService';
import { municipioService } from '../../Services/municipioService';
import { coloniaService } from '../../Services/coloniaService';
import { usuarioService } from '../../Services/usuarioService';

import { Paismodel } from '../../Interfaces/PaisModel';
import { EstadoModel } from '../../Interfaces/EstadoModel';
import { MunicipioModel } from '../../Interfaces/MunicipioModel';
import { ColoniaModel } from '../../Interfaces/ColoniaModel';

@Component({
  selector: 'app-usuarioform',
  templateUrl: './usuarioform.html',
  styleUrl: './usuarioform.css',
  imports: [RouterLink, ReactiveFormsModule, FormsModule]
})
export class Usuarioform implements OnInit {
  paises: Paismodel[] = [];
  estados: EstadoModel[] = [];
  municipios: MunicipioModel[] = [];
  colonias: ColoniaModel[] = [];
  archivoFile: File | null = null;

  constructor(
    private paisServ: paisService,
    private estadoServ: estadoService,
    private municipioServ: municipioService,
    private coloniaServ: coloniaService,
    public usuarioServ: usuarioService,
    private router: Router
  ) {}

  usuarioform = new FormGroup({
    nombre: new FormControl('', [Validators.required, Validators.pattern('[a-zA-ZáéíóúÁÉÍÓÚñÑ ]+')]),
    apellidoPaterno: new FormControl('', [Validators.required, Validators.pattern('[a-zA-ZáéíóúÁÉÍÓÚñÑ ]+')]),
    apellidoMaterno: new FormControl('', [Validators.required, Validators.pattern('[a-zA-ZáéíóúÁÉÍÓÚñÑ ]+')]),
    email: new FormControl('', [Validators.required, Validators.email]),
    telefono: new FormControl('', [Validators.required, Validators.pattern('^\\+?[1-9]\\d{9,13}$')]),
    celular: new FormControl('', [Validators.required, Validators.pattern('^\\+?[1-9]\\d{9,13}$')]),
    fechanacimiento: new FormControl('', Validators.required),
    sexo: new FormControl(''),
    curp: new FormControl('', [Validators.required, Validators.pattern('^[A-Z]{4}[0-9]{6}[A-Z]{7}[0-9]{1}$')]),
    username: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required),
    idPais: new FormControl(0),
    idEstado: new FormControl(0),
    idMunicipio: new FormControl(0),
    idColonia: new FormControl(0),
    calle: new FormControl(''),
    numeroExterior: new FormControl(''),
    numeroInterior: new FormControl('')
  });

  ngOnInit(): void {
    this.cargarPaises();
  }

  cargarPaises() {
    this.paisServ.getall().subscribe({
      next: (res) => { this.paises = res.Objects; },
      error: (err) => console.error(err),
    });
  }

  onFileSelected(event: any) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.archivoFile = input.files[0];      
    }
  }

  onPaisChange(event: any) {
    const id = Number(event.target.value);
    this.estados = []; this.municipios = []; this.colonias = [];
    this.usuarioform.patchValue({ idEstado: 0, idMunicipio: 0, idColonia: 0 });
    if (id > 0) {
      this.estadoServ.getallbyid(id).subscribe({
        next: (res) => { this.estados = res.Objects; },
        error: (err) => console.error(err)
      });
    }
  }

  onEstadoChange(event: any) {
    const id = Number(event.target.value);
    this.municipios = []; this.colonias = [];
    this.usuarioform.patchValue({ idMunicipio: 0, idColonia: 0 });
    if (id > 0) {
      this.municipioServ.getallbyid(id).subscribe({
        next: (res) => { this.municipios = res.Objects; },
        error: (err) => console.error(err)
      });
    }
  }

  onMunicipioChange(event: any) {
    const id = Number(event.target.value);
    this.colonias = [];
    this.usuarioform.patchValue({ idColonia: 0 });
    if (id > 0) {
      this.coloniaServ.getallbyid(id).subscribe({
        next: (res) => { this.colonias = res.Objects; },
        error: (err) => console.error(err)
      });
    }
  }

  onSubmit() {
    if (this.usuarioform.valid) {
      const formValue = this.usuarioform.getRawValue();

      const usuarioA: any = {
        nombre: formValue.nombre,
        apellidoPaterno: formValue.apellidoPaterno,
        apellidoMaterno: formValue.apellidoMaterno,
        email: formValue.email,
        telefono: formValue.telefono,
        celular: formValue.celular,
        fechanacimiento: formValue.fechanacimiento, 
        curp: formValue.curp,
        sexo: formValue.sexo,
        username: formValue.username,
        password: formValue.password,
        estatus: 1,
        imagen: '', 
        rol: { idRol: 2 }
      };

      if (formValue.idColonia && Number(formValue.idColonia) > 0) {
        usuarioA.Direcciones = [
          {
            calle: formValue.calle || '',
            numeroExterior: formValue.numeroExterior || '',
            numeroInterior: formValue.numeroInterior || '',
            Colonia: { idColonia: Number(formValue.idColonia) }
          }
        ];
      } else {
        usuarioA.Direcciones = [];
      }

      const formData = new FormData();
      
      const jsonBlob = new Blob([JSON.stringify(usuarioA)], { type: 'application/json' });
      formData.append('usuario', jsonBlob);

      if (this.archivoFile) {
        formData.append('Imagen', this.archivoFile, this.archivoFile.name);
      }

      this.usuarioServ.add(formData).subscribe({
        next: (res) => {           
          this.router.navigate(['/']); 
        },
        error: (err) => console.error('Error:', err)
      });
    } else {
      this.usuarioform.markAllAsTouched();
    }
  }
}