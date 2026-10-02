import { EstadoModel } from "./EstadoModel";

export interface MunicipioModel {
  idMunicipio: number;
  nombre: string;
  Estado:EstadoModel;
}
