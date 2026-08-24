<?php

use App\Http\Controllers\ProductoController;
use App\Http\Controllers\VentaController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', fn () => Inertia::render('welcome'))->name('home');

Route::get('/productos', [ProductoController::class, 'index'])->name('productos');
Route::post('/productos', [ProductoController::class, 'store'])->name('productos.store');
Route::put('/productos/{producto}', [ProductoController::class, 'update'])->name('productos.update');
Route::patch('/productos/{producto}/baja', [ProductoController::class, 'baja'])->name('productos.baja');

Route::get('/ventas', [VentaController::class, 'index'])->name('ventas');
Route::post('/ventas', [VentaController::class, 'store'])->name('ventas.store');
