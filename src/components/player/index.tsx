import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'
import { usePlayer } from '../../contexts/playerContext'
import styles from './styles.module.scss'
import Slider from 'rc-slider'
import 'rc-slider/assets/index.css'
import DurationToTime from '../../utils/duration_to_time'

export default function Player() {

    const [progress, setProgress] = useState(0)

    const { episodeList, currentEpisodeIndex,
        isPlaying, togglePlay, setPlayingState, playNext,
        playPrevious, hasNext, hasPrevious, isLooping,
        toggleLoop, isShuffling, toggleShuffle,
        clearPlayerState } = usePlayer()

    const episode = episodeList[currentEpisodeIndex]

    const audioRef = useRef<HTMLAudioElement>(null)

    const setupProgressListener = () => {
        audioRef.current.currentTime = 0
        audioRef.current.addEventListener('timeupdate', () => {
            setProgress(Math.floor(audioRef.current.currentTime))
        })
    }

    const handleSeek = (amount: number) => {
        audioRef.current.currentTime = amount
        setProgress(amount)
    }

    const handleEnded = () => {
        if(hasNext) {
            playNext()
        } else {
            clearPlayerState()
        }
    }

    useEffect(() => {

        if(!audioRef.current) {
            return
        }

        if(isPlaying) {
            audioRef.current.play()
            return
        }

        audioRef.current.pause()

    }, [isPlaying])

    return (
        <div className={styles.playerContainer}>
            <header>
                <img src="/playing.svg" alt="Tocando agora"/>
                <strong>Tocando agora </strong>
            </header>

            {episode ? (
                <div className={styles.currentEpisode}>
                    <Image width={592} height={592} src={episode.thumbnail} objectFit="cover" />
                    <strong>{episode.title}</strong>
                    <span>{episode.members}</span>
                </div>
            ) : (
                <div className={styles.emptyPlayer}>
                    <strong>Selecione um podcast para ouvir</strong>
                </div>
            )}

            <footer className={!episode ? styles.empty : ""}>
                <div className={styles.progress}>
                    <span>{DurationToTime(progress)}</span>

                    <div className={styles.slider}>
                        {episode ? (
                            <Slider
                            max={episode.duration}
                            value={progress}
                            onChange={handleSeek}
                            trackStyle={{
                                backgroundColor: '#04b361'
                            }}
                            railStyle={{
                                backgroundColor: '#9f75ff'
                            }}
                            handleStyle={{
                                borderColor: '#04b361',
                                borderWidth: 4
                            }} />
                        ): (
                            <div className={styles.emptySlider} />
                        )}
                    </div>

                    <span>{DurationToTime(episode?.duration ?? 0)}</span>
                </div>

                {episode && (
                    <audio
                        onEnded={handleEnded}
                        ref={audioRef} src={episode.url} autoPlay
                        onPlay={() => setPlayingState(true)} loop={isLooping}
                        onPause={() => setPlayingState(false)} onLoadedMetadata={setupProgressListener}></audio>
                )}

                <div className={styles.buttons}>
                    <button type="button" disabled={!episode || episodeList.length == 1}
                        onClick={toggleShuffle}
                        className={isShuffling ? styles.isActive : ''}>
                        <img src="/shuffle.svg" alt="Embaralhar"/>
                    </button>
                    <button type="button" disabled={!episode || !hasPrevious} onClick={playPrevious}>
                        <img src="/play-previous.svg" alt="Tocar Anterior"/>
                    </button>
                    <button type="button" className={styles.playButton} onClick={togglePlay} disabled={!episode}>
                        {isPlaying ? (
                            <img src="/pause.svg" alt="Tocar"/>
                        ): (
                            <img src="/play.svg" alt="Tocar"/>
                        )}
                    </button>
                    <button type="button" disabled={!episode || !hasNext} onClick={playNext}>
                        <img src="/play-next.svg" alt="Tocar próxima"/>
                    </button>
                    <button type="button" disabled={!episode} onClick={toggleLoop}
                        className={isLooping ? styles.isActive : ''}>
                        <img src="/repeat.svg" alt="Repetir"/>
                    </button>
                </div>
            </footer>
        </div>
    )
}