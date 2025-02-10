import { createClient } from "@/app/utils/supabase/server";
import { prisma } from "@/lib/prisma";
import { overviewSchema } from "@/schema/overview";
import { redirect } from "next/navigation";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect("/sign-in")
    }

    const { searchParams } = new URL(request.url)
    const from = searchParams.get("from")
    const to = searchParams.get("to")

    const queryParams = overviewSchema.safeParse({ from, to })
    if (!queryParams.success) {
        return NextResponse.json(queryParams.error.message, {
            status: 400
        })
    }

    const stats = await getBalanceStats(
        user.id,
        queryParams.data.from,
        queryParams.data.to
    )

    return NextResponse.json(stats)

}
export type getBalanceStatsResponse = Awaited<ReturnType<typeof getBalanceStats>>

async function getBalanceStats(
    userId: string,
    from: Date,
    to: Date
) {
    const totals = await prisma.transaction.groupBy({
        by: ["type"],
        where: {
            UserId: userId,
            date: {
                gte: from,
                lte: to
            }
        },
        _sum: {
            amount: true
        }
    })
    return {
        expense: totals.find((t) => t.type === "expense")?._sum.amount || 0,
        income: totals.find((t) => t.type === "income")?._sum.amount || 0,
    }

}
