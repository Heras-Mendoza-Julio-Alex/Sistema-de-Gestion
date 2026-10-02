import { TicketModel } from "./ticketModel";
import { UsuarioModel } from "./usuarioModel";

export interface ComentarioModel {
  idComentario: number;
  contenido: string;
  usuario : UsuarioModel;
  ticket:TicketModel
}
