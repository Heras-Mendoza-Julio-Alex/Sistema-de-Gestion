import { Routes } from '@angular/router';
import { Login } from './Component/login/login';
import { Register } from './Component/register/register';
import { Usuarios } from './Component/usuarios/usuarios';
import { Usuario } from './Component/usuario/usuario';
import { Productos } from './Component/productos/productos';
import { Producto } from './Component/producto/producto';
import { authGuard } from './Guards/auth-guard';
import { AnadirProducto } from './Component/anadir-producto/anadir-producto';
import { Venta } from './Component/venta/venta';
import { Detalleventa } from './Component/detalleventa/detalleventa';

export const routes: Routes = [
  { path: 'login', component: Login },
  { path: 'registro', component: Register },
  {
    path: 'usuarios',
    component: Usuarios,
    canActivate: [authGuard],
    data: { roles: ['Administrador'] },
  },
    {
    path: 'detalleventa',
    component: Detalleventa,
    canActivate: [authGuard],
    data: { roles: ['Administrador'] },
  },
  {
    path: 'productos',
    component: Productos,
    canActivate: [authGuard],
    data: { roles: ['Administrador'] },
  },
  {
    path: 'anadirproducto',
    component: AnadirProducto,
    canActivate: [authGuard],
    data: { roles: ['Administrador'] },
  },
  {
    path: 'productos/:idProducto',
    component: Producto,
    canActivate: [authGuard],
    data: { roles: ['Administrador'] },
  },
  { path: 'carrito', component: Venta, canActivate: [authGuard] },
  {
    path: 'usuarios/:idUsuario',
    component: Usuario,
    canActivate: [authGuard],
    data: { roles: ['Administrador'] },
  },
  { path: '', redirectTo: 'login', pathMatch: 'full' },
];



