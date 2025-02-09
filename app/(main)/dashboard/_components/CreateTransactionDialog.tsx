"use client"

import { TransactionType } from "@/lib/types";
import { ReactNode, useCallback, useState } from "react";
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
import { useMutation, useQueryClient } from "@tanstack/react-query"; // Diubah dari useMutationState
import { toast } from "sonner";
import { CreateTransaction } from "../_action/transaction";
import { DateToUTCDate } from "@/lib/helpers";

interface Props {
    trigger: ReactNode;
    type: TransactionType;
}

function CreateTransactionDialog({ trigger, type }: Props) {
    const form = useForm<CreateTransactionSchemaType>({
        resolver: zodResolver(CreateTransactionSchema),
        defaultValues: {
            type,
            date: new Date(),
            description: "",
            amount: 0,
            category: undefined,
        }
    });

    const [open, setOpen] = useState(false);
    const queryClient = useQueryClient();

    // Diubah ke useMutation yang benar
    const { mutate, isPending } = useMutation({
        mutationFn: CreateTransaction,
        onSuccess: () => {
            toast.success("Transaction created successfully", {
                id: "create-transaction",
            });

            queryClient.invalidateQueries({
                queryKey: ["overview"],
            });

            form.reset();
            setOpen(false); // Langsung set ke false untuk menutup dialog
        },
        onError: () => {
            toast.error("Failed to create transaction", {
                id: "create-transaction",
            });
        }
    });

    const handleCategoryChange = useCallback(
        (value: string) => {
            form.setValue("category", value);
        },
        [form]
    );

    const onSubmit = useCallback(
        (values: CreateTransactionSchemaType) => {
            toast.loading("Creating transaction...", {
                id: "create-transaction",
            });

            mutate({
                ...values,
                date: DateToUTCDate(values.date)
            });
        },
        [mutate]
    );

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>{trigger}</DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        Create a new{" "}
                        <span className={cn(
                            type === "income" ? "text-green-500" : "text-red-500"
                        )}>
                            {type}
                        </span>
                    </DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
                        {/* Field Deskripsi */}
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
                                        />
                                    </FormControl>
                                    <FormDescription>
                                        Transaction description (Optional)
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Field Amount */}
                        <FormField
                            control={form.control}
                            name="amount"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Amount</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="0.00"
                                            {...field}
                                            type="number"
                                            min="0"
                                        />
                                    </FormControl>
                                    <FormDescription>
                                        Transaction amount (required)
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="grid grid-cols-2 gap-4">
                            {/* Field Kategori */}
                            <FormField
                                control={form.control}
                                name="category"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Category</FormLabel>
                                        <FormControl>
                                            <CategoryPicker
                                                type={type}
                                                onChange={handleCategoryChange}
                                                selectedCategory={field.value}
                                            />
                                        </FormControl>
                                        <FormDescription>
                                            Select a category
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Field Tanggal */}
                            <FormField
                                control={form.control}
                                name="date"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Transaction Date</FormLabel>
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <FormControl>
                                                    <Button
                                                        variant={"outline"}
                                                        className={cn(
                                                            "w-full pl-3 text-left font-normal",
                                                            !field.value && "text-muted-foreground"
                                                        )}
                                                    >
                                                        {field.value ? format(field.value, "PPP") : "Pick a date"}
                                                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                    </Button>
                                                </FormControl>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-auto p-0" align="start">
                                                <Calendar
                                                    mode="single"
                                                    selected={field.value}
                                                    onSelect={field.onChange}
                                                    initialFocus
                                                />
                                            </PopoverContent>
                                        </Popover>
                                        <FormDescription>
                                            Select transaction date
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        {/* Footer dengan button submit di dalam form */}
                        <DialogFooter>
                            <DialogClose asChild>
                                <Button
                                    type="button"
                                    variant={"secondary"}
                                    onClick={() => form.reset()}
                                >
                                    Cancel
                                </Button>
                            </DialogClose>
                            <Button type="submit" disabled={isPending}>
                                {!isPending ? "Create" : <Loader2 className="w-4 h-4 animate-spin" />}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}

export default CreateTransactionDialog;