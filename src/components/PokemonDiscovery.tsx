import { useEffect, useRef } from "react"
import { useInfiniteQuery } from "@tanstack/react-query"
import { Loader2 } from 'lucide-react'
import { fetchPokemonPage } from "@/apis/pokemon"
import PokemonCard from "./PokemonCard"

const POKEMON_PER_PAGE = 6

export default function PokemonDiscovery() {
  const observerRef = useRef<HTMLDivElement>(null)

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    error,
  } = useInfiniteQuery({
    queryKey: ["pokemon"],
    queryFn: ({ pageParam = 0 }) => fetchPokemonPage(pageParam, POKEMON_PER_PAGE),
    getNextPageParam: (_, pages) => {
        
      const totalFetched = pages.length * POKEMON_PER_PAGE
      return totalFetched < 1000 ? totalFetched : undefined // Limit to first 1000 Pokemon
    },
    initialPageParam: 0,
  })

  // Intersection Observer for infinite scrolling
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage()
        }
      },
      { threshold: 0.1 }
    )

    if (observerRef.current) {
      observer.observe(observerRef.current)
    }

    return () => observer.disconnect()
  }, [fetchNextPage, hasNextPage, isFetchingNextPage])

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2 text-lg">Loading Pokemon...</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500 text-lg">Failed to load Pokemon. Please try again.</p>
      </div>
    )
  }

  const allPokemon = data?.pages.flatMap(page => page.pokemon) || []

  return (
    <div className="p-4 md:p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {allPokemon.map((pokemon) => (
          <PokemonCard key={pokemon.id} pokemon={pokemon} showAddButton />
        ))}
      </div>

      {/* Loading indicator for next page */}
      {isFetchingNextPage && (
        <div className="flex justify-center items-center py-8">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span className="ml-2">Loading more Pokemon...</span>
        </div>
      )}

      {/* Intersection observer target */}
      <div ref={observerRef} className="h-4" />

      {/* End of results indicator */}
      {!hasNextPage && allPokemon.length > 0 && (
        <div className="text-center py-8">
          <p className="text-gray-500">You've discovered all available Pokemon!</p>
        </div>
      )}
    </div>
  )
}
