import { getSession } from "next-auth/client";
import { NextApiRequest, NextApiResponse } from "next-auth/_next";
import { stripe } from "../../services/stripe";

export default async(req: NextApiRequest, res: NextApiResponse) => {
    //Verifica se o método da requisição é POST
    if(req.method === 'POST') {
        //Qual o usuário logado na aplicação.
        const session = await getSession({ req }); // Consegue pegar a sessão por conta do cookie dentro do 'req'

        const stripeCustomer = await stripe.customers.create({
            email: session.user.email,
        })

        //Criar uma sessão do stripe
        const stripeCheckoutSession = await stripe.checkout.sessions.create({
            customer: stripeCustomer.id, //Id do usuário no customer no stripe e nao no banco de dados.

            payment_method_types: ['card'],
            billing_address_collection: 'required',
            line_items: [
                { price: 'price_1IdkaMIymJDKGQ8sxlatu5Dv', quantity: 1 }
            ],
            mode: 'subscription',
            allow_promotion_codes: true,
            success_url: process.env.STRIPE_SUCCESS_URL,
            cancel_url: process.env.STRIPE_CANCEL_URL,
        });

        return res.status(200).json({ sessionId: stripeCheckoutSession.id })
    } else {
        res.setHeader('Allow', 'POST'); //Explico pro front end que o método que essa rota aceita é 'POST'
        res.status(405).end('method not allowed');
    }
}