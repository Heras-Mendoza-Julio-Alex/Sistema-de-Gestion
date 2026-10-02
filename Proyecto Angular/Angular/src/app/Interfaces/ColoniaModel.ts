import { MunicipioModel } from "./MunicipioModel";

export interface ColoniaModel {
    idColonia:number;
    nombre: string;
    codigoPostal: string;
    Municipio: MunicipioModel;
}
