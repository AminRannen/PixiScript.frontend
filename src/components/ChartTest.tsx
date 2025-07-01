"use client"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp } from "lucide-react"
import { Pie, PieChart, Tooltip } from "recharts"

const data = [
  { name: "Chrome", value: 300, fill: "#8884d8" },
  { name: "Safari", value: 200, fill: "#82ca9d" },
  { name: "Firefox", value: 150, fill: "#ffc658" },
]

export function ChartTest() {
  return (
    <Card className="max-w-md mx-auto">
      <CardHeader className="text-center">
        <CardTitle>ShadCN Pie Chart</CardTitle>
        <CardDescription>Test static data</CardDescription>
      </CardHeader>
      <CardContent>
        <PieChart width={300} height={300}>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={100}
            dataKey="value"
            nameKey="name"
            label
          />
          <Tooltip />
        </PieChart>
      </CardContent>
      <CardFooter className="flex justify-center items-center text-sm text-muted-foreground">
        Trending up this month <TrendingUp className="ml-2 h-4 w-4" />
      </CardFooter>
    </Card>
  )
}
