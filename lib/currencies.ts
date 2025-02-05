export interface Currency {
    value: string
    label: string
}

export const currencies: Currency[] = [
    {
        value: "IDR",
        label: "Rp Rupiah",
        locale: "id-ID",
    },
    {
        value: "USD",
        label: "$ Dollar",
        locale: "en-US",
    },
    {
        value: "EUR",
        label: "€ Euro",
        locale: "en-EU",
    },
    {
        value: "JPY",
        label: "¥ Yen",
        locale: "ja-JP",
    }
]

export type currency = (typeof currencies)[0]