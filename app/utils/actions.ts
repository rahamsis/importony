'use server';

/* eslint-disable */

export async function getNewProduct() {
    try {
        const response = await fetch(`${process.env.APP_BACK_END}/backendApi/new-products`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'accept': '/'
            },
            next: { revalidate: 0 }
        });

        const data = await response.json();

        return data;
    } catch (error) {
        console.error('Error al obtener los nuevos productos:', error);
        throw new Error("Error al obtener los nuevos productos");
    }
}