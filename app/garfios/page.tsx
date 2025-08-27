'use client';

import { useState, useEffect, useRef, useMemo, use } from "react";
import Image from "next/image";
import CustomSelect from "../components/selector/select";
import Sidebar from "../components/sidebar/sidebar";
import { getProductByCategory } from "@/app/utils/actions";
import Dropdown from "../components/dropDown/dropDown";
import { LayoutList, LayoutGrid } from "lucide-react";

function Banner() {
    return (
        <div className="relative w-full lg:h-full overflow-hidden pt-3 lg:pt-6">
            <div className="bg-buttonGray w-full text-center lg:py-16 py-8 text-zinc-800 text-2xl font-semibold">
                <h3>GARFIOS</h3>
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

const options = [
    { value: "default", label: "Predeterminado" },
    { value: "priceLowHigh", label: "Precio: bajo a alto" },
    { value: "priceHighLow", label: "Precio: alto a bajo" },
    { value: "nameAZ", label: "Nombre: A a Z" },
    { value: "nameZA", label: "Nombre: Z a A" },
];

function Content() {
    const [isMobile, setIsMobile] = useState(false);

    const [products, setProducts] = useState<Productos[]>([]);
    const [productsFiltered, setProductsFiltered] = useState<Productos[]>([]);
    const [selectedFilters, setSelectedFilters] = useState<Record<string, string[]>>({});

    const [order, setOrder] = useState(1);
    const [filterVisible, setFilterVisible] = useState(false);

    // Detectar tamaño de pantalla para 2 / 6 visibles
    useEffect(() => {
        const check = () => setIsMobile(window.innerWidth >= 1024 ? false : true);
        check();
        window.addEventListener("resize", check);
        return () => window.removeEventListener("resize", check);
    }, []);

    // cargamos la data desde la base de datos
    useEffect(() => {
        async function fetchData() {
            try {
                const data = await getProductByCategory("GARFIOS");
                setProducts(data);
                setProductsFiltered(data);
            } catch (error) {
                console.error("Error obteniendo los productos por categoria:", error);
            }
        }
        fetchData();
    }, []);

    // Ordena los productos según el orden seleccionado
    const handleSelectChange = (value: string) => {
        const productosOrdenados = [...products]; // clonamos el array para no mutar el original

        switch (value) {
            case "priceLowHigh":
                productosOrdenados.sort((a, b) => a.precio - b.precio);
                break;
            case "priceHighLow":
                productosOrdenados.sort((a, b) => b.precio - a.precio);
                break;
            case "nameAZ":
                productosOrdenados.sort((a, b) => a.nombre.localeCompare(b.nombre));
                break;
            case "nameZA":
                productosOrdenados.sort((a, b) => b.nombre.localeCompare(a.nombre));
                break;
            case "default":
            default:
                productosOrdenados.sort((a, b) => a.idProducto - b.idProducto);
                break;
        }

        setProductsFiltered(productosOrdenados);
    };

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


            <div className={`lg:w-4/5 flex flex-wrap ${filterVisible ? "hidden lg:flex" : "block"}`}>
                {/* Menú para ordenar los productos*/}
                <div className="flex justify-between w-full mb-6">
                    <div className="hidden lg:flex gap-4 items-center">
                        <div className={`text-xl cursor-pointer hover:text-black ${order === 1 ? "text-black" : "text-zinc-300"}`} onClick={() => setOrder(1)}>
                            <LayoutGrid />
                        </div>

                        <div className={`text-xl cursor-pointer hover:text-black ${order === 2 ? "text-black" : "text-zinc-300"}`} onClick={() => setOrder(2)}>
                            <LayoutList className="" />
                        </div>

                        <div className="font-normal">
                            <p>Hay {productsFiltered.length} productos</p>
                        </div>
                    </div>

                    <div className="flex flex-col">
                        <div className="hidden lg:flex">
                            <p>Ordenar por:</p>
                        </div>
                        <div className="">
                            <CustomSelect options={options} defaultValue="default" onChange={handleSelectChange} />
                        </div>
                    </div>
                    <div className="lg:hidden">
                        <button className="py-2 px-3 bg-buttonGray" onClick={() => setFilterVisible(true)}>
                            FILTRAR
                        </button>
                    </div>
                </div>

                {/* Productos */}
                <div className={`grid gap-4 ${order === 2 && !isMobile ? "grid-cols-1" : "lg:grid-cols-3 grid-cols-2 "}`}>
                    {productsFiltered.map((product, index) => (
                        <div key={index} className={`group ${order === 2 && !isMobile && "lg:flex"} overflow-hidden`}>
                            <div className="border-slate-300 border">
                                <div className="relative">
                                    <Image
                                        src={product.imagen}
                                        alt={product.nombre}
                                        width={300}
                                        height={300}
                                        className="my-6 object-cover"
                                        priority={true}
                                    />
                                    {product.fotos?.[0] && (
                                        <Image
                                            src={product.fotos[0]}
                                            alt={product.nombre}
                                            width={300}
                                            height={300}
                                            priority={true}
                                            className="object-cover absolute top-0 left-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"

                                        />
                                    )}
                                </div>
                            </div>
                            <div className="text-center relative items-center justify-center mx-auto mt-2 w-full">
                                <h3 className="text-base text-gray mb-2 w-full">{product.nombre}</h3>

                                {/* Precio: desaparece con hover */}
                                <h3 className={`text-lg font-semibold ${order === 1 && !isMobile ? "transition-opacity duration-300 group-hover:opacity-0" : ""}`}>
                                    S/ {product.precio}
                                </h3>

                                {/* Botón: aparece desde abajo */}
                                <button className={`bg-black text-white lg:text-base text-xs py-2 px-4 translate-y-12 
                                        ${order === 1 && !isMobile ? "group-hover:opacity-100 group-hover:translate-y-0  transition-all duration-500" : ""}`}>
                                    VER DETALLE
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
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

export default function Garfios() {
    return (
        <div className="mx-auto justify-between items-center xl:w-8/12 2xl:w-8/12 w-11/12">
            <Banner />

            <Content />
        </div>
    );
}