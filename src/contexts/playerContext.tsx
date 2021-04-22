import { createContext, FC, useState } from 'react'

interface Episode {
    title: string
    members: string
    thumbnail: string
    duration: number
    url: string
}

interface PlayerContextData {
    episodeList: Episode[]
    currentEpisodeIndex: number
    play: (episode: Episode) => void
    isPlaying: boolean
    togglePlay: () => void
    setPlayingState: (isPlaying: boolean) => void
}

const PlayerContext = createContext<PlayerContextData>({} as PlayerContextData)

const PlayerProvider: FC = ({children}) => {

    const [episodeList, setEpisodeList] = useState([])
    const [currentEpisodeIndex, setCurrentEpisodeIndex] = useState(0)
    const [isPlaying, setIsPlaying] = useState(false)

    const play = (episode: Episode) => {
        setEpisodeList([episode])
        setCurrentEpisodeIndex(0)
        setIsPlaying(true)
    }

    const togglePlay = () => {
        setIsPlaying(!isPlaying)
    }

    const setPlayingState = (state: boolean) => {
        setIsPlaying(state)
    }

    return (
        <PlayerContext.Provider value={{
            episodeList,
            currentEpisodeIndex,
            play,
            isPlaying,
            togglePlay,
            setPlayingState
        }}>
            {children}
        </PlayerContext.Provider>
    )
}

export { PlayerProvider }
export default PlayerContext