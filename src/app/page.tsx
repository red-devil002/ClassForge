"use client";
import { useAuth } from "@/context/auth-context";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function Home() {
  const { user, role } = useAuth();
  const router = useRouter();

  const handleGetStarted = () => {
    if (user) {
      router.push(
        role === "ADMIN"
          ? "/admin"
          : role === "TEACHER"
            ? "/teacher"
            : "/student"
      );
    } else {
      router.push("/signUp");
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Hero Section */}
      <section className="py-24 md:py-32 text-center px-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight text-gray-900 mb-6">
            Welcome to <span className="text-primary">Class Forge</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-600 mb-10">
            The platform built for <strong>admins</strong>, <strong>teachers</strong>, and <strong>students</strong> to manage and grow together.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" onClick={handleGetStarted}>
              {user ? "Go to Dashboard" : "Get Started"}
            </Button>
            <Button size="lg" variant="ghost" asChild>
              <a href="/about">Learn More</a>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">
            Key Features
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                role: "Administrator",
                color: "admin",
                icon: "⚙️",
                features: ["User management", "Data analytics", "System configuration"],
              },
              {
                role: "Teacher",
                color: "teacher",
                icon: "📚",
                features: ["Student management", "Performance tracking", "Well-being assessment"],
              },
              {
                role: "Student",
                color: "student",
                icon: "🎓",
                features: ["Performance overview", "Activity tracking", "Personal profile"],
              },
            ].map(({ role, color, icon, features }) => (
              <div
                key={role}
                className={`bg-white/90 backdrop-blur-md p-6 rounded-xl shadow-md border border-gray-200 hover:shadow-lg transition`}
              >
                <div className={`w-12 h-12 mb-4 rounded-full flex items-center justify-center bg-${color}/10 text-${color} text-xl`}>
                  {icon}
                </div>
                <h3 className="text-xl font-semibold mb-2 text-gray-800">
                  For {role}s
                </h3>
                <ul className="text-sm text-gray-600 space-y-2 mt-3">
                  {features.map((f, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <span className={`text-${color}`}>✔</span> {f}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-white border-t border-gray-100">
        <div className="text-center max-w-3xl mx-auto px-4">
          <h2 className="text-3xl font-bold mb-4 text-gray-900">Ready to Join?</h2>
          <p className="text-gray-600 mb-6">
            Empower your learning environment today with a better way to connect administrators, teachers, and students.
          </p>
          <Button size="lg" onClick={handleGetStarted}>
            {user ? "Go to Dashboard" : "Sign Up Now"}
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-10 mt-auto">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 px-4 text-sm">
          <div>
            <h3 className="text-white font-bold mb-4">Class Gen</h3>
            <p>The smart classroom assistant for modern schools.</p>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-3">Platform</h4>
            <ul className="space-y-2">
              <li><a href="#" className="hover:text-white">Features</a></li>
              <li><a href="#" className="hover:text-white">Pricing</a></li>
              <li><a href="#" className="hover:text-white">Security</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-3">Resources</h4>
            <ul className="space-y-2">
              <li><a href="#" className="hover:text-white">Docs</a></li>
              <li><a href="#" className="hover:text-white">Guides</a></li>
              <li><a href="#" className="hover:text-white">Support</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-3">Company</h4>
            <ul className="space-y-2">
              <li><a href="#" className="hover:text-white">About</a></li>
              <li><a href="#" className="hover:text-white">Blog</a></li>
              <li><a href="#" className="hover:text-white">Contact</a></li>
            </ul>
          </div>
        </div>
        <div className="text-center text-sm text-gray-500 mt-10 border-t border-gray-800 pt-6">
          &copy; {new Date().getFullYear()} Class Gen. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
