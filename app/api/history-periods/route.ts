"use server"
import { createClient } from "@/app/utils/supabase/server"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import { NextRequest, NextResponse } from "next/server"

 

export async funtion GET(request: NextRequest){
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect("/sign-in")
    }
  const periods = getHistoryPeriods(user.id)
  return NextResponse.json(periods)

}

export type GetHistoryPeriodsResponseType = Awaited<ReturnType<typeof getHistoryPeriods>>

async function getHistoryPeriods( userId: String){
  const result = await prisma.monthHistory.findMany({
    where: {
      UserId: userId,
    },
    select:{
      year: true
    },
    distinct:["year"],
    orderBy: [
      {
        year: "asc"
      }
    ],

  })
  const years = result.map(el => el.year)
  if ( years.length === 0 ) {
    // Return the current year 
    return [ new Date().getFullYear()]
  }
  return years;
}


