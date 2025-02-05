"use client"

import { TransactionType } from "@/lib/types";
import { ReactNode, useCallback } from "react";
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { CreateTransactionSchema, CreateTransactionSchemaType } from "@/schema/transaction";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { cn } from "@/lib/utils";
import CategoryPicker from "./categoryPicker";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { CalendarIcon, Loader2 } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
interface Props {
    trigger: ReactNode,
    type: TransactionType;
}

function CreateTransactionDialog({ trigger, type }: Props) {
    const form = useForm<CreateTransactionSchemaType>({
        resolver: zodResolver(CreateTransactionSchema),
        defaultValues: {
            type,
            date: new Date(),

        }
    })
    const handleCategoryChange = useCallback((value: string) => {
        form.setValue("category", value)
    }, [form])
    return (
        <Dialog>
            <DialogTrigger asChild>{trigger}</DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Create a new <span className={cn(
                        type === "income" ? "text-green-500" : "text-red-500"
                    )}>{type}</span></DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form className="space-y-4">
                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Description</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Buy something"
                                            {...field}
                                            defaultValue={""}
                                        />
                                    </FormControl>
                                    <FormDescription>Transaction description (Optional)</FormDescription>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="amount"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Amount</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Buy something"
                                            {...field}
                                            defaultValue={0}
                                            type="number"
                                        />
                                    </FormControl>
                                    <FormDescription>Transaction description (required)</FormDescription>
                                </FormItem>
                            )}
                        />

                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="category"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Category</FormLabel>
                                        <FormControl>
                                            <CategoryPicker type={type} onChange={handleCategoryChange} />
                                        </FormControl>
                                        <FormDescription>Select a category</FormDescription>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="date"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Transaction Date</FormLabel>
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <FormControl>
                                                    <Button variant={"outline"} className={cn(
                                                        "w-full pl-3 text-left font-normal",
                                                        !field.value && "text-muted-foreground"
                                                    )}>
                                                        {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                                                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                    </Button>
                                                </FormControl>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-auto p-0" align="start">
                                                <Calendar mode="single" selected={field.value} onSelect={field.onChange} />
                                            </PopoverContent>
                                        </Popover>
                                        <FormDescription>Select transaction date</FormDescription>
                                    </FormItem>
                                )}
                            />
                        </div>


                    </form>
                </Form>
                <DialogFooter>
                    {/* <DialogClose asChild>
                                <Button variant={"secondary"} onClick={() => {
                                    form.reset()
                                }}>Cancel</Button>
                            </DialogClose>
                            <Button type="submit" disabled={isPending}>{!isPending ? "Create" : <Loader2 className="w-4 h-4 animate-spin" />}</Button> */}
                </DialogFooter>
            </DialogContent >
        </Dialog >
    )
}

export default CreateTransactionDialog;