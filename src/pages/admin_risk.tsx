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
import CitySearch from "@/components/Admin-Dashboard/city-search";
import { Badge } from "@/components/Admin-Dashboard/badge";

interface Danger {
  _id: string;
  city: string;
  lat: number | null;
  lng: number | null;
  terrorism: string;
  meteo: string;
  health_issues: string;
  poison: string;
  natural_disasters: string;
  political_unrest: string;
  economic_crisis: string;
  car_crashes: string;
  fires: string;
  carnivors_zones: string;
  robberies: string;
  scams: string;
  over_tourism: string;
  riskValue: string;
}

interface CityData {
  name: string;
  lat: number;
  lng: number;
}

export default function Admin_Risks() {
  const { data: session, status } = useSession();
  const isAuthenticated = status === "authenticated";
  const router = useRouter();
  const [dangers, setDangers] = useState<Danger[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingDanger, setEditingDanger] = useState<Danger | null>(null);

  const [newDanger, setNewDanger] = useState<Danger>({
    _id: "",
    city: "",
    lat: null,
    lng: null,
    terrorism: "0",
    meteo: "0",
    health_issues: "0",
    poison: "0",
    natural_disasters: "0",
    political_unrest: "0",
    economic_crisis: "0",
    car_crashes: "0",
    fires: "0",
    carnivors_zones: "0",
    robberies: "0",
    scams: "0",
    over_tourism: "0",
    riskValue: "0",
  });

  const [showForm, setShowForm] = useState(false);

  const handleSubmit = async () => {
    if (newDanger.lat === null || newDanger.lng === null) {
      console.error("Latitude and Longitude are required.");
      toast.error("Latitude and Longitude are required.");
      return;
    }

    try {
      const response = await fetch(`/api/dangers`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newDanger),
      });

      if (!response.ok) throw new Error("Failed to submit danger");

      const result = await response.json();
      setDangers((prevDangers) => [...prevDangers, result.danger]);
      toast.success("Danger submitted successfully!");
      setNewDanger({
        _id: "",
        city: "",
        lat: null,
        lng: null,
        terrorism: "0",
        meteo: "0",
        health_issues: "0",
        poison: "0",
        natural_disasters: "0",
        political_unrest: "0",
        economic_crisis: "0",
        car_crashes: "0",
        fires: "0",
        carnivors_zones: "0",
        robberies: "0",
        scams: "0",
        over_tourism: "0",
        riskValue: "0",
      });
      setShowForm(false);
    } catch (error) {
      console.error("Error saving danger:", error);
      toast.error("Failed to submit danger");
    }
  };

  const handleEdit = (danger: Danger) => {
    setEditingDanger(danger);
  };

  const handleCitySelect = (cityData: CityData) => {
    setNewDanger({
      ...newDanger,
      city: cityData.name,
      lat: cityData.lat,
      lng: cityData.lng,
    });
  };

  const handleSave = async () => {
    if (!editingDanger) return;

    try {
      const response = await fetch(`/api/dangers`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingDanger),
      });

      if (!response.ok) throw new Error("Failed to save danger");

      const updatedDanger = await response.json();

      setDangers((prevDangers) =>
        prevDangers.map((danger) =>
          danger._id === updatedDanger._id ? updatedDanger : danger
        )
      );

      // Exit editing mode
      setEditingDanger(null);

      toast.success("Danger updated successfully!");
    } catch (error) {
      console.error(error);
      toast.error("Failed to update danger");
    }
  };

  const handleDelete = async (dangerId: string) => {
    try {
      const response = await fetch(`/api/dangers?dangerId=${dangerId}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete danger");

      setDangers((prevDangers) =>
        prevDangers.filter((danger) => danger._id !== dangerId)
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

    const fetchDangers = async () => {
      try {
        const response = await fetch("/api/dangers");
        if (!response.ok) throw new Error("Failed to fetch dangers");
        const data = await response.json();
        setDangers(data);
      } catch (error) {
        setError("Failed to load dangers");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchDangers();
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
              Risk Assessments
            </CardTitle>
            <CardDescription>
              Manage and review incident dangers submitted to the database.
            </CardDescription>
          </CardHeader>
          <CardContent className="px-6">
            <div className="flex flex-col space-y-4">
              <Tabs defaultValue="all" className="w-full">
                <TabsContent value="all" className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold">Dangers</h2>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setShowForm(!showForm)}
                        className="p-1"
                      >
                        Add Danger
                      </Button>
                    </div>
                  </div>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead> City </TableHead>
                        <TableHead> Terrorism </TableHead>
                        <TableHead> Meteo </TableHead>
                        <TableHead> Health Issues </TableHead>
                        <TableHead> Poison </TableHead>
                        <TableHead> Natural Disasters </TableHead>
                        <TableHead> Political Unrest </TableHead>
                        <TableHead> Economic Crisis </TableHead>
                        <TableHead> Car Crashes </TableHead>
                        <TableHead> Fires </TableHead>
                        <TableHead> Carnivors Zones </TableHead>
                        <TableHead> Robberies </TableHead>
                        <TableHead> Scams </TableHead>
                        <TableHead> Over Tourism </TableHead>
                        <TableHead> RiskValue </TableHead>
                        <TableHead> Actions </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {showForm && (
                        <TableRow>
                          <TableCell>
                            <CitySearch onCitySelect={handleCitySelect} />
                          </TableCell>

                          <TableCell>
                            <input
                              type="text"
                              placeholder="Terrorism"
                              value={newDanger.terrorism}
                              onChange={(e) =>
                                setNewDanger({
                                  ...newDanger,
                                  terrorism: e.target.value,
                                })
                              }
                              className="border px-2 py-1 rounded-md w-full"
                            />
                          </TableCell>

                          <TableCell>
                            <input
                              type="text"
                              placeholder="Meteo"
                              value={newDanger.meteo}
                              onChange={(e) =>
                                setNewDanger({
                                  ...newDanger,
                                  meteo: e.target.value,
                                })
                              }
                              className="border px-2 py-1 rounded-md w-full"
                            />
                          </TableCell>
                          <TableCell>
                            <input
                              type="text"
                              placeholder="Health Issues"
                              value={newDanger.health_issues}
                              onChange={(e) =>
                                setNewDanger({
                                  ...newDanger,
                                  health_issues: e.target.value,
                                })
                              }
                              className="border px-2 py-1 rounded-md w-full"
                            />
                          </TableCell>
                          <TableCell>
                            <input
                              type="text"
                              placeholder="Poison"
                              value={newDanger.poison}
                              onChange={(e) =>
                                setNewDanger({
                                  ...newDanger,
                                  poison: e.target.value,
                                })
                              }
                              className="border px-2 py-1 rounded-md w-full"
                            />
                          </TableCell>
                          <TableCell>
                            <input
                              type="text"
                              placeholder="Natural Disasters"
                              value={newDanger.natural_disasters}
                              onChange={(e) =>
                                setNewDanger({
                                  ...newDanger,
                                  natural_disasters: e.target.value,
                                })
                              }
                              className="border px-2 py-1 rounded-md w-full"
                            />
                          </TableCell>
                          <TableCell>
                            <input
                              type="text"
                              placeholder="Political Unrest"
                              value={newDanger.political_unrest}
                              onChange={(e) =>
                                setNewDanger({
                                  ...newDanger,
                                  political_unrest: e.target.value,
                                })
                              }
                              className="border px-2 py-1 rounded-md w-full"
                            />
                          </TableCell>
                          <TableCell>
                            <input
                              type="text"
                              placeholder="Economic Crisis"
                              value={newDanger.economic_crisis}
                              onChange={(e) =>
                                setNewDanger({
                                  ...newDanger,
                                  economic_crisis: e.target.value,
                                })
                              }
                              className="border px-2 py-1 rounded-md w-full"
                            />
                          </TableCell>
                          <TableCell>
                            <input
                              type="text"
                              placeholder="Car Crashes"
                              value={newDanger.car_crashes}
                              onChange={(e) =>
                                setNewDanger({
                                  ...newDanger,
                                  car_crashes: e.target.value,
                                })
                              }
                              className="border px-2 py-1 rounded-md w-full"
                            />
                          </TableCell>
                          <TableCell>
                            <input
                              type="text"
                              placeholder="Fires"
                              value={newDanger.fires}
                              onChange={(e) =>
                                setNewDanger({
                                  ...newDanger,
                                  fires: e.target.value,
                                })
                              }
                              className="border px-2 py-1 rounded-md w-full"
                            />
                          </TableCell>
                          <TableCell>
                            <input
                              type="text"
                              placeholder="Carnivors Zones"
                              value={newDanger.carnivors_zones}
                              onChange={(e) =>
                                setNewDanger({
                                  ...newDanger,
                                  carnivors_zones: e.target.value,
                                })
                              }
                              className="border px-2 py-1 rounded-md w-full"
                            />
                          </TableCell>
                          <TableCell>
                            <input
                              type="text"
                              placeholder="Robberies"
                              value={newDanger.robberies}
                              onChange={(e) =>
                                setNewDanger({
                                  ...newDanger,
                                  robberies: e.target.value,
                                })
                              }
                              className="border px-2 py-1 rounded-md w-full"
                            />
                          </TableCell>
                          <TableCell>
                            <input
                              type="text"
                              placeholder="Scams"
                              value={newDanger.scams}
                              onChange={(e) =>
                                setNewDanger({
                                  ...newDanger,
                                  scams: e.target.value,
                                })
                              }
                              className="border px-2 py-1 rounded-md w-full"
                            />
                          </TableCell>
                          <TableCell>
                            <input
                              type="text"
                              placeholder="Over Tourism"
                              value={newDanger.over_tourism}
                              onChange={(e) =>
                                setNewDanger({
                                  ...newDanger,
                                  over_tourism: e.target.value,
                                })
                              }
                              className="border px-2 py-1 rounded-md w-full"
                            />
                          </TableCell>
                          <TableCell></TableCell>

                          <TableCell>
                            <div className="flex space-x-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={handleSubmit}
                                className="p-1"
                              >
                                <Check className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => setShowForm(false)}
                                className="p-1"
                              >
                                <X className="w-4 h-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      )}
                      {Array.isArray(dangers) && dangers.length > 0 ? (
                        dangers.map((danger: Danger) => (
                          <TableRow key={danger._id}>
                            <TableCell>
                              {editingDanger &&
                              editingDanger._id === danger._id ? (
                                <input
                                  type="text"
                                  value={editingDanger.city}
                                  onChange={(e) =>
                                    setEditingDanger({
                                      ...editingDanger,
                                      city: e.target.value,
                                    })
                                  }
                                  className="border px-2 py-1 rounded-md w-full"
                                />
                              ) : (
                                danger.city
                              )}
                            </TableCell>

                            <TableCell>
                              {editingDanger &&
                              editingDanger._id === danger._id ? (
                                <input
                                  type="text"
                                  value={editingDanger.terrorism}
                                  onChange={(e) =>
                                    setEditingDanger({
                                      ...editingDanger,
                                      terrorism: e.target.value,
                                    })
                                  }
                                  className="border px-2 py-1 rounded-md w-full"
                                />
                              ) : (
                                danger.terrorism
                              )}
                            </TableCell>

                            <TableCell>
                              {editingDanger &&
                              editingDanger._id === danger._id ? (
                                <input
                                  type="text"
                                  value={editingDanger.meteo}
                                  onChange={(e) =>
                                    setEditingDanger({
                                      ...editingDanger,
                                      meteo: e.target.value,
                                    })
                                  }
                                  className="border px-2 py-1 rounded-md w-full"
                                />
                              ) : (
                                danger.meteo
                              )}
                            </TableCell>

                            <TableCell>
                              {editingDanger &&
                              editingDanger._id === danger._id ? (
                                <input
                                  type="text"
                                  value={editingDanger.health_issues}
                                  onChange={(e) =>
                                    setEditingDanger({
                                      ...editingDanger,
                                      health_issues: e.target.value,
                                    })
                                  }
                                  className="border px-2 py-1 rounded-md w-full"
                                />
                              ) : (
                                danger.health_issues
                              )}
                            </TableCell>
                            <TableCell>
                              {editingDanger &&
                              editingDanger._id === danger._id ? (
                                <input
                                  type="text"
                                  value={editingDanger.poison}
                                  onChange={(e) =>
                                    setEditingDanger({
                                      ...editingDanger,
                                      poison: e.target.value,
                                    })
                                  }
                                  className="border px-2 py-1 rounded-md w-full"
                                />
                              ) : (
                                danger.poison
                              )}
                            </TableCell>
                            <TableCell>
                              {editingDanger &&
                              editingDanger._id === danger._id ? (
                                <input
                                  type="text"
                                  value={editingDanger.natural_disasters}
                                  onChange={(e) =>
                                    setEditingDanger({
                                      ...editingDanger,
                                      natural_disasters: e.target.value,
                                    })
                                  }
                                  className="border px-2 py-1 rounded-md w-full"
                                />
                              ) : (
                                danger.natural_disasters
                              )}
                            </TableCell>
                            <TableCell>
                              {editingDanger &&
                              editingDanger._id === danger._id ? (
                                <input
                                  type="text"
                                  value={editingDanger.political_unrest}
                                  onChange={(e) =>
                                    setEditingDanger({
                                      ...editingDanger,
                                      political_unrest: e.target.value,
                                    })
                                  }
                                  className="border px-2 py-1 rounded-md w-full"
                                />
                              ) : (
                                danger.political_unrest
                              )}
                            </TableCell>
                            <TableCell>
                              {editingDanger &&
                              editingDanger._id === danger._id ? (
                                <input
                                  type="text"
                                  value={editingDanger.economic_crisis}
                                  onChange={(e) =>
                                    setEditingDanger({
                                      ...editingDanger,
                                      economic_crisis: e.target.value,
                                    })
                                  }
                                  className="border px-2 py-1 rounded-md w-full"
                                />
                              ) : (
                                danger.economic_crisis
                              )}
                            </TableCell>
                            <TableCell>
                              {editingDanger &&
                              editingDanger._id === danger._id ? (
                                <input
                                  type="text"
                                  value={editingDanger.car_crashes}
                                  onChange={(e) =>
                                    setEditingDanger({
                                      ...editingDanger,
                                      car_crashes: e.target.value,
                                    })
                                  }
                                  className="border px-2 py-1 rounded-md w-full"
                                />
                              ) : (
                                danger.car_crashes
                              )}
                            </TableCell>
                            <TableCell>
                              {editingDanger &&
                              editingDanger._id === danger._id ? (
                                <input
                                  type="text"
                                  value={editingDanger.fires}
                                  onChange={(e) =>
                                    setEditingDanger({
                                      ...editingDanger,
                                      fires: e.target.value,
                                    })
                                  }
                                  className="border px-2 py-1 rounded-md w-full"
                                />
                              ) : (
                                danger.fires
                              )}
                            </TableCell>
                            <TableCell>
                              {editingDanger &&
                              editingDanger._id === danger._id ? (
                                <input
                                  type="text"
                                  value={editingDanger.carnivors_zones}
                                  onChange={(e) =>
                                    setEditingDanger({
                                      ...editingDanger,
                                      carnivors_zones: e.target.value,
                                    })
                                  }
                                  className="border px-2 py-1 rounded-md w-full"
                                />
                              ) : (
                                danger.carnivors_zones
                              )}
                            </TableCell>
                            <TableCell>
                              {editingDanger &&
                              editingDanger._id === danger._id ? (
                                <input
                                  type="text"
                                  value={editingDanger.robberies}
                                  onChange={(e) =>
                                    setEditingDanger({
                                      ...editingDanger,
                                      robberies: e.target.value,
                                    })
                                  }
                                  className="border px-2 py-1 rounded-md w-full"
                                />
                              ) : (
                                danger.robberies
                              )}
                            </TableCell>
                            <TableCell>
                              {editingDanger &&
                              editingDanger._id === danger._id ? (
                                <input
                                  type="text"
                                  value={editingDanger.scams}
                                  onChange={(e) =>
                                    setEditingDanger({
                                      ...editingDanger,
                                      scams: e.target.value,
                                    })
                                  }
                                  className="border px-2 py-1 rounded-md w-full"
                                />
                              ) : (
                                danger.scams
                              )}
                            </TableCell>
                            <TableCell>
                              {editingDanger &&
                              editingDanger._id === danger._id ? (
                                <input
                                  type="text"
                                  value={editingDanger.over_tourism}
                                  onChange={(e) =>
                                    setEditingDanger({
                                      ...editingDanger,
                                      over_tourism: e.target.value,
                                    })
                                  }
                                  className="border px-2 py-1 rounded-md w-full"
                                />
                              ) : (
                                danger.over_tourism
                              )}
                            </TableCell>

                            <TableCell>
                              {editingDanger &&
                              editingDanger._id === danger._id ? (
                                <input
                                  type="text"
                                  value={editingDanger.riskValue}
                                  onChange={(e) =>
                                    setEditingDanger({
                                      ...editingDanger,
                                      riskValue: e.target.value,
                                    })
                                  }
                                  className="border px-2 py-1 rounded-md w-full"
                                />
                              ) : (
                                danger.riskValue
                              )}
                            </TableCell>

                            <TableCell>
                              {editingDanger &&
                              editingDanger._id === danger._id ? (
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
                                    onClick={() => setEditingDanger(null)}
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
                                    onClick={() => handleEdit(danger)}
                                    className="p-1"
                                  >
                                    <Edit2 className="w-4 h-4" />
                                  </Button>
                                  <Button
                                    variant="destructive"
                                    size="sm"
                                    onClick={() => handleDelete(danger._id)}
                                    className="p-1"
                                  >
                                    <Trash className="w-4 h-4" />
                                  </Button>
                                </div>
                              )}
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={16}>
                            No dangers to display.
                          </TableCell>
                        </TableRow>
                      )}
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
