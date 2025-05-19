"use client"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import DarkstoreFulfillment from "@/components/darkstore-fulfillment"
import UserEngagement from "@/components/user-engagement"
import ShelfLifeManagement from "@/components/shelf-life-management"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function Home() {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Quick Commerce Platform</h1>
      <p className="text-gray-600 mb-8">Dark Store Management Project </p>

      <Tabs defaultValue="darkstore">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="darkstore">Darkstore Fulfillment</TabsTrigger>
          <TabsTrigger value="engagement">User Engagement</TabsTrigger>
          <TabsTrigger value="shelflife">Shelf-Life Management</TabsTrigger>
        </TabsList>

        <TabsContent value="darkstore">
          <Card>
            <CardHeader>
              <CardTitle>Smart Darkstore Fulfillment Engine</CardTitle>
              <CardDescription>
                Automatically select the best darkstore to fulfill a user order within 20 minutes based on inventory and
                delivery distance.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <DarkstoreFulfillment />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="engagement">
          <Card>
            <CardHeader>
              <CardTitle>Hyperpersonal User Engagement Engine</CardTitle>
              <CardDescription>
                Customize the app's homepage content and push notifications based on user context (time, weather,
                festivals).
              </CardDescription>
            </CardHeader>
            <CardContent>
              <UserEngagement />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="shelflife">
          <Card>
            <CardHeader>
              <CardTitle>Shelf-Life Based Discount & Repurposing System</CardTitle>
              <CardDescription>
                Manage perishables by tracking shelf life, applying timely discounts, and repurposing near-expiry stock.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ShelfLifeManagement />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
