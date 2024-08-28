import Link from "next/link";
import { Button } from "@/components/Main/button";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/Main/card";
import { Badge } from "@/components/Main/badge";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/Main/table";
import DangerZones from "@/components/Main/danger-zones";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";


export function Main() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const isAuthenticated = status === "authenticated";

  const handleLogin = () => {
    router.push("/login"); 
  };

  const handleRefresh = () => {
    router.push("/"); 
  };

  return (
    <div className="flex flex-col min-h-screen">
      <header className="bg-[#007bff] text-white py-4 px-6 flex items-center justify-between md:px-8 lg:px-10">
        <Link href="/" className="flex items-center gap-2" prefetch={false}>
          <BeanIcon className="w-6 h-6" />
          <span className="text-lg font-bold">TravelSafe</span>
        </Link>
        <nav className="flex items-center gap-4 md:gap-6 lg:gap-8">
          <Link href="#" className="text-sm font-medium hover:underline underline-offset-4 md:text-base" prefetch={false}>
            Destination Risks
          </Link>
          <Link href="/incident_report" className="text-sm font-medium hover:underline underline-offset-4 md:text-base" prefetch={false}>
            Incident Reporting
          </Link>
        </nav>
        {isAuthenticated ? (
          <span className="text-sm font-medium text-white">
            Welcome, {session.user?.username}
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
        <div className="p-6 md:p-8 lg:p-10">
          <div className="flex items-center justify-between mb-6 md:mb-8 lg:mb-10">
            <h2 className="text-2xl font-bold md:text-3xl lg:text-4xl">
              Travel Risk Assessment
            </h2>
          </div>
          <Card>
            <CardHeader>
              <CardTitle>Travel Risk Map</CardTitle>
              <CardDescription>
                Evaluate the likelihood and impact of potential risks across different destinations.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="relative w-full h-[400px] md:h-[600px] lg:h-[600px]">
                <DangerZones />
              </div>
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
