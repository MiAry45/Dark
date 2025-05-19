"use client"

import { useState } from "react"
import { getUserRecommendations } from "@/lib/user-engagement"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Bell, Clock, CloudRain, Gift, MapPin, Sun, Thermometer } from "lucide-react"

export default function UserEngagement() {
  const [userContext, setUserContext] = useState({
    time: "morning",
    weather: "sunny",
    festival: "none",
    pincode: "110001",
    location: "Delhi",
  })

  const [recommendations, setRecommendations] = useState<any>(null)

  const handleContextChange = (field: string, value: string) => {
    setUserContext({
      ...userContext,
      [field]: value,
    })
  }

  const generateRecommendations = () => {
    const recs = getUserRecommendations(userContext)
    setRecommendations(recs)
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="time">Time of Day</Label>
            <Select value={userContext.time} onValueChange={(value) => handleContextChange("time", value)}>
              <SelectTrigger id="time">
                <SelectValue placeholder="Select time of day" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="morning">Morning</SelectItem>
                <SelectItem value="afternoon">Afternoon</SelectItem>
                <SelectItem value="evening">Evening</SelectItem>
                <SelectItem value="night">Night</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="weather">Weather Condition</Label>
            <Select value={userContext.weather} onValueChange={(value) => handleContextChange("weather", value)}>
              <SelectTrigger id="weather">
                <SelectValue placeholder="Select weather" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sunny">Sunny</SelectItem>
                <SelectItem value="rainy">Rainy</SelectItem>
                <SelectItem value="cold">Cold</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="festival">Festival (Optional)</Label>
            <Select value={userContext.festival} onValueChange={(value) => handleContextChange("festival", value)}>
              <SelectTrigger id="festival">
                <SelectValue placeholder="Select festival" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">None</SelectItem>
                <SelectItem value="diwali">Diwali</SelectItem>
                <SelectItem value="christmas">Christmas</SelectItem>
                <SelectItem value="holi">Holi</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="pincode">Pincode</Label>
            <Input
              id="pincode"
              value={userContext.pincode}
              onChange={(e) => handleContextChange("pincode", e.target.value)}
              placeholder="Enter pincode"
            />
          </div>

          <Button onClick={generateRecommendations} className="mt-2">
            Generate Recommendations
          </Button>
        </div>

        <div>
          <Card className="mb-4">
            <CardContent className="p-4">
              <div className="flex items-center space-x-2 mb-2">
                <Clock className="h-5 w-5 text-gray-500" />
                <span className="font-medium capitalize">{userContext.time}</span>
              </div>

              <div className="flex items-center space-x-2 mb-2">
                {userContext.weather === "sunny" && <Sun className="h-5 w-5 text-yellow-500" />}
                {userContext.weather === "rainy" && <CloudRain className="h-5 w-5 text-blue-500" />}
                {userContext.weather === "cold" && <Thermometer className="h-5 w-5 text-blue-300" />}
                <span className="font-medium capitalize">{userContext.weather}</span>
              </div>

              {userContext.festival !== "none" && (
                <div className="flex items-center space-x-2 mb-2">
                  <Gift className="h-5 w-5 text-purple-500" />
                  <span className="font-medium capitalize">{userContext.festival}</span>
                </div>
              )}

              <div className="flex items-center space-x-2">
                <MapPin className="h-5 w-5 text-red-500" />
                <span className="font-medium">{userContext.pincode}</span>
              </div>
            </CardContent>
          </Card>

          {recommendations && (
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium mb-2">Primary Recommendations</h3>
                <div className="grid grid-cols-1 gap-2">
                  {recommendations.primary.map((item: string, index: number) => (
                    <Card key={index}>
                      <CardContent className="p-3 flex items-center justify-between">
                        <span className="capitalize">{item}</span>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-2">Secondary Recommendations</h3>
                <div className="grid grid-cols-2 gap-2">
                  {recommendations.secondary.map((item: string, index: number) => (
                    <Card key={index}>
                      <CardContent className="p-2 text-sm">
                        <span className="capitalize">{item}</span>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-2">Push Notifications</h3>
                <div className="space-y-2">
                  {recommendations.notifications.map((item: string, index: number) => (
                    <Card key={index}>
                      <CardContent className="p-3 flex items-center space-x-2">
                        <Bell className="h-4 w-4 text-gray-500" />
                        <span>Check out {item} today!</span>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
