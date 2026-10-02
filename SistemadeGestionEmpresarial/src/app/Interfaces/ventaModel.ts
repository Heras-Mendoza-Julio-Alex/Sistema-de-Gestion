import { UsuarioModel } from "./usuarioModel";

export interface VentaModel {
  idVenta: number;
  fechaRegistro: Date;
  totalVenta: number;
  idUsuario: UsuarioModel;
}
