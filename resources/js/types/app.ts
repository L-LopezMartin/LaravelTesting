export type Producto = {
    id: number;
    nombre: string;
    descripcion?: string | null;
    stock: number;
    precio: number;
    fechaHoraBaja?: string | null;
};

export type VentaDetalle = {
    renglon: number;
    cantidad: number;
    subtotal: number;
    productoNombre: string;
    productoPrecio: number;
};

export type Venta = {
    id: number;
    total: number;
    nombreComprador: string;
    fechaHoraVenta: string;
    detalles: VentaDetalle[];
};

export type VentaRenglonForm = {
    producto_id: string;
    cantidad: string;
};
