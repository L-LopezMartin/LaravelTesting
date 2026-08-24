import { Head } from '@inertiajs/react';
import { useMemo, useState } from 'react';
import productos from '../routes/productos';
import type { Producto } from '../types/app';

const initialForm = { nombre: '', descripcion: '', stock: 0, precio: 0 };

export default function Productos({ productos: productosServer }: { productos: Producto[] }) {
    const [modalOpen, setModalOpen] = useState(false);
    const [editProducto, setEditProducto] = useState<Producto | null>(null);
    const [form, setForm] = useState(initialForm);

    const activos = useMemo(
        () => productosServer.filter((producto) => !producto.fechaHoraBaja),
        [productosServer],
    );

    const openNew = () => {
        setEditProducto(null);
        setForm(initialForm);
        setModalOpen(true);
    };

    const openEdit = (producto: Producto) => {
        setEditProducto(producto);
        setForm({
            nombre: producto.nombre,
            descripcion: producto.descripcion ?? '',
            stock: producto.stock,
            precio: producto.precio,
        });
        setModalOpen(true);
    };

    const closeModal = () => setModalOpen(false);

    return (
        <>
            <Head title="Productos" />
            <div className="mx-auto max-w-6xl px-4 py-6">
                <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-3xl font-semibold">Productos</h1>
                        <p className="mt-1 text-sm text-slate-500">Listado de productos activos y acciones de alta/edición.</p>
                    </div>
                    <button
                        type="button"
                        onClick={openNew}
                        className="inline-flex items-center rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700"
                    >
                        Agregar producto
                    </button>
                </div>

                <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
                    <table className="min-w-full divide-y divide-slate-200 text-sm">
                        <thead className="bg-slate-50">
                            <tr>
                                <th className="px-4 py-3 text-left font-medium text-slate-700">ID</th>
                                <th className="px-4 py-3 text-left font-medium text-slate-700">Nombre</th>
                                <th className="px-4 py-3 text-left font-medium text-slate-700">Descripción</th>
                                <th className="px-4 py-3 text-left font-medium text-slate-700">Stock</th>
                                <th className="px-4 py-3 text-left font-medium text-slate-700">Precio</th>
                                <th className="px-4 py-3 text-left font-medium text-slate-700">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200 bg-white">
                            {activos.map((producto) => (
                                <tr key={producto.id}>
                                    <td className="px-4 py-3 text-slate-700">{producto.id}</td>
                                    <td className="px-4 py-3 text-slate-900">{producto.nombre}</td>
                                    <td className="px-4 py-3 text-slate-600">{producto.descripcion}</td>
                                    <td className="px-4 py-3 text-slate-700">{producto.stock}</td>
                                    <td className="px-4 py-3 text-slate-700">${producto.precio.toFixed(2)}</td>
                                    <td className="px-4 py-3">
                                        <div className="flex gap-2">
                                            <button
                                                type="button"
                                                onClick={() => openEdit(producto)}
                                                className="rounded-md bg-slate-700 px-3 py-1 text-sm font-medium text-white hover:bg-slate-600"
                                            >
                                                Editar
                                            </button>
                                            <form action={productos.baja(producto.id).url} method="post">
                                                <input type="hidden" name="_token" value={document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') ?? ''} />
                                                <input type="hidden" name="_method" value="PATCH" />
                                                <button
                                                    type="submit"
                                                    className="rounded-md bg-rose-600 px-3 py-1 text-sm font-medium text-white hover:bg-rose-500"
                                                >
                                                    Dar de baja
                                                </button>
                                            </form>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {modalOpen ? (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 px-4 py-6">
                    <div className="w-full max-w-xl rounded-2xl bg-white p-6 shadow-xl">
                        <div className="mb-4 flex items-center justify-between">
                            <div>
                                <h2 className="text-xl font-semibold">{editProducto ? 'Editar producto' : 'Agregar producto'}</h2>
                                <p className="text-sm text-slate-500">Completa el formulario para {editProducto ? 'actualizar' : 'crear'} el producto.</p>
                            </div>
                            <button type="button" onClick={closeModal} className="text-slate-500 hover:text-slate-700">Cerrar</button>
                        </div>
                        <form action={editProducto ? productos.update(editProducto.id).url : productos.store().url} method="post" className="space-y-4">
                            <input type="hidden" name="_token" value={document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') ?? ''} />
                            {editProducto ? <input type="hidden" name="_method" value="PUT" /> : null}
                            <div>
                                <label className="block text-sm font-medium text-slate-700">Nombre</label>
                                <input
                                    name="nombre"
                                    value={form.nombre}
                                    onChange={(event) => setForm((prev) => ({ ...prev, nombre: event.target.value }))}
                                    className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700">Descripción</label>
                                <textarea
                                    name="descripcion"
                                    value={form.descripcion}
                                    onChange={(event) => setForm((prev) => ({ ...prev, descripcion: event.target.value }))}
                                    className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2"
                                />
                            </div>
                            <div className="grid gap-4 sm:grid-cols-2">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700">Stock</label>
                                    <input
                                        name="stock"
                                        type="number"
                                        min="0"
                                        value={form.stock}
                                        onChange={(event) => setForm((prev) => ({ ...prev, stock: Number(event.target.value) }))}
                                        className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700">Precio</label>
                                    <input
                                        name="precio"
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        value={form.precio}
                                        onChange={(event) => setForm((prev) => ({ ...prev, precio: Number(event.target.value) }))}
                                        className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="flex items-center justify-end gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={closeModal}
                                    className="rounded-md border border-slate-300 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700"
                                >
                                    Guardar
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            ) : null}
        </>
    );
}
