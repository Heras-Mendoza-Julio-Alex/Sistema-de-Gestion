import { Routes } from '@angular/router';
import { Usuario } from './Component/usuario/usuario';
import { Tickets } from './Component/tickets/tickets';
import { Ticket } from './Component/ticket/ticket';
import { Ticketform } from './Component/ticketform/ticketform';
import { Login } from './Component/login/login';
import { authGuard } from './Guards/auth-guard';
import { Formulario } from './Component/formulario/formulario';

export const routes: Routes = [
  { path: 'login', component: Login },
  { path: 'registro', component: Formulario },

  {
    path: 'usuarios',
    component: Usuario,
    canActivate: [authGuard],
    data: { roles: ['Administrador'] },
  },
  { path: 'tickets', component: Tickets, canActivate: [authGuard] },
  { path: 'ticket/:idTicket', component: Ticket, canActivate: [authGuard] },
  { path: 'nuevo', component: Ticketform, canActivate: [authGuard], data: { roles: ['Usuario'] } },
  { path: '', redirectTo: 'login', pathMatch: 'full' },
];
