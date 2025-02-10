/* eslint-disable max-lines */
'use client'

import React, { type FC, useState, useEffect, useRef } from 'react'
import { Button } from './button'
import { Popover, PopoverContent, PopoverTrigger } from './popover'
import { Calendar } from './calendar'
import { DateInput } from './date-input'
import { Label } from './label'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from './select'
import { Switch } from './switch'
import { ChevronUpIcon, ChevronDownIcon, CheckIcon } from '@radix-ui/react-icons'
import { cn } from '@/lib/utils'

export interface DateRangePickerProps {
    /** Click handler for applying the updates from DateRangePicker. */
    onUpdate?: (values: { range: DateRange, rangeCompare?: DateRange }) => void
    /** Initial value for start date */
    initialDateFrom?: Date | string
    /** Initial value for end date */
    initialDateTo?: Date | string
    /** Initial value for start date for compare */
    initialCompareFrom?: Date | string
    /** Initial value for end date for compare */
    initialCompareTo?: Date | string
    /** Alignment of popover */
    align?: 'start' | 'center' | 'end'
    /** Option for locale */
    locale?: string
    /** Option for showing compare feature */
    showCompare?: boolean
}

const formatDate = (date: Date, locale: string = 'en-us'): string => {
    return date.toLocaleDateString(locale, {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
    })
}

const getDateAdjustedForTimezone = (dateInput: Date | string): Date => {
    if (typeof dateInput === 'string') {
        // Split the date string to get year, month, and day parts
        const parts = dateInput.split('-').map((part) => parseInt(part, 10))
        // Create a new Date object using the local timezone
        // Note: Month is 0-indexed, so subtract 1 from the month part
        const date = new Date(parts[0], parts[1] - 1, parts[2])
        return date
    } else {
        // If dateInput is already a Date object, return it directly
        return dateInput
    }
}

interface DateRange {
    from: Date
    to: Date | undefined
}

interface Preset {
    name: string
    label: string
}

// Define presets
const PRESETS: Preset[] = [
    { name: 'today', label: 'Today' },
    { name: 'yesterday', label: 'Yesterday' },
    { name: 'last7', label: 'Last 7 days' },
    { name: 'last14', label: 'Last 14 days' },
    { name: 'last30', label: 'Last 30 days' },
    { name: 'thisWeek', label: 'This Week' },
    { name: 'lastWeek', label: 'Last Week' },
    { name: 'thisMonth', label: 'This Month' },
    { name: 'lastMonth', label: 'Last Month' }
]

