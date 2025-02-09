import { createClient } from "@/app/utils/supabase/server";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect("/sign-in")
    }


    let userSettings = await prisma.userSettings.findUnique({
        where: {
            userId: user.id
        }
    })

    if (!userSettings) {
        userSettings = await prisma.userSettings.create({
            data: {
                currency: "IDR",
                userId: user.id
            }
        })
    }
    // Revalidate the home page to update the currency
    revalidatePath("/")

    return NextResponse.json(userSettings)
}

export async function POST(request: NextRequest) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect("/sign-in")
    }

    const { currency } = await request.json()

    const userSettings = await prisma.userSettings.upsert({
        where: {
            userId: user.id
        },
        update: {
            currency
        },
        create: {
            userId: user.id,
            currency
        }
    })

    revalidatePath("/")
    return NextResponse.json(userSettings)
}