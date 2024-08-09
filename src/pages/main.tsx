import Link from "next/link"
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuItem } from "@/ui/dropdown-menu"
import { Button } from "@/ui/button"
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/ui/card"
import { Badge } from "@/ui/badge"
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/ui/table"
import { Progress } from "@/ui/progress"
import { ChartTooltipContent, ChartTooltip, ChartContainer } from "@/ui/chart"
import { PolarAngleAxis, PolarGrid, Radar, RadarChart, CartesianGrid, XAxis, Line, LineChart } from "recharts"
import DangerZones from "@/ui/danger-zones";

export function Component() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="bg-[#007bff] text-white py-4 px-6 flex items-center justify-between md:px-8 lg:px-10">
        <Link href="#" className="flex items-center gap-2" prefetch={false}>
          <BeanIcon className="w-6 h-6" />
          <span className="text-lg font-bold">Travel Risk Management</span>
        </Link>
        <nav className="flex items-center gap-4 md:gap-6 lg:gap-8">
          <Link
            href="#"
            className="text-sm font-medium hover:underline underline-offset-4 md:text-base"
            prefetch={false}
          >
            Destination Risks
          </Link>
          {/* <Link
            href="#"
            className="text-sm font-medium hover:underline underline-offset-4 md:text-base"
            prefetch={false}
          >
            Travel Advisories
          </Link>
          <Link
            href="#"
            className="text-sm font-medium hover:underline underline-offset-4 md:text-base"
            prefetch={false}
          >
            Emergency Response
          </Link> */}
          <Link
            href="#"
            className="text-sm font-medium hover:underline underline-offset-4 md:text-base"
            prefetch={false}
          >
            Incident Reporting
          </Link>
        </nav>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon" className="overflow-hidden rounded-full">
              <img
                src="/placeholder.svg"
                width={36}
                height={36}
                alt="Avatar"
                className="overflow-hidden rounded-full"
              />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>John Doe</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Settings</DropdownMenuItem>
            <DropdownMenuItem>Logout</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </header>
      <div className="flex-1 grid grid-cols-1 md:grid-cols-[280px_1fr] bg-[#f8f9fa]">
        <div className="bg-white p-6 border-r md:p-8 lg:p-10">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold md:text-xl lg:text-2xl">Travel Risk Dashboard</h3>
            <Button size="sm">Refresh</Button>
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
            <Card>
              <CardHeader>
                <CardTitle>Travel Alerts</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 md:space-y-3 lg:space-y-4">
                  <li className="flex items-center justify-between">
                    <div className="font-medium">Terrorist Threat Detected</div>
                    <Badge variant="default">New</Badge>
                  </li>
                  <li className="flex items-center justify-between">
                    <div className="font-medium">Hurricane Warning Issued</div>
                    <Badge variant="default">Upcoming</Badge>
                  </li>
                  <li className="flex items-center justify-between">
                    <div className="font-medium">Travel Advisory Updated</div>
                    <Badge variant="default">New</Badge>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
        <div className="p-6 md:p-8 lg:p-10">
          <div className="flex items-center justify-between mb-6 md:mb-8 lg:mb-10">
            <h2 className="text-2xl font-bold md:text-3xl lg:text-4xl">Travel Risk Assessment</h2>
            {/* <div className="flex items-center gap-4 md:gap-6 lg:gap-8">
              <Button size="sm" variant="outline">
                Export
              </Button>
              <Button size="sm">Assess Risk</Button>
            </div> */}
          </div>
          <Card>
            <CardHeader>
              <CardTitle>Travel Risk Map</CardTitle>
              <CardDescription>
                Evaluate the likelihood and impact of potential risks across different destinations.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="relative w-full h-[400px] md:h-[600px] lg:h-[800px]">
                <DangerZones />
                {/* <div className="absolute inset-0 flex flex-col justify-between p-4 md:p-6 lg:p-8">
                  <div className="grid grid-cols-3 gap-4 md:gap-6 lg:gap-8">
                    <div className="bg-white p-4 rounded-md shadow-md">
                      <div className="text-sm font-medium">Destination A</div>
                      <div className="text-2xl font-bold">75%</div>
                    </div>
                    <div className="bg-white p-4 rounded-md shadow-md">
                      <div className="text-sm font-medium">Destination B</div>
                      <div className="text-2xl font-bold">50%</div>
                    </div>
                    <div className="bg-white p-4 rounded-md shadow-md">
                      <div className="text-sm font-medium">Destination C</div>
                      <div className="text-2xl font-bold">25%</div>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-4 md:gap-6 lg:gap-8">
                    <div className="bg-white p-4 rounded-md shadow-md">
                      <div className="text-sm font-medium">Destination D</div>
                      <div className="text-2xl font-bold">90%</div>
                    </div>
                    <div className="bg-white p-4 rounded-md shadow-md">
                      <div className="text-sm font-medium">Destination E</div>
                      <div className="text-2xl font-bold">60%</div>
                    </div>
                    <div className="bg-white p-4 rounded-md shadow-md">
                      <div className="text-sm font-medium">Destination F</div>
                      <div className="text-2xl font-bold">35%</div>
                    </div>
                  </div>
                </div> */}
              </div>
            </CardContent>
          </Card>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6 md:mt-8 lg:mt-10">
            <Card>
              <CardHeader>
                <CardTitle>Travel Risk Mitigation</CardTitle>
                <CardDescription>Explore effective strategies to mitigate identified travel risks.</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Risk</TableHead>
                      <TableHead>Mitigation Strategy</TableHead>
                      <TableHead>Effectiveness</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell>Conflict Zones</TableCell>
                      <TableCell>Avoid travel to high-risk areas</TableCell>
                      <TableCell>
                        <Progress value={80} aria-label="80% effective" />
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Natural Disasters</TableCell>
                      <TableCell>Monitor weather patterns and alerts</TableCell>
                      <TableCell>
                        <Progress value={70} aria-label="70% effective" />
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>High Crime Locations</TableCell>
                      <TableCell>Implement security protocols and awareness</TableCell>
                      <TableCell>
                        <Progress value={90} aria-label="90% effective" />
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Travel Risk Monitoring</CardTitle>
                <CardDescription>Track and monitor key travel risk indicators in real-time.</CardDescription>
              </CardHeader>
              <CardContent>
                <RadarchartChart className="aspect-[4/3] md:aspect-[16/9] lg:aspect-[21/9]" />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
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
  )
}

