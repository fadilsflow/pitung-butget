"use client"

import { UserSettings } from "@prisma/client";
import { startOfMonth } from "date-fns";
import { useState } from "react";
import { DateRangePicker } from "@/components/ui/date-range-picker";
function Overview({ userSettings }: { userSettings: UserSettings }) {
    const [dateRange, setDateRange] = useState<{ from: Date; to: Date }>({
        from: startOfMonth(new Date()),
        to: new Date(),
    })

    return (
        <>
            <div className="container flex flex-wrap items-center justify-between gap-2 py-6">
                <div className="flex flex-wrap items-center gap-6">
                    <h2 className="text-3xl font-bold">Overview</h2>
                    <div className="flex items-center gap-3">
                        <DateRangePicker

                        />
                    </div>
                </div>
            </div>
        </>
    )
}

export default Overview;