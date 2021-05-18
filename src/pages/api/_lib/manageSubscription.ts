import { fauna } from "../../../services/fauna";
import { query as q } from 'faunadb';
import { stripe } from "../../../services/stripe";

//Salvar as informações o banco de dados.
export async function saveSubscription(
    subscriptionId: string,
    customerId: string,
    createAction = false,
) {
    //buscar os dados do usuário na colletions 'users'.
    //Através da ref
    const userRef = await fauna.query(
        q.Select(
            "ref",
            q.Get(
                q.Match(
                    q.Index('user_by_stripe_customer_id'),
                    customerId
                )
            )
        )
    );

    //buscando todos os dados da subscription
    //retrieve - uma só
    const subscription = await stripe.subscriptions.retrieve(subscriptionId);

    //Salvando somente os dados importantes
    const subscriptionData = {
        id: subscription.id,
        userId: userRef,
        status: subscription.status,
        price_id: subscription.items.data[0].price.id
    }

    if (createAction) { //Posso criar uma subscription

        //Salvando esses dados no banco de dados
        await fauna.query(
            q.Create(
                q.Collection('subscriptions'),
                { data: subscriptionData }
            )
        )

    } else { //Vou atualizar
        await fauna.query(
            q.Replace(
                q.Select(
                    "ref",
                    q.Get(
                        q.Match(
                            q.Index('subscription_by_id'),
                            subscriptionId,
                        )
                    )
                ),
                { data: subscriptionData }
            )
        )
    }


}

//Métodos de atualização no fauna
//Replace - Substitue por completo.
//Update - atualizo 'alguns' campos daquele registro