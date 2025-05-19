// Graph implementation for city model
class Graph {
  constructor() {
    this.adjacencyList = {}
  }

  addVertex(vertex) {
    if (!this.adjacencyList[vertex]) {
      this.adjacencyList[vertex] = []
    }
  }

  addEdge(vertex1, vertex2, weight) {
    this.adjacencyList[vertex1].push({ node: vertex2, weight })
    this.adjacencyList[vertex2].push({ node: vertex1, weight }) // For undirected graph
  }

  // Dijkstra's algorithm to find shortest path
  dijkstra(start) {
    const nodes = new PriorityQueue()
    const distances = {}
    const previous = {}
    let smallest
    const path = []

    // Build up initial state
    for (const vertex in this.adjacencyList) {
      if (vertex === start) {
        distances[vertex] = 0
        nodes.enqueue(vertex, 0)
      } else {
        distances[vertex] = Number.POSITIVE_INFINITY
        nodes.enqueue(vertex, Number.POSITIVE_INFINITY)
      }
      previous[vertex] = null
    }

    // As long as there is something to visit
    while (nodes.values.length) {
      smallest = nodes.dequeue().val

      if (smallest === null) continue

      // We are done
      if (distances[smallest] === Number.POSITIVE_INFINITY) break

      for (const neighbor of this.adjacencyList[smallest]) {
        // Calculate new distance to neighboring node
        const candidate = distances[smallest] + neighbor.weight
        if (candidate < distances[neighbor.node]) {
          // Updating new smallest distance to neighbor
          distances[neighbor.node] = candidate
          // Updating previous - How we got to neighbor
          previous[neighbor.node] = smallest
          // Enqueue in priority queue with new priority
          nodes.enqueue(neighbor.node, candidate)
        }
      }
    }

    return { distances, previous }
  }
}

// Priority Queue implementation for Dijkstra's algorithm
class PriorityQueue {
  constructor() {
    this.values = []
  }

  enqueue(val, priority) {
    this.values.push({ val, priority })
    this.sort()
  }

  dequeue() {
    return this.values.shift()
  }

  sort() {
    this.values.sort((a, b) => a.priority - b.priority)
  }
}

// Function to find the best darkstore for an order
export function findBestDarkstore(userLocation, darkstores, inventory, orderItems) {
  // Create a graph of the city
  const cityGraph = new Graph()

  // Add all vertices (darkstores and user location)
  cityGraph.addVertex(userLocation)
  darkstores.forEach((store) => {
    cityGraph.addVertex(store.id)
  })

  // Add edges (connections between locations with delivery times)
  darkstores.forEach((store) => {
    cityGraph.addEdge(userLocation, store.id, store.deliveryTime)
  })

  // Run Dijkstra's algorithm to find shortest paths from user to all darkstores
  const { distances } = cityGraph.dijkstra(userLocation)

  // Filter darkstores based on inventory and delivery time
  const eligibleDarkstores = darkstores.filter((store) => {
    // Check if delivery time is within 20 minutes
    if (distances[store.id] > 20) return false

    // Check if all items are in stock
    return orderItems.every((item) => {
      const storeInventory = inventory[store.id] || {}
      return storeInventory[item] && storeInventory[item] > 0
    })
  })

  // Sort eligible darkstores by delivery time
  eligibleDarkstores.sort((a, b) => distances[a.id] - distances[b.id])

  // Return the best darkstore or null if none found
  return eligibleDarkstores.length > 0
    ? { ...eligibleDarkstores[0], deliveryTime: distances[eligibleDarkstores[0].id] }
    : null
}
