import Link from "next/link";
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuLink,
} from "@/components/Admin-Dashboard/navigation-menu";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
} from "@/components/Admin-Dashboard/dropdown-menu";
import { Button } from "@/components/Admin-Dashboard/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
  CardContent,
} from "@/components/Admin-Dashboard/card";
import { Progress } from "@/components/Admin-Dashboard/progress";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/Admin-Dashboard/tabs";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/Admin-Dashboard/table";
import { Badge } from "@/components/Admin-Dashboard/badge";
import Logo from "@/components/logo";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { ChevronDownIcon } from "lucide-react";
import { toast } from "sonner";

export default function Admin_Dash() {
  const { data: session, status } = useSession();
  const isAuthenticated = status === "authenticated";
  const router = useRouter();

  const handleLogout = async () => {
    await signOut({
      callbackUrl: "/login",
    });
  };
  
  useEffect(() => {
    // Wait until the session status is 'authenticated' before checking the role
    if (status === "loading") return; // it will make the qeue wait until it loads

    if (status === "authenticated") {
      if (session.user.role !== "admin") {
        router.push("/");
      }
    } else {
      // If the user is not authenticated, redirect to the login page or home page
      router.push("/");
    }
  }, [session, status]);

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex items-center space-x-4">
          <div className="spinner"></div>
          <span>Loading...</span>
        </div>
      </div>
    );
  }
  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
        <Link href="/" className="flex items-center gap-2" prefetch={false}>
          <Logo className="h-6 w-6" />
          <span className="text-lg font-semibold">TravelSafe</span>
        </Link>
        <nav className="ml-auto flex items-center gap-4">
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuLink
                  href="/admin_dash"
                  className="group inline-flex h-9 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50"
                >
                  Dashboard
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink
                  href="/admin_risk"
                  className="group inline-flex h-9 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50"
                >
                  Risk Assessment
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink
                  href="/admin_reports"
                  className="group inline-flex h-9 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50"
                >
                  Incident Reports
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink
                  href="/admin_users"
                  className="group inline-flex h-9 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50"
                >
                  Users
                </NavigationMenuLink>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
          <>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
              {isAuthenticated ? (
                <div className="flex items-center space-x-1">
                  <span className="text-sm font-medium text-black">
                    Welcome, {session.user?.username}
                  </span>
                  <ChevronDownIcon className="w-4 h-4" />
                </div>): (
                  toast.error('you dont have the rights to access! '),
                  router.push('/login')
                )}
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuSeparator />
                <DropdownMenuItem>Settings</DropdownMenuItem>
                <DropdownMenuItem onClick={handleLogout}>Logout</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </>
        </nav>
      </header>
      <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
        <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8 lg:grid-cols-3 xl:grid-cols-3">
          <div className="grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-2">
            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4">
              <Card className="sm:col-span-2" x-chunk="dashboard-05-chunk-0">
                <CardHeader className="pb-3">
                  <CardTitle>Risk Dashboard</CardTitle>
                  <CardDescription className="max-w-lg text-balance leading-relaxed">
                    Get a comprehensive overview of the current risk landscape
                    for your travel operations.
                  </CardDescription>
                </CardHeader>
                <CardFooter>
                  <Button onClick={() => router.push("/")}>
                    View Risk Assessment
                  </Button>
                </CardFooter>
              </Card>
              <Card x-chunk="dashboard-05-chunk-1">
                <CardHeader className="pb-2">
                  <CardDescription>This Week</CardDescription>
                  <CardTitle className="text-4xl">12</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-xs text-muted-foreground">
                    +25% from last week
                  </div>
                </CardContent>
                <CardFooter>
                  <Progress value={25} aria-label="25% increase" />
                </CardFooter>
              </Card>
              <Card x-chunk="dashboard-05-chunk-2">
                <CardHeader className="pb-2">
                  <CardDescription>This Month</CardDescription>
                  <CardTitle className="text-4xl">48</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-xs text-muted-foreground">
                    +10% from last month
                  </div>
                </CardContent>
                <CardFooter>
                  <Progress value={12} aria-label="12% increase" />
                </CardFooter>
              </Card>
            </div>
            <Tabs defaultValue="week">
              <div className="flex items-center">
                <TabsList>
                  <TabsTrigger value="week">Incidents</TabsTrigger>
                  <TabsTrigger value="month">Risk Assessments</TabsTrigger>
                  <TabsTrigger value="year">Users</TabsTrigger>
                </TabsList>
                <div className="ml-auto flex items-center gap-2">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-7 gap-1 text-sm"
                      >
                        <div className="h-3.5 w-3.5" />
                        <span className="sr-only sm:not-sr-only">Filter</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Filter by</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuCheckboxItem checked>
                        High Risk
                      </DropdownMenuCheckboxItem>
                      <DropdownMenuCheckboxItem>
                        Medium Risk
                      </DropdownMenuCheckboxItem>
                      <DropdownMenuCheckboxItem>
                        Low Risk
                      </DropdownMenuCheckboxItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-7 gap-1 text-sm"
                  >
                    <div className="h-3.5 w-3.5" />
                    <span className="sr-only sm:not-sr-only">Export</span>
                  </Button>
                </div>
              </div>
              <TabsContent value="week">
                <Card x-chunk="dashboard-05-chunk-3">
                  <CardHeader className="px-7">
                    <CardTitle>Incident Reports</CardTitle>
                    <CardDescription>
                      Recent incident reports for your travel operations.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Incident</TableHead>
                          <TableHead className="hidden sm:table-cell">
                            Location
                          </TableHead>
                          <TableHead className="hidden sm:table-cell">
                            Risk Level
                          </TableHead>
                          <TableHead className="hidden md:table-cell">
                            Date
                          </TableHead>
                          <TableHead className="text-right">Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        <TableRow className="bg-accent">
                          <TableCell>
                            <div className="font-medium">Civil Unrest</div>
                            <div className="hidden text-sm text-muted-foreground md:inline">
                              Acme Hotel, Paris
                            </div>
                          </TableCell>
                          <TableCell className="hidden sm:table-cell">
                            Paris, France
                          </TableCell>
                          <TableCell className="hidden sm:table-cell">
                            <Badge className="text-xs" variant="secondary">
                              High
                            </Badge>
                          </TableCell>
                          <TableCell className="hidden md:table-cell">
                            2023-06-23
                          </TableCell>
                          <TableCell className="text-right">
                            <Badge className="text-xs" variant="outline">
                              Resolved
                            </Badge>
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>
                            <div className="font-medium">Food Poisoning</div>
                            <div className="hidden text-sm text-muted-foreground md:inline">
                              Acme Resort, Bali
                            </div>
                          </TableCell>
                          <TableCell className="hidden sm:table-cell">
                            Bali, Indonesia
                          </TableCell>
                          <TableCell className="hidden sm:table-cell">
                            <Badge className="text-xs" variant="outline">
                              Medium
                            </Badge>
                          </TableCell>
                          <TableCell className="hidden md:table-cell">
                            2023-06-24
                          </TableCell>
                          <TableCell className="text-right">
                            <Badge className="text-xs" variant="secondary">
                              Open
                            </Badge>
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>
                            <div className="font-medium">Theft</div>
                            <div className="hidden text-sm text-muted-foreground md:inline">
                              Acme Hotel, London
                            </div>
                          </TableCell>
                          <TableCell className="hidden sm:table-cell">
                            London, UK
                          </TableCell>
                          <TableCell className="hidden sm:table-cell">
                            <Badge className="text-xs" variant="secondary">
                              High
                            </Badge>
                          </TableCell>
                          <TableCell className="hidden md:table-cell">
                            2023-06-25
                          </TableCell>
                          <TableCell className="text-right">
                            <Badge className="text-xs" variant="outline">
                              Resolved
                            </Badge>
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>
                            <div className="font-medium">Natural Disaster</div>
                            <div className="hidden text-sm text-muted-foreground md:inline">
                              Acme Resort, Bali
                            </div>
                          </TableCell>
                          <TableCell className="hidden sm:table-cell">
                            Bali, Indonesia
                          </TableCell>
                          <TableCell className="hidden sm:table-cell">
                            <Badge className="text-xs" variant="secondary">
                              High
                            </Badge>
                          </TableCell>
                          <TableCell className="hidden md:table-cell">
                            2023-06-26
                          </TableCell>
                          <TableCell className="text-right">
                            <Badge className="text-xs" variant="secondary">
                              Open
                            </Badge>
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>
                            <div className="font-medium">Civil Unrest</div>
                            <div className="hidden text-sm text-muted-foreground md:inline">
                              Acme Hotel, Paris
                            </div>
                          </TableCell>
                          <TableCell className="hidden sm:table-cell">
                            Paris, France
                          </TableCell>
                          <TableCell className="hidden sm:table-cell">
                            <Badge className="text-xs" variant="secondary">
                              High
                            </Badge>
                          </TableCell>
                          <TableCell className="hidden md:table-cell">
                            2023-06-23
                          </TableCell>
                          <TableCell className="text-right">
                            <Badge className="text-xs" variant="outline">
                              Resolved
                            </Badge>
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>
                            <div className="font-medium">Food Poisoning</div>
                            <div className="hidden text-sm text-muted-foreground md:inline">
                              Acme Resort, Bali
                            </div>
                          </TableCell>
                          <TableCell className="hidden sm:table-cell">
                            Bali, Indonesia
                          </TableCell>
                          <TableCell className="hidden sm:table-cell">
                            <Badge className="text-xs" variant="outline">
                              Medium
                            </Badge>
                          </TableCell>
                          <TableCell className="hidden md:table-cell">
                            2023-06-24
                          </TableCell>
                          <TableCell className="text-right">
                            <Badge className="text-xs" variant="secondary">
                              Open
                            </Badge>
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>
                            <div className="font-medium">Natural Disaster</div>
                            <div className="hidden text-sm text-muted-foreground md:inline">
                              Acme Resort, Bali
                            </div>
                          </TableCell>
                          <TableCell className="hidden sm:table-cell">
                            Bali, Indonesia
                          </TableCell>
                          <TableCell className="hidden sm:table-cell">
                            <Badge className="text-xs" variant="secondary">
                              High
                            </Badge>
                          </TableCell>
                          <TableCell className="hidden md:table-cell">
                            2023-06-26
                          </TableCell>
                          <TableCell className="text-right">
                            <Badge className="text-xs" variant="secondary">
                              Open
                            </Badge>
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
          <div>
            <Card className="overflow-hidden" x-chunk="dashboard-05-chunk-4">
              <CardHeader className="flex flex-row items-start bg-muted/50">
                <div className="grid gap-0.5">
                  <CardTitle className="group flex items-center gap-2 text-lg">
                    Risk Assessment
                    <Button
                      size="icon"
                      variant="outline"
                      className="h-6 w-6 opacity-0 transition-opacity group-hover:opacity-100"
                    >
                      <div className="h-3 w-3" />
                      <span className="sr-only">Copy Risk Assessment</span>
                    </Button>
                  </CardTitle>
                  <CardDescription>Last Updated: June 23, 2023</CardDescription>
                </div>
                <div className="ml-auto flex items-center gap-1">
                  <Button size="sm" />
                </div>
              </CardHeader>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}
