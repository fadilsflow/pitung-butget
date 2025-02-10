"use client"

import { DateToUTCDate, GetFormaterCurrency } from "@/lib/helpers"
import type { UserSettings } from "@prisma/client"
import { useQuery } from "@tanstack/react-query"
import { TrendingDown, TrendingUp, Wallet } from "lucide-react"
import { useCallback, useMemo } from "react"
import CountUp from "react-countup"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import type { getBalanceStatsResponse } from "@/app/api/stats/balance/route"
import type React from "react" // Added import for React

interface Props {
  from: Date
  to: Date
  userSettings: UserSettings
}

function StatsCards({ from, to, userSettings }: Props) {
  const statsQuery = useQuery<getBalanceStatsResponse>({
    queryKey: ["overview", "stats", from, to],
    queryFn: () =>
      fetch(`/api/stats/balance?from=${DateToUTCDate(from)}&to=${DateToUTCDate(to)}`).then((res) => res.json()),
  })

  const formater = useMemo(() => {
    return GetFormaterCurrency(userSettings?.currency || "USD")
  }, [userSettings?.currency])

  const income = statsQuery.data?.income || 0
  const expense = statsQuery.data?.expense || 0
  const balance = income - expense

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <StatsCard
        formater={formater}
        value={income}
        title="Income"
        icon={<TrendingUp className="h-5 w-5" />}
        color="text-emerald-500"
        isLoading={statsQuery.isFetching}
      />
      <StatsCard
        formater={formater}
        value={expense}
        title="Expense"
        icon={<TrendingDown className="h-5 w-5" />}
        color="text-rose-500"
        isLoading={statsQuery.isFetching}
      />
      <StatsCard
        formater={formater}
        value={balance}
        title="Balance"
        icon={<Wallet className="h-5 w-5" />}
        color="text-violet-500"
        isLoading={statsQuery.isFetching}
      />
    </div>
  )
}

export default StatsCards

interface StatsCardProps {
  formater: Intl.NumberFormat
  icon: React.ReactNode
  title: string
  value: number
  color: string
  isLoading: boolean
}

function StatsCard({ formater, value, title, icon, color, isLoading }: StatsCardProps) {
  const formatFn = useCallback((value: number) => formater.format(value), [formater])

  return (
    <Card>
      <CardContent className="flex items-center justify-between p-6">
        <div className="space-y-1">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          {isLoading ? (
            <Skeleton className="h-7 w-[100px]" />
          ) : (
            <CountUp
              key={value}
              preserveValue
              end={value}
              decimals={2}
              formattingFn={formatFn}
              className={`text-2xl font-bold ${color}`}
              duration={0.8}
            />
          )}
        </div>
        <div className={`rounded-full p-3 ${color} bg-primary/10`}>{icon}</div>
      </CardContent>
    </Card>
  )
}

