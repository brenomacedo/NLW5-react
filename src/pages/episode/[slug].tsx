import { parseISO } from 'date-fns'
import { GetStaticPaths, GetStaticProps } from 'next'
import { format } from 'date-fns'
import ptBR from 'date-fns/locale/pt-BR'
import api from '../../services/api'
import DurationToTime from '../../utils/duration_to_time'
import styles from './episode.module.scss'
import Image from 'next/image'
import Link from 'next/link'
import { usePlayer } from '../../contexts/playerContext'
import Head from 'next/head'

interface RawFile {
    url: string
    type: string
    duration: number
}

interface RawEpisode {
    id: string
    title: string
    members: string
    published_at: string
    thumbnail: string
    description: string
    file: RawFile
}

interface Episode {
    id: string
    title: string
    members: string
    publishedAt: string
    thumbnail: string
    description: string
    durationAsString: string,
    duration: number
    url: string
}

interface EpisodeProps {
    episode: Episode
}

export default function Episode({ episode }: EpisodeProps) {

    const { play } = usePlayer()

    return (
        <div className={styles.episode}>

            <Head>
                <title>{episode.title} | Podcastr</title>
            </Head>

            <div className={styles.thumbnailContainer}>
                <Link href="/">
                    <button type="button">
                        <img src="/arrow-left.svg" alt="Voltar"/>
                    </button>
                </Link>
                
                <Image width={700} height={160} src={episode.thumbnail} objectFit="cover" />

                <button type="button" onClick={() => play(episode)}>
                    <img src="/play.svg" alt="Tocar episódio"/>
                </button>
            </div>

            <header>
                <h1>{episode.title}</h1>
                <span>{episode.members}</span>
                <span>{episode.publishedAt}</span>
                <span>{episode.durationAsString}</span>
            </header>

            <div className={styles.description} dangerouslySetInnerHTML={{
                __html: episode.description
            }} />
        </div>
    )
}

export const getStaticProps: GetStaticProps = async (ctx) => {

    const { data } = await api.get<RawEpisode>(`/episodes/${ctx.params.slug}`)

    const episode = {
        id: data.id,
        title: data.title,
        thumbnail: data.thumbnail,
        members: data.members,
        publishedAt: format(parseISO(data.published_at), 'd MMM yy', { locale: ptBR }),
        duration: Number(data.file.duration),
        description: data.description,
        url: data.file.url,
        durationAsString: DurationToTime(Number(data.file.duration))
    }

    return {
        props: {
            episode
        },
        revalidate: 60*60*24
    }
}

export const getStaticPaths: GetStaticPaths = async (ctx) => {

    const { data } = await api.get<RawEpisode[]>('/episodes', {
        params: {
          _limit: 2,
          _order: 'published_at',
          _sort: 'desc'
        }
    })

    const paths = data.map(episode => {
        return {
            params: {
                slug: episode.id
            }
        }
    })

    return {
        paths,
        fallback: 'blocking'
    }
}