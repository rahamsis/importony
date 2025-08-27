'use client'

import { useState, useEffect, useRef, useMemo } from "react";
import Image from "next/image";
import { getFeaturesProduct } from "./utils/actions";

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
        <div className="group relative overflow-hidden">
          <div>
            <Image
              src={"/images/postBanner/postBanner1.jpg"}
              alt={`Post Banner 1`}
              width={600}
              height={400}
              priority={true}
            />
            {/* Capa izquierda */}
            <div className="absolute top-0 left-0 group-hover:bg-white group-hover:opacity-5 h-full w-0 group-hover:w-1/2 transition-all duration-1000 ease-in-out" />

            {/* Capa derecha */}
            <div className="absolute top-0 right-0 group-hover:bg-white group-hover:opacity-5 h-full w-0 group-hover:w-1/2 transition-all duration-1000 ease-in-out" />
          </div>
        </div>

        <div className="group relative overflow-hidden">
          <div>
            <Image
              src={"/images/postBanner/postBanner2.jpg"}
              alt={`Post Banner 1`}
              width={600}
              height={400}
              priority={true}
            />
            {/* Capa izquierda */}
            <div className="absolute top-0 left-0 group-hover:bg-white group-hover:opacity-5 h-full w-0 group-hover:w-1/2 transition-all duration-1000 ease-in-out" />

            {/* Capa derecha */}
            <div className="absolute top-0 right-0 group-hover:bg-white group-hover:opacity-5 h-full w-0 group-hover:w-1/2 transition-all duration-1000 ease-in-out" />
          </div>
        </div>
      </div>
    </div>
  );
}

interface Productos {
  idProducto: string;
  categoria: string;
  marca: string;
  nombre: string;
  precio: number;
  decripcion: string;
  imagen: string;
  destacado: boolean;
  nuevo: boolean;
  masVendido: boolean;
  activo: boolean;
  fotos: string[];
}

