import { GetServerSideProps } from "next";
import { getSession } from "next-auth/client";
import Head from "next/head";
import { RichText } from "prismic-dom";
import React from "react";
import { getPrismicClient } from "../../services/prismic";

import styles from './post.module.scss';

interface PostProps {
    slug: string;
    title: string;
    content: string;
    updatedAt: string;
}

export default function Post({ post }) {
    return (
        <>
            <Head>
                <title>{post.title} | Ignews</title>
            </Head>

            <main className={styles.container}
            >
                <article
                    className={styles.post}
                >
                    <h1>{post.title}</h1>
                    <time>{post.updatedAt}</time>
                    <main
                        className={styles.postContent}
                        dangerouslySetInnerHTML={{ __html: post.content }}
                    />
                </article>
            </main>
        </>
    );
}

export const getServerSideProps: GetServerSideProps = async ({ req, params }) => {
    const session = await getSession({ req }); //Busca através dos cooks

    //Qual post precisamos recuperar? Pode ser recuperado pelo método 'params' que vem na requisição;
    const { slug } = params;

    if(!session.activeSubscription) {
        return {
            redirect: {
                destination: '/',
                permanent: false,
            }
        }
    }

    const prismic = getPrismicClient(req);

    //Busco qualquer elemento pelo seu UID
    const response = await prismic.getByUID('publication', String(slug), {});

    //Formatação dos dados
    const post = {
        slug,
        title: RichText.asText(response.data.title),
        content: RichText.asHtml(response.data.content),
        updatedAt: new Date(response.last_publication_date).toLocaleDateString('pt-BR', { //Ultima data de atualização do post
            day: '2-digit',
            month: 'long',
            year: 'numeric'
        })
    }

    return {
        props: {
            post,
        }
    }

}