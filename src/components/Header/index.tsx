import { SignInButton } from '../SignInbutton';

import styles from './styles.module.scss';
import { useRouter } from 'next/router';
import React from 'react';
import { ActiveLink } from '../ActiveLink';

export function Header() {
    return (
        <header className={styles.headerContainer}>
            <div className={styles.headerContent}>
                <img src="/images/logo.svg" alt="ig.news" />
                <nav>
                    <ActiveLink href="/" activeClassName={styles.active} >
                        <a>Home</a>
                    </ActiveLink>
                    <ActiveLink href="/posts" activeClassName={styles.active}>
                        <a>Posts</a>
                    </ActiveLink>
                </nav>
                <SignInButton />
             </div>
        </header>
    );
}