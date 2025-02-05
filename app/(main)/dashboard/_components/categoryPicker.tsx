import { TransactionType } from "@/lib/types"
import { useState } from "react"
import { useQuery } from "@tanstack/react-query";


interface Props {
    type: TransactionType,

}
function CategoryPicker({ type }: { type: Props }) {
    const [ open, setOpen ] = useState(false)
    const [ value, setValue ] = useState<string>("")
    
    const categoriesQuery = useQuery({
        queryKey: ["categories", type],
        queryFn: () =>
            fetch(`/api/categories?type=${type}`).then(res =>
                res.json())
    })
    return (
        <div>categories</div>
    )
}


export default CategoryPicker;