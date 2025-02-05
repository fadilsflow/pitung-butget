"use client"

import { TransactionType } from "@/lib/types"
import { useCallback, useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { CreateCategorySchema } from "@/schema/categories"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { cn } from "@/lib/utils"
import { CircleOff, Loader2, PlusSquare } from "lucide-react"
import { Form, FormField, FormItem, FormLabel, FormControl, FormDescription } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover"
import Picker from "@emoji-mart/react"
import data from "@emoji-mart/data"
import { DialogClose } from "@radix-ui/react-dialog"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { createCategory } from "../_action/categories"
import { Category } from "@prisma/client"
import { toast } from "sonner"
import { useTheme } from "next-themes"

interface Props {
    type: TransactionType
    SuccesCallback?: (category: Category) => void
}

function CreateCategoryDialog({ type, SuccesCallback }: Props) {
    const [open, setOpen] = useState(false)
    const form = useForm<CreateCategorySchema>({
        resolver: zodResolver(CreateCategorySchema),
        defaultValues: {
            type,
            name: "",
            icon: "",
        }
    })
    const queryClient = useQueryClient()
    const theme = useTheme()
    const { mutate, isPending } = useMutation({
        mutationFn: createCategory,
        onMutate: () => {
            toast.loading("Creating category...", {
                id: "create-category"
            })
        },
        onSuccess: async (data: Category) => {
            form.reset({
                name: "",
                icon: "",
                type
            })
            toast.success(`Category ${data.name} created successfully`, {
                id: "create-category"
            })
            queryClient.invalidateQueries({
                queryKey: ["categories"]
            })
            SuccesCallback?.(data)
        },
        onError: (error) => {
            toast.error("Failed to create category", {
                id: "create-category"
            })
        },
        onSettled: () => {
            setOpen((prev) => !prev)
        }
    })

    const onSubmit = useCallback((data: CreateCategorySchema) => {
        mutate(data)
    }, [mutate])

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant={"ghost"}><PlusSquare className="mr-2 w-4 h-4" />Create new</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogTitle>
                    Create <span className={cn("capitalize", type === "income" ? "text-green-500" : "text-red-500")}>{type}</span> category
                </DialogTitle>
                <DialogDescription>
                    Create a new category to categorize your transactions.
                </DialogDescription>
                <Form {...form}>
                    <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Name</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Category name"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormDescription>
                                        This is how your category will be displayed in the app
                                    </FormDescription>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="icon"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Icon</FormLabel>
                                    <FormControl>
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <Button variant={"outline"} className="w-full h-[100px] p-0">
                                                    {form.watch("icon") ? (
                                                        <div className="flex flex-col items-center gap-2"><span className="text-5xl" role="img">{field.value}</span>
                                                            <p className="text-sm">Click to change</p></div>) : (
                                                        <div className="flex flex-col items-center gap-2"><CircleOff className="w-12 h-12" />
                                                            <p className="text-sm">No icon selected</p></div>
                                                    )}
                                                </Button>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-[200px] p-0 bg-transparent" >
                                                <Picker
                                                    data={data}
                                                    onEmojiSelect={(emoji: { native: string }) => {
                                                        field.onChange(emoji.native)
                                                    }}
                                                    emojiSize={16}
                                                    emojiButtonSize={24}
                                                    previewPosition="none"
                                                    maxFrequentRows={1}
                                                    theme={theme.resolvedTheme}
                                                />
                                            </PopoverContent>
                                        </Popover>
                                    </FormControl>
                                    <FormDescription>
                                        This is how your category will look like
                                    </FormDescription>
                                </FormItem>
                            )}
                        />
                        <DialogFooter>
                            <DialogClose asChild>
                                <Button variant={"secondary"} onClick={() => {
                                    form.reset()
                                }}>Cancel</Button>
                            </DialogClose>
                            <Button type="submit" disabled={isPending}>{!isPending ? "Create" : <Loader2 className="w-4 h-4 animate-spin" />}</Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}

export default CreateCategoryDialog