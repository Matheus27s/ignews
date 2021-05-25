import { signin, useSession } from 'next-auth/client';
import { useRouter } from 'next/router';
import api from '../../services/api';
import { getStripeJs } from '../../services/stripe-js';
import styles from './styles.module.scss';

interface SubscribleButtonProps {
    priceId: string;
}

export function Subscriblebutton({ priceId }: SubscribleButtonProps) {

    const [ session ] = useSession();
    const router = useRouter();

    async function handleSubscrible() {
        if(!session) {
            signin('github');
            return;
        }

        if(session.activeSubscription) {
            router.push('/posts');
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