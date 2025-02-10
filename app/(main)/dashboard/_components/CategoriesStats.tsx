"use client"

import type { getCategoriesStatsResponseType } from "@/app/api/stats/categories/route"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Skeleton } from "@/components/ui/skeleton"
import { DateToUTCDate, GetFormaterCurrency } from "@/lib/helpers"
import type { TransactionType } from "@/lib/types"
import type { UserSettings } from "@prisma/client"
import { useQuery } from "@tanstack/react-query"
import { CreditCard, TrendingDown, TrendingUp, Wallet } from "lucide-react"
import { useMemo } from "react"

function CategoriesStats({
    userSettings,
    from,
    to,
}: {
    userSettings: UserSettings
    from: Date
    to: Date
}) {
    const { data, isFetching } = useQuery<getCategoriesStatsResponseType>({
        queryKey: ["overview", "stats", "categories", from, to],
        queryFn: () =>
            fetch(`/api/stats/categories?from=${DateToUTCDate(from)}&to=${DateToUTCDate(to)}`).then((res) => res.json()),
    })

    const formater = useMemo(() => {
        return GetFormaterCurrency(userSettings?.currency || "USD")
    }, [userSettings?.currency])

    return (
        <div className="grid gap-4 md:grid-cols-2">
            <CategoriesCard format={formater} type="income" data={data || []} isLoading={isFetching} />
            <CategoriesCard format={formater} type="expense" data={data || []} isLoading={isFetching} />
        </div>
    )
}

function CategoriesCard({
    format,
    type,
    data,
    isLoading,
}: {
    format: Intl.NumberFormat
    type: TransactionType
    data: getCategoriesStatsResponseType
    isLoading: boolean
}) {
    const filteredData = data.filter((item) => item.type === type)
    const total = filteredData.reduce((acc, item) => acc + (item._sum?.amount || 0), 0)

    return (
        <Card className="flex h-[400px] flex-col">
            <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2">
                    
                    {type === "income" ? "Income" : "Expense"} Categories
                </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 overflow-hidden">
                {isLoading ? (
                    <div className="space-y-4">
                        {[...Array(5)].map((_, i) => (
                            <div key={i} className="space-y-2">
                                <Skeleton className="h-4 w-full" />
                                <Skeleton className="h-2 w-full" />
                            </div>
                        ))}
                    </div>
                ) : filteredData.length === 0 ? (
                    <div className="flex h-full flex-col items-center justify-center gap-2 text-center">
                        <p className="text-sm text-muted-foreground">📭 No transactions found</p>
                        <p className="text-xs text-muted-foreground">Try different time period or add new {type} transactions</p>
                    </div>
                ) : (
                    <ScrollArea className="h-full pr-4">
                        <div className="space-y-6">
                            {filteredData.map((item) => {
                                const amount = item._sum?.amount || 0
                                const percentage = (amount * 100) / (total || 1)

                                return (
                                    <div key={item.category} className="space-y-2">
                                        <div className="flex items-center justify-between gap-4">
                                            <div className="flex items-center gap-2">
                                                <span className="text-xl">{item.categoryIcon}</span>
                                                <span className="font-medium">{item.category}</span>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-medium">{format.format(amount)}</p>
                                                <p className="text-xs text-muted-foreground">{percentage.toFixed(1)}%</p>
                                            </div>
                                        </div>
                                        <div className="h-2 w-full rounded-full bg-secondary">
                                            <div
                                                className={`h-full rounded-full transition-all duration-500 ${type === "income" ? "bg-emerald-500" : "bg-rose-500"
                                                    }`}
                                                style={{ width: `${percentage}%` }}
                                            />
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </ScrollArea>
                )}
            </CardContent>
        </Card>
    )
}

export default CategoriesStats

