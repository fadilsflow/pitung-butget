"use server"

import { createClient } from "@/app/utils/supabase/server";
import { prisma } from "@/lib/prisma";
import { CreateCategorySchema } from "@/schema/categories";
import { redirect } from "next/navigation";

export async function createCategory(form: CreateCategorySchema) {
    const supabase = createClient()
    const { data: { user } } = await (await supabase).auth.getUser()
    const parseBody = CreateCategorySchema.safeParse(form)
    if (!parseBody.success) {
        throw new Error("bad request")
    }

    if (!user) {
        redirect("/sign-in")
    }

    const { name, icon, type } = parseBody.data

    return await prisma.category.create({
        data: {
            userId: user.id,
            name,
            icon,
            type
        }
    })


}