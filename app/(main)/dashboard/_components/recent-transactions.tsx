import { Transaction } from "@prisma/client";
import { formatCurrency } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";

interface RecentTransactionsProps {
    transactions: Transaction[];
}

const RecentTransactions = ({ transactions }: RecentTransactionsProps) => {
    return (
        <ScrollArea className="h-[300px]">
            <div className="space-y-4">
                {transactions.map((transaction) => (
                    <div key={transaction.id} className="flex items-center justify-between">
                        <div className="space-y-1">
                            <p className="text-sm font-medium">{transaction.description}</p>
                            <p className="text-xs text-muted-foreground">
                                {new Date(transaction.date).toLocaleDateString()}
                            </p>
                        </div>
                        <div className={`text-sm font-medium ${
                            transaction.type === 'expense' ? 'text-red-500' : 'text-green-500'
                        }`}>
                            {transaction.type === 'expense' ? '-' : '+'}
                            {formatCurrency(transaction.amount)}
                        </div>
                    </div>
                ))}
            </div>
        </ScrollArea>
    );
};

export default RecentTransactions; 