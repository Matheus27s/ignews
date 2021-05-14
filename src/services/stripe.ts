import Stripe from 'stripe';

export const stripe = new Stripe(
    process.env.STRIPE_API_KEY, //Chave
    {//Informações obrigatórias
        apiVersion: '2020-08-27',
        appInfo: {
            name: 'Ignews',//metadados
            version: '1.0.1' //version
        }
    }
);