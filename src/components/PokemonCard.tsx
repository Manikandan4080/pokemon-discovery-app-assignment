import { useState } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Plus, X, Heart, Zap, Shield } from 'lucide-react'
import { useCollection } from "../hooks/use-collection"
import type { Pokemon } from "@/types/Pokemon"

interface PokemonCardProps {
  pokemon: Pokemon
  showAddButton?: boolean
  showRemoveButton?: boolean
  onRemove?: () => void
  isDragging?: boolean
}

const typeColors: Record<string, string> = {
  normal: "bg-gray-400",
  fire: "bg-red-500",
  water: "bg-blue-500",
  electric: "bg-yellow-400",
  grass: "bg-green-500",
  ice: "bg-blue-300",
  fighting: "bg-red-700",
  poison: "bg-purple-500",
  ground: "bg-yellow-600",
  flying: "bg-indigo-400",
  psychic: "bg-pink-500",
  bug: "bg-green-400",
  rock: "bg-yellow-800",
  ghost: "bg-purple-700",
  dragon: "bg-indigo-700",
  dark: "bg-gray-800",
  steel: "bg-gray-500",
  fairy: "bg-pink-300",
}

export default function PokemonCard({
  pokemon,
  showAddButton = false,
  showRemoveButton = false,
  onRemove,
  isDragging = false,
}: PokemonCardProps) {
  const { addToCollection, isInCollection } = useCollection()
  const [imageLoading, setImageLoading] = useState(true)
  const [imageError, setImageError] = useState(false)

  const isAlreadyInCollection = isInCollection(pokemon.id)

  const handleAddToCollection = () => {
    if (!isAlreadyInCollection) {
      addToCollection(pokemon)
    }
  }

  const handleImageLoad = () => {
    setImageLoading(false)
  }

  const handleImageError = () => {
    setImageError(true)
    setImageLoading(false)
  }

  return (
    <Card className={`overflow-hidden transition-all duration-200 hover:shadow-lg ${
      isDragging ? "shadow-2xl ring-2 ring-blue-400" : ""
    }`}>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-bold text-lg capitalize">{pokemon.name}</h3>
            <p className="text-sm text-gray-500">#{pokemon.id.toString().padStart(3, '0')}</p>
          </div>
          {showAddButton && (
            <Button
              size="sm"
              variant={isAlreadyInCollection ? "secondary" : "default"}
              onClick={handleAddToCollection}
              disabled={isAlreadyInCollection}
              className="shrink-0"
            >
              {isAlreadyInCollection ? (
                <>
                  <Heart className="h-4 w-4 mr-1 fill-current" />
                  Added
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4 mr-1" />
                  Add
                </>
              )}
            </Button>
          )}
          {showRemoveButton && (
            <Button
              size="sm"
              variant="destructive"
              onClick={onRemove}
              className="shrink-0"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Pokemon Image */}
        <div className="relative w-full h-48 bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden">
          {!imageError ? (
            <img
              src={pokemon.image || "/placeholder.svg"}
              alt={pokemon.name}
              className={`w-full h-full object-contain transition-opacity duration-200 ${
                imageLoading ? "opacity-0" : "opacity-100"
              }`}
              onLoad={handleImageLoad}
              onError={handleImageError}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              <div className="text-center">
                <div className="text-4xl mb-2">❓</div>
                <p className="text-sm">Image not available</p>
              </div>
            </div>
          )}
          {imageLoading && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            </div>
          )}
        </div>

        {/* Pokemon Types */}
        <div className="flex flex-wrap gap-2">
          {pokemon.types.map((type) => (
            <Badge
              key={type}
              className={`${typeColors[type] || "bg-gray-400"} text-white capitalize`}
            >
              {type}
            </Badge>
          ))}
        </div>

        {/* Pokemon Stats */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Heart className="h-4 w-4 text-red-500" />
              <span className="text-sm font-medium">HP</span>
            </div>
            <span className="font-bold">{pokemon.stats.hp}</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Zap className="h-4 w-4 text-orange-500" />
              <span className="text-sm font-medium">Attack</span>
            </div>
            <span className="font-bold">{pokemon.stats.attack}</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-blue-500" />
              <span className="text-sm font-medium">Defense</span>
            </div>
            <span className="font-bold">{pokemon.stats.defense}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
