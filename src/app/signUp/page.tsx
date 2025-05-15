
import { SignUpForm } from "@/components/auth/sign-up-form";

export default function SignUp() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-2">Loveable</h1>
          <h2 className="text-2xl font-semibold text-gray-700">Create Account</h2>
          <p className="mt-2 text-gray-600">
            Join our platform to get started
          </p>
        </div>
        <SignUpForm />
      </div>
    </div>
  );
}