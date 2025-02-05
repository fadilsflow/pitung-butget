import { ReactNode } from "react";
import { Skeleton } from "./ui/skeleton";
import { cn } from "@/lib/utils";

function SkeletonWrapper({
    children,
    isLoading,
    fulllWidth = true,
}: {
    children: ReactNode,
    isLoading: boolean,
    fulllWidth?: boolean,
}) {
    if (!isLoading) return children;

    return (
        <Skeleton className={
            cn(fulllWidth && "w-full")
        }>
            <div className="opacity-0">{children}</div>
        </Skeleton>
    )
}

export default SkeletonWrapper;