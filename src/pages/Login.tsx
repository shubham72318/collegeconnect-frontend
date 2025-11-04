import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { GraduationCap, Building2, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";

const Login = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const defaultRole = searchParams.get("role") || "student";
  const [role, setRole] = useState(defaultRole);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Mock authentication
    if (email && password) {
      toast.success("Login successful!");
      
      // Navigate to respective dashboard
      switch (role) {
        case "college":
          navigate("/college/dashboard");
          break;
        case "company":
          navigate("/company/dashboard");
          break;
        case "student":
          navigate("/student/dashboard");
          break;
      }
    } else {
      toast.error("Please fill in all fields");
    }
  };

  const getRoleColor = () => {
    switch (role) {
      case "college": return "text-blue-600";
      case "company": return "text-green-600";
      case "student": return "text-purple-600";
      default: return "text-primary";
    }
  };

  const getRoleIcon = () => {
    switch (role) {
      case "college": return <GraduationCap className="h-8 w-8" />;
      case "company": return <Building2 className="h-8 w-8" />;
      case "student": return <Users className="h-8 w-8" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-green-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${
            role === "college" ? "bg-blue-100" :
            role === "company" ? "bg-green-100" :
            "bg-purple-100"
          }`}>
            <div className={getRoleColor()}>
              {getRoleIcon()}
            </div>
          </div>
          <CardTitle className="text-2xl">Welcome Back</CardTitle>
          <CardDescription>Sign in to your account</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={role} onValueChange={setRole} className="mb-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="college">College</TabsTrigger>
              <TabsTrigger value="company">Company</TabsTrigger>
              <TabsTrigger value="student">Student</TabsTrigger>
            </TabsList>
          </Tabs>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="your.email@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button 
              type="submit" 
              className={`w-full ${
                role === "college" ? "bg-blue-600 hover:bg-blue-700" :
                role === "company" ? "bg-green-600 hover:bg-green-700" :
                "bg-purple-600 hover:bg-purple-700"
              }`}
            >
              Sign In
            </Button>
          </form>

          <div className="mt-4 text-center text-sm">
            <span className="text-muted-foreground">Don't have an account? </span>
            <Link to="/signup" className={`font-medium ${getRoleColor()} hover:underline`}>
              Sign up
            </Link>
          </div>

          <div className="mt-6 text-center">
            <Link to="/" className="text-sm text-muted-foreground hover:underline">
              ← Back to home
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
