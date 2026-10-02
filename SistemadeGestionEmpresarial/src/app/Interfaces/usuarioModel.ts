import { RolModel } from "./rolModel";

export interface UsuarioModel { idUsuario:number;
    email:string;
    contrasena:string;
    usuario:string;
    nombre:string;
    apellidoPaterno:string;
    apellidoMaterno:string;
    telefono:string;
    token:string;
    rol:RolModel;
    estatus:number;
}
