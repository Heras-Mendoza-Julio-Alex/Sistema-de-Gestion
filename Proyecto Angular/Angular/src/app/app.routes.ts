import { Routes } from '@angular/router';
import { Usuario } from './Components/usuario/usuario';
import { UsuarioDetail } from './Components/usuario-detail/usuario-detail';
import { Usuarioform } from './Components/usuarioform/usuarioform';
import { CargaMasiva } from './Components/CargaMasiva/carga-masiva';


export const routes: Routes = [
  { path: '', component: Usuario },
  { path: 'usuarioform', component: Usuarioform },
  { path: 'cargamasiva', component: CargaMasiva },
  { path: ':idUsuario', component: UsuarioDetail },
  
];
