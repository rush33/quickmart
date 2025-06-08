export default function AuthLayout({ children }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-blue-300 px-4">
      <div className="flex flex-col justify-center items-center w-full max-w-md bg-white rounded-3xl shadow-2xl p-10 border border-blue-200">
        {children}
      </div>
    </div>
  );
}
