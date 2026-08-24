<?php

namespace App\Services;

use App\Models\Producto;
use App\Models\Venta;
use App\Models\VentaDetalle;
use Illuminate\Support\Facades\DB;

class VentaService
{
    public function listarVentas()
    {
        return Venta::with('detalles.producto')->orderByDesc('id')->get();
    }

    public function crearVenta(string $nombreComprador, array $renglones): Venta
    {
        return DB::transaction(function () use ($nombreComprador, $renglones) {
            $venta = Venta::create([
                'total' => 0,
                'nombreComprador' => $nombreComprador,
                'fechaHoraVenta' => now(),
            ]);

            $total = 0;

            foreach ($renglones as $index => $renglon) {
                $producto = Producto::findOrFail($renglon['producto_id']);
                $cantidad = max(1, intval($renglon['cantidad']));

                if ($producto->stock < $cantidad) {
                    throw new \InvalidArgumentException("No hay stock suficiente para el producto {$producto->nombre}.");
                }

                $subtotal = round($producto->precio * $cantidad, 2);

                VentaDetalle::create([
                    'venta_id' => $venta->id,
                    'producto_id' => $producto->id,
                    'renglon' => $index + 1,
                    'cantidad' => $cantidad,
                    'subtotal' => $subtotal,
                ]);

                $producto->decrement('stock', $cantidad);
                $total += $subtotal;
            }

            $venta->total = $total;
            $venta->save();

            return $venta;
        });
    }
}
