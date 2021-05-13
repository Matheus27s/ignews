import { NextApiRequest, NextApiResponse } from "next";
import { Readable } from 'stream';
import Stripe from "stripe";
import { stripe } from "../../services/stripe";

//Converte Readable em um objeto.

async function butter(readable: Readable) {
    const chunks = []; //Pedaços da stream

    for await (const chunk of readable) {
        chunks.push(
            typeof chunk === "string" ? Buffer.from(chunk) : chunk
        );
    }

    return Buffer.concat(chunks);
}

//Por padrão o nex tem uma forma de entender a requisição(está vindo como um JSON). Então precisamos desabilitar o entendimento padrão do NEXT.
export const config = {
    api: {
        bodyParser: false,
    }
}

//Eventos relevantes
//Define quais eventos são importantes a serem ouvidos. Os outros não iremos levar em consideração.

//SET - Array que não repete itens.

const relevantEvents = new Set([
    "checkout.session.completed"
])

export default async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method === "POST") {

        //buf - requisição em sí
        const buf = await butter(req);

        //Código passado para a rota. Mesmo código quando rodamos o CLI do stripe. Ready! Your webhook signing secret is whsec_sVjtxZjLvBluKfWDwkalulrytnURCCqN
        //Vamos adicionar no .env.local
        const secret = req.headers['stripe-signature']

        //verificar e os valores batem.
        let event: Stripe.Event

        try {
            event = stripe.webhooks.constructEvent(buf, secret, process.env.STRIPE_WEBHOOK_SECRET);
        } catch(err) {
            return res.status(400).send('Webhook error: ' + err.message);
        }

        //Retornado o tipo do evento para decidir se é relevante ou não.
        const { type } = event;

        if (relevantEvents.has(type)) {
            console.log('Evento recebido', event);
        }


        res.json({ received: true })
    } else {
        res.setHeader('Allow', 'POST');
        res.status(405).end('method not allowed');
    }
}