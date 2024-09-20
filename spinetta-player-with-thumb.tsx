"use client"

import { useState, useRef, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Play, Pause, SkipBack, SkipForward, Volume2, Heart, Repeat, Shuffle } from "lucide-react"
import Image from "next/image"

export default function Component() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(1)
  const [isLiked, setIsLiked] = useState(false)
  const [isShuffled, setIsShuffled] = useState(false)
  const [isRepeated, setIsRepeated] = useState(false)
  const [isHoveringProgress, setIsHoveringProgress] = useState(false)
  const [isHoveringVolume, setIsHoveringVolume] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const progressRef = useRef<HTMLDivElement>(null)
  const volumeRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const audio = audioRef.current
    if (audio) {
      audio.addEventListener('timeupdate', updateProgress)
      audio.addEventListener('loadedmetadata', () => setDuration(audio.duration))
      audio.addEventListener('ended', handleEnded)
      return () => {
        audio.removeEventListener('timeupdate', updateProgress)
        audio.removeEventListener('loadedmetadata', () => setDuration(audio.duration))
        audio.removeEventListener('ended', handleEnded)
      }
    }
  }, [])

  const updateProgress = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime)
    }
  }

  const handleEnded = () => {
    if (isRepeated) {
      audioRef.current!.currentTime = 0
      audioRef.current!.play()
    } else {
      setIsPlaying(false)
    }
  }

  const togglePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause()
      } else {
        audioRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  const handleProgressChange = (e: React.MouseEvent<HTMLDivElement>) => {
    if (progressRef.current && audioRef.current) {
      const bounds = progressRef.current.getBoundingClientRect()
      const x = e.clientX - bounds.left
      const percent = x / bounds.width
      audioRef.current.currentTime = percent * duration
      setCurrentTime(percent * duration)
    }
  }

  const handleVolumeChange = (e: React.MouseEvent<HTMLDivElement>) => {
    if (volumeRef.current && audioRef.current) {
      const bounds = volumeRef.current.getBoundingClientRect()
      const x = e.clientX - bounds.left
      const percent = Math.max(0, Math.min(1, x / bounds.width))
      audioRef.current.volume = percent
      setVolume(percent)
    }
  }

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  const toggleLike = () => setIsLiked(!isLiked)
  const toggleShuffle = () => setIsShuffled(!isShuffled)
  const toggleRepeat = () => setIsRepeated(!isRepeated)

  return (
    <div className="flex flex-col h-screen bg-gradient-to-b from-zinc-900 to-black text-white p-4">
      <audio 
        ref={audioRef} 
        src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Y2meta.app%20-%20SPINETTA%20-%20BAJAN%20(128%20kbps)-0P9l48BC0UROExqRxZm5NX1Aboi49M.mp3"
        loop={isRepeated}
      />
      
      {/* Top section with back button and song info */}
      <div className="flex items-center mb-4">
        <Button variant="ghost" size="icon" className="text-white">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6"/></svg>
        </Button>
        <div className="ml-4">
          <p className="text-xs text-zinc-400">PLAYING FROM ALBUM</p>
          <h2 className="text-sm font-semibold">Artaud</h2>
        </div>
      </div>

      {/* Album cover */}
      <div className="flex-grow flex items-center justify-center mb-6">
        <Image
          src="/placeholder.svg?height=350&width=350"
          alt="Album cover"
          width={350}
          height={350}
          className="rounded-md shadow-lg"
        />
      </div>

      {/* Song info */}
      <div className="mb-4">
        <h2 className="text-2xl font-bold">Bajan</h2>
        <p className="text-zinc-400">Luis Alberto Spinetta</p>
      </div>

      {/* Progress bar */}
      <div className="mb-4">
        <div 
          ref={progressRef}
          className="relative w-full h-1 bg-zinc-600 rounded-full overflow-hidden cursor-pointer group"
          onClick={handleProgressChange}
          onMouseEnter={() => setIsHoveringProgress(true)}
          onMouseLeave={() => setIsHoveringProgress(false)}
        >
          <div 
            className="absolute top-0 left-0 h-full bg-white"
            style={{ width: `${(currentTime / duration) * 100}%` }}
          />
          {isHoveringProgress && (
            <div 
              className="absolute top-1/2 -mt-2 w-4 h-4 bg-white rounded-full shadow-md"
              style={{ left: `calc(${(currentTime / duration) * 100}% - 8px)` }}
            />
          )}
        </div>
        <div className="flex justify-between text-xs mt-1">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>

      {/* Playback controls */}
      <div className="flex items-center justify-between mb-6">
        <Button 
          variant="ghost" 
          size="icon" 
          className={`text-white ${isShuffled ? 'text-green-500' : ''}`}
          onClick={toggleShuffle}
        >
          <Shuffle className="h-6 w-6" />
        </Button>
        <Button variant="ghost" size="icon" className="text-white">
          <SkipBack className="h-6 w-6" />
        </Button>
        <Button 
          variant="ghost" 
          size="icon" 
          className="text-white h-16 w-16 bg-green-500 hover:bg-green-600 rounded-full" 
          onClick={togglePlayPause}
        >
          {isPlaying ? <Pause className="h-8 w-8" /> : <Play className="h-8 w-8 ml-1" />}
        </Button>
        <Button variant="ghost" size="icon" className="text-white">
          <SkipForward className="h-6 w-6" />
        </Button>
        <Button 
          variant="ghost" 
          size="icon" 
          className={`text-white ${isRepeated ? 'text-green-500' : ''}`}
          onClick={toggleRepeat}
        >
          <Repeat className="h-6 w-6" />
        </Button>
      </div>

      {/* Bottom section with additional controls */}
      <div className="flex items-center justify-between">
        <Button variant="ghost" size="icon" className="text-white">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>
        </Button>
        <div className="flex items-center space-x-2 flex-grow mx-4">
          <Volume2 className="h-4 w-4" />
          <div 
            ref={volumeRef}
            className="relative w-full h-1 bg-zinc-600 rounded-full overflow-hidden cursor-pointer group"
            onClick={handleVolumeChange}
            onMouseEnter={() => setIsHoveringVolume(true)}
            onMouseLeave={() => setIsHoveringVolume(false)}
          >
            <div 
              className="absolute top-0 left-0 h-full bg-white"
              style={{ width: `${volume * 100}%` }}
            />
            {isHoveringVolume && (
              <div 
                className="absolute top-1/2 -mt-2 w-4 h-4 bg-white rounded-full shadow-md"
                style={{ left: `calc(${volume * 100}% - 8px)` }}
              />
            )}
          </div>
        </div>
        <Button 
          variant="ghost" 
          size="icon" 
          className={`text-white ${isLiked ? 'text-green-500' : ''}`}
          onClick={toggleLike}
        >
          <Heart className="h-6 w-6" fill={isLiked ? "currentColor" : "none"} />
        </Button>
      </div>
    </div>
  )
}