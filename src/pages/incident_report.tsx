import Link from "next/link";
import { Button } from "@/components/Main/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/Main/card";
import Textarea from "@/components/Main/textarea";
import Input from "@/components/Main/input";
import { useRouter } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { Badge } from "@/components/Main/badge";
import { toast } from "sonner";
import Logo from "@/components/logo";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/Main/dropdown-menu";
import { ChevronDownIcon } from "lucide-react";
import { useState } from "react";
import { geocode } from "@/utils/geocode";

interface Suggestion {
  place_id: string;
  formatted_address: string;
}

export default function IncidentReport() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const isAuthenticated = status === "authenticated";
  const isAdmin = session?.user?.role === "admin";

  const [location, setLocation] = useState("");
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);

  const handleLogin = () => {
    router.push("/login");
  };

  const handleRefresh = () => {
    router.push("/incident_report");
  };

  const handleLogout = async () => {
    await signOut({
      callbackUrl: "/login",
    });
  };


  const handleLocationChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const inputValue = e.target.value;
    setLocation(inputValue);

    if (inputValue.length > 2) {
      try {
        const results: Suggestion[] = await geocode(inputValue);
        setSuggestions(results);
      } catch (error) {
        console.error("Geocoding error:", error);
      }
    } else {
      setSuggestions([]);
    }
  };

  const handleSuggestionClick = (suggestion: Suggestion) => {
    setLocation(suggestion.formatted_address);
    setSuggestions([]);
  };

  const handleReportSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const location = formData.get("location") as string;

    const username = session?.user?.username;

    if (!username) {
      toast.error("You must be logged in to submit a report.");
      return;
    }

    const reportData = {
      title,
      description,
      location,
      username,
    };

    try {
      const response = await fetch("/api/reports", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(reportData),
      });

      if (response.ok) {
        const result = await response.json();
        toast.success(result.message);
        clearForm();
      } else {
        toast.error("Failed to submit the report");
      }
    } catch (error) {
      console.error("Error submitting report:", error);
      toast.error("An error occurred while submitting the report");
    }
  };

  const clearForm = () => {
    (document.getElementById("title") as HTMLInputElement).value = "";
    (document.getElementById("location") as HTMLInputElement).value = "";
    (document.getElementById("description") as HTMLInputElement).value = "";
  };

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

  if (!isAuthenticated) {
    router.push("/login");
    toast.error('You should login first to access this page');
    return null;
  }

  return (
    <div className="flex flex-col min-h-screen">
      <header className="bg-[#00000] text-black py-4 px-6 flex items-center justify-between md:px-8 lg:px-10 z-10 shadow">
        <Link href="/" className="flex items-center gap-2" prefetch={false}>
          <Logo className="w-6 h-6" />
          <span className="text-lg font-bold">TravelSafe</span>
        </Link>
        <nav className="flex items-center gap-4 md:gap-6 lg:gap-8">
          <Link
            href="/risk_assesment"
            className="text-sm font-medium hover:underline underline-offset-4 md:text-base"
            prefetch={false}
          >
            Destination Risks
          </Link>
          <Link
            href="/incident_report"
            className="text-sm font-medium hover:underline underline-offset-4 md:text-base"
            prefetch={false}
          >
            Incident Reporting
          </Link>
          {isAdmin && (
            <Link
              href="/admin_dash"
              className="text-sm font-medium hover:underline underline-offset-4 md:text-base"
              prefetch={false}
            >
              Admin
            </Link>
          )}
        </nav>
        {isAuthenticated ? (
          <>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <div className="flex items-center space-x-1">
                  <span className="text-sm font-medium text-black">
                    Welcome, {session.user?.username}
                  </span>
                  <ChevronDownIcon className="w-4 h-4" />
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>{session.user?.username}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Settings</DropdownMenuItem>
                <DropdownMenuItem onSelect={handleLogout}>
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </>
        ) : (
          <Button size="sm" onClick={handleLogin}>
            Login
          </Button>
        )}
      </header>
      <div className="flex-1 grid grid-cols-1 md:grid-cols-[300px_1fr] bg-[#f8f9fa]">
        <div className="bg-white p-6 border-r md:p-8 lg:p-10">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold md:text-xl lg:text-2xl">
              Travel Risk
            </h3>
            <Button size="sm" onClick={handleRefresh}>
              Refresh
            </Button>
          </div>
          <div className="space-y-4 md:space-y-6 lg:space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>High-Risk Destinations</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 md:space-y-3 lg:space-y-4">
                  <li className="flex items-center justify-between">
                    <div className="font-medium">Conflict Zones</div>
                    <Badge variant="default">Critical</Badge>
                  </li>
                  <li className="flex items-center justify-between">
                    <div className="font-medium">Natural Disaster Areas</div>
                    <Badge variant="default">Critical</Badge>
                  </li>
                  <li className="flex items-center justify-between">
                    <div className="font-medium">High Crime Locations</div>
                    <Badge variant="default">Critical</Badge>
                  </li>
                </ul>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Upcoming Travel Risks</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 md:space-y-3 lg:space-y-4">
                  <li className="flex items-center justify-between">
                    <div className="font-medium">Political Unrest</div>
                    <Badge variant="default">High</Badge>
                  </li>
                  <li className="flex items-center justify-between">
                    <div className="font-medium">Disease Outbreaks</div>
                    <Badge variant="default">High</Badge>
                  </li>
                  <li className="flex items-center justify-between">
                    <div className="font-medium">
                      Transportation Disruptions
                    </div>
                    <Badge variant="default">High</Badge>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
        <div className="bg-white p-6 border-r md:p-8 lg:p-10">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold md:text-xl lg:text-2xl">
              Incident Reporting
            </h3>
          </div>
          <Card>
            <CardHeader>
              <CardTitle>Submit an Incident Report</CardTitle>
              <CardDescription>
                Please provide detailed information about the incident you want
                to report.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form
                onSubmit={handleReportSubmit}
                className="space-y-4 md:space-y-6 lg:space-y-8"
              >
                <div>
                  <label
                    htmlFor="title"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Incident Title
                  </label>
                  <Input id="title" name="title" type="text" required />
                </div>
                <div>
                  <label
                    htmlFor="location"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Location
                  </label>
                  <Input
                    id="location"
                    name="location"
                    type="text"
                    value={location}
                    onChange={handleLocationChange}
                    required
                  />
                  {suggestions.length > 0 && (
                    <ul className="bg-white border border-gray-300 rounded mt-1">
                      {suggestions.map((suggestion) => (
                        <li
                          key={suggestion.place_id}
                          className="p-2 text-black cursor-pointer hover:bg-gray-100"
                          onClick={() => handleSuggestionClick(suggestion)}
                        >
                          {suggestion.formatted_address}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
                <div>
                  <label
                    htmlFor="description"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Description
                  </label>
                  <Textarea
                    id="description"
                    name="description"
                    rows={5}
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="date"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Date
                  </label>
                  <Input id="date" name="date" type="date" required />
                </div>
                <div>
                  <label
                    htmlFor="status"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Status
                  </label>
                  <select
                    id="status"
                    name="status"
                    className="block w-full mt-1 p-2 border border-gray-300 rounded"
                    defaultValue="open"
                  >
                    <option value="open">Open</option>
                    <option value="resolved">Resolved</option>
                  </select>
                </div>
                <div>
                  <Button type="submit" className="w-full">
                    Submit Report
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
