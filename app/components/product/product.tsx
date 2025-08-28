'use client';

import { useState, useEffect, } from "react";
import Image from "next/image";
import { LayoutList, LayoutGrid, ChevronLeft, ChevronRight } from "lucide-react";
import CustomSelect from "../selector/select";

import { ModalDetailProduct } from "../modal/detailProducts";

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

interface ProductProps {
    products: Productos[];
    filteredProducts: Productos[];

    setFilterVisible: (visible: boolean) => void;
}

const options = [
    { value: "default", label: "Predeterminado" },
    { value: "priceLowHigh", label: "Precio: bajo a alto" },
    { value: "priceHighLow", label: "Precio: alto a bajo" },
    { value: "nameAZ", label: "Nombre: A a Z" },
    { value: "nameZA", label: "Nombre: Z a A" },
];

const Product = ({
    products,
    filteredProducts,
    setFilterVisible
}: ProductProps) => {
    const [isMobile, setIsMobile] = useState(false);
    const [order, setOrder] = useState(1);
    const [productsFiltered, setProductsFiltered] = useState<Productos[]>([]);
    const [showDetailProduct, setShowDetailProduct] = useState<Productos | null>(null)

    const [currentPage, setCurrentPage] = useState(1);
    const productsPerPage = 12;

    // Calcular índices para mostrar solo los productos de la página actual
    const startIndex = (currentPage - 1) * productsPerPage;
    const endIndex = startIndex + productsPerPage;
    const currentProducts = productsFiltered.slice(startIndex, endIndex);

    // Calcular número total de páginas
    const totalPages = Math.ceil(productsFiltered.length / productsPerPage);

    // inicializamos el componente 
    useEffect(() => {
        setProductsFiltered(filteredProducts.length ? filteredProducts : products);
    }, [products, filteredProducts]);


    // Detectar tamaño de pantalla para 2 / 6 visibles
    useEffect(() => {
        const check = () => setIsMobile(window.innerWidth >= 1024 ? false : true);
        check();
        window.addEventListener("resize", check);
        return () => window.removeEventListener("resize", check);
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

    return (
        <>
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
                        <p>Hay {products.length} productos</p>
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
                {currentProducts.map((product) => (
                    <div key={product.idProducto} className={`group ${order === 2 && !isMobile && "lg:flex"} overflow-hidden`}>
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
                            <button
                                onClick={() => setShowDetailProduct(product)}
                                className={`bg-black text-white lg:text-base text-xs py-2 px-4 translate-y-12 
                                        ${order === 1 && !isMobile ? "group-hover:opacity-100 group-hover:translate-y-0  transition-all duration-500" : ""}`}>
                                VER DETALLE
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {currentProducts.length > 11 && (
                <div className="flex flex-row mt-6 justify-between">
                    <div className="text-zinc-600 flex lg:text-base text-xs items-center">
                        <span>Mostrando {productsFiltered.length === 0 ? 0 : startIndex + 1} - {Math.min(endIndex, productsFiltered.length)} de {products.length} producto(s)</span>
                    </div>

                    <div className="flex justify-center gap-1">
                        <button
                            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                            className={`p-1 border border-zinc-300 disabled:opacity-50 text-zinc-400 ${currentPage === 1 && "hidden"}`}
                        >
                            <ChevronLeft />
                        </button>

                        {Array.from({ length: totalPages }, (_, i) => (
                            <button
                                key={i}
                                onClick={() => setCurrentPage(i + 1)}
                                className={`px-3 py-1 border border-zinc-300 hover:bg-black hover:text-white font-semibold ${currentPage === i + 1 ? "bg-black text-white border border-black" : "text-zinc-400"}`}
                            >
                                {i + 1}
                            </button>
                        ))}

                        <button
                            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                            className={`p-1 border border-zinc-300 disabled:opacity-50 hover:bg-black hover:text-white text-zinc-400 ${currentPage === totalPages && "hidden"}`}
                        >
                            <ChevronRight />
                        </button>
                    </div>
                </div>
            )}




            {/* Modal de detalle del producto */}
            {showDetailProduct && (
                <ModalDetailProduct producto={showDetailProduct} onClose={() => setShowDetailProduct(null)} />
            )}
        </>
    );
}

export default Product;