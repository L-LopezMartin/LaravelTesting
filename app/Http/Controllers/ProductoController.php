<?php

namespace App\Http\Controllers;

use App\Models\Producto;
use App\Services\ProductoService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ProductoController extends Controller
{
    public function __construct(private ProductoService $productoService)
    {
    }

    public function index()
    {
        return Inertia::render('productos', [
            'productos' => $this->productoService->listarActivos()->map(fn (Producto $producto) => [
                'id' => $producto->id,
                'nombre' => $producto->nombre,
                'descripcion' => $producto->descripcion,
                'stock' => $producto->stock,
                'precio' => $producto->precio,
                'fechaHoraBaja' => $producto->fechaHoraBaja?->toDateTimeString(),
            ]),
        ]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'nombre' => 'required|string|max:255',
            'descripcion' => 'nullable|string|max:1000',
            'stock' => 'required|integer|min:0',
            'precio' => 'nullable|numeric|min:0',
        ]);

        $data['precio'] = $data['precio'] ?? 0;

        $this->productoService->crearProducto($data);

        return redirect()->route('productos');
    }

    public function update(Request $request, Producto $producto)
    {
        $data = $request->validate([
            'nombre' => 'required|string|max:255',
            'descripcion' => 'nullable|string|max:1000',
            'stock' => 'required|integer|min:0',
            'precio' => 'nullable|numeric|min:0',
        ]);

        $data['precio'] = $data['precio'] ?? 0;

        $this->productoService->actualizarProducto($producto, $data);

        return redirect()->route('productos');
    }

    public function baja(Producto $producto)
    {
        $this->productoService->darDeBaja($producto);

        return redirect()->route('productos');
    }
}
