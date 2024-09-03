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
import { useEffect, useState } from "react";
import { ChevronDownIcon } from "lucide-react";
import { toast } from "sonner";

interface Report {
  _id: string;
  username: string;
  title: string;
  description: string;
  riskLevel: string;
  location: string;
  status: string;
  date: string;
}

export default function Admin_Dash() {
  const { data: session, status } = useSession();
  const isAuthenticated = status === "authenticated";
  const router = useRouter();
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedRiskLevels, setSelectedRiskLevels] = useState<string[]>([]);

  const handleLogout = async () => {
    await signOut({
      callbackUrl: "/login",
    });
  };

  useEffect(() => {
    if (status === "loading") return;
    if (session?.user?.role !== "admin") {
      router.push("/"); // Redirect non-admin users
      return;
    }

    const fetchReports = async () => {
      try {
        const response = await fetch("/api/reports");
        if (!response.ok) throw new Error("Failed to fetch reports");
        const data = await response.json();
        setReports(data);
      } catch (error) {
        setError("Failed to load reports");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, [status, session, router]);

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex items-center space-x-4">
          <div className="spinner"></div>
          <span>Loading...</span>
        </div>
      </div>
    );

  const handleRiskLevelChange = (riskLevel: string) => {
    setSelectedRiskLevels((prev) =>
      prev.includes(riskLevel)
        ? prev.filter((level) => level !== riskLevel)
        : [...prev, riskLevel]
    );
  };

  const filteredReports = reports.filter(
    (report) =>
      selectedRiskLevels.length === 0 ||
      selectedRiskLevels.includes(report.riskLevel)
  );

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
                  </div>
                ) : (
                  (toast.error("you dont have the rights to access! "),
                  router.push("/login"))
                )}
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuSeparator />
                <DropdownMenuItem>Settings</DropdownMenuItem>
                <DropdownMenuItem onClick={handleLogout}>
                  Logout
                </DropdownMenuItem>
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
                <Card>
                  <CardHeader>
                    <CardTitle className="text-2xl font-bold">
                      Incident Reports
                    </CardTitle>
                    <CardDescription>
                      Manage and review incident reports submitted by users.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="px-6">
                    <div className="flex flex-col space-y-4">
                      <Tabs defaultValue="all" className="w-full">
                        <TabsContent value="all" className="space-y-4">
                          <div className="flex items-center justify-between">
                            <h2 className="text-xl font-bold">Reports</h2>
                            <div className="flex items-center space-x-2">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="outline" size="sm">
                                    Filter
                                    <ChevronDownIcon className="ml-2 h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuCheckboxItem
                                    checked={selectedRiskLevels.includes("Low")}
                                    onCheckedChange={() =>
                                      handleRiskLevelChange("Low")
                                    }
                                  >
                                    Low Risk
                                  </DropdownMenuCheckboxItem>
                                  <DropdownMenuCheckboxItem
                                    checked={selectedRiskLevels.includes(
                                      "Medium"
                                    )}
                                    onCheckedChange={() =>
                                      handleRiskLevelChange("Medium")
                                    }
                                  >
                                    Medium Risk
                                  </DropdownMenuCheckboxItem>
                                  <DropdownMenuCheckboxItem
                                    checked={selectedRiskLevels.includes(
                                      "High"
                                    )}
                                    onCheckedChange={() =>
                                      handleRiskLevelChange("High")
                                    }
                                  >
                                    High Risk
                                  </DropdownMenuCheckboxItem>
                                  <DropdownMenuCheckboxItem
                                    checked={selectedRiskLevels.includes(
                                      "Undefined"
                                    )}
                                    onCheckedChange={() =>
                                      handleRiskLevelChange("Undefined")
                                    }
                                  >
                                    Undefined
                                  </DropdownMenuCheckboxItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          </div>
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>Title</TableHead>
                                <TableHead>Location</TableHead>
                                <TableHead>Description</TableHead>
                                <TableHead>Date</TableHead>
                                <TableHead>Risk Level</TableHead>
                                <TableHead>Reported by</TableHead>
                                <TableHead>Status</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {filteredReports.map((report: Report) => (
                                <TableRow key={report._id}>
                                  <TableCell>{report.title}</TableCell>

                                  <TableCell>{report.location}</TableCell>

                                  <TableCell className="hidden sm:table-cell">
                                    {report.description}
                                  </TableCell>

                                  <TableCell>
                                    {new Date(report.date).toLocaleDateString()}
                                  </TableCell>

                                  <TableCell>
                                      <Badge
                                        variant="outline"
                                        className="capitalize"
                                      >
                                        {report.riskLevel}
                                      </Badge>
                                  </TableCell>

                                  <TableCell className="hidden sm:table-cell">
                                    {report.username}
                                  </TableCell>

                                  <TableCell>
                                      <Badge
                                        variant="outline"
                                        className="capitalize"
                                      >
                                        {report.status}
                                      </Badge>
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </TabsContent>
                      </Tabs>
                    </div>
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
