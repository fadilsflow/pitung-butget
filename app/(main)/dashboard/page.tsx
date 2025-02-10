import { createClient } from "@/app/utils/supabase/server";
import { Button } from "@/components/ui/button";
import { redirect } from "next/navigation";
import CreateTransactionDialog from "./_components/CreateTransactionDialog";
import Overview from "./_components/overview";
import { prisma } from "@/lib/prisma";
import { Separator } from "@/components/ui/separator";
import { Card } from "@/components/ui/card";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import RecentTransactions from "./_components/recent-transactions";
import SpendingChart from "./_components/spending-chart";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Page = async () => {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    const firstName = user?.user_metadata.full_name?.split(" ")[0];
    if (!user) {
        redirect("/sign-in");
    }

    const userSettings = await prisma.userSettings.findUnique({
        where: {
            userId: user.id
        }
    });

    // Fetch recent transactions
    const recentTransactions = await prisma.transaction.findMany({
        where: {
            userId: user.id
        },
        orderBy: {
            date: 'desc'
        },
        take: 5
    });

    return (
        <div className="h-full bg-background">
            {/* Header Section */}
            <div className="container py-4 px-6">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div className="space-y-1">
                        <h2 className="text-3xl font-bold tracking-tight">
                            Welcome back, {firstName}! 👋
                        </h2>
                        <p className="text-muted-foreground">
                            Here's an overview of your finances
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <DateRangePicker />
                        <CreateTransactionDialog
                            trigger={<Button size="sm">New income</Button>}
                            type="income"
                        />
                        <CreateTransactionDialog
                            trigger={<Button size="sm">New expense</Button>}
                            type="expense"
                        />
                    </div>
                </div>
            </div>
            <Separator />

            {/* Main Content */}
            <div className="container py-6 px-6">
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                    {/* Overview Section */}
                    <Card className="col-span-full lg:col-span-4 p-6">
                        <Tabs defaultValue="overview" className="space-y-4">
                            <div className="flex items-center justify-between">
                                <TabsList>
                                    <TabsTrigger value="overview">Overview</TabsTrigger>
                                    <TabsTrigger value="analytics">Analytics</TabsTrigger>
                                </TabsList>
                            </div>
                            <TabsContent value="overview" className="space-y-4">
                                <Overview userSettings={userSettings} />
                            </TabsContent>
                            <TabsContent value="analytics" className="space-y-4">
                                <SpendingChart />
                            </TabsContent>
                        </Tabs>
                    </Card>

                    {/* Recent Transactions */}
                    <Card className="col-span-full lg:col-span-3 p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-medium">Recent Transactions</h3>
                            <Button variant="ghost" size="sm">View all</Button>
                        </div>
                        <RecentTransactions transactions={recentTransactions} />
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default Page;