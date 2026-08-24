<?php

namespace App\Services;

use App\Models\Producto;
use Illuminate\Database\Eloquent\Collection;

class ProductoService
{
    public function listarActivos(): Collection
    {
        return Producto::activos()->orderBy('id')->get();
    }

    public function crearProducto(array $data): Producto
    {
        return Producto::create([
            'nombre' => $data['nombre'],
            'descripcion' => $data['descripcion'] ?? null,
            'stock' => $data['stock'],
            'precio' => $data['precio'] ?? 0,
        ]);
    }

    public function actualizarProducto(Producto $producto, array $data): Producto
    {
        $producto->update([
            'nombre' => $data['nombre'],
            'descripcion' => $data['descripcion'] ?? null,
            'stock' => $data['stock'],
            'precio' => $data['precio'] ?? 0,
        ]);

        return $producto;
    }

    public function darDeBaja(Producto $producto): Producto
    {
        $producto->update(['fechaHoraBaja' => now()]);

        return $producto;
    }
}
