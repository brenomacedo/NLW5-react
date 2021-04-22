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
}

const PlayerContext = createContext<PlayerContextData>({} as PlayerContextData)

const PlayerProvider: FC = ({children}) => {

    const [episodeList, setEpisodeList] = useState([])
    const [currentEpisodeIndex, setCurrentEpisodeIndex] = useState(0)

    const play = (episode: Episode) => {
        setEpisodeList([episode])
        setCurrentEpisodeIndex(0)
    }

    return (
        <PlayerContext.Provider value={{
            episodeList,
            currentEpisodeIndex,
            play
        }}>
            {children}
        </PlayerContext.Provider>
    )
}

export { PlayerProvider }
export default PlayerContext