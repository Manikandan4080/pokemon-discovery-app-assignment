import { useState } from "react"
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import type { DropResult } from "@hello-pangea/dnd";
import { useCollection } from "../hooks/use-collection"
import { Trash2 } from 'lucide-react'
import { Button } from "@/components/ui/button"
import PokemonCard from "./PokemonCard"

export default function PokemonCollection() {
  const { collection, reorderCollection, removeFromCollection, clearCollection } = useCollection()
  const [draggedId, setDraggedId] = useState<string | null>(null)

  const handleDragEnd = (result: DropResult) => {
    setDraggedId(null)
    
    if (!result.destination) return

    const sourceIndex = result.source.index
    const destinationIndex = result.destination.index

    if (sourceIndex === destinationIndex) return

    reorderCollection(sourceIndex, destinationIndex)
  }

  const handleDragStart = (start: any) => {
    setDraggedId(start.draggableId)
  }

  if (collection.length === 0) {
    return (
      <div className="p-6 text-center">
        <div className="max-w-md mx-auto">
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-xl font-semibold mb-2">No Pokemon in your collection yet</h3>
          <p className="text-gray-600 dark:text-gray-400">
            Start discovering Pokemon and add them to your collection by clicking the + button!
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">
          My Collection ({collection.length} Pokemon)
        </h2>
        <Button
          variant="outline"
          size="sm"
          onClick={clearCollection}
          className="text-red-600 hover:text-red-700"
        >
          <Trash2 className="h-4 w-4 mr-2" />
          Clear All
        </Button>
      </div>

      <DragDropContext onDragEnd={handleDragEnd} onDragStart={handleDragStart}>
        <Droppable droppableId="collection">
          {(provided, snapshot) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 transition-colors ${
                snapshot.isDraggingOver ? "bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4" : ""
              }`}
            >
              {collection.map((pokemon, index) => (
                <Draggable key={pokemon.id} draggableId={pokemon.id.toString()} index={index}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      className={`transition-transform ${
                        snapshot.isDragging ? "rotate-3 scale-105 z-50" : ""
                      } ${draggedId === pokemon.id.toString() ? "opacity-50" : ""}`}
                    >
                      <PokemonCard
                        pokemon={pokemon}
                        showRemoveButton
                        onRemove={() => removeFromCollection(pokemon.id)}
                        isDragging={snapshot.isDragging}
                      />
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>

      <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
        <p className="text-sm text-blue-700 dark:text-blue-300">
          💡 <strong>Tip:</strong> Drag and drop Pokemon cards to reorder your collection!
        </p>
      </div>
    </div>
  )
}
