import LoginForm from "@/components/admin/LoginForm";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Admin Login</h1>
          <p className="text-sm text-gray-500 mt-1">
            Sign in to manage your site
          </p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <LoginForm />
        </div>
      </div>
    </div>
  );
}
