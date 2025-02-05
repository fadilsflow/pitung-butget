"use client"

import * as React from "react"
import SkeletonWrapper from "@/components/skeleton-wrapper"
import { useMediaQuery } from "@/hooks/use-media-query"
import { Button } from "@/components/ui/button"
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command"
import {
    Drawer,
    DrawerContent,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from "@/components/ui/drawer"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { currencies, type Currency } from "@/lib/currencies"
import { useMutation, useQuery } from "@tanstack/react-query"
import { UserSettings } from "@prisma/client"
import { updateUserCurrency } from "./_action/userSettings"
import { toast } from "sonner"

export function CurrencySelect() {
    const [open, setOpen] = React.useState(false)
    const isDesktop = useMediaQuery("(min-width: 768px)")
    const [selectedOption, setSelectedOption] = React.useState<Currency | null>(null)

    const { data: userSettings, isLoading: isLoadingSettings } = useQuery<UserSettings>({
        queryKey: ["user-settings"],
        queryFn: async () => {
            const response = await fetch("/api/user-settings")
            if (!response.ok) {
                throw new Error("Failed to fetch user settings")
            }
            return response.json()
        }
    })

    React.useEffect(() => {
        if (!userSettings?.currency) return
        const userCurrency = currencies.find(
            (currency) => currency.value === userSettings.currency
        )
        if (userCurrency) setSelectedOption(userCurrency)
    }, [userSettings])

    const mutation = useMutation({
        mutationFn: updateUserCurrency,
        onMutate: () => {
            toast.loading("Updating currency...", {
                id: "update-currency"
            })
        },
        onSuccess: (data: UserSettings) => {
            setSelectedOption(
                currencies.find((c) => c.value === data.currency) || null
            )
            toast.success("Currency updated 🥳", {
                id: "update-currency"
            })
        },
        onError: () => {
            toast.error("Failed to update currency", {
                id: "update-currency"
            })
        }
    })

    const selectOption = React.useCallback((currency: Currency | null) => {
        if (!currency) return
        mutation.mutate(currency.value)
    }, [mutation])

    const isLoading = isLoadingSettings || mutation.isPending

    if (isDesktop) {
        return (
            <SkeletonWrapper isLoading={isLoading}>
                <Popover open={open} onOpenChange={setOpen}>
                    <PopoverTrigger asChild>
                        <Button variant="outline" disabled={isLoading} className="w-full justify-start">
                            {selectedOption ? selectedOption.label : "+ Set Currency"}
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[200px] p-0" align="start">
                        <OptionList setOpen={setOpen} setSelectedOption={selectOption} />
                    </PopoverContent>
                </Popover>
            </SkeletonWrapper>
        )
    }

    return (
        <SkeletonWrapper isLoading={isLoading}>
            <Drawer open={open} onOpenChange={setOpen}>
                <DrawerTrigger asChild>
                    <Button variant="outline" disabled={isLoading} className="w-[150px] justify-start">
                        {selectedOption ? selectedOption.label : "+ Set Currency"}
                    </Button>
                </DrawerTrigger>
                <DrawerContent>
                    <DrawerHeader>
                        <DrawerTitle>Select Currency</DrawerTitle>
                    </DrawerHeader>
                    <div className="mt-4 border-t">
                        <OptionList setOpen={setOpen} setSelectedOption={selectOption} />
                    </div>
                </DrawerContent>
            </Drawer>
        </SkeletonWrapper>
    )
}

interface OptionListProps {
    setOpen: (open: boolean) => void
    setSelectedOption: (currency: Currency | null) => void
}

function OptionList({ setOpen, setSelectedOption }: OptionListProps) {
    return (
        <Command className="w-full">
            <CommandInput placeholder="Filter currency..." />
            <CommandList>
                <CommandEmpty>No results found.</CommandEmpty>
                <CommandGroup>
                    {currencies.map((currency) => (
                        <CommandItem
                            key={currency.value}
                            value={currency.value}
                            onSelect={(value) => {
                                const selected = currencies.find((c) => c.value === value)
                                if (selected) {
                                    setSelectedOption(selected)
                                    setOpen(false)
                                }
                            }}
                        >
                            {currency.label}
                        </CommandItem>
                    ))}
                </CommandGroup>
            </CommandList>
        </Command>
    )
}
