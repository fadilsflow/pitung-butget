import { getCategoriesStatsResponseType } from "@/app/api/stats/categories/route";
import SkeletonWrapper from "@/components/skeleton-wrapper";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { DateToUTCDate, GetFormaterCurrency } from "@/lib/helpers";
import { TransactionType } from "@/lib/types";
import { UserSettings } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";

function CategoriesStats({ userSettings, from, to }: {
    userSettings: UserSettings,
    from: Date,
    to: Date
}) {
    const { data, isFetching } = useQuery<getCategoriesStatsResponseType>({
        queryKey: ["overview", "stats", "categories", from, to],
        queryFn: () => fetch(
            `/api/stats/categories?from=${DateToUTCDate(from)}&to=${DateToUTCDate(to)}`
        ).then((res) => res.json())
    });

    const formater = useMemo(() => {
        return GetFormaterCurrency(userSettings?.currency || 'USD');
    }, [userSettings?.currency]);

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 w-full">
            <SkeletonWrapper isLoading={isFetching}>
                <CategoriesCard
                    format={formater}
                    type="income"
                    data={data || []}
                />
            </SkeletonWrapper>
            
            <SkeletonWrapper isLoading={isFetching}>
                <CategoriesCard
                    format={formater}
                    type="expense"
                    data={data || []}
                />
            </SkeletonWrapper>
        </div>
    );
}

function CategoriesCard({ format, type, data }: {
    format: Intl.NumberFormat
    type: TransactionType,
    data: getCategoriesStatsResponseType
}) {
    const filteredData = data.filter((item) => item.type === type);
    const total = filteredData.reduce((acc, item) => acc + (item._sum?.amount || 0), 0);

    return (
        <Card className="h-[400px] flex flex-col">
            <CardHeader className="pb-4">
                <CardTitle className="text-xl font-semibold">
                    {type === "income" ? "🏦 Income" : "💸 Expense"} Categories
                </CardTitle>
            </CardHeader>
            
            <div className="flex-1 px-6 pb-4">
                {filteredData.length === 0 ? (
                    <div className="flex h-full flex-col items-center justify-center gap-2 text-center">
                        <p className="text-muted-foreground text-sm">
                            📭 No transactions found
                        </p>
                        <p className="text-xs text-muted-foreground">
                            Try different time period or add new {type} transactions
                        </p>
                    </div>
                ) : (
                    <ScrollArea className="h-[300px]">
                        <div className="space-y-6 pr-4">
                            {filteredData.map((item) => {
                                const amount = item._sum?.amount || 0;
                                const percentage = (amount * 100) / (total || 1);
                                
                                return (
                                    <div key={item.category} className="space-y-1">
                                        <div className="flex items-center justify-between gap-4">
                                            <div className="flex items-center gap-2">
                                                <span className="text-xl">
                                                    {item.categoryIcon}
                                                </span>
                                                <span className="font-medium">
                                                    {item.category}
                                                </span>
                                            </div>
                                            
                                            <div className="text-right">
                                                <p className="font-medium">
                                                    {format.format(amount)}
                                                </p>
                                                <p className="text-xs text-muted-foreground">
                                                    {percentage.toFixed(1)}%
                                                </p>
                                            </div>
                                        </div>
                                        
                                        <Progress 
                                            value={percentage}
                                            indicator={type === "income" 
                                                ? "bg-green-500" 
                                                : "bg-red-500"}
                                            className="h-2 transition-all duration-500"
                                        />
                                    </div>
                                );
                            })}
                        </div>
                    </ScrollArea>
                )}
            </div>
        </Card>
    );
}

export default CategoriesStats;