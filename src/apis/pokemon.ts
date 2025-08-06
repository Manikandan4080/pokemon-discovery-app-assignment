import type { Pokemon, PokemonDetailResponse, PokemonListResponse } from "@/types/Pokemon"


const POKEMON_API_BASE = import.meta.env.VITE_POKEMON_API_BASE;

console.log(import.meta.env.VITE_POKEMON_API_BASE)


export async function fetchPokemonPage(offset: number, limit: number) {
  try {
    const listResponse = await fetch(
      `${POKEMON_API_BASE}/pokemon?offset=${offset}&limit=${limit}`
    )
    
    if (!listResponse.ok) {
      throw new Error(`Failed to fetch Pokemon list: ${listResponse.status}`)
    }
    
    const listData: PokemonListResponse = await listResponse.json()
    
    // Fetch detailed data for each Pokemon
    const pokemonPromises = listData.results.map(async (pokemon) => {
      const detailResponse = await fetch(pokemon.url)
      
      if (!detailResponse.ok) {
        throw new Error(`Failed to fetch Pokemon details: ${detailResponse.status}`)
      }
      
      const detail: PokemonDetailResponse = await detailResponse.json()
      
      return {
        id: detail.id,
        name: detail.name,
        image: detail.sprites.other["official-artwork"].front_default || 
               `/placeholder.svg?height=200&width=200&query=${detail.name} pokemon`,
        types: detail.types.map(t => t.type.name),
        stats: {
          hp: detail.stats.find(s => s.stat.name === "hp")?.base_stat || 0,
          attack: detail.stats.find(s => s.stat.name === "attack")?.base_stat || 0,
          defense: detail.stats.find(s => s.stat.name === "defense")?.base_stat || 0,
        }
      } as Pokemon
    })
    
    const pokemon = await Promise.all(pokemonPromises)
    
    return {
      pokemon,
      hasMore: listData.next !== null,
      total: listData.count
    }
  } catch (error) {
    console.error("Error fetching Pokemon:", error)
    throw error
  }
}
