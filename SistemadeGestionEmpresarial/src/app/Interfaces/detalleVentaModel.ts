import { ProductoModel } from "./productoModel";
import { VentaModel } from "./ventaModel";

export interface DetalleVentaModel {
  idDetalleVenta: number;
  cantidad: number;
  idVenta: VentaModel;
  idProducto: ProductoModel;
}
