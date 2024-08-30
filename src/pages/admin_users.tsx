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

interface User {
  _id: string;
  username: string;
  email: string;
  role: string;
  createdAt: string;
  password: string;
}

export default function Admin_Reports() {
  const { data: session, status } = useSession();
  const isAuthenticated = status === "authenticated";
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  const handleEdit = (user: User) => {
    setEditingUser(user);
  };

  const handleSave = async () => {
    if (!editingUser) return;

    try {
      const response = await fetch(`/api/users`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingUser),
      });

      if (!response.ok) throw new Error("Failed to save user");

      const updatedUser = await response.json();

      setUsers((prevUser) =>
        prevUser.map((user) =>
          user._id === updatedUser._id ? updatedUser : user
        )
      );

      // Exit editing mode
      setEditingUser(null);

      toast.success("User updated successfully!");
    } catch (error) {
      console.error(error);
      toast.error("Failed to update user");
    }
  };

  const handleDelete = async (userId: string) => {
    try {
      const response = await fetch(`/api/users?userId=${userId}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete user");

      setUsers((prevUser) => prevUser.filter((user) => user._id !== userId));
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

    const fetchUsers = async () => {
      try {
        const response = await fetch("/api/users");
        if (!response.ok) throw new Error("Failed to fetch users");
        const data = await response.json();
        setUsers(data);
      } catch (error) {
        setError("Failed to load users");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
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

  if (error) return <div>{error}</div>;

  const handleLogout = async () => {
    await signOut({
      callbackUrl: "/login",
    });
  };

  const handleRoleChange = (role: string) => {
    setSelectedRoles((prev) =>
      prev.includes(role)
        ? prev.filter((roles) => roles !== role)
        : [...prev, role]
    );
  };

  const filteredReports = users.filter(
    (user) => selectedRoles.length === 0 || selectedRoles.includes(user.role)
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
                  href="/"
                  className="group inline-flex h-9 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50"
                >
                  Dashboard
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink
                  href="#"
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
              Manage and review incident users submitted by users.
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
                            checked={selectedRoles.includes("admin")}
                            onCheckedChange={() => handleRoleChange("admin")}
                          >
                            Admin
                          </DropdownMenuCheckboxItem>
                          <DropdownMenuCheckboxItem
                            checked={selectedRoles.includes("user")}
                            onCheckedChange={() => handleRoleChange("user")}
                          >
                            User
                          </DropdownMenuCheckboxItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>User</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Password</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Created At</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredReports.map((user: User) => (
                        <TableRow key={user._id}>
                          <TableCell>
                            {editingUser && editingUser._id === user._id ? (
                              <input
                                type="text"
                                value={editingUser.username}
                                onChange={(e) =>
                                  setEditingUser({
                                    ...editingUser,
                                    username: e.target.value,
                                  })
                                }
                                className="border px-2 py-1 rounded-md w-full"
                              />
                            ) : (
                              user.username
                            )}
                          </TableCell>

                          <TableCell>
                            {editingUser && editingUser._id === user._id ? (
                              <input
                                type="email"
                                value={editingUser.email}
                                onChange={(e) =>
                                  setEditingUser({
                                    ...editingUser,
                                    email: e.target.value,
                                  })
                                }
                                className="border px-2 py-1 rounded-md w-full"
                              />
                            ) : (
                              user.email
                            )}
                          </TableCell>

                          <TableCell>
                            {editingUser && editingUser._id === user._id ? (
                              <input
                                type="email"
                                value={editingUser.password}
                                onChange={(e) =>
                                  setEditingUser({
                                    ...editingUser,
                                    password: e.target.value,
                                  })
                                }
                                className="border px-2 py-1 rounded-md w-full"
                              />
                            ) : (
                              "********"
                            )}
                          </TableCell>

                          <TableCell>
                            {editingUser && editingUser._id === user._id ? (
                              <select
                                value={editingUser.role}
                                onChange={(e) =>
                                  setEditingUser({
                                    ...editingUser,
                                    role: e.target.value,
                                  })
                                }
                                className="border px-2 py-1 rounded-md w-full"
                              >
                                <option value="user">User</option>
                                <option value="admin">Admin</option>
                              </select>
                            ) : (
                              <Badge variant="outline" className="capitalize">
                                {user.role}
                              </Badge>
                            )}
                          </TableCell>

                          <TableCell>
                            {new Date(user.createdAt).toLocaleDateString()}
                          </TableCell>

                          <TableCell>
                            {editingUser && editingUser._id === user._id ? (
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
                                  onClick={() => setEditingUser(null)}
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
                                  onClick={() => handleEdit(user)}
                                  className="p-1"
                                >
                                  <Edit2 className="w-4 h-4" />
                                </Button>
                                <Button
                                  variant="destructive"
                                  size="sm"
                                  onClick={() => handleDelete(user._id)}
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
