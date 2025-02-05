import { prisma } from "@/lib/prisma";
import { createClient } from "@/app/utils/supabase/server";
import { redirect } from "next/navigation";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

export async function GET(request: NextRequest) {
    const supabase = createClient()
    const { data: { user } } = await (await supabase).auth.getUser()

    if (!user) {
        redirect("/sign-in")
    }
    const { searchParams } = new URL(request.url)
    const paramType = searchParams.get("type")

    const validator = z.enum(["income", "expense"]).nullable()
    const queryParams = validator.safeParse(paramType)
    if (!queryParams.success) {
        return NextResponse.json({ error: "Invalid type" }, { status: 400 })
    }

    const type = queryParams.data

    const categories = await prisma.category.findMany({
        where: {
            userId: user.id,
            ...(type && { type }) // include type in the filters if it's defined
        },
        orderBy: {
            name: "asc"
        }
    })

    return NextResponse.json(categories)


}