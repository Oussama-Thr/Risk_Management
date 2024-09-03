import Link from "next/link";
import { Button } from "@/components/Main/button";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/Main/accordion";
import {
  SearchIcon,
  ClipboardIcon,
  ShieldCheckIcon,
  ChevronDownIcon,
  CircleCheckIcon,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
} from "@/components/Main/dropdown-menu";
import { useRouter } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import Logo from "@/components/logo";

export default function Main() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const isAuthenticated = status === "authenticated";
  const isAdmin = session?.user?.role === "admin";

  const handleLogin = () => {
    router.push("/login");
  };

  const handleRefresh = () => {
    router.push("/");
  };

  const handleLogout = async () => {
    await signOut({
      callbackUrl: "/login",
    });
  };

  return (
    <div className="flex flex-col min-h-screen bg-backgroud">
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
      <main className="flex-1">
        <section className="py-12 md:py-24">
          <div className="container px-4 md:px-6">
            <div className="mx-auto max-w-3xl space-y-6 text-center">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                Travel Risk Management
              </h1>
              <p className="text-muted-foreground text-base md:text-lg">
                Discover comprehensive strategies to manage travel risks
                effectively and ensure safe and successful journeys.
              </p>
            </div>
          </div>
        </section>
        <section className="py-12 md:py-24">
          <div className="container px-4 md:px-6">
            <div className="mx-auto max-w-3xl space-y-8">
              <Accordion type="single" collapsible>
                <AccordionItem value="risk-identification">
                  <AccordionTrigger className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <SearchIcon className="h-6 w-6 text-primary" />
                      <h2 className="text-lg font-bold sm:text-xl">
                        Risk Identification
                      </h2>
                    </div>
                    <ChevronDownIcon className="h-5 w-5 transition-transform group-[data-state=open]:rotate-180" />
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-4 pt-4">
                      <p className="text-muted-foreground text-sm md:text-base">
                        The first step in managing travel risks is identifying
                        potential hazards and threats that could affect
                        travelers. This involves evaluating both domestic and
                        international risks to ensure safety and preparedness.
                      </p>
                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div className="rounded-lg border bg-background p-4 shadow-sm">
                          <h3 className="text-md font-bold sm:text-lg">
                            Domestic Risk Factors
                          </h3>
                          <ul className="mt-2 space-y-2 text-muted-foreground text-sm md:text-base">
                            <li>
                              <CircleCheckIcon className="mr-2 inline-block h-5 w-5 text-primary" />
                              Health risks
                            </li>
                            <li>
                              <CircleCheckIcon className="mr-2 inline-block h-5 w-5 text-primary" />
                              Safety concerns
                            </li>
                            <li>
                              <CircleCheckIcon className="mr-2 inline-block h-5 w-5 text-primary" />
                              Political instability
                            </li>
                            <li>
                              <CircleCheckIcon className="mr-2 inline-block h-5 w-5 text-primary" />
                              Weather conditions
                            </li>
                          </ul>
                        </div>
                        <div className="rounded-lg border bg-background p-4 shadow-sm">
                          <h3 className="text-md font-bold sm:text-lg">
                            International Risk Factors
                          </h3>
                          <ul className="mt-2 space-y-2 text-muted-foreground text-sm md:text-base">
                            <li>
                              <CircleCheckIcon className="mr-2 inline-block h-5 w-5 text-primary" />
                              Political instability
                            </li>
                            <li>
                              <CircleCheckIcon className="mr-2 inline-block h-5 w-5 text-primary" />
                              Health and medical issues
                            </li>
                            <li>
                              <CircleCheckIcon className="mr-2 inline-block h-5 w-5 text-primary" />
                              Travel advisories
                            </li>
                            <li>
                              <CircleCheckIcon className="mr-2 inline-block h-5 w-5 text-primary" />
                              Cultural differences
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
              <Accordion type="single" collapsible>
                <AccordionItem value="risk-assessment">
                  <AccordionTrigger className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <ClipboardIcon className="h-6 w-6 text-primary" />
                      <h2 className="text-lg font-bold sm:text-xl">
                        Risk Assessment
                      </h2>
                    </div>
                    <ChevronDownIcon className="h-5 w-5 transition-transform group-[data-state=open]:rotate-180" />
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-4 pt-4">
                      <p className="text-muted-foreground text-sm md:text-base">
                        After identifying potential travel risks, the next step
                        is to assess their likelihood and impact. This helps
                        prioritize risks and allocate resources effectively to
                        manage them.
                      </p>
                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div className="rounded-lg border bg-background p-4 shadow-sm">
                          <h3 className="text-md font-bold sm:text-lg">
                            Likelihood Assessment
                          </h3>
                          <ul className="mt-2 space-y-2 text-muted-foreground text-sm md:text-base">
                            <li>
                              <CircleCheckIcon className="mr-2 inline-block h-5 w-5 text-primary" />
                              Probability of occurrence
                            </li>
                            <li>
                              <CircleCheckIcon className="mr-2 inline-block h-5 w-5 text-primary" />
                              Historical trends
                            </li>
                            <li>
                              <CircleCheckIcon className="mr-2 inline-block h-5 w-5 text-primary" />
                              Expert opinions
                            </li>
                            <li>
                              <CircleCheckIcon className="mr-2 inline-block h-5 w-5 text-primary" />
                              Scenario planning
                            </li>
                          </ul>
                        </div>
                        <div className="rounded-lg border bg-background p-4 shadow-sm">
                          <h3 className="text-md font-bold sm:text-lg">
                            Impact Assessment
                          </h3>
                          <ul className="mt-2 space-y-2 text-muted-foreground text-sm md:text-base">
                            <li>
                              <CircleCheckIcon className="mr-2 inline-block h-5 w-5 text-primary" />
                              Financial implications
                            </li>
                            <li>
                              <CircleCheckIcon className="mr-2 inline-block h-5 w-5 text-primary" />
                              Safety and health concerns
                            </li>
                            <li>
                              <CircleCheckIcon className="mr-2 inline-block h-5 w-5 text-primary" />
                              Legal consequences
                            </li>
                            <li>
                              <CircleCheckIcon className="mr-2 inline-block h-5 w-5 text-primary" />
                              Reputational damage
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
              <Accordion type="single" collapsible>
                <AccordionItem value="risk-mitigation">
                  <AccordionTrigger className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <ShieldCheckIcon className="h-6 w-6 text-primary" />
                      <h2 className="text-lg font-bold sm:text-xl">
                        Risk Mitigation
                      </h2>
                    </div>
                    <ChevronDownIcon className="h-5 w-5 transition-transform group-[data-state=open]:rotate-180" />
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-4 pt-4">
                      <p className="text-muted-foreground text-sm md:text-base">
                        Developing and implementing strategies to minimize or
                        manage identified risks effectively. This includes
                        creating action plans, establishing protocols, and
                        ensuring continuous monitoring.
                      </p>
                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div className="rounded-lg border bg-background p-4 shadow-sm">
                          <h3 className="text-md font-bold sm:text-lg">
                            Mitigation Strategies
                          </h3>
                          <ul className="mt-2 space-y-2 text-muted-foreground text-sm md:text-base">
                            <li>
                              <CircleCheckIcon className="mr-2 inline-block h-5 w-5 text-primary" />
                              Emergency preparedness
                            </li>
                            <li>
                              <CircleCheckIcon className="mr-2 inline-block h-5 w-5 text-primary" />
                              Health and safety measures
                            </li>
                            <li>
                              <CircleCheckIcon className="mr-2 inline-block h-5 w-5 text-primary" />
                              Travel advisories and updates
                            </li>
                            <li>
                              <CircleCheckIcon className="mr-2 inline-block h-5 w-5 text-primary" />
                              Insurance coverage
                            </li>
                          </ul>
                        </div>
                        <div className="rounded-lg border bg-background p-4 shadow-sm">
                          <h3 className="text-md font-bold sm:text-lg">
                            Monitoring and Review
                          </h3>
                          <ul className="mt-2 space-y-2 text-muted-foreground text-sm md:text-base">
                            <li>
                              <CircleCheckIcon className="mr-2 inline-block h-5 w-5 text-primary" />
                              Regular risk reviews
                            </li>
                            <li>
                              <CircleCheckIcon className="mr-2 inline-block h-5 w-5 text-primary" />
                              Incident tracking and reporting
                            </li>
                            <li>
                              <CircleCheckIcon className="mr-2 inline-block h-5 w-5 text-primary" />
                              Feedback collection and analysis
                            </li>
                            <li>
                              <CircleCheckIcon className="mr-2 inline-block h-5 w-5 text-primary" />
                              Adjustments to strategies as needed
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </div>
        </section>
      </main>
      <footer className="bg-background py-4 text-center">
        <p className="text-sm text-muted-foreground">
          © 2024 TravelSafe. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
