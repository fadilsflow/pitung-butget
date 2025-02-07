import { ModeToggle } from "@/components/mode-toggle"
import { Button } from "@/components/ui/button"
import { createClient } from "@/app/utils/supabase/server"
import Image from "next/image"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { LogOutIcon } from "lucide-react"
import { logout } from "@/app/(auth)/logout/action"

const Page = async () => {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    const user_metadata = user?.user_metadata

    if (!user) {
        return null // atau redirect ke halaman login
    }

    return (
        <div className="container max-w-md mx-auto p-4 min-h-screen flex items-center justify-center">
            <Card className="w-full">
                <CardHeader className="flex flex-col items-center space-y-4">
                    <div className="relative">
                        <Image
                            src={user_metadata?.avatar_url}
                            alt="Profile Picture"
                            width={96}
                            height={96}
                            className="rounded-full"
                            priority
                        />
                        <div className="absolute -bottom-2 -right-2">
                            <ModeToggle />
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="space-y-4 text-center">
                    <div>
                        <h1 className="text-xl font-semibold">{user_metadata?.full_name}</h1>
                        <p className="text-sm text-muted-foreground">{user_metadata?.email}</p>
                    </div>
                </CardContent>
                <CardFooter className="flex justify-center">
                    <form action={logout}>
                        <Button variant="destructive">
                            <LogOutIcon className="mr-2 h-4 w-4" />
                            Logout
                        </Button>
                    </form>
                </CardFooter>
            </Card>
        </div>
    )
}

export default Page