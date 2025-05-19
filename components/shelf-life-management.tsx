"use client"

import { useState, useEffect } from "react"
import { ShelfLifeManager } from "@/lib/shelf-life-manager"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Clock, Plus, Recycle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

// Initialize the shelf life manager with sample data
const initializeManager = () => {
  const manager = new ShelfLifeManager()

  // Add sample items with different dates
  const today = new Date()
  const yesterday = new Date(today)
  yesterday.setDate(yesterday.getDate() - 1)

  const twoDaysAgo = new Date(today)
  twoDaysAgo.setDate(twoDaysAgo.getDate() - 2)

  const threeDaysAgo = new Date(today)
  threeDaysAgo.setDate(threeDaysAgo.getDate() - 3)

  // Add items with different shelf lives and added dates
  manager.addItem("item1", "Banana", threeDaysAgo.toISOString(), 5, "fruit")
  manager.addItem("item2", "Milk", yesterday.toISOString(), 3, "dairy")
  manager.addItem("item3", "Tomato", twoDaysAgo.toISOString(), 4, "vegetable")
  manager.addItem("item4", "Yogurt", today.toISOString(), 7, "dairy")
  manager.addItem("item5", "Apple", yesterday.toISOString(), 10, "fruit")

  manager.updateAllItems()
  return manager
}

export default function ShelfLifeManagement() {
  const [manager] = useState(() => initializeManager())
  const [inventory, setInventory] = useState<any[]>([])
  const [summary, setSummary] = useState<any>({})
  const [priorityItems, setPriorityItems] = useState<any[]>([])

  // Form state for adding new items
  const [newItem, setNewItem] = useState({
    name: "",
    category: "fruit",
    shelfLife: 5,
  })

  // Update inventory data
  const updateInventoryData = () => {
    manager.updateAllItems()
    setInventory(manager.inventory)
    setSummary(manager.getInventorySummary())
    setPriorityItems(manager.getPriorityItems())
  }

  // Initialize data
  useEffect(() => {
    updateInventoryData()
  }, [])

  // Add a new item
  const handleAddItem = () => {
    if (!newItem.name) return

    const today = new Date()
    manager.addItem(
      `item${inventory.length + 1}`,
      newItem.name,
      today.toISOString(),
      newItem.shelfLife,
      newItem.category,
    )

    setNewItem({
      name: "",
      category: "fruit",
      shelfLife: 5,
    })

    updateInventoryData()
  }

  // Simulate a day passing
  const simulateDay = () => {
    // Shift all added dates back by one day
    inventory.forEach((item) => {
      const date = new Date(item.addedDate)
      date.setDate(date.getDate() - 1)
      item.addedDate = date
    })

    updateInventoryData()
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Fresh Items</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary.fresh || 0}</div>
            <p className="text-xs text-muted-foreground">No action needed</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Discounted Items</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary.discounted || 0}</div>
            <p className="text-xs text-muted-foreground">20% discount applied</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Repurpose Items</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary.repurpose || 0}</div>
            <p className="text-xs text-muted-foreground">Needs immediate action</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 className="text-lg font-medium mb-4">Priority Items</h3>

          {priorityItems.length > 0 ? (
            <div className="space-y-3">
              {priorityItems.map((item, index) => (
                <Card key={index}>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-center mb-2">
                      <div>
                        <h4 className="font-medium capitalize">{item.name}</h4>
                        <p className="text-sm text-gray-500 capitalize">{item.category}</p>
                      </div>
                      <Badge
                        variant={
                          item.status === "fresh"
                            ? "default"
                            : item.status === "discounted"
                              ? "secondary"
                              : "destructive"
                        }
                      >
                        {item.status}
                      </Badge>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Shelf Life:</span>
                        <span>{item.daysRemaining} days remaining</span>
                      </div>

                      <Progress value={(item.daysRemaining / item.shelfLifeDays) * 100} className="h-2" />

                      {item.discount > 0 && (
                        <div className="text-sm font-medium text-orange-600">{item.discount}% discount applied</div>
                      )}

                      {item.repurposeSuggestion && (
                        <Alert variant="warning" className="mt-2 py-2">
                          <Recycle className="h-4 w-4" />
                          <AlertTitle className="text-xs">Repurpose Suggestion</AlertTitle>
                          <AlertDescription className="text-xs">{item.repurposeSuggestion}</AlertDescription>
                        </Alert>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center p-6 text-gray-500">No priority items found</div>
          )}

          <div className="mt-4 flex justify-between">
            <Button onClick={simulateDay} variant="outline">
              <Clock className="mr-2 h-4 w-4" />
              Simulate Day Passing
            </Button>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-medium mb-4">Add New Item</h3>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="item-name">Item Name</Label>
              <Input
                id="item-name"
                value={newItem.name}
                onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                placeholder="Enter item name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select value={newItem.category} onValueChange={(value) => setNewItem({ ...newItem, category: value })}>
                <SelectTrigger id="category">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="fruit">Fruit</SelectItem>
                  <SelectItem value="vegetable">Vegetable</SelectItem>
                  <SelectItem value="dairy">Dairy</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="shelf-life">Shelf Life (Days)</Label>
              <Input
                id="shelf-life"
                type="number"
                min="1"
                value={newItem.shelfLife}
                onChange={(e) => setNewItem({ ...newItem, shelfLife: Number.parseInt(e.target.value) || 1 })}
              />
            </div>

            <Button onClick={handleAddItem} className="w-full">
              <Plus className="mr-2 h-4 w-4" />
              Add Item
            </Button>
          </div>

          <div className="mt-6">
            <h3 className="text-lg font-medium mb-4">How It Works</h3>
            <Card>
              <CardContent className="p-4 text-sm">
                <p className="mb-2">The system automatically:</p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Tracks shelf life of all perishable items</li>
                  <li>Applies 20% discount when 2 days remaining</li>
                  <li>Applies 40% discount when 1 day remaining</li>
                  <li>Suggests repurposing options for near-expiry items</li>
                  <li>Uses a priority queue to highlight items needing attention</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
