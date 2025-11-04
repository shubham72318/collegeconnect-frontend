import { Link } from "react-router-dom";
import { GraduationCap, Building2, Users, ArrowRight, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const Landing = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-green-50">
      {/* Navigation */}
      <nav className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <GraduationCap className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold">CollegeConnect</span>
          </div>
          <Button asChild variant="outline">
            <Link to="/login">Sign In</Link>
          </Button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-600 via-purple-600 to-green-600 bg-clip-text text-transparent">
            Connecting Colleges, Companies & Students
          </h1>
          <p className="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto">
            A unified platform that bridges the gap between educational institutions, 
            corporate recruiters, and talented students seeking opportunities.
          </p>

          {/* Role Cards */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <Card className="p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-2 hover:border-blue-500">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <GraduationCap className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">For Colleges</h3>
              <p className="text-muted-foreground mb-4">
                Manage student placements, approve companies, and track placement records
              </p>
              <Button asChild className="w-full bg-blue-600 hover:bg-blue-700">
                <Link to="/login?role=college">
                  College Login <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </Card>

            <Card className="p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-2 hover:border-green-500">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Building2 className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">For Companies</h3>
              <p className="text-muted-foreground mb-4">
                Post opportunities, review applications, and hire talented students
              </p>
              <Button asChild className="w-full bg-green-600 hover:bg-green-700">
                <Link to="/login?role=company">
                  Company Login <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </Card>

            <Card className="p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-2 hover:border-purple-500">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">For Students</h3>
              <p className="text-muted-foreground mb-4">
                Explore opportunities, apply for jobs, and track your applications
              </p>
              <Button asChild className="w-full bg-purple-600 hover:bg-purple-700">
                <Link to="/login?role=student">
                  Student Login <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </Card>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-white py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Why CollegeConnect?</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              A comprehensive solution designed to streamline the placement process
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: "Easy Management", description: "Streamlined dashboard for all stakeholders" },
              { title: "Real-time Updates", description: "Track applications and approvals instantly" },
              { title: "Secure Platform", description: "Role-based access and data protection" },
              { title: "Smart Matching", description: "Connect the right talent with opportunities" }
            ].map((feature, index) => (
              <div key={index} className="text-center p-6">
                <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-4" />
                <h3 className="font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <GraduationCap className="h-6 w-6" />
            <span className="text-xl font-bold">CollegeConnect</span>
          </div>
          <p className="text-gray-400">
            © 2024 CollegeConnect. Bridging education and employment.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
