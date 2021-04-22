import Header from '../components/header'
import Player from '../components/player'
import { PlayerProvider } from '../contexts/playerContext'
import styles from '../styles/app.module.scss'
import '../styles/global.scss'

function MyApp({ Component, pageProps }) {
  return (
    <div className={styles.wrapper}>
      <PlayerProvider>
        <main>
          <Header />
          <Component {...pageProps} />
        </main>
        <Player />
      </PlayerProvider>
    </div>
  )
}

export default MyApp
