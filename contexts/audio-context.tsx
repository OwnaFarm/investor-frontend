"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect, useRef } from "react"

interface AudioContextType {
  isPlaying: boolean
  toggleAudio: () => void
  setAudioState: (playing: boolean) => void
}

const AudioContext = createContext<AudioContextType | undefined>(undefined)

export function AudioProvider({ children }: { children: React.ReactNode }) {
  const [isPlaying, setIsPlaying] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    // Initialize audio element
    audioRef.current = new Audio("/bacsound.mp3")
    audioRef.current.loop = true
    audioRef.current.volume = 0.5 // Set default volume to 50%

    // Check local storage for saved preference
    const savedState = localStorage.getItem("ownafarm_audio")
    if (savedState === "true") {
      setIsPlaying(true)
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current = null
      }
    }
  }, [])

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        // User interaction is required to play audio in most browsers
        // We handle the catch to avoid unhandled promise rejections if autoplay is blocked
        audioRef.current.play().catch((error) => {
          console.log("Audio playback failed:", error)
          setIsPlaying(false) // Revert state if playback fails
        })
      } else {
        audioRef.current.pause()
      }
      localStorage.setItem("ownafarm_audio", String(isPlaying))
    }
  }, [isPlaying])

  const toggleAudio = () => {
    setIsPlaying((prev) => !prev)
  }

  const setAudioState = (playing: boolean) => {
    setIsPlaying(playing)
  }

  return (
    <AudioContext.Provider value={{ isPlaying, toggleAudio, setAudioState }}>
      {children}
    </AudioContext.Provider>
  )
}

export function useAudio() {
  const context = useContext(AudioContext)
  if (context === undefined) {
    throw new Error("useAudio must be used within an AudioProvider")
  }
  return context
}
