import { useState } from "react"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card } from "@/components/ui/card"
import { CollectionProvider } from "./hooks/use-collection"
import PokemonDiscovery from "./components/PokemonDiscovery"
import PokemonCollection from "./components/PokemonCollection"

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes
    },
  },
})

export default function App() {
  const [activeTab, setActiveTab] = useState("discovery")

  return (
    <QueryClientProvider client={queryClient}>
      <CollectionProvider>
        <div className="min-h-screen flex justify-center p-2 md:p-4">
          <div className="container mx-auto px-4 py-8">
            <div className="text-center mb-8">
              <h1 className="text-xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">
                Pokemon Discovery
              </h1>
              <p className=" text-gray-600 dark:text-gray-300">
                Discover Pokemon and build your personal collection
              </p>
            </div>

            <Card className="w-full mx-auto">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="flex gap-3 w-full px-3">
                  <TabsTrigger value="discovery" className="text-sm">
                    Discover Pokemon
                  </TabsTrigger>
                  <TabsTrigger value="collection" className="text-sm">
                    My Collection
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="discovery" className="">
                  <PokemonDiscovery />
                </TabsContent>

                <TabsContent value="collection" className="">
                  <PokemonCollection />
                </TabsContent>
              </Tabs>
            </Card>
          </div>
        </div>
      </CollectionProvider>
    </QueryClientProvider>
  )
}
