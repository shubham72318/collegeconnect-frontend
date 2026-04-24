import { Link } from "react-router-dom";
import {
  GraduationCap,
  Building2,
  Users,
  ArrowRight,
  CheckCircle2,
  Briefcase,
  ShieldCheck,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const Landing = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Navigation */}
      <nav className="border-b border-border/60 bg-background/80 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-lg bg-gradient-to-br from-blue-600 to-emerald-500 flex items-center justify-center text-white font-bold text-sm shadow-sm">
              CC
            </div>
            <span className="text-lg font-semibold tracking-tight">
              CollegeConnect
            </span>
          </Link>
          <div className="flex items-center gap-2">
            <Button asChild variant="ghost" size="sm">
              <Link to="/login">Sign in</Link>
            </Button>
            <Button asChild size="sm">
              <Link to="/signup">Get started</Link>
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(60%_50%_at_50%_0%,hsl(var(--primary)/0.08),transparent_70%)]" />
        <div className="container mx-auto px-6 pt-20 pb-16">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-muted/40 px-3 py-1 text-xs font-medium text-muted-foreground mb-6">
              <Sparkles className="h-3.5 w-3.5 text-primary" />
              The modern campus placement platform
            </div>
            <h1 className="text-4xl md:text-6xl font-semibold tracking-tight leading-[1.05] mb-6">
              Where colleges, companies
              <br />
              and students{" "}
              <span className="bg-gradient-to-r from-blue-600 to-emerald-500 bg-clip-text text-transparent">
                actually connect
              </span>
              .
            </h1>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
              One workspace to post drives, approve recruiters, and apply to
              opportunities — built for placement cells that are tired of
              spreadsheets and email threads.
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              <Button asChild size="lg" className="h-11 px-6">
                <Link to="/signup">
                  Get started free <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="h-11 px-6">
                <Link to="/login">Sign in</Link>
              </Button>
            </div>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" /> No
                credit card required
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />{" "}
                Role-based access
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />{" "}
                Real-time approvals
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Role Cards */}
      <section className="container mx-auto px-6 pb-20">
        <div className="grid md:grid-cols-3 gap-5 max-w-5xl mx-auto">
          {[
            {
              icon: GraduationCap,
              title: "Colleges",
              copy: "Approve recruiters, manage student rosters, and track placement outcomes from a single dashboard.",
              cta: "College sign in",
              href: "/login?role=college",
              tone: "blue",
            },
            {
              icon: Building2,
              title: "Companies",
              copy: "Post drives, reach pre-vetted candidates from partner colleges, and shortlist with one click.",
              cta: "Company sign in",
              href: "/login?role=company",
              tone: "emerald",
            },
            {
              icon: Users,
              title: "Students",
              copy: "Discover approved opportunities, apply in seconds, and see your application status update live.",
              cta: "Student sign in",
              href: "/login?role=student",
              tone: "violet",
            },
          ].map(({ icon: Icon, title, copy, cta, href, tone }) => {
            const tones: Record<string, string> = {
              blue: "text-blue-600 bg-blue-50 group-hover:bg-blue-100 dark:bg-blue-950/40 dark:group-hover:bg-blue-950/70",
              emerald:
                "text-emerald-600 bg-emerald-50 group-hover:bg-emerald-100 dark:bg-emerald-950/40 dark:group-hover:bg-emerald-950/70",
              violet:
                "text-violet-600 bg-violet-50 group-hover:bg-violet-100 dark:bg-violet-950/40 dark:group-hover:bg-violet-950/70",
            };
            return (
              <Card
                key={title}
                className="group p-6 border-border/70 hover:border-foreground/20 transition-colors"
              >
                <div
                  className={`h-10 w-10 rounded-lg flex items-center justify-center mb-5 transition-colors ${tones[tone]}`}
                >
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="text-base font-semibold mb-2">For {title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed mb-6">
                  {copy}
                </p>
                <Button
                  asChild
                  variant="ghost"
                  size="sm"
                  className="-ml-3 text-foreground"
                >
                  <Link to={href}>
                    {cta} <ArrowRight className="ml-1 h-3.5 w-3.5" />
                  </Link>
                </Button>
              </Card>
            );
          })}
        </div>
      </section>

      {/* Features */}
      <section className="border-t border-border/60 bg-muted/30 py-20">
        <div className="container mx-auto px-6">
          <div className="max-w-2xl mb-14">
            <h2 className="text-3xl md:text-4xl font-semibold tracking-tight mb-3">
              Everything a placement cell needs.
            </h2>
            <p className="text-muted-foreground">
              Replace scattered Google Forms, WhatsApp groups and Excel sheets
              with one focused workflow.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-px bg-border/60 rounded-xl overflow-hidden border border-border/60">
            {[
              {
                icon: Briefcase,
                title: "Drive management",
                desc: "Companies post once, eligible colleges and students see it instantly.",
              },
              {
                icon: ShieldCheck,
                title: "Approval workflow",
                desc: "Colleges control who can recruit their students with one-click approvals.",
              },
              {
                icon: TrendingUp,
                title: "Live status",
                desc: "Students track applications and shortlists without refreshing email.",
              },
              {
                icon: CheckCircle2,
                title: "Role-based access",
                desc: "Secure permissions per role — students never see admin tools.",
              },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="bg-background p-6">
                <Icon className="h-5 w-5 text-primary mb-4" />
                <h3 className="font-semibold mb-1.5 text-sm">{title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="container mx-auto px-6 py-20">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-semibold tracking-tight mb-4">
            Ready to run your next placement season?
          </h2>
          <p className="text-muted-foreground mb-8">
            Set up your account in under two minutes. No installation, no IT
            ticket.
          </p>
          <Button asChild size="lg" className="h-11 px-6">
            <Link to="/signup">
              Create your account <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/60">
        <div className="container mx-auto px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="h-7 w-7 rounded-md bg-gradient-to-br from-blue-600 to-emerald-500 flex items-center justify-center text-white font-bold text-xs">
              CC
            </div>
            <span className="text-sm font-medium">CollegeConnect</span>
          </div>
          <p className="text-xs text-muted-foreground">
            © 2024 CollegeConnect. Bridging education and employment.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
