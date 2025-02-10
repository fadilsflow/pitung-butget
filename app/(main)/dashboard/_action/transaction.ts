"use server"

import { createClient } from "@/app/utils/supabase/server";
import { prisma } from "@/lib/prisma";
import { CreateTransactionSchema, CreateTransactionSchemaType } from "@/schema/transaction";
import { redirect } from "next/navigation";

export async function CreateTransaction(form: CreateTransactionSchemaType) {
    const parseBody = CreateTransactionSchema.safeParse(form);

    if (!parseBody.success) {
        throw new Error("Invalid form data");
    }

    const supabase = createClient();
    const { data: { user } } = await (await supabase).auth.getUser();

    if (!user) {
        redirect("/sign-in");
    }

    const { amount, category, date, description, type } = parseBody.data;

    // Cek apakah kategori yang dipilih valid
    const categoryRow = await prisma.category.findFirst({
        where: {
            userId: user.id,
            name: category,
        },
    });

    if (!categoryRow) {
        throw new Error("Category not found");
    }

    // Buat transaksi baru
    await prisma.$transaction([
        // Buat transaksi
        prisma.transaction.create({
            data: {
                UserId: user.id,
                amount,
                date,
                description: description || "",
                type,
                category: categoryRow.name,
                categoryIcon: categoryRow.icon,
            },
        }),
        // Update tabel MonthHistory
        prisma.monthHistory.upsert({
            where: {
                userId_day_month_year: {
                    userId: user.id,
                    day: date.getUTCDate(),
                    month: date.getUTCMonth(),
                    year: date.getUTCFullYear(),
                },
            },
            create: {
                userId: user.id,
                day: date.getUTCDate(),
                month: date.getUTCMonth(),
                year: date.getUTCFullYear(),
                expenses: type === "expense" ? amount : 0,
                income: type === "income" ? amount : 0,
            },
            update: {
                expenses: {
                    increment: type === "expense" ? amount : 0,
                },
                income: {
                    increment: type === "income" ? amount : 0,
                },
            },
        }),
        // Update tabel YearHistory
        prisma.yearHistory.upsert({
            where: {
                userId_month_year: {
                    userId: user.id,
                    month: date.getUTCMonth(),
                    year: date.getUTCFullYear(),
                },
            },
            create: {
                userId: user.id,
                month: date.getUTCMonth(),
                year: date.getUTCFullYear(),
                expenses: type === "expense" ? amount : 0,
                income: type === "income" ? amount : 0,
            },
            update: {
                expenses: {
                    increment: type === "expense" ? amount : 0,
                },
                income: {
                    increment: type === "income" ? amount : 0,
                },
            },
        }),
    ]);
}