import { ColoniaModel } from "./ColoniaModel";
import { UsuarioModel } from "./UsuarioModel";

export interface DireccionModel {
    idDireccion: number;
    calle:string;
    numeroInterior:string;
    numeroExterior:string;
    colonia:ColoniaModel;
    usuario:UsuarioModel;
}
