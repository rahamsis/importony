
'use client';

import { useState, useEffect, } from "react";
import Image from "next/image";

interface Productos {
    idProducto: number;
    categoria: string;
    subCategoria: string;
    marca: string;
    nombre: string;
    precio: number;
    color: string
    decripcion: string;
    imagen: string;
    destacado: boolean;
    nuevo: boolean;
    masVendido: boolean;
    activo: boolean;
    fotos: string[];
}

interface SidebarProps {
    products: Productos[];
    filteredProducts: Productos[];
    selectedFilters: Record<string, string[]>;
    onFiltersChange: (filters: Record<string, string[]>) => void;
}

const Sidebar = ({ products, filteredProducts, selectedFilters, onFiltersChange }: SidebarProps) => {
    const [productosEspeciales, setProductosEspeciales] = useState<Productos[]>([]);
    const atributos = products.length > 0
        ? Object.keys(products[0]).filter(k =>
            !["idProducto", "nombre", "precio", "descripcion", "imagen",
                "fotos", "nuevo", "activo", "destacado", "masVendido", "categoria"].includes(k)
        )
        : [];

    // Inicializa filtros vacíos al cargar productos
    useEffect(() => {
        if (products.length && Object.keys(selectedFilters).length === 0) {
            const initFilters: Record<string, string[]> = {};
            atributos.forEach(attr => (initFilters[attr] = []));
            onFiltersChange(initFilters);
        }
    }, [products]);

    // Manejo de checkboxes
    const handleFilterChange = (group: string, value: string) => {
        const current = selectedFilters[group] || [];
        const isSelected = current.includes(value);
        const updated = isSelected ? current.filter(v => v !== value) : [...current, value];
        onFiltersChange({ ...selectedFilters, [group]: updated });
    };

    // Opciones dinámicas según productos filtrados
    const getOptions = (attr: string) => {
        const baseData = selectedFilters[attr]?.length > 0 ? products : filteredProducts;
        const counts = baseData.reduce((acc: Record<string, number>, p) => {
            const key = (p as any)[attr];
            acc[key] = (acc[key] || 0) + 1;
            return acc;
        }, {});
        return Object.entries(counts)
            .map(([key, count]) => ({ value: key, count }))
            .sort((a, b) => a.value.localeCompare(b.value)); // Orden alfabético;
    };

    // Inicializa productos especiales
    useEffect(() => {
        if (products.length) {
            const productos = products.filter(p => p.destacado)

            // Orden aleatorio por idProducto
            const productosAleatorios = productos
                .map(p => ({ ...p, random: Math.random() }))
                .sort((a, b) => a.random - b.random)
                .slice(0, 2);

            setProductosEspeciales(productosAleatorios);
        }
    }, [products]);

    return (
        <div className="w-full  mb-10">
            <div className="py-4 border-b border-zinc-300">
                <h3 className="font-medium capitalize mb-3">FILTRAR POR</h3>
                {atributos.map(attr => (
                    (attr != "null" && attr != null && attr != "") &&
                    <div key={attr} className="mb-4">
                        <h3 className="font-medium capitalize mb-1">{attr}</h3>
                        {getOptions(attr).map(option => (
                            (option.value != "null" && option.value != null && option.value !== "") &&
                            <div key={option.value} className="space-y-1 flex items-center justify-between cursor-pointer">
                                <div className="space-x-2 text-zinc-600">
                                    <input
                                        type="checkbox"
                                        className="accent-black"
                                        checked={selectedFilters[attr]?.includes(option.value) || false}
                                        onChange={() => handleFilterChange(attr, option.value)}
                                    />
                                    <span className="font-light">{option.value} </span>
                                </div>
                                <span className="text-zinc-600 font-light">({option.count})</span>
                            </div>
                        ))}
                    </div>
                ))}
            </div>

            <div className="py-4 border-b border-zinc-300">
                <h3 className="font-semibold capitalize mb-3">PRODUCTOS ESPECIALES</h3>
                <div className={`grid grid-cols-1 gap-4`}>
                    {productosEspeciales.map(prod => (
                        <div key={prod.idProducto} className="flex gap-4">
                            <div className="border-slate-300 border">
                                <Image
                                    src={prod.imagen}
                                    alt={prod.nombre}
                                    width={150}
                                    height={150}
                                    className="my-2 object-cover"
                                    priority={true}
                                />
                            </div>
                            <div className="text-left relative items-center justify-start mx-auto mt-2 w-full">
                                <h3 className="text-base text-gray mb-2 w-full font-light">{prod.nombre}</h3>

                                <h3 className={`text-lg font-medium`}>
                                    S/ {prod.precio}
                                </h3>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="py-4">
                <Image
                    src={"/images/sidebar/leftBanner.png"}
                    alt={"leftBanner"}
                    width={500}
                    height={500}
                    className="my-2 object-cover"
                    priority={true}
                />
            </div>
        </div>
    );
}

export default Sidebar;