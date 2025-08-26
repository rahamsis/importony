'use client'

import { useState, useEffect } from "react";
import Image from "next/image";

const images = [
  "/images/banner/banner1.jpg",
  "/images/banner/banner2.jpg",
  "/images/banner/banner3.jpg",
];

function Banner() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  // Cambia imagen cada 8 segundos
  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 8000);
    return () => clearInterval(interval);
  }, [currentIndex]);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  const goToSlide = (index: any) => {
    setCurrentIndex(index);
  };

  return (
    <div className="relative w-full h-[200px] lg:h-full overflow-hidden lg:pt-6" onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}>
      {/* Contenedor de las imágenes */}
      <div
        className="flex transition-transform duration-700 ease-in-out "
        style={{ transform: `translateX(-${currentIndex * 100.1}%)` }}
      >
        {images.map((src, index) => (
          <div key={index} className="w-full flex-shrink-0 relative lg:h-[500px] h-[200px]">
            <Image
              src={src}
              alt={`Banner ${index + 1}`}
              fill
              className="w-full lg:h-[500px] h-[200px]"
              priority={index === 0}
            />
          </div>
        ))}
      </div>

      {/* Botones izquierda/derecha visibles solo en escritorio */}
      {isHovered && (
        <>
          <button
            onClick={prevSlide}
            className="hidden lg:flex absolute left-4 top-1/2 -translate-y-1/2 bg-opacity-50 text-3xl text-slate-300 p-2 hover:text-slate-800 transition"
          >
            &#10094;
          </button>
          <button
            onClick={nextSlide}
            className="hidden lg:flex absolute right-4 top-1/2 -translate-y-1/2 bg-opacity-50 text-3xl text-slate-300 p-2 hover:text-slate-800 transition"
          >
            &#10095;
          </button>
        </>
      )}

      {/* Círculos de navegación */}
      <div className="absolute lg:bottom-6 bottom-3 left-0 right-0 flex justify-center gap-3">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`lg:w-5 w-3 lg:h-5 h-3 rounded-full border-2 border-slate-800 ${currentIndex === index ? "bg-white" : "bg-gray"
              }`}
          ></button>
        ))}
      </div>
    </div>
  );
}

function PostBanner() {
  return (
    <div className="relative w-full lg:pt-6 pt-4">
      <div className="grid lg:grid-cols-2 grid-cols-1 gap-4">
        <div>
          <Image
            src={"/images/postBanner/postBanner1.jpg"}
            alt={`Post Banner 1`}
            width={600}
            height={400}
            priority={true}
          />
        </div>
        <div>
          <Image
            src={"/images/postBanner/postBanner2.jpg"}
            alt={`Post Banner 1`}
            width={600}
            height={400}
            priority={true}
          />
        </div>
      </div>
    </div>
  );
}

const productos = [
  "/images/productos/GarfiosRecta/BORDADORA/BORDADO2.jpg",
  "/images/productos/GarfiosRecta/OJALADORA/OJALADORA1.jpg",
  "/images/productos/GarfiosRecta/OJALADORATAZADORADA/OJALADORAB.jpg",
  "/images/productos/GarfiosRecta/PLANA1152/PLANA1.jpg",
  "/images/productos/GarfiosRecta/RECTAELECTRONICA/RECTAELECTRONICAH.jpg",
  "/images/productos/GarfiosRecta/RECTALIVIANA/rectaliviana.jpg",
  "/images/productos/GarfiosRecta/RECTALIVIANAHIROSE/rectah.jpg",
  "/images/productos/Accesorios/IMAGEN1.2.jpg",
];

function Products() {
  return (
    <div className="relative w-full lg:pt-12 pt-9">
      <div className="justify-center text-center mb-6">
        <button className="bg-buttonGray text-primary font-semibold py-2 px-4 lg:mb-4 mb-2 w-full lg:w-auto">
          PRODUCTOS DESTACADOS
        </button>
        <button className="bg-buttonGray text-primary font-semibold py-2 px-4 lg:mb-4 mb-2 lg:ml-4 w-full lg:w-auto">
          PRODUCTOS NUEVOS
        </button>
        <button className="bg-buttonGray text-primary font-semibold py-2 px-4 lg:mb-4 mb-2 lg:ml-4 w-full lg:w-auto">
          MAS VENDIDOS
        </button>
      </div>

      <div className="grid lg:grid-cols-4 grid-cols-2 gap-4">
        {productos.map((product, index) => (
          <div key={index} className="group relative overflow-hidden">
            <div className="border-slate-300 border">
              <Image
                src={product}
                alt={product}
                width={300}
                height={300}
                className="my-6"
                priority={true}
              />
            </div>
            {/* Contenedor del texto y botón */}
            <div className="text-center relative items-center justify-center mx-auto mt-2 w-full">
              <h3 className="text-base text-gray mb-2 w-full">Producto</h3>

              {/* Precio: desaparece con hover */}
              <h3 className="text-lg font-semibold  transition-opacity duration-300 group-hover:opacity-0 ">
                S/ 0.00
              </h3>

              {/* Botón: aparece desde abajo */}
              <button
                className="bg-black text-white lg:text-base text-xs py-2 px-4 
                  group-hover:opacity-100 group-hover:translate-y-0 translate-y-12 transition-all duration-500">
                AÑADIR AL CARRO
              </button>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}

export default function Home() {
  return (
    <>
      <Banner />

      <PostBanner />

      <Products />
    </>
  )
}