import { signin, useSession } from 'next-auth/client';
import api from '../../services/api';
import { getStripeJs } from '../../services/stripe-js';
import styles from './styles.module.scss';

interface SubscribleButtonProps {
    priceId: string;
}

export function Subscriblebutton({ priceId }: SubscribleButtonProps) {

    const [ session ] = useSession();

    async function handleSubscrible() {
        if(!session) {
            signin('github');
            return;
        }

        try {
            const response = await api.post('/subscrible'); //O arquivo é a própria rota.

            const { sessionId } = response.data;

            const stripe = await getStripeJs();

            await stripe.redirectToCheckout({ sessionId });

        } catch(err) {
            alert(err.message);
        }
    }

    return  (
        <button 
            type="button"
            className={styles.subscribeButton}
            onClick={handleSubscrible}
        >
           Subscribe now
        </button>
    );
}