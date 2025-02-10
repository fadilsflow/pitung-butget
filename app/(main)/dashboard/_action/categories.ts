"use server"

import { createClient } from "@/app/utils/supabase/server";
import { prisma } from "@/lib/prisma";
import { CreateCategorySchema } from "@/schema/categories";
import { redirect } from "next/navigation";

export async function createCategory(form: CreateCategorySchema) {
    const supabase = createClient();
    const { data: { user } } = await (await supabase).auth.getUser();
    const parseBody = CreateCategorySchema.safeParse(form);

    if (!parseBody.success) {
        throw new Error("Bad request");
    }

    if (!user) {
        redirect("/sign-in");
    }

    const { name, icon, type } = parseBody.data;

    // Cek apakah kategori dengan nama yang sama sudah ada
    const existingCategory = await prisma.category.findFirst({
        where: {
            userId: user.id,
            name,
            type,
        },
    });

    if (existingCategory) {
        throw new Error("Category with this name already exists");
    }

    // Buat kategori baru
    return await prisma.category.create({
        data: {
            userId: user.id,
            name,
            icon,
            type,
        },
    });
}