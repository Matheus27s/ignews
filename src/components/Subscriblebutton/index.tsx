import styles from './styles.module.scss';

interface SubscribleButtonProps {
    priceId: string;
}

export function Subscriblebutton({ priceId }: SubscribleButtonProps) {

    return  (
        <button 
            type="button"
            className={styles.subscribeButton}
        >
           Subscribe now
        </button>
    );
}