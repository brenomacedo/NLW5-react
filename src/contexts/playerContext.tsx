import { createContext, FC, useContext, useState } from 'react'

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
    playList: (list: Episode[], index: number) => void
    playNext: () => void
    playPrevious: () => void
    hasNext: boolean,
    hasPrevious: boolean
    isLooping: boolean
    toggleLoop: () => void
    isShuffling: boolean
    toggleShuffle: () => void
    clearPlayerState: () => void
}

const PlayerContext = createContext<PlayerContextData>({} as PlayerContextData)

const PlayerProvider: FC = ({children}) => {

    const [episodeList, setEpisodeList] = useState([])
    const [currentEpisodeIndex, setCurrentEpisodeIndex] = useState(0)
    const [isPlaying, setIsPlaying] = useState(false)
    const [isLooping, setIsLooping] = useState(false)
    const [isShuffling, setIsShuffling] = useState(false)

    const play = (episode: Episode) => {
        setEpisodeList([episode])
        setCurrentEpisodeIndex(0)
        setIsPlaying(true)
    }

    const togglePlay = () => {
        setIsPlaying(!isPlaying)
    }

    const toggleLoop = () => {
        setIsLooping(!isLooping)
    }

    const toggleShuffle = () => {
        setIsShuffling(!isShuffling)
    }

    const setPlayingState = (state: boolean) => {
        setIsPlaying(state)
    }

    const playList = (list: Episode[], index: number) => {
        setEpisodeList(list)
        setCurrentEpisodeIndex(index)
        setIsPlaying(true)
    }

    const hasPrevious = currentEpisodeIndex > 0
    const hasNext = isShuffling || (currentEpisodeIndex + 1) < episodeList.length

    const playNext = () => {

        if(isShuffling) {
            const nextRandomEpisodeIndex = Math.floor(Math.random() * episodeList.length)
            setCurrentEpisodeIndex(nextRandomEpisodeIndex)
        } else if(hasNext) {
            setCurrentEpisodeIndex(currentEpisodeIndex + 1)
        }
        

    }

    const playPrevious = () => {
        if(hasPrevious) {
            setCurrentEpisodeIndex(currentEpisodeIndex - 1)
        }
    }

    const clearPlayerState = () => {
        setEpisodeList([])
        setCurrentEpisodeIndex(0)
    }

    return (
        <PlayerContext.Provider value={{
            episodeList,
            currentEpisodeIndex,
            play,
            isPlaying,
            togglePlay,
            setPlayingState,
            playList,
            playNext,
            playPrevious,
            hasNext,
            hasPrevious,
            isLooping,
            toggleLoop,
            isShuffling,
            toggleShuffle,
            clearPlayerState
        }}>
            {children}
        </PlayerContext.Provider>
    )
}

export const usePlayer = () => {
    return useContext(PlayerContext)
}
export { PlayerProvider }
export default PlayerContext