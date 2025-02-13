"use client"
import { Card, CardHeader } from "@/components/ui/card";
import { GetFormaterCurrency } from "@/lib/helpers";
import { Period, Timeframe } from "@/lib/types";
import { UserSettings } from "@prisma/client";
import { useMemo, useState } from "react";

function History({ userSettings } : {userSettings: UserSettings}) {
  const [ timeframe, setTimeframe ] = useState<Timeframe>("month")
  const [ period, setPeriod ] = useState<Period>{
    month: new Date().getMonth(),
    year: new Date().getFullYear(),
  }

  const formatter = useMemo( () => {
    return GetFormaterCurrency(userSettings.currency)
  },[userSettings.currency])
  
  return (
  <div className="container">
      <h2 className="mt-12 text-3xl font-bold">History</h2>
      <Card className="col-span-12 mt-2 w-full">
        <CardHeader className="gap-2">
          <CardTitle className="grid grid-flow-row justify-between gap-2 md:grid-flow-col">
            <HistoryPeriodSelector period={period} setPeriod={setPeriod} timeframe={timeframe) setTimeframe={setTimeframe}/>
          </CardTitle>
        </CardHeader>
      </Card>
    </div>
  )

}

export default History
