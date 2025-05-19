// Item class to track perishable items
class PerishableItem {
  constructor(id, name, addedDate, shelfLifeDays, category) {
    this.id = id
    this.name = name
    this.addedDate = new Date(addedDate)
    this.shelfLifeDays = shelfLifeDays
    this.category = category
    this.discount = 0
    this.status = "fresh" // fresh, discounted, repurpose
  }

  // Calculate days remaining before expiry
  getDaysRemaining() {
    const today = new Date()
    const diffTime = this.addedDate.getTime() + this.shelfLifeDays * 24 * 60 * 60 * 1000 - today.getTime()
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  }

  // Update item status based on days remaining
  updateStatus() {
    const daysRemaining = this.getDaysRemaining()

    if (daysRemaining <= 0) {
      this.status = "expired"
      this.discount = 0
    } else if (daysRemaining === 1) {
      this.status = "repurpose"
      this.discount = 40
    } else if (daysRemaining === 2) {
      this.status = "discounted"
      this.discount = 20
    } else {
      this.status = "fresh"
      this.discount = 0
    }

    return this.status
  }
}

// Repurposing rules for different categories
const repurposingRules = {
  fruit: {
    banana: "Smoothie",
    apple: "Juice",
    berries: "Desserts",
  },
  vegetable: {
    tomato: "Cafe Chain",
    potato: "Ready meals",
    leafy: "Compost",
  },
  dairy: {
    milk: "Bulk Offer",
    yogurt: "CSR Donation",
    cheese: "Staff meals",
  },
}

// Function to get repurposing suggestion
function getRepurposingSuggestion(item) {
  const categoryRules = repurposingRules[item.category] || {}
  return categoryRules[item.name.toLowerCase()] || "Discount Sale"
}

// Priority Queue implementation for shelf life management
class ShelfLifePriorityQueue {
  constructor() {
    this.items = []
  }

  enqueue(item) {
    this.items.push(item)
    this.sort()
  }

  dequeue() {
    return this.items.shift()
  }

  sort() {
    this.items.sort((a, b) => a.getDaysRemaining() - b.getDaysRemaining())
  }

  peek() {
    return this.items[0]
  }

  isEmpty() {
    return this.items.length === 0
  }

  size() {
    return this.items.length
  }
}

// Main shelf life management system
export class ShelfLifeManager {
  constructor() {
    this.inventory = []
    this.priorityQueue = new ShelfLifePriorityQueue()
  }

  addItem(id, name, addedDate, shelfLifeDays, category) {
    const item = new PerishableItem(id, name, addedDate, shelfLifeDays, category)
    this.inventory.push(item)
    this.priorityQueue.enqueue(item)
    return item
  }

  updateAllItems() {
    this.inventory.forEach((item) => {
      item.updateStatus()
    })
    this.priorityQueue.sort()
  }

  getItemsNeedingAction() {
    return this.inventory
      .filter((item) => item.status === "discounted" || item.status === "repurpose")
      .map((item) => ({
        ...item,
        repurposeSuggestion: item.status === "repurpose" ? getRepurposingSuggestion(item) : null,
      }))
  }

  getInventorySummary() {
    const summary = {
      fresh: 0,
      discounted: 0,
      repurpose: 0,
      expired: 0,
    }

    this.inventory.forEach((item) => {
      summary[item.status]++
    })

    return summary
  }

  getPriorityItems(count = 5) {
    // Create a copy of the priority queue to avoid modifying the original
    const tempQueue = new ShelfLifePriorityQueue()
    this.inventory.forEach((item) => tempQueue.enqueue(item))

    const priorityItems = []
    for (let i = 0; i < count && !tempQueue.isEmpty(); i++) {
      const item = tempQueue.dequeue()
      priorityItems.push({
        ...item,
        daysRemaining: item.getDaysRemaining(),
        repurposeSuggestion: item.status === "repurpose" ? getRepurposingSuggestion(item) : null,
      })
    }

    return priorityItems
  }
}
