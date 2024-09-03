import Link from "next/link";
import { useEffect, useState } from "react";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/router";
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
  CardContent,
} from "@/components/Admin-Dashboard/card";
import { Tabs, TabsContent } from "@/components/Admin-Dashboard/tabs";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/Admin-Dashboard/table";
import { Check, ChevronDownIcon, Edit2, Trash, X } from "lucide-react";
import Logo from "@/components/logo";
import { toast } from "sonner";
import { Badge } from "@/components/Admin-Dashboard/badge";

interface Report {
  _id: string;
  username: string,
  title: string;
  description: string;
  riskLevel: string;
  location: string;
  status: string,
  date: string;
}

export default function Admin_Reports() {
  const { data: session, status } = useSession();
  const isAuthenticated = status === "authenticated";
  const router = useRouter();
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedRiskLevels, setSelectedRiskLevels] = useState<string[]>([]);
  const [editingReport, setEditingReport] = useState<Report | null>(null);

  const handleEdit = (report: Report) => {
    setEditingReport(report);
  };

  const handleSave = async () => {
    if (!editingReport) return;

    try {
      const response = await fetch(`/api/reports`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingReport),
      });

      if (!response.ok) throw new Error("Failed to save report");

      const updatedReport = await response.json();

      setReports((prevReports) =>
        prevReports.map((report) =>
          report._id === updatedReport._id ? updatedReport : report
        )
      );

      // Exit editing mode
      setEditingReport(null);

      toast.success("Report updated successfully!");
    } catch (error) {
      console.error(error);
      toast.error("Failed to update report");
    }
  };

  const handleDelete = async (reportId: string) => {
    try {
      const response = await fetch(`/api/reports?reportId=${reportId}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete report");

      setReports((prevReports) =>
        prevReports.filter((report) => report._id !== reportId)
      );
    } catch (error) {
      console.error(error);
    }
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

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="flex items-center space-x-4">
        <div className="spinner"></div>
        <span>Loading...</span>
      </div>
    </div>
  );

  if (error) return <div>{error}</div>;

  const handleLogout = async () => {
    await signOut({
      callbackUrl: "/login",
    });
  };

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

  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
        <Link
          href="/"
          className="flex items-center gap-2 mt-4"
          prefetch={false}
        >
          <Logo className="h-6 w-6" />
          <span className="text-lg font-semibold">TravelSafe</span>
        </Link>
        <nav className="ml-auto flex items-center gap-4 mb-4 mt-4">
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
                  (toast.error("you don't have the rights to access! "),
                  router.push("/login"))
                )}
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => router.push("/")}>
                  Dashboard
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleLogout}>
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </>
        </nav>
      </header>
      <div className="flex-1 space-y-4 p-8 pt-6">
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
                            onCheckedChange={() => handleRiskLevelChange("Low")}
                          >
                            Low Risk
                          </DropdownMenuCheckboxItem>
                          <DropdownMenuCheckboxItem
                            checked={selectedRiskLevels.includes("Medium")}
                            onCheckedChange={() =>
                              handleRiskLevelChange("Medium")
                            }
                          >
                            Medium Risk
                          </DropdownMenuCheckboxItem>
                          <DropdownMenuCheckboxItem
                            checked={selectedRiskLevels.includes("High")}
                            onCheckedChange={() =>
                              handleRiskLevelChange("High")
                            }
                          >
                            High Risk
                          </DropdownMenuCheckboxItem>
                          <DropdownMenuCheckboxItem
                            checked={selectedRiskLevels.includes("Undefined")}
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
                        <TableHead>Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredReports.map((report : Report) => (
                        <TableRow key={report._id}>
                          <TableCell>
                            {editingReport &&
                            editingReport._id === report._id ? (
                              <input
                                type="text"
                                value={editingReport.title}
                                onChange={(e) => setEditingReport({ ...editingReport, title: e.target.value,})
                                }
                                className="border px-2 py-1 rounded-md w-full"
                              />
                            ) : (
                              report.title
                            )}
                          </TableCell>

                          <TableCell>
                            {editingReport &&
                            editingReport._id === report._id ? (
                              <input
                                type="text"
                                value={editingReport.location}
                                onChange={(e) =>
                                  setEditingReport({
                                    ...editingReport,
                                    location: e.target.value,
                                  })
                                }
                                className="border px-2 py-1 rounded-md w-full"
                              />
                            ) : (
                              report.location
                            )}
                          </TableCell>

                          <TableCell className="hidden sm:table-cell">
                            {editingReport &&
                            editingReport._id === report._id ? (
                              <input
                                type="text"
                                value={editingReport.description}
                                onChange={(e) =>
                                  setEditingReport({
                                    ...editingReport,
                                    description: e.target.value,
                                  })
                                }
                                className="border px-2 py-1 rounded-md w-full"
                              />
                            ) : (
                              report.description
                            )}
                          </TableCell>

                          <TableCell>
                            {editingReport &&
                            editingReport._id === report._id ? (
                              <input
                                type="date"
                                value={editingReport.date.split("T")[0]} // Assuming `date` is in ISO format
                                onChange={(e) =>
                                  setEditingReport({
                                    ...editingReport,
                                    date: e.target.value,
                                  })
                                }
                                className="border px-2 py-1 rounded-md w-full"
                              />
                            ) : (
                              new Date(report.date).toLocaleDateString()
                            )}
                          </TableCell>

                          <TableCell>
                            {editingReport &&
                            editingReport._id === report._id ? (
                              <select
                                value={editingReport.riskLevel}
                                onChange={(e) =>
                                  setEditingReport({
                                    ...editingReport,
                                    riskLevel: e.target.value,
                                  })
                                }
                                className="border px-2 py-1 rounded-md w-full"
                              >
                                <option value="Low">Low</option>
                                <option value="Medium">Medium</option>
                                <option value="High">High</option>
                                <option value="Undefined">Undefined</option>
                              </select>
                            ) : (
                              <Badge variant="outline" className="capitalize">
                                {report.riskLevel}
                              </Badge>
                            )}
                          </TableCell>

                          <TableCell className="hidden sm:table-cell">
                            {report.username}
                          </TableCell>

                          <TableCell>
                            {editingReport &&
                            editingReport._id === report._id ? (
                              <select
                                value={editingReport.status}
                                onChange={(e) =>
                                  setEditingReport({
                                    ...editingReport,
                                    riskLevel: e.target.value,
                                  })
                                }
                                className="border px-2 py-1 rounded-md w-full"
                              >
                                <option value="Open">Open</option>
                                <option value="Resolved">Resolved</option>
                              </select>
                            ) : (
                              <Badge variant="outline" className="capitalize">
                                {report.status}
                              </Badge>
                            )}
                          </TableCell>

                          {/* <TableCell className="hidden sm:table-cell">
                            {report.status}
                          </TableCell> */}

                          <TableCell>
                            {editingReport &&
                            editingReport._id === report._id ? (
                              <div className="flex space-x-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={handleSave}
                                  className="p-1"
                                >
                                  <Check className="w-4 h-4" />
                                </Button>
                                <Button
                                  variant="destructive"
                                  size="sm"
                                  onClick={() => setEditingReport(null)}
                                  className="p-1"
                                >
                                  <X className="w-4 h-4" />
                                </Button>
                              </div>
                            ) : (
                              <div className="flex space-x-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleEdit(report)}
                                  className="p-1"
                                >
                                  <Edit2 className="w-4 h-4" />
                                </Button>
                                <Button
                                  variant="destructive"
                                  size="sm"
                                  onClick={() => handleDelete(report._id)}
                                  className="p-1"
                                >
                                  <Trash className="w-4 h-4" />
                                </Button>
                              </div>
                            )}
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
      </div>
    </div>
  );
}
