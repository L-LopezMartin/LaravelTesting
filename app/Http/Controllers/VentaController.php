<?php

namespace App\Http\Controllers;

use App\Services\ProductoService;
use App\Services\VentaService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class VentaController extends Controller
{
    public function __construct(
        private VentaService $ventaService,
        private ProductoService $productoService,
    ) {
    }

    public function index()
    {
        return Inertia::render('ventas', [
            'ventas' => $this->ventaService->listarVentas()->map(fn ($venta) => [
                'id' => $venta->id,
                'total' => $venta->total,
                'nombreComprador' => $venta->nombreComprador,
                'fechaHoraVenta' => $venta->fechaHoraVenta->toDateTimeString(),
                'detalles' => $venta->detalles->map(fn ($detalle) => [
                    'renglon' => $detalle->renglon,
                    'cantidad' => $detalle->cantidad,
                    'subtotal' => $detalle->subtotal,
                    'productoNombre' => $detalle->producto->nombre,
                    'productoPrecio' => $detalle->producto->precio,
                ]),
            ]),
            'productos' => $this->productoService->listarActivos()->map(fn ($producto) => [
                'id' => $producto->id,
                'nombre' => $producto->nombre,
                'precio' => $producto->precio,
                'stock' => $producto->stock,
            ]),
        ]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'nombreComprador' => 'required|string|max:255',
            'renglones' => 'required|array|min:1',
            'renglones.*.producto_id' => 'required|exists:productos,id',
            'renglones.*.cantidad' => 'required|integer|min:1',
        ]);

        $this->ventaService->crearVenta($data['nombreComprador'], $data['renglones']);

        return redirect()->route('ventas');
    }
}
