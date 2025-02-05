"use client"

import { TransactionType } from "@/lib/types";
import { ReactNode } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { CreateTransactionSchema, CreateTransactionSchemaType } from "@/schema/transaction";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { cn } from "@/lib/utils";
import CategoryPicker from "./categoryPicker";
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
                        <div className="flex items-center justify-between gap2">
                            <FormField
                                control={form.control}
                                name="category"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Category</FormLabel>
                                        <FormControl>
                                            <CategoryPicker type={type} />
                                        </FormControl>
                                        <FormDescription>Select a category for the transaction</FormDescription>
                                    </FormItem>
                                )}
                            />
                        </div>


                    </form>
                </Form>
            </DialogContent >
        </Dialog >
    )
}

export default CreateTransactionDialog;