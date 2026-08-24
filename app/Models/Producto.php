<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Producto extends Model
{
    use HasFactory;

    protected $table = 'productos';

    protected $fillable = [
        'nombre',
        'descripcion',
        'stock',
        'precio',
        'fechaHoraBaja',
    ];

    protected $casts = [
        'stock' => 'integer',
        'precio' => 'float',
        'fechaHoraBaja' => 'datetime',
    ];

    public function scopeActivos(Builder $query): Builder
    {
        return $query->whereNull('fechaHoraBaja');
    }

    public function detalles(): HasMany
    {
        return $this->hasMany(VentaDetalle::class, 'producto_id');
    }
}
