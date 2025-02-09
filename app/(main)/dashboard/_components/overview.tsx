"use client"

import { UserSettings } from "@prisma/client";
import { startOfMonth } from "date-fns";
import { useState } from "react";

function Overview({ userSettings }: { userSettings: UserSettings }) {
    const [ dateRange, setDateRange ] = useState<{ from: Date; to: Date }>({
        from: startOfMonth( new Date()),
        to: new Date(),
    })
    
    return (
        <div>
            <h1>Overview</h1>
        </div>
    )
}

export default Overview;