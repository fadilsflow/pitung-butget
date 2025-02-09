"use client"

import { DateToUTCDate, GetFormaterCurrency } from "@/lib/helpers"
import { UserSettings } from "@prisma/client"
import { useQuery } from "@tanstack/react-query"
import { TrendingDown, TrendingUp, Wallet } from "lucide-react"
import { useCallback, useMemo } from "react"
import CountUp from "react-countup"
import { Card } from "@/components/ui/card"
import SkeletonWrapper from "@/components/skeleton-wrapper"
import { getBalanceStatsResponse } from "@/app/api/stats/balance/route"


interface props {
    from: Date
    to: Date
    userSettings: UserSettings
}


function StatsCards({
    from,
    to,
    userSettings
}: props) {
    const statsQuery = useQuery<getBalanceStatsResponse>({
        queryKey: ["overview", "stats", from, to],
        queryFn: () => fetch(`/api/stats/balance?from=${DateToUTCDate(from)}&to=${DateToUTCDate(to)}`
        ).then((res) => res.json())
    });

    const formater = useMemo(() => {
        return GetFormaterCurrency(userSettings?.currency || 'USD');
    }, [userSettings?.currency]);

    const income = statsQuery.data?.income || 0;
    const expense = statsQuery.data?.expense || 0;

    const balance = income - expense;


    return (

        <div className="relative flex w-full flex-wrap gap-2 md:flex-nowrap">


            <SkeletonWrapper isLoading={statsQuery.isFetching}>
                <StatsCard
                    formater={formater}
                    value={income}
                    title="Income"
                    icon={<TrendingUp className="h-12 w-12 items-center rounded-lg p-2" />}
                    color="bg-emerald-500/15 text-emerald-500"

                />
            </SkeletonWrapper>
            <SkeletonWrapper isLoading={statsQuery.isFetching}>
                <StatsCard
                    formater={formater}
                    value={expense}
                    title="Expense"
                    icon={<TrendingDown className="h-12 w-12" />}
                    color="bg-rose-500/15 text-rose-500"
                />
            </SkeletonWrapper>
            <SkeletonWrapper isLoading={statsQuery.isFetching}>
                <StatsCard
                    formater={formater}
                    value={balance}
                    title="Balance"
                    icon={<Wallet className="h-12 w-12" />}
                    color="bg-violet-500/15 text-violet-500"
                />
            </SkeletonWrapper>

        </div>
    )
}



export default StatsCards;

function StatsCard({
    formater,
    value,
    title,
    icon,
    color
}: {
    formater: Intl.NumberFormat,
    icon: React.ReactNode
    title: string,
    value: number,
    color: string
}) {

    const formatFn = useCallback(
        (value: number) => formater.format(value), // ✅ Ambil nilai dari animasi
        [formater]
    )
    return (
        <Card className={` w-full  flex h-24 items-center gap-2 p-4`}>
            <div className={`rounded-lg p-3 ${color}`}>
                {icon}
            </div>

            <div className="flex flex-col justify-between gap-0"></div>
            <div className="flex flex-col gap-2">
                <p className="text-sm font-medium">{title}</p>
                <CountUp
                    key={value}
                    preserveValue
                    redraw={false}
                    end={value}
                    decimals={2}
                    formattingFn={formatFn}
                    className="text-2xl font-bold tracking-tighter"
                    duration={0.8}
                />
            </div>
        </Card>
    )
}