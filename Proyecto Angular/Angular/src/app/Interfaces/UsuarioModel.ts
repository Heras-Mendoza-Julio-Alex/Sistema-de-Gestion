import { RolModel } from './RolModel';
import { DireccionModel } from './DireccionModel';

export interface UsuarioModel {
  nombre: string;
  apellidoPaterno: string;
  apellidoMaterno: string;
  telefono: string;
  fechanacimiento: Date;
  username: string;
  email: string;
  sexo: string;
  celular: string;
  curp: string;
  password: string;
  idUsuario: number;
  estatus: number;
  imagen: String;
  rol: RolModel;
  Direcciones: DireccionModel[];
}