function Products() {

  const [featuresProduct, setFeaturesProducts] = useState<Productos[]>([]);
  const [activeButton, setActiveButton] = useState<number>(1);
  const [feature, setFeature] = useState<number>(1); // 1: nuevos, 2: destacados, 3: mas vendidos

  // llenar los productos
  useEffect(() => {
    async function fetchData() {
      try {
        const data = await getFeaturesProduct(feature);
        setFeaturesProducts(data);
      } catch (error) {
        console.error("Error obteniendo los productos destacados o nuevos o más vendidos:", error);
      }
    }
    fetchData();
  }, [feature]);

  return (
    <div className="relative w-full lg:pt-12 pt-9">
      <div className="justify-center text-center mb-6">
        <button
          onClick={() => { setFeature(1); setActiveButton(1) }}
          className={`font-semibold py-2 px-4 lg:mb-4 mb-2 w-full lg:w-auto hover:bg-black hover:text-white 
          ${activeButton === 1 ? 'bg-black text-white' : 'bg-buttonGray text-primary'}`}>
          PRODUCTOS DESTACADOS
        </button>
        <button
          onClick={() => { setFeature(2); setActiveButton(2) }}
          className={`font-semibold py-2 px-4 lg:mb-4 mb-2 lg:ml-4 w-full lg:w-auto hover:bg-black hover:text-white
          ${activeButton === 2 ? 'bg-black text-white' : 'bg-buttonGray text-primary'}`}>
          PRODUCTOS NUEVOS
        </button>
        <button
          onClick={() => { setFeature(3); setActiveButton(3) }}
          className={`font-semibold py-2 px-4 lg:mb-4 mb-2 lg:ml-4 w-full lg:w-auto hover:bg-black hover:text-white
          ${activeButton === 3 ? 'bg-black text-white' : 'bg-buttonGray text-primary'}`}>
          MAS VENDIDOS
        </button>
      </div>

      <div className="grid lg:grid-cols-4 grid-cols-2 gap-4">
        {featuresProduct.map((product, index) => (
          <div key={index} className="group overflow-hidden">
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
                <Image
                  src={product.fotos[0]}
                  alt={product.nombre}
                  width={300}
                  height={300}
                  priority={true}
                  className="object-cover absolute top-0 left-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"

                />
              </div>
            </div>
            
            {/* Contenedor del texto y botón */}
            <div className="text-center relative items-center justify-center mx-auto mt-2 w-full">
              <h3 className="text-base text-gray mb-2 w-full">{product.nombre}</h3>

              {/* Precio: desaparece con hover */}
              <h3 className="text-lg font-semibold  transition-opacity duration-300 lg:group-hover:opacity-0 ">
                S/ {product.precio}
              </h3>

              {/* Botón: aparece desde abajo */}
              <button
                className="bg-black text-white lg:text-base text-xs py-2 px-4 
                  lg:group-hover:opacity-100 lg:group-hover:translate-y-0 translate-y-12 transition-all duration-500">
                AÑADIR AL CARRO
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="w-full flex justify-center mt-8">
        <div>
          <button className="bg-buttonGray text-primary font-semibold py-2 px-4 lg:mb-4 mb-2 w-full lg:w-auto">
            VER MÁS PRODUCTOS
          </button>
        </div>
      </div>
    </div>
  );
}

function Destacados() {
  return (
    <div className="relative w-full pt-12">
      <div className="grid lg:grid-cols-2 grid-cols-1 lg:gap-12 gap-4">
        <div className="overflow-hidden">
          <Image
            src={"/images/destacados/destacado1.png"}
            alt={`Destacado 1`}
            width={1000}
            height={1000}
            priority={true}
            className="transition-transform duration-1000 transform hover:scale-105"
          />
        </div>
        <div className="overflow-hidden">
          <Image
            src={"/images/destacados/destacado2.png"}
            alt={`Destacado 2`}
            width={1000}
            height={1000}
            priority={true}
            className="transition-transform duration-1000 transform hover:scale-105"
          />
        </div>
      </div>
    </div>
  );
}

const vendors = [
  {
    img: "/images/vendors/vendor1.jpg",
    texto: "Un buen producto a un mejor precio y lo mejor de todo que es de muy buena calidad, ofrecemos a nuestros clientes una gran variedad en repuestos y accesorios.",
    nombre: "Carme Llanos J.",
    cargo: "Gte. Gnral.",
  },
  {
    img: "/images/vendors/vendor2.jpg",
    texto: "Nuestro enfoque y prioridad son nuestros clientes y ellos tienen la razón, por ello tratamos de atenderlos con un trato agradable y satisfaciendo sus necesidades.",
    nombre: "Miguel Lazaro",
    cargo: "Ventas",
  },
  {
    img: "/images/vendors/vendor3.jpg",
    texto: "Cualquier producto sale directo de la fábrica a sus manos y en caso no sea lo que el cliente busca siempre se le da una alternativa optima, por que ellos tienen la razón!",
    nombre: "Rogger Vara E.",
    cargo: "Ventas",
  },
  {
    img: "/images/vendors/vendor4.jpg",
    texto: "Ofrecemos una cómoda atención al cliente, desde su llegada hasta su despacho",
    nombre: "David Hinostroza P.",
    cargo: "Ventas",
  },
];

const services = [
  {
    icon: <i className="bi bi-person-circle"></i>,
    title: "Buena Atención",
    description: "Ofrecemos una cómoda atención al cliente, hasta que compre lo deseado"
  },
  {
    icon: <i className="bi bi-coin"></i>,
    title: "Mejor Precio",
    description: "Los mejores precios del mercado, garantizado"
  },
  {
    icon: <i className="bi bi-award"></i>,
    title: "Excelente calidad",
    description: "Productos con garantía de calidad y durabilidad"
  }
]

function Servicios() {
  const [current, setCurrent] = useState(0);
  const [time, setTime] = useState(3000);

  // Cambiar automáticamente cada 10s
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % vendors.length);
    }, time);
    return () => clearInterval(interval);
  }, [current, time]);

  const goToVendor = (index: number) => {
    setCurrent(index);
    setTime(3000); // Reiniciar el temporizador a 10 segundos
  };

  return (
    <div className="relative w-full lg:pt-16 pt-12">
      <div className="grid lg:grid-cols-2 grid-cols-1 gap-4">
        <div className="">
          <div className="text-xl font-semibold lg:mb-16 mb-4 text-zinc-800">
            <h3>QUE DICEN NUESTROS TRABAJADORES</h3>
          </div>
          <div className="bg-buttonGray p-10 flex flex-col items-center gap-6">
            {/* Contenido del vendedor actual */}
            <div className="flex items-start gap-4 max-w-2xl py-10">
              {/* Imagen */}
              <div className="rounded-full overflow-hidden w-20 h-20 lg:w-28 lg:h-28 flex-shrink-0">
                <Image
                  src={vendors[current].img}
                  alt={vendors[current].nombre}
                  width={80}
                  height={80}
                  className="rounded-full object-cover lg:w-28 lg:h-28"
                />
              </div>

              {/* Texto y nombre */}
              <div className="text-left overflow-hidden lg:h-32">
                <p className="text-gray-800 text-sm mb-2 leading-relaxed text-gray">
                  {vendors[current].texto}
                </p>
                <h3 className="font-bold text-neutral-800">
                  {vendors[current].nombre}{" "}
                  <span className="font-normal text-gray">{vendors[current].cargo}</span>
                </h3>
              </div>
            </div>

            {/* Puntos para cambiar de vendedor */}
            <div className="flex justify-center gap-2 mt-2">
              {vendors.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToVendor(index)}
                  className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${index === current ? "bg-black" : "bg-neutral-400"
                    }`}
                ></button>
              ))}
            </div>
          </div>
        </div>
        <div className="">
          <div className="text-xl font-semibold lg:mb-16 mb-4">
            <h3>MENU DE SERVICIOS</h3>
          </div>
          <div>
            <div className="flex flex-col grid-cols-1">
              {services.map((service, index) => (
                <div key={index} className="px-6 py-4 flex lg:flex-row flex-col items-center text-center gap-4">
                  <div className="text-4xl text-zinc-300 border border-slate-300 p-4 hover:text-white hover:bg-black transition">
                    {service.icon}
                  </div>
                  <div className="lg:text-left text-center text-zinc-800">
                    <h3 className="font-semibold text-lg">
                      {service.title}
                    </h3>
                    <p className="text-gray">
                      {service.description}
                    </p>
                  </div>

                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const marcas = [
  "/images/marcas/brother.png",
  "/images/marcas/durkop.png",
  "/images/marcas/hirose.png",
  "/images/marcas/juki.png",
  "/images/marcas/kansai.png",
  "/images/marcas/kingtex.png",
  "/images/marcas/Koban.png",
  "/images/marcas/merrow.png",
  "/images/marcas/paff.png",
  "/images/marcas/pegasus.png",
  "/images/marcas/reece.png",
  "/images/marcas/rimoldi.png",
  "/images/marcas/singer.png",
  "/images/marcas/siruba.png",
  "/images/marcas/union.png",
  "/images/marcas/yamato.png",
];

function Marcas() {
  const [current, setCurrent] = useState(0);
  const [visible, setVisible] = useState(2); // 2 en móvil, 6 en desktop
  const [isHovered, setIsHovered] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Detectar tamaño de pantalla para 2 / 6 visibles
  useEffect(() => {
    const check = () => setVisible(window.innerWidth >= 1024 ? 6 : 2);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  // Avance automático cada 5s
  useEffect(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      next();
    }, 5000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [current, visible]);

  const stepPercent = useMemo(() => 100 / visible, [visible]);
  const total = marcas.length;

  const next = () => {
    setCurrent((i) => (i + 1) % (total - visible + 1));
  };
  const prev = () => {
    setCurrent((i) => (i - 1 + (total - visible + 1)) % (total - visible + 1));
  };

  // const goTo = (i: number) => setCurrent(i);

  // Para que cada item ocupe 1/visible del carril
  const itemStyle = { flex: `0 0 ${stepPercent}%` };
  // Trasladar carril: un paso = ancho de un item
  const trackStyle = {
    transform: `translateX(-${current * stepPercent}%)`,
  };

  return (
    <div className="relative w-full pt-12">
      <div
        className="relative w-full overflow-hidden group py-8"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Carril */}
        <div
          className="flex items-center transition-transform duration-700 ease-in-out"
          style={trackStyle}
        >
          {marcas.map((src, idx) => (
            <div key={idx} style={itemStyle} className="shrink-0">
              <div className="mx-auto flex h-20 w-full items-center justify-center">
                <Image
                  src={src}
                  alt={`Marca ${idx + 1}`}
                  width={140}
                  height={50}
                  className="object-contain transition duration-300 "
                  priority={idx < visible}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Flechas (solo desktop + en hover) */}
        {isHovered && (
          <>
            <button
              onClick={() => {
                prev();
              }}
              className="hidden lg:flex absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-black/50 text-white w-10 h-10 items-center justify-center hover:bg-black/70 transition"
              aria-label="Anterior"
            >
              ‹
            </button>
            <button
              onClick={() => {
                next();
              }}
              className="hidden lg:flex absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-black/50 text-white w-10 h-10 items-center justify-center hover:bg-black/70 transition"
              aria-label="Siguiente"
            >
              ›
            </button>
          </>
        )}

        {/* Puntos (opcional) */}
        {/* <div className="mt-4 flex justify-center gap-2">
        {marcas.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            className={`h-2 w-2 rounded-full transition ${
              i === current ? "bg-black" : "bg-slate-300"
            }`}
            aria-label={`Ir a marca ${i + 1}`}
          />
        ))}
      </div> */}
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <div className="mx-auto justify-between items-center xl:w-8/12 2xl:w-8/12 w-11/12">
      <Banner />

      <PostBanner />

      <Products />

      <Destacados />

      <Servicios />

      <Marcas />
    </div>
  )
}