/** The DateRangePicker component allows a user to select a range of dates */
export const DateRangePicker: FC<DateRangePickerProps> & {
    filePath: string
} = ({
    initialDateFrom = new Date(new Date().setHours(0, 0, 0, 0)),
    initialDateTo,
    initialCompareFrom,
    initialCompareTo,
    onUpdate,
    align = 'end',
    locale = 'en-US',
    showCompare = true
}): JSX.Element => {
        const [isOpen, setIsOpen] = useState(false)

        const [range, setRange] = useState<DateRange>({
            from: getDateAdjustedForTimezone(initialDateFrom),
            to: initialDateTo
                ? getDateAdjustedForTimezone(initialDateTo)
                : getDateAdjustedForTimezone(initialDateFrom)
        })
        const [rangeCompare, setRangeCompare] = useState<DateRange | undefined>(
            initialCompareFrom
                ? {
                    from: new Date(new Date(initialCompareFrom).setHours(0, 0, 0, 0)),
                    to: initialCompareTo
                        ? new Date(new Date(initialCompareTo).setHours(0, 0, 0, 0))
                        : new Date(new Date(initialCompareFrom).setHours(0, 0, 0, 0))
                }
                : undefined
        )

        // Refs to store the values of range and rangeCompare when the date picker is opened
        const openedRangeRef = useRef<DateRange | undefined>()
        const openedRangeCompareRef = useRef<DateRange | undefined>()

        const [selectedPreset, setSelectedPreset] = useState<string | undefined>(undefined)

        const [isSmallScreen, setIsSmallScreen] = useState(
            typeof window !== 'undefined' ? window.innerWidth < 960 : false
        )

        useEffect(() => {
            const handleResize = (): void => {
                setIsSmallScreen(window.innerWidth < 960)
            }

            window.addEventListener('resize', handleResize)

            // Clean up event listener on unmount
            return () => {
                window.removeEventListener('resize', handleResize)
            }
        }, [])

        const getPresetRange = (presetName: string): DateRange => {
            const preset = PRESETS.find(({ name }) => name === presetName)
            if (!preset) throw new Error(`Unknown date range preset: ${presetName}`)
            const from = new Date()
            const to = new Date()
            const first = from.getDate() - from.getDay()

            switch (preset.name) {
                case 'today':
                    from.setHours(0, 0, 0, 0)
                    to.setHours(23, 59, 59, 999)
                    break
                case 'yesterday':
                    from.setDate(from.getDate() - 1)
                    from.setHours(0, 0, 0, 0)
                    to.setDate(to.getDate() - 1)
                    to.setHours(23, 59, 59, 999)
                    break
                case 'last7':
                    from.setDate(from.getDate() - 6)
                    from.setHours(0, 0, 0, 0)
                    to.setHours(23, 59, 59, 999)
                    break
                case 'last14':
                    from.setDate(from.getDate() - 13)
                    from.setHours(0, 0, 0, 0)
                    to.setHours(23, 59, 59, 999)
                    break
                case 'last30':
                    from.setDate(from.getDate() - 29)
                    from.setHours(0, 0, 0, 0)
                    to.setHours(23, 59, 59, 999)
                    break
                case 'thisWeek':
                    from.setDate(first)
                    from.setHours(0, 0, 0, 0)
                    to.setHours(23, 59, 59, 999)
                    break
                case 'lastWeek':
                    from.setDate(from.getDate() - 7 - from.getDay())
                    to.setDate(to.getDate() - to.getDay() - 1)
                    from.setHours(0, 0, 0, 0)
                    to.setHours(23, 59, 59, 999)
                    break
                case 'thisMonth':
                    from.setDate(1)
                    from.setHours(0, 0, 0, 0)
                    to.setHours(23, 59, 59, 999)
                    break
                case 'lastMonth':
                    from.setMonth(from.getMonth() - 1)
                    from.setDate(1)
                    from.setHours(0, 0, 0, 0)
                    to.setDate(0)
                    to.setHours(23, 59, 59, 999)
                    break
            }

            return { from, to }
        }

        const setPreset = (preset: string): void => {
            const range = getPresetRange(preset)
            setRange(range)
            if (rangeCompare) {
                const rangeCompare = {
                    from: new Date(
                        range.from.getFullYear() - 1,
                        range.from.getMonth(),
                        range.from.getDate()
                    ),
                    to: range.to
                        ? new Date(
                            range.to.getFullYear() - 1,
                            range.to.getMonth(),
                            range.to.getDate()
                        )
                        : undefined
                }
                setRangeCompare(rangeCompare)
            }
        }

        const checkPreset = (): void => {
            for (const preset of PRESETS) {
                const presetRange = getPresetRange(preset.name)

                const normalizedRangeFrom = new Date(range.from);
                normalizedRangeFrom.setHours(0, 0, 0, 0);
                const normalizedPresetFrom = new Date(
                    presetRange.from.setHours(0, 0, 0, 0)
                )

                const normalizedRangeTo = new Date(range.to ?? 0);
                normalizedRangeTo.setHours(0, 0, 0, 0);
                const normalizedPresetTo = new Date(
                    presetRange.to?.setHours(0, 0, 0, 0) ?? 0
                )

                if (
                    normalizedRangeFrom.getTime() === normalizedPresetFrom.getTime() &&
                    normalizedRangeTo.getTime() === normalizedPresetTo.getTime()
                ) {
                    setSelectedPreset(preset.name)
                    return
                }
            }

            setSelectedPreset(undefined)
        }

        const resetValues = (): void => {
            setRange({
                from:
                    typeof initialDateFrom === 'string'
                        ? getDateAdjustedForTimezone(initialDateFrom)
                        : initialDateFrom,
                to: initialDateTo
                    ? typeof initialDateTo === 'string'
                        ? getDateAdjustedForTimezone(initialDateTo)
                        : initialDateTo
                    : typeof initialDateFrom === 'string'
                        ? getDateAdjustedForTimezone(initialDateFrom)
                        : initialDateFrom
            })
            setRangeCompare(
                initialCompareFrom
                    ? {
                        from:
                            typeof initialCompareFrom === 'string'
                                ? getDateAdjustedForTimezone(initialCompareFrom)
                                : initialCompareFrom,
                        to: initialCompareTo
                            ? typeof initialCompareTo === 'string'
                                ? getDateAdjustedForTimezone(initialCompareTo)
                                : initialCompareTo
                            : typeof initialCompareFrom === 'string'
                                ? getDateAdjustedForTimezone(initialCompareFrom)
                                : initialCompareFrom
                    }
                    : undefined
            )
        }

        useEffect(() => {
            checkPreset()
        }, [range])

        const PresetButton = ({
            preset,
            label,
            isSelected
        }: {
            preset: string
            label: string
            isSelected: boolean
        }): JSX.Element => (
            <Button
                className={cn(isSelected && 'pointer-events-none')}
                variant="ghost"
                onClick={() => {
                    setPreset(preset)
                }}
            >
                <>
                    <span className={cn('pr-2 opacity-0', isSelected && 'opacity-70')}>
                        <CheckIcon width={18} height={18} />
                    </span>
                    {label}
                </>
            </Button>
        )

        // Helper function to check if two date ranges are equal
        const areRangesEqual = (a?: DateRange, b?: DateRange): boolean => {
            if (!a || !b) return a === b // If either is undefined, return true if both are undefined
            return (
                a.from.getTime() === b.from.getTime() &&
                (!a.to || !b.to || a.to.getTime() === b.to.getTime())
            )
        }

        useEffect(() => {
            if (isOpen) {
                openedRangeRef.current = range
                openedRangeCompareRef.current = rangeCompare
            }
        }, [isOpen])

        return (
            <Popover
                modal={true}
                open={isOpen}
                onOpenChange={(open: boolean) => {
                    if (!open) {
                        resetValues()
                    }
                    setIsOpen(open)
                }}
            >
                <PopoverTrigger asChild>
                    <Button
                        variant="outline"
                    >
                        <div className="flex items-center gap-2 ">
                            <div className="text-right">
                                <div>
                                    {`${formatDate(range.from, locale)}${range.to != null ? ' - ' + formatDate(range.to, locale) : ''}`}
                                </div>
                                {rangeCompare != null && (
                                    <div className="opacity-60 text-[8px]">
                                        vs. {formatDate(rangeCompare.from, locale)}
                                        {rangeCompare.to != null ? ` - ${formatDate(rangeCompare.to, locale)}` : ''}
                                    </div>
                                )}
                            </div>
                            <ChevronDownIcon className="h-3 w-3 opacity-50" />
                        </div>
                    </Button>
                </PopoverTrigger>
                <PopoverContent align={align} className="w-auto p-1.5">
                    <div className="space-y-1.5">
                        {/* Compare Switch */}
                        <div className="flex items-center justify-center px-1 ">
                            {showCompare && (
                                <div className="flex items-center gap-1">
                                    <Switch
                                        className="scale-[0.6]"
                                        defaultChecked={Boolean(rangeCompare)}
                                        onCheckedChange={(checked: boolean) => {
                                            if (checked) {
                                                if (!range.to) {
                                                    setRange({
                                                        from: range.from,
                                                        to: range.from
                                                    })
                                                }
                                                setRangeCompare({
                                                    from: new Date(
                                                        range.from.getFullYear(),
                                                        range.from.getMonth(),
                                                        range.from.getDate() - 365
                                                    ),
                                                    to: range.to
                                                        ? new Date(
                                                            range.to.getFullYear() - 1,
                                                            range.to.getMonth(),
                                                            range.to.getDate()
                                                        )
                                                        : new Date(
                                                            range.from.getFullYear() - 1,
                                                            range.from.getMonth(),
                                                            range.from.getDate()
                                                        )
                                                })
                                            } else {
                                                setRangeCompare(undefined)
                                            }
                                        }}
                                        id="compare-mode"
                                    />
                                    <Label htmlFor="compare-mode" className="text-[9px]">Compare</Label>
                                </div>
                            )}
                        </div>

                        {/* Mobile Preset Select */}
                        {isSmallScreen && (
                            <div className="flex justify-center px-1">
                                <Select
                                    defaultValue={selectedPreset}
                                    onValueChange={setPreset}
                                >
                                    <SelectTrigger className="h-6 text-[9px] px-2 w-[120px]">
                                        <SelectValue placeholder="Preset..." />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {PRESETS.map((preset) => (
                                            <SelectItem
                                                key={preset.name}
                                                value={preset.name}
                                                className="text-[9px] h-6"
                                            >
                                                {preset.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        )}

                        {/* Date Inputs */}
                        <div className="flex flex-col items-center gap-1 px-1">
                            <div className="flex gap-1">
                                <DateInput
                                    value={range.from}
                                    onChange={(date) => {
                                        const toDate =
                                            range.to == null || date > range.to ? date : range.to
                                        setRange((prevRange) => ({
                                            ...prevRange,
                                            from: date,
                                            to: toDate
                                        }))
                                    }}
                                    className="h-6 text-[9px]"
                                />
                                <div className="py-1 text-[9px]">-</div>
                                <DateInput
                                    value={range.to}
                                    onChange={(date) => {
                                        const fromDate = date < range.from ? date : range.from
                                        setRange((prevRange) => ({
                                            ...prevRange,
                                            from: fromDate,
                                            to: date
                                        }))
                                    }}
                                    className="h-6 text-[9px]"
                                />
                            </div>
                            {rangeCompare && (
                                <div className="flex gap-1 ">
                                    <DateInput
                                        value={rangeCompare.from}
                                        onChange={(date) => {
                                            if (rangeCompare) {
                                                const compareToDate =
                                                    rangeCompare.to == null || date > rangeCompare.to
                                                        ? date
                                                        : rangeCompare.to
                                                setRangeCompare((prevRangeCompare) => ({
                                                    ...prevRangeCompare,
                                                    from: date,
                                                    to: compareToDate
                                                }))
                                            } else {
                                                setRangeCompare({
                                                    from: date,
                                                    to: new Date()
                                                })
                                            }
                                        }}
                                        className="h-6 text-[9px]"
                                    />
                                    <div className="py-1 text-[9px]">-</div>
                                    <DateInput
                                        value={rangeCompare.to}
                                        onChange={(date) => {
                                            if (rangeCompare && rangeCompare.from) {
                                                const compareFromDate =
                                                    date < rangeCompare.from
                                                        ? date
                                                        : rangeCompare.from
                                                setRangeCompare({
                                                    ...rangeCompare,
                                                    from: compareFromDate,
                                                    to: date
                                                })
                                            }
                                        }}
                                        className="h-6 text-[9px]"
                                    />
                                </div>
                            )}
                        </div>

                        {/* Calendar and Presets */}
                        <div className="flex justify-center gap-1.5 ">
                            <div className="rounded-md border">
                                <Calendar
                                    mode="range"
                                    selected={range}
                                    onSelect={(value) => {
                                        if (value?.from) setRange({ from: value.from, to: value?.to })
                                    }}
                                    numberOfMonths={isSmallScreen ? 1 : 2}
                                    className="p-0"
                                    classNames={{
                                        months: "flex flex-col sm:flex-row space-y-1 sm:space-x-1 sm:space-y-0",
                                        month: "space-y-1",
                                        caption: "flex justify-center pt-1 relative items-center text-[10px]",
                                        caption_label: "text-[10px] font-medium",
                                        nav: "space-x-1 flex items-center",
                                        nav_button: "h-5 w-5 bg-transparent p-0 hover:opacity-70",
                                        nav_button_previous: "absolute left-1",
                                        nav_button_next: "absolute right-1",
                                        table: "w-full border-collapse space-y-0.5",
                                        head_row: "flex",
                                        head_cell: "text-muted-foreground rounded-md w-7 h-6 text-[9px] font-normal",
                                        row: "flex w-full mt-0.5",
                                        cell: "text-center text-[10px] p-0 relative first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
                                        day: "h-6 w-6 p-0 font-normal aria-selected:opacity-100",
                                        day_selected: "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
                                        day_today: "bg-accent text-accent-foreground",
                                        day_outside: "text-muted-foreground opacity-50",
                                        day_disabled: "text-muted-foreground opacity-50",
                                        day_range_middle: "aria-selected:bg-accent aria-selected:text-accent-foreground",
                                        day_hidden: "invisible",
                                    }}
                                />
                            </div>

                            {!isSmallScreen && (
                                <div className="flex flex-col gap-0.5 min-w-[90px] rounded-md border">
                                    {PRESETS.map((preset) => (
                                        <Button
                                            key={preset.name}
                                            onClick={() => setPreset(preset.name)}
                                            variant="ghost"
                                            className={cn(
                                                "h-5 text-[9px] justify-start px-2",
                                                selectedPreset === preset.name && "bg-accent text-accent-foreground"
                                            )}
                                        >
                                            {preset.label}
                                        </Button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Action Buttons */}
                        <div className="flex justify-center gap-1 pt-1 px-1 ">
                            <Button
                                onClick={() => {
                                    setIsOpen(false)
                                    resetValues()
                                }}
                                variant="ghost"
                                className="h-6 text-[9px] px-2"
                            >
                                Cancel
                            </Button>
                            <Button
                                onClick={() => {
                                    setIsOpen(false)
                                    if (!areRangesEqual(range, openedRangeRef.current) ||
                                        !areRangesEqual(rangeCompare, openedRangeCompareRef.current)) {
                                        onUpdate?.({ range, rangeCompare })
                                    }
                                }}
                                className="h-6 text-[9px] px-2"
                            >
                                Update
                            </Button>
                        </div>
                    </div>
                </PopoverContent>
            </Popover>
        )
    }

DateRangePicker.displayName = 'DateRangePicker'
DateRangePicker.filePath =
    'libs/shared/ui-kit/src/lib/date-range-picker/date-range-picker.tsx'