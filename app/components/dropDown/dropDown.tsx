/* eslint-disable */

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { ChevronUp, ChevronDown } from "lucide-react";

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

interface DropdownProps {
    isVisible: boolean;
    products: Productos[];
    filteredProducts: Productos[];
    selectedFilters: Record<string, string[]>;
    onFiltersChange: (filters: Record<string, string[]>) => void;
    onClose: () => void;
}

const Dropdown = ({ isVisible, products, filteredProducts, selectedFilters, onFiltersChange, onClose }: DropdownProps) => {
    const [attributeOpenGroups, setAttributeOpenGroups] = useState<Record<string, boolean>>({});
    const [specialProductsOpen, setSpecialProductsOpen] = useState<boolean>(false)
    const [leftBannerOpen, setLeftBannerOpen] = useState<boolean>(false)
    const dropdownRef = useRef<HTMLDivElement>(null);

    const hasActiveFilters = Object.values(selectedFilters).some(arr => arr.length > 0);
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
    }, [products, atributos]);

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
            if (!key || key === "null" || key === "") return acc;
            acc[key] = (acc[key] || 0) + 1;
            return acc;
        }, {});
        return Object.entries(counts)
            .map(([key, count]) => ({ value: key, count }))
            .sort((a, b) => a.value.localeCompare(b.value)); // Orden alfabético;;
    };

    //evalua cual dropdown tiene valores para inicializarlo abierto
    useEffect(() => {
        const openGroups: Record<string, boolean> = {};
        Object.keys(selectedFilters).forEach(attr => {
            if (selectedFilters[attr] && selectedFilters[attr].length > 0) {
                openGroups[attr] = true; // ✅ Usamos el objeto temporal
            }
        });

        if (isVisible) {
            setAttributeOpenGroups(prev => ({ ...prev, ...openGroups }));
        }

    }, [selectedFilters, isVisible]);

    // Cerrar dropdown si se hace click afuera
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setAttributeOpenGroups({});
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const toggleGroup = (attr: string) => {
        setAttributeOpenGroups((prev) => ({
            ...prev,
            [attr]: !prev[attr],
        }));
    };

    const clearFilters = () => {
        const initFilters = atributos.reduce((acc, attr) => {
            acc[attr] = [];
            return acc;
        }, {} as Record<string, string[]>);

        onFiltersChange(initFilters);
        setAttributeOpenGroups({});
    };

    const handleOk = () => {
        onFiltersChange(selectedFilters); // envia filtros al padre
        onClose();
    }

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
        <div className="relative lg:w-52 w-full min-h-screen" ref={dropdownRef}>
            <div className={`flex flex-row border-2 gap-4 justify-center border-zinc-300 text-center p-3 cursor-pointer`}>
                {hasActiveFilters &&
                    <div className="flex gap-1 bg-buttonGray py-2 px-5" onClick={() => clearFilters()}>
                        <span><i className="bi bi-x-lg"></i></span>
                        <span>LIMPIAR FILTROS</span>
                    </div>
                }
                <div className="flex gap-1 bg-buttonGray py-2 px-5" onClick={handleOk}>
                    <span><i className="bi bi-check2"></i>
                    </span><span>OK</span>
                </div>
            </div>

            {atributos.map(attr => {
                const options = getOptions(attr);

                if (options.length === 0) return null;

                return (
                    (getOptions(attr).length > 0) &&
                    <div key={attr} className="border-collapse border border-zinc-300">
                        <div className="flex justify-between items-center cursor-pointer" onClick={() => toggleGroup(attr)}>
                            <button className="w-full px-4 py-2 font-semibold bg-white text-left hover:border-gray-400 ">
                                {attr}
                            </button>
                            <div className="px-4">
                                {attributeOpenGroups[attr] ? <ChevronUp className="text-black" /> : <ChevronDown className="text-black" />}
                            </div>
                        </div>


                        <div className={`mt-1 px-4 bg-white overflow-hidden transition-max-height duration-700 ease-in-out ${attributeOpenGroups[attr] ? "max-h-60" : "max-h-0"
                            }`}>
                            {getOptions(attr).map(option => (
                                (option.value != "null" && option.value != null && option.value !== "") &&
                                <label key={option.value} className="flex items-center justify-between cursor-pointer border-t border-zinc-300 py-2">
                                    <div className="space-x-2 text-zinc-600">
                                        <input
                                            type="checkbox"
                                            className="accent-black"
                                            checked={selectedFilters[attr]?.includes(option.value) || false}
                                            onChange={() => handleFilterChange(attr, option.value)}

                                        />
                                        <span>{option.value}</span>
                                    </div>

                                    <div className="text-zinc-600">({option.count})</div>
                                </label>
                            ))}
                        </div>

                    </div>
                )
            })}

            <div className="border border-zinc-300 my-3">
                <div className="flex justify-between items-center cursor-pointer" onClick={() => setSpecialProductsOpen(!specialProductsOpen)}>
                    <button className="w-full px-4 py-2 font-semibold bg-white text-left hover:border-gray-400">
                        <h3 className="font-semibold capitalize">PRODUCTOS ESPECIALES</h3>
                    </button>
                    <div className="px-4 text-black text-xl">
                        {specialProductsOpen ? <ChevronUp className="text-black" /> : <ChevronDown className="text-black" />}
                    </div>
                </div>

                <div className={`px-4 overflow-hidden transition-max-height duration-700 ease-in-out ${specialProductsOpen ? "max-h-80" : "max-h-0"
                    }`}>
                    <div className={`grid grid-cols-1 gap-4 my-3`}>
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
                                    <h3 className="text-base text-gray mb-2 w-full">{prod.nombre}</h3>

                                    <h3 className={`text-lg font-semibold`}>
                                        S/ {prod.precio}
                                    </h3>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="border border-zinc-300 my-3">
                <div className="flex justify-between items-center cursor-pointer" onClick={() => setLeftBannerOpen(!leftBannerOpen)}>
                    <button className="w-full px-4 py-2 font-semibold bg-white text-left hover:border-gray-400">
                        <h3 className="font-semibold capitalize">BANNER IZQUIERDO</h3>
                    </button>
                    <div className="px-4 text-black text-xl">
                        {leftBannerOpen ? <ChevronUp className="text-black" /> : <ChevronDown className="text-black" />}
                    </div>
                </div>

                <div className={`px-4 overflow-hidden duration-700 ease-in-out ${leftBannerOpen ? "max-h-[500px]" : "max-h-0"
                    }`}>
                    <div className={`grid grid-cols-1 gap-4 my-3`}>
                        <div className="flex gap-4 justify-center">
                            <div className="hidden lg:block">
                                <Image
                                    src={"/images/sidebar/leftBanner.png"}
                                    alt={"leftBanner"}
                                    width={150}
                                    height={150}
                                    className="my-2 object-cover"
                                    priority={true}
                                />
                            </div>
                            <div className="lg:hidden block">
                                <Image
                                    src={"/images/sidebar/leftBanner.png"}
                                    alt={"leftBanner"}
                                    width={250}
                                    height={150}
                                    className="my-2 object-cover"
                                    priority={true}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dropdown;
