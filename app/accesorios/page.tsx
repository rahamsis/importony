'use client';

/* eslint-disable */

import { useState, useEffect, } from "react";
import Sidebar from "../components/sidebar/sidebar";
import { getProductByCategory } from "@/app/utils/actions";
import Dropdown from "../components/dropDown/dropDown";
import Product from "../components/product/product"


function Banner() {
    return (
        <div className="relative w-full lg:h-full overflow-hidden pt-3 lg:pt-6">
            <div className="bg-buttonGray w-full text-center lg:py-16 py-8 text-zinc-800 text-2xl font-semibold">
                <h3>ACCESORIOS</h3>
            </div>
        </div>
    );
}

interface Productos {
    idProducto: number;
    categoria: string;
    subCategoria: string;
    marca: string;
    nombre: string;
    precio: number;
    color: string;
    decripcion: string;
    imagen: string;
    destacado: boolean;
    nuevo: boolean;
    masVendido: boolean;
    activo: boolean;
    fotos: string[];
}

function Content() {

    const [products, setProducts] = useState<Productos[]>([]);
    const [productsFiltered, setProductsFiltered] = useState<Productos[]>([]);
    const [selectedFilters, setSelectedFilters] = useState<Record<string, string[]>>({});

    const [filterVisible, setFilterVisible] = useState(false);

    // cargamos la data desde la base de datos
    useEffect(() => {
        async function fetchData() {
            try {
                const data = await getProductByCategory("ACCESORIOS");
                setProducts(data);
                setProductsFiltered(data);
            } catch (error) {
                console.error("Error obteniendo los productos por categoria:", error);
            }
        }
        fetchData();
    }, []);

    // Se llama cada vez que el Sidebar cambia filtros
    const handleFiltersChange = (filters: Record<string, string[]>) => {
        setSelectedFilters(filters);
    };

    // Filtrar productos según los filtros seleccionados
    useEffect(() => {
        if (!products.length) return;

        let result = [...products];
        Object.keys(selectedFilters).forEach(attr => {
            const selected = selectedFilters[attr];
            if (selected?.length > 0) {
                result = result.filter(p => selected.includes((p as any)[attr]));
            }
        });
        setProductsFiltered(result);
    }, [selectedFilters, products]);


    return (
        <div className="lg:flex w-full lg:pt-6 pt-4 gap-6">
            {/* Sidebar de Categorías */}
            <div className="lg:w-1/5 hidden lg:flex lg:relative">
                <Sidebar
                    products={products}
                    selectedFilters={selectedFilters}
                    onFiltersChange={handleFiltersChange}
                    filteredProducts={productsFiltered} />
            </div>


            <div className={`lg:w-4/5 flex flex-col ${filterVisible ? "hidden lg:flex" : "block"}`}>
                <Product products={products} filteredProducts={productsFiltered} setFilterVisible={setFilterVisible} />
            </div>

            {/* Menu de filtros solo para móbiles */}
            <div className={`w-full flex flex-col gap-4 ${filterVisible ? "block lg:hidden" : "hidden"}`}>
                <div className="w-full">
                    <Dropdown
                        isVisible={filterVisible}
                        products={products}
                        selectedFilters={selectedFilters}
                        onFiltersChange={handleFiltersChange}
                        filteredProducts={productsFiltered}
                        onClose={() => setFilterVisible(false)} />
                </div>
            </div>


        </div>
    );
}

export default function Accesorios() {
    return (
        <div className="mx-auto justify-between items-center xl:w-8/12 2xl:w-8/12 w-11/12 mb-8">

            <Banner />

            <Content />
        </div>
    );
}