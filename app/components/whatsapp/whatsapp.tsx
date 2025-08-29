'use client'

import { useState } from "react";
import styles from './WhatsappButton.module.css';

// var message = "Hola%2c%20estoy%20interesado%20en%20los%20productos%20que%20vende%2e"
const numero = "51955171495"
const url = "https://api.whatsapp.com/send?phone=" + numero + "&text="


export default function Whatsapp() {

    // Estado local para almacenar el valor del input
    const [valorInput, setValorInput] = useState('');

    const toggleChating = () => {
        window.open(url + valorInput, '_blank');
        setValorInput("")
    };

    return (
        <>
            <div>
                <a className={styles.btn} onClick={toggleChating}>
                    <i className="bi bi-whatsapp"></i>
                </a>
            </div>
        </>
    )
}