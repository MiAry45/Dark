"use client"

import { useState } from "react"
import { findBestDarkstore } from "@/lib/darkstore-algorithm"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AlertCircle, CheckCircle2 } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

// Sample data
const sampleDarkstores = [
  { id: "store1", name: "Central Darkstore", location: "City Center", deliveryTime: 15 },
  { id: "store2", name: "North Darkstore", location: "North District", deliveryTime: 10 },
  { id: "store3", name: "East Darkstore", location: "East District", deliveryTime: 18 },
  { id: "store4", name: "South Darkstore", location: "South District", deliveryTime: 25 },
  { id: "store5", name: "West Darkstore", location: "West District", deliveryTime: 12 },
]

const sampleInventory = {
  store1: { milk: 10, bread: 15, eggs: 20, coffee: 8, noodles: 12 },
  store2: { milk: 5, bread: 8, eggs: 10, coffee: 0, noodles: 15 },
  store3: { milk: 8, bread: 0, eggs: 15, coffee: 10, noodles: 8 },
  store4: { milk: 12, bread: 10, eggs: 0, coffee: 5, noodles: 10 },
  store5: { milk: 6, bread: 12, eggs: 8, coffee: 6, noodles: 0 },
}

const availableItems = ["milk", "bread", "eggs", "coffee", "noodles"]

export default function DarkstoreFulfillment() {
  const [userLocation, setUserLocation] = useState("user1")
  const [selectedItems, setSelectedItems] = useState<string[]>([])
  const [result, setResult] = useState<any>(null)

  const handleItemToggle = (item: string) => {
    if (selectedItems.includes(item)) {
      setSelectedItems(selectedItems.filter((i) => i !== item))
    } else {
      setSelectedItems([...selectedItems, item])
    }
  }

  const findBestStore = () => {
    if (selectedItems.length === 0) {
      setResult({ error: "Please select at least one item" })
      return
    }

    const bestStore = findBestDarkstore(userLocation, sampleDarkstores, sampleInventory, selectedItems)
    setResult({ bestStore })
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 className="text-lg font-medium mb-4">Select Items for Your Order</h3>
          <div className="space-y-3">
            {availableItems.map((item) => (
              <div key={item} className="flex items-center space-x-2">
                <Checkbox
                  id={`item-${item}`}
                  checked={selectedItems.includes(item)}
                  onCheckedChange={() => handleItemToggle(item)}
                />
                <Label htmlFor={`item-${item}`} className="capitalize">
                  {item}
                </Label>
              </div>
            ))}
          </div>

          <Button onClick={findBestStore} className="mt-6">
            Find Best Darkstore
          </Button>
        </div>

        <div>
          <h3 className="text-lg font-medium mb-4">Available Darkstores</h3>
          <div className="space-y-3">
            {sampleDarkstores.map((store) => (
              <Card key={store.id}>
                <CardContent className="p-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="font-medium">{store.name}</h4>
                      <p className="text-sm text-gray-500">{store.location}</p>
                    </div>
                    <Badge variant={store.deliveryTime <= 20 ? "default" : "destructive"}>
                      {store.deliveryTime} min
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {result && (
        <div className="mt-6">
          {result.error ? (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{result.error}</AlertDescription>
            </Alert>
          ) : result.bestStore ? (
            <Alert>
              <CheckCircle2 className="h-4 w-4" />
              <AlertTitle>Best Darkstore Found</AlertTitle>
              <AlertDescription>
                <p className="font-medium">{result.bestStore.name}</p>
                <p>Location: {result.bestStore.location}</p>
                <p>Estimated Delivery Time: {result.bestStore.deliveryTime} minutes</p>
              </AlertDescription>
            </Alert>
          ) : (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>No Suitable Darkstore Found</AlertTitle>
              <AlertDescription>
                No darkstore can fulfill your order within 20 minutes or has all items in stock.
              </AlertDescription>
            </Alert>
          )}
        </div>
      )}
    </div>
  )
}
