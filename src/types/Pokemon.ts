export interface Pokemon {
    id: number
    name: string
    image: string
    types: string[]
    stats: {
      hp: number
      attack: number
      defense: number
    }
  }
  

  export interface PokemonListResponse {
    count: number
    next: string | null
    previous: string | null
    results: Array<{
      name: string
      url: string
    }>
  }

  export interface PokemonDetailResponse {
    id: number
    name: string
    sprites: {
      other: {
        "official-artwork": {
          front_default: string
        }
      }
    }
    types: Array<{
      type: {
        name: string
      }
    }>
    stats: Array<{
      base_stat: number
      stat: {
        name: string
      }
    }>
  }