import { currencies } from "./currencies"

export function DateToUTCDate(date: Date) {
    return new Date(
        Date.UTC(
            date.getUTCFullYear(),
            date.getUTCMonth(),
            date.getUTCHours(),
            date.getUTCMinutes(),
            date.getUTCSeconds(),
            date.getUTCMilliseconds()
        )
    )
}

export function GetFormaterCurrency(currency: string) {
    const locale = currencies.find(c => c.value === currency)?.locale;

    return new Intl.NumberFormat(locale, {
        style: "currency",
        currency
    })
}