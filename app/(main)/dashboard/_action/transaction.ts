"use server"

import { createClient } from "@/app/utils/supabase/server";
import { prisma } from "@/lib/prisma";
import { CreateTransactionSchema, CreateTransactionSchemaType } from "@/schema/transaction";
import { redirect } from "next/navigation";

export async function CreateTransaction(form: CreateTransactionSchemaType) {
    const parseBody = CreateTransactionSchema.safeParse(form)

    if (!parseBody.success) {
        throw new Error("Invalid form data")
    }

    const supabase = createClient()
    const { data: { user } } = await (await supabase).auth.getUser()
    if (!user) {
        redirect("/sign-in")
    }

    const { amount, category, date, description, type } = parseBody.data;

    const categoryRow = await prisma.category.findFirst({
        where: {
            userId: user.id,
            name: category,
        }
    })

    if (!categoryRow) {
        throw new Error("category not found")
    }


    await prisma.$transaction([
        // create user transaction
        prisma.transaction.create({
            data: {
                UserId: user.id,
                amount,
                date,
                description: description || "",
                type,
                category: categoryRow.name,
                categoryIcon: categoryRow.icon,

            }
        }),
        // update  month aggregate table
        prisma.monthHistory.upsert({
            where: {
                userId_day_month_year: {
                    userId: user.id,
                    day: date.getUTCDate(),
                    month: date.getUTCMonth(),
                    year: date.getUTCFullYear(),
                }
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
            }

        }),
        // update year agregate table

        prisma.yearHistory.upsert({
            where: {
                userId_month_year: {
                    userId: user.id,
                    month: date.getUTCMonth(),
                    year: date.getUTCFullYear(),
                }
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
            }

        })


    ])

}