interface ChartProps {
  className?: string;
}

function LinechartChart({ className }: ChartProps) {
  return (
    <div className={className}>
      <ChartContainer
        config={{
          desktop: {
            label: "Desktop",
            color: "hsl(var(--chart-1))",
          },
        }}
      >
        <LineChart
          accessibilityLayer
          data={[
            { month: "January", desktop: 186 },
            { month: "February", desktop: 305 },
            { month: "March", desktop: 237 },
            { month: "April", desktop: 73 },
            { month: "May", desktop: 209 },
            { month: "June", desktop: 214 },
          ]}
          margin={{
            left: 12,
            right: 12,
          }}
        >
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="month"
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            tickFormatter={(value) => value.slice(0, 3)}
          />
          <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
          <Line dataKey="desktop" type="natural" stroke="var(--color-desktop)" strokeWidth={2} dot={false} />
        </LineChart>
      </ChartContainer>
    </div>
  )
}


function RadarchartChart({ className }: ChartProps) {
  return (
    <div className={className}>
      <ChartContainer
        config={{
          desktop: {
            label: "Desktop",
            color: "hsl(var(--chart-1))",
          },
        }}
        className="mx-auto aspect-square max-h-[250px]"
      >
        <RadarChart
          data={[
            { month: "January", desktop: 186 },
            { month: "February", desktop: 305 },
            { month: "March", desktop: 237 },
            { month: "April", desktop: 273 },
            { month: "May", desktop: 209 },
            { month: "June", desktop: 214 },
          ]}
        >
          <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
          <PolarAngleAxis dataKey="month" />
          <PolarGrid />
          <Radar dataKey="desktop" fill="var(--color-desktop)" fillOpacity={0.6} />
        </RadarChart>
      </ChartContainer>
    </div>
  )
}

interface XIconProps extends React.SVGProps<SVGSVGElement> {}

function XIcon(props: XIconProps) {
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
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  )
}
