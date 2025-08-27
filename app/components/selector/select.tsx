'use client';
import { useState, useRef, useEffect } from "react";

interface Option {
    value: string;
    label: string;
}

interface CustomSelectProps {
    options: Option[];
    defaultValue?: string;
    onChange?: (value: string) => void;
}

export default function CustomSelect({ options, defaultValue, onChange }: CustomSelectProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [selected, setSelected] = useState(defaultValue || options[0].value);

    const dropdownRef = useRef<HTMLDivElement>(null);

    // Cerrar dropdown si se hace clic fuera
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleSelect = (value: string) => {
        setSelected(value);
        setIsOpen(false);
        if (onChange) onChange(value);
    };

    return (
        <div className="relative lg:w-64 w-60" ref={dropdownRef}>
            {/* Botón principal */}
            <div
                className="border border-zinc-300 px-4 py-2  cursor-pointer flex justify-between items-center"
                onClick={() => setIsOpen(!isOpen)}
            >
                <span>{options.find(o => o.value === selected)?.label}</span>
                <span className="ml-2">
                    <i className="bi bi-chevron-down"></i>
                </span>
            </div>

            {/* Dropdown */}
            {isOpen && (
                <ul className="absolute z-10 w-full mt-1 bg-white border border-zinc-300 shadow-lg max-h-60 overflow-auto">
                    {options.map(opt => (
                        <li
                            key={opt.value}
                            className={`px-4 py-2 cursor-pointer hover:bg-black hover:text-white ${selected === opt.value ? "text-zinc-900" : "text-zinc-500"
                                }`}
                            onClick={() => handleSelect(opt.value)}
                        >
                            {opt.label}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
