import { useState, useEffect,} from "react";
import { X } from "lucide-react";
import Image from "next/image";

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

interface ModalDetailProducts {
    producto: Productos;
    onClose: () => void;
}

export const ModalDetailProduct = ({ producto, onClose }: ModalDetailProducts) => {
    const [fotos, setFotos] = useState<string[]>([]);
    const [picture, setPicture] = useState<{ nombre: string, url: string } | null>(null)

    // Bloquear scroll al abrir modal
    useEffect(() => {
        document.body.style.overflow = "hidden";
        return () => {
            document.body.style.overflow = "auto";
        };
    }, []);


    useEffect(() => {
        if (!producto) return;

        if (producto.imagen) {
            setPicture({ nombre: producto.nombre, url: producto.imagen });
        }

        const fotosProductos = [producto.imagen, ...(producto.fotos || [])].filter(Boolean);;
        setFotos(fotosProductos);
    }, [producto]);


    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="relative bg-white p-6 rounded-lg 2xl:max-w-4xl xl:max-w-2xl max-w-lg w-full mx-4 lg:mx-0 shadow-lg">
                {/* Botón Cerrar */}
                <button
                    onClick={onClose}
                    className="absolute top-2 right-2 text-gray-500 bg-black text-white hover:opacity-30 text-xl font-bold"
                >
                    <X />
                </button>

                {/* Contenido del Modal */}
                <div className="m-2">
                    {picture?.url && (
                        <div>
                            <div className="grid grid-cols-2 gap-8">
                                <div className="">
                                    <div className="px-6 border py-12 border-zinc-300 ">
                                        <Image
                                            src={picture?.url || ""}
                                            alt={picture?.nombre || ""}
                                            width={500}
                                            height={500}
                                            className="object-cover "
                                            priority={true}
                                        />
                                    </div>
                                    <div className="grid grid-cols-4 gap-4 pt-4">
                                        {fotos.map((foto, index) => (
                                            <div key={index} className="border-slate-300 border cursor-pointer" onClick={() => setPicture({nombre: picture.nombre, url: foto})}>
                                                <Image
                                                    src={foto}
                                                    alt={foto}
                                                    width={150}
                                                    height={150}
                                                    className="object-cover py-2"
                                                    priority={true}
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="">
                                    <h3 className="text-2xl font-medium mb-3">{producto.nombre}</h3>
                                    <h3 className="text-3xl font-bold">S/ {producto.precio}</h3>
                                    <h4 className="text-zinc-600 ">Impuestos excluidos</h4>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>

    );
}