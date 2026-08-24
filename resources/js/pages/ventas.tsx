import { Head } from '@inertiajs/react';
import { useMemo, useState } from 'react';
import ventas from '../routes/ventas';
import type { Producto, Venta, VentaRenglonForm } from '../types/app';

const initialVentaForm = {
    nombreComprador: '',
    renglones: [{ producto_id: '', cantidad: '' }],
};

export default function Ventas({ ventas: ventasServer, productos: productosServer }: { ventas: Venta[]; productos: Producto[] }) {
    const [modalOpen, setModalOpen] = useState(false);
    const [form, setForm] = useState(initialVentaForm);

    const subtotal = useMemo(() => {
        return form.renglones.reduce((sum, renglon) => {
            const producto = productosServer.find((item) => item.id === Number(renglon.producto_id));
            const cantidad = Number(renglon.cantidad) || 0;
            if (!producto || cantidad <= 0) {
                return sum;
            }
            return sum + producto.precio * cantidad;
        }, 0);
    }, [form.renglones, productosServer]);

    const updateRenglon = (index: number, changes: Partial<VentaRenglonForm>) => {
        setForm((prev) => ({
            ...prev,
            renglones: prev.renglones.map((item, itemIndex) =>
                itemIndex === index ? { ...item, ...changes } : item,
            ),
        }));
    };

    const addRenglon = () => {
        setForm((prev) => ({
            ...prev,
            renglones: [...prev.renglones, { producto_id: '', cantidad: '' }],
        }));
    };

    const removeRenglon = (index: number) => {
        setForm((prev) => ({
            ...prev,
            renglones: prev.renglones.filter((_, itemIndex) => itemIndex !== index),
        }));
    };

    const closeModal = () => {
        setModalOpen(false);
        setForm(initialVentaForm);
    };

    return (
        <>
            <Head title="Ventas" />
            <div className="mx-auto max-w-6xl px-4 py-6">
                <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-3xl font-semibold">Ventas</h1>
                        <p className="mt-1 text-sm text-slate-500">Historial de ventas y alta de nuevas ventas.</p>
                    </div>
                    <button
                        type="button"
                        onClick={() => setModalOpen(true)}
                        className="inline-flex items-center rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700"
                    >
                        Agregar venta
                    </button>
                </div>

                <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
                    <table className="min-w-full divide-y divide-slate-200 text-sm">
                        <thead className="bg-slate-50">
                            <tr>
                                <th className="px-4 py-3 text-left font-medium text-slate-700">ID</th>
                                <th className="px-4 py-3 text-left font-medium text-slate-700">Comprador</th>
                                <th className="px-4 py-3 text-left font-medium text-slate-700">Fecha</th>
                                <th className="px-4 py-3 text-left font-medium text-slate-700">Total</th>
                                <th className="px-4 py-3 text-left font-medium text-slate-700">Detalle</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200 bg-white">
                            {ventasServer.map((venta) => (
                                <tr key={venta.id}>
                                    <td className="px-4 py-3 text-slate-700">{venta.id}</td>
                                    <td className="px-4 py-3 text-slate-900">{venta.nombreComprador}</td>
                                    <td className="px-4 py-3 text-slate-700">{venta.fechaHoraVenta}</td>
                                    <td className="px-4 py-3 text-slate-700">${venta.total.toFixed(2)}</td>
                                    <td className="px-4 py-3 text-slate-700">
                                        <ul className="space-y-1 text-sm text-slate-600">
                                            {venta.detalles.map((detalle) => (
                                                <li key={detalle.renglon}>
                                                    {detalle.renglon}. {detalle.cantidad} x {detalle.productoNombre} = ${detalle.subtotal.toFixed(2)}
                                                </li>
                                            ))}
                                        </ul>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {modalOpen ? (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 px-4 py-6">
                    <div className="w-full max-w-3xl rounded-2xl bg-white p-6 shadow-xl">
                        <div className="mb-4 flex items-center justify-between">
                            <div>
                                <h2 className="text-xl font-semibold">Agregar venta</h2>
                                <p className="text-sm text-slate-500">Ingrese el nombre del comprador y los renglones de venta.</p>
                            </div>
                            <button type="button" onClick={closeModal} className="text-slate-500 hover:text-slate-700">Cerrar</button>
                        </div>
                        <form action={ventas.store().url} method="post" className="space-y-4">
                            <input type="hidden" name="_token" value={document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') ?? ''} />
                            <div>
                                <label className="block text-sm font-medium text-slate-700">Nombre del comprador</label>
                                <input
                                    name="nombreComprador"
                                    value={form.nombreComprador}
                                    onChange={(event) => setForm((prev) => ({ ...prev, nombreComprador: event.target.value }))}
                                    className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2"
                                    required
                                />
                            </div>

                            <div className="space-y-4">
                                {form.renglones.map((renglon, index) => {
                                    const producto = productosServer.find((item) => item.id === Number(renglon.producto_id));
                                    const cantidad = Number(renglon.cantidad) || 0;
                                    const subtotalRenglon = producto ? producto.precio * cantidad : 0;

                                    return (
                                        <div key={index} className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                                            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                                                <div className="flex-1">
                                                    <label className="block text-sm font-medium text-slate-700">Producto</label>
                                                    <select
                                                        name={`renglones[${index}][producto_id]`}
                                                        value={renglon.producto_id}
                                                        onChange={(event) =>
                                                            updateRenglon(index, {
                                                                producto_id: event.target.value,
                                                            })
                                                        }
                                                        className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2"
                                                        required
                                                    >
                                                        <option value="">Seleccionar producto</option>
                                                        {productosServer.map((item) => (
                                                            <option key={item.id} value={item.id}>
                                                                {item.nombre} - ${item.precio.toFixed(2)} (stock {item.stock})
                                                            </option>
                                                        ))}
                                                    </select>
                                                </div>
                                                <div className="w-28">
                                                    <label className="block text-sm font-medium text-slate-700">Cantidad</label>
                                                    <input
                                                        name={`renglones[${index}][cantidad]`}
                                                        type="number"
                                                        min="1"
                                                        value={renglon.cantidad}
                                                        onChange={(event) =>
                                                            updateRenglon(index, {
                                                                cantidad: event.target.value,
                                                            })
                                                        }
                                                        className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2"
                                                        required
                                                    />
                                                </div>
                                                <div className="w-36">
                                                    <span className="block text-sm font-medium text-slate-700">Subtotal</span>
                                                    <p className="mt-1 rounded-md border border-slate-300 bg-white px-3 py-2 text-slate-900">
                                                        ${subtotalRenglon.toFixed(2)}
                                                    </p>
                                                </div>
                                                <div className="shrink-0">
                                                    <button
                                                        type="button"
                                                        onClick={() => removeRenglon(index)}
                                                        className="rounded-md bg-rose-600 px-3 py-2 text-sm font-medium text-white hover:bg-rose-500"
                                                    >
                                                        Eliminar
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                                <button
                                    type="button"
                                    onClick={addRenglon}
                                    className="inline-flex items-center justify-center rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700"
                                >
                                    Agregar renglón
                                </button>
                                <div className="text-right text-sm text-slate-700">
                                    Total actual: <span className="font-semibold">${subtotal.toFixed(2)}</span>
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
                                    Guardar venta
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            ) : null}
        </>
    );
}
