import { GetStaticProps } from 'next'
import api from '../services/api'
import { format, parseISO } from 'date-fns'
import ptBR from 'date-fns/locale/pt-BR'
import DurationToTime from '../utils/duration_to_time'
import styles from '../styles/home.module.scss'
import Image from 'next/image'
import Link from 'next/link'
import { usePlayer } from '../contexts/playerContext'
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

interface HomeProps {
  latestEpisodes: Episode[]
  allEpisodes: Episode[]
}

export default function Home({ latestEpisodes, allEpisodes }: HomeProps) {

  const { playList } = usePlayer()

  const episodeList = [...latestEpisodes, ...allEpisodes]

  return (
    <div className={styles.homePage}>

      <Head>
        <title>Home Podcastr</title>
      </Head>

      <section className={styles.latestEpisodes}>
        <h2>Últimos lançamentos</h2>
        <ul>
          {latestEpisodes.map((episode, index) => {
            return (
              <li key={episode.id}>
                <Image
                  className={styles.teste}
                  width={192}
                  height={192}
                  src={episode.thumbnail}
                  alt={episode.title}
                  objectFit="cover"
                />

                <div className={styles.episodeDetails}>
                    <Link  href={`/episode/${episode.id}`}>
                      <a>{episode.title}</a>
                    </Link>
                  <p>{episode.members}</p>
                  <span>
                    {episode.publishedAt}
                  </span>
                  <span>
                    {episode.durationAsString}
                  </span>
                </div>

                <button type="button" onClick={() => playList(episodeList, index)}>
                  <img src="/play-green.svg" alt="Tocar episódio"/>
                </button>
              </li>
            )
          })}
        </ul>
      </section>

      <section className={styles.allEpisodes}>
        <h2>Todos os episódios</h2>

        <table cellSpacing={0}>
          <thead>
            <tr>
              <th></th>
              <th>Podcast</th>
              <th>Integrantes</th>
              <th>Data</th>
              <th>Duração</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {allEpisodes.map((episode, index) => {
              return (
                <tr key={episode.id}>
                  <td style={{ width: 72 }}>
                    <Image src={episode.thumbnail} width={120} height={120}
                      objectFit="cover" alt={episode.title} />
                  </td>

                  <td>
                    <Link  href={`/episode/${episode.id}`}>
                      <a>{episode.title}</a>
                    </Link>
                  </td>
                  <td>{episode.members}</td>
                  <td style={{
                    width: 100
                  }} >{episode.publishedAt}</td>
                  <td>{episode.durationAsString}</td>
                  <td>
                    <button type="button" onClick={() => playList(episodeList, index + latestEpisodes.length)}>
                      <img src="/play-green.svg" alt="Tocar episódio"/>
                    </button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </section>

    </div>
  )
}

export const getStaticProps: GetStaticProps = async () => {

  const { data } = await api.get<RawEpisode[]>('/episodes', {
    params: {
      _limit: 12,
      _order: 'published_at',
      _sort: 'desc'
    }
  })

  const episodes = data.map(episode => {
    return {
      id: episode.id,
      title: episode.title,
      thumbnail: episode.thumbnail,
      members: episode.members,
      publishedAt: format(parseISO(episode.published_at), 'd MMM yy', { locale: ptBR }),
      duration: Number(episode.file.duration),
      description: episode.description,
      url: episode.file.url,
      durationAsString: DurationToTime(Number(episode.file.duration))
    }
  })

  const latestEpisodes = episodes.slice(0, 2)
  const allEpisodes = episodes.slice(2, episodes.length)

  return {
    props: {
      latestEpisodes,
      allEpisodes
    },
    revalidate: 60*60*8
  }

}