"use server"

import { createClient } from "@/app/utils/supabase/server"
import { prisma } from "@/lib/prisma"
import { UpdateUserSettingsSchema } from "@/schema/userSettings"
import { redirect } from "next/navigation"

export async function updateUserCurrency(currency: string) {
    const supabase = createClient();
    const parseBody = UpdateUserSettingsSchema.safeParse({ currency })


    if (!parseBody.success) {
        return {

        }
    }
    const user = await (await supabase).auth.getUser()

    if (!user) {
        redirect("/sign-in")
    }

    const userSettings = await prisma.userSettings.update({
        where: {
            userId: user.data.user?.id
        },
        data: {
            currency: parseBody.data.currency
        }
    })

    return userSettings
}
