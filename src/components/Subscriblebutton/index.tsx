import { signin, useSession } from 'next-auth/client';
import styles from './styles.module.scss';

interface SubscribleButtonProps {
    priceId: string;
}

export function Subscriblebutton({ priceId }: SubscribleButtonProps) {

    const [ session ] = useSession();

    function handleSubscrible() {
        if(!session) {
            signin('github');
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