import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Activity, AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { authAPI } from "../../lib/api";

function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please enter email and password");
      return;
    }

    try {
      // PROMPT 2.2: Auth Flow - Real implementation
      const response = await authAPI.login(email, password);

      // Store token for api.js helper
      if (response.token) {
        localStorage.setItem("authToken", response.token);
        // Store user info
        localStorage.setItem("user", JSON.stringify({
          name: response.name,
          email: response.email,
          role: response.role,
          _id: response._id
        }));

        // Navigation based on role
        if (response.role === "doctor") {
          navigate("/doctor/dashboard");
        } else if (response.role === "admin") {
          navigate("/admin/dashboard");
        } else {
          navigate("/patient/dashboard");
        }
      } else {
        setError("Login failed: No token received");
      }

    } catch (err) {
      console.error(err);
      setError(err.message || "Invalid credentials. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 to-teal-50 flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-cyan-600 to-teal-500 rounded-xl flex items-center justify-center">
              <Activity className="w-7 h-7 text-white" />
            </div>
            <span className="text-2xl font-bold">MedAI Care</span>
          </div>
          <p className="text-gray-600">Sign in to your account</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Welcome Back</CardTitle>
            <CardDescription>Enter your credentials to access your account</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-center gap-2 text-sm text-red-800">
                  <AlertCircle className="w-4 h-4" />
                  {error}
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
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

              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2">
                  <input type="checkbox" className="rounded" />
                  <span>Remember me</span>
                </label>
                <a href="#" className="text-cyan-600 hover:text-cyan-700">
                  Forgot password?
                </a>
              </div>

              <Button type="submit" className="w-full bg-cyan-600 hover:bg-cyan-700" size="lg">
                Sign In
              </Button>

              <div className="text-center text-sm">
                <span className="text-gray-600">Don't have an account? </span>
                <button
                  type="button"
                  onClick={() => navigate("/register")}
                  className="text-cyan-600 hover:text-cyan-700 font-medium"
                >
                  Sign up
                </button>
              </div>
            </form>

            <div className="mt-6 pt-6 border-t">
              <p className="text-xs text-gray-500 mb-3">Demo Credentials:</p>
              <div className="space-y-2 text-xs text-gray-600">
                <div className="bg-gray-50 p-2 rounded">
                  <strong>Patient:</strong> test@gmail.com / password (register first)
                </div>
                <div className="bg-gray-50 p-2 rounded">
                  <strong>Doctor:</strong> test1@dr.com / password (or 'medicoredr' for instant access)
                </div>
                <div className="bg-gray-50 p-2 rounded">
                  <strong>Admin:</strong> admin@subhash.com / subhash14
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export { LoginPage };
