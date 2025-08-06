import type { Pokemon } from "@/types/Pokemon"
import { createContext, useContext, useEffect, useState } from "react"
import type { ReactNode } from "react"

interface CollectionContextType {
  collection: Pokemon[]
  addToCollection: (pokemon: Pokemon) => void
  removeFromCollection: (pokemonId: number) => void
  isInCollection: (pokemonId: number) => boolean
  reorderCollection: (sourceIndex: number, destinationIndex: number) => void
  clearCollection: () => void
}

const CollectionContext = createContext<CollectionContextType | undefined>(undefined)

const STORAGE_KEY = import.meta.env.VITE_STORAGE_KEY;

export function CollectionProvider({ children }: { children: ReactNode }) {
  const [collection, setCollection] = useState<Pokemon[]>([])
  const [isLoaded, setIsLoaded] = useState(false)

  // Load collection from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) {
        const parsedCollection = JSON.parse(saved)
        setCollection(parsedCollection)
      }
    } catch (error) {
      console.error("Failed to load collection from localStorage:", error)
    } finally {
      setIsLoaded(true)
    }
  }, [])

  // Save collection to localStorage whenever it changes
  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(collection))
      } catch (error) {
        console.error("Failed to save collection to localStorage:", error)
      }
    }
  }, [collection, isLoaded])

  const addToCollection = (pokemon: Pokemon) => {
    setCollection(prev => {
      if (prev.some(p => p.id === pokemon.id)) {
        return prev // Already in collection
      }
      return [...prev, pokemon]
    })
  }

  const removeFromCollection = (pokemonId: number) => {
    setCollection(prev => prev.filter(p => p.id !== pokemonId))
  }

  const isInCollection = (pokemonId: number) => {
    return collection.some(p => p.id === pokemonId)
  }

  const reorderCollection = (sourceIndex: number, destinationIndex: number) => {
    setCollection(prev => {
      const newCollection = [...prev]
      const [removed] = newCollection.splice(sourceIndex, 1)
      newCollection.splice(destinationIndex, 0, removed)
      return newCollection
    })
  }

  const clearCollection = () => {
    setCollection([])
  }

  const value: CollectionContextType = {
    collection,
    addToCollection,
    removeFromCollection,
    isInCollection,
    reorderCollection,
    clearCollection,
  }

  return (
    <CollectionContext.Provider value={value}>
      {children}
    </CollectionContext.Provider>
  )
}

export function useCollection() {
  const context = useContext(CollectionContext)
  if (context === undefined) {
    throw new Error("useCollection must be used within a CollectionProvider")
  }
  return context
}
