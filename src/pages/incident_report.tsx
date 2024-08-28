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
import { useSession } from "next-auth/react";
import { Badge } from "@/components/Main/badge";

export default function IncidentReport() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const isAuthenticated = status === "authenticated";

  const handleLogin = () => {
    router.push("/login");
  };
  const handleRefresh = () => {
    router.push("/incident_report"); 
  };

  const handleReportSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  
    // Get the form data
    const formData = new FormData(e.currentTarget);
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const location = formData.get('location') as string;
  
    // Get the username from the session
    const { data: session } = useSession();
    const username = session?.user?.username;
  
    if (!username) {
      alert('You must be logged in to submit a report.');
      return;
    }
  
    // Prepare the report data
    const reportData = {
      title,
      description,
      location,
      username,
    };
  
    // Send a POST request to the API endpoint
    try {
      const response = await fetch('/api/reports', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(reportData),
      });
  
      if (response.ok) {
        const result = await response.json();
        alert(result.message); // Show success message
      } else {
        alert('Failed to submit the report');
      }
    } catch (error) {
      console.error('Error submitting report:', error);
      alert('An error occurred while submitting the report');
    }
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
    return null;
  }

  return (
    <div className="flex flex-col min-h-screen">
      <header className="bg-[#007bff] text-white py-4 px-6 flex items-center justify-between md:px-8 lg:px-10">
        <Link href="/" className="flex items-center gap-2" prefetch={false}>
          <BeanIcon className="w-6 h-6" />
          <span className="text-lg font-bold">TravelSafe</span>
        </Link>
        <nav className="flex items-center gap-4 md:gap-6 lg:gap-8">
          <Link
            href="#"
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
        </nav>
        {isAuthenticated ? (
          <span className="text-sm font-medium text-white">
            Welcome, {session.user?.name}
          </span>
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
            <Button size="sm" onClick={handleRefresh}>Refresh</Button>
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
                    <div className="font-medium">Transportation Disruptions</div>
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
                  <Input id="title" type="text" required />
                </div>
                <div>
                  <label
                    htmlFor="location"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Location
                  </label>
                  <Input id="location" type="text" required />
                </div>
                <div>
                  <label
                    htmlFor="description"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Description
                  </label>
                  <Textarea id="description" rows={5} required />
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

interface BeanIconProps extends React.SVGProps<SVGSVGElement> {}
function BeanIcon(props: BeanIconProps) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M10.165 6.598C9.954 7.478 9.64 8.36 9 9c-.64.64-1.521.954-2.402 1.165A6 6 0 0 0 8 22c7.732 0 14-6.268 14-14a6 6 0 0 0-11.835-1.402Z" />
      <path d="M5.341 10.62a4 4 0 1 0 5.279-5.28" />
    </svg>
  );
}
