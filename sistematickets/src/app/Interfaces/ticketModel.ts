import { EstadoModel } from "./estadoModel";
import { PrioridadModel } from "./prioridadModel";
import { UsuarioModel } from "./usuarioModel";

export interface TicketModel {

    idTicket:number;
    titulo:String;
    descripcion:String;
    Fecha:Date;
    Estado:EstadoModel;
    Prioridad:PrioridadModel;
    usuario:UsuarioModel;
    
}
