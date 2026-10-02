import { RolModel } from "./rolModel";

export interface UsuarioModel {
    idUsuario:number;
    email:String;
    contrasena:String;
    nombre:String;
    apellidoPaterno:String;
    apellidoMaterno:String;
    Rol:RolModel;
}
