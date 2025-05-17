import { SignUpForm } from "@/components/auth/sign-up-form";

export default function SignUp() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-indigo-100 px-4 py-12">
      <div className="max-w-lg w-full space-y-6">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold text-gray-800 mb-2">
            ClassForge
          </h1>
          <p className="text-gray-600">Create your account to get started</p>
        </div>
        <SignUpForm />
      </div>
    </div>
  );
}
