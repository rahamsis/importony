"use client";

/* eslint-disable */

import { useEffect, useRef, useState } from "react";
import * as pdfjsLib from "pdfjs-dist";

// Configurar el worker manualmente
pdfjsLib.GlobalWorkerOptions.workerSrc = "/pdfjs/pdf.worker.min.js";

interface PdfCardProps {
    url: string;
    name: string;
}

export default function PdfCard({ url, name }: PdfCardProps) {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const renderTaskRef = useRef<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let isMounted = true; // Para evitar actualizaciones si el componente se desmonta

        const loadPdf = async () => {
            try {
                const pdf = await pdfjsLib.getDocument(url).promise;

                if (!isMounted || pdf.numPages === 0) return;

                const page = await pdf.getPage(1);

                const canvas = canvasRef.current;
                if (!canvas) {
                    return;
                }

                const context = canvas.getContext("2d");
                if (!context) {
                    return;
                }

                const viewport = page.getViewport({ scale: 1.5 });
                canvas.height = viewport.height;
                canvas.width = viewport.width;

                // Cancelar render previo si existe
                if (renderTaskRef.current) {
                    renderTaskRef.current.cancel();
                }

                // Renderizar la página en el canvas
                const renderTask = page.render({ canvasContext: context,canvas, viewport });
                renderTaskRef.current = renderTask;

                await renderTask.promise;
                if (isMounted) {
                    setLoading(false);
                }
            } catch (error: any) {
                if (error?.name === "RenderingCancelledException") {
                    console.warn("Render cancelado, no es un error crítico.");
                } else {
                    console.error("Error cargando PDF:", error);
                }
                if (isMounted) setLoading(false);
            }
        };

        loadPdf();

        // Limpiar en desmontaje
        return () => {
            isMounted = false;
            if (renderTaskRef.current) {
                renderTaskRef.current.cancel();
            }
        };
    }, [url]);

    return (
        <div className="w-64 border border-zinc-300 shadow-md p-2 flex flex-col items-center">
            <canvas
                ref={canvasRef}
                className="w-full h-full rounded-lg"
                style={{ display: loading ? "none" : "block" }}
            />
            {loading && <div className="h-40 flex items-center justify-center">Cargando...</div>}
            <p className="mt-2 text-center font-semibold">{name}</p>
            <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 px-4 py-1 bg-black text-white hover:opacity-50"
            >
                Ver PDF
            </a>
        </div>
    );
}
