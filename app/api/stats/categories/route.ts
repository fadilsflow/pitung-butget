

import { redirect } from "next/navigation";
import { createClient } from "@/app/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";
import { overviewSchema } from "@/schema/overview";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect("/sign-in")
    }

    const { searchParams } = new URL(req.url)
    const from = searchParams.get("from")
    const to = searchParams.get("to")

    const queryParams = overviewSchema.safeParse({ from, to })
    if (!queryParams.success) {
        return NextResponse.json(queryParams.error.message, {
            status: 400
        })
    }

    const stats = await getCategoriesStats(user.id, queryParams.data.from, queryParams.data.to)

    return NextResponse.json(stats)
    
}

export type getCategoriesStatsResponseType = Awaited<ReturnType<typeof getCategoriesStats>>
async function getCategoriesStats(userId: string, from: Date, to: Date) {
    const stats = await prisma.transaction.groupBy({
        by: ["type","category", "categoryIcon"],
        where: {
            UserId: userId,
            date: {
                gte: from,
                lte: to
            }
        },
        _sum: {
            amount: true
        },
        orderBy: {
            _sum: {
                amount: "desc"
            }
        }
    })

    return stats
}

