export default function Spinner() {
  return (
    <div className="flex flex-col justify-center items-center h-screen bg-white">
      <p className="text-xl font-semibold text-green-600 mb-4">
        Preparing your dashboard...
      </p>
      <video src="/shop.webm" autoPlay loop muted width={75} height={75} />
    </div>
  );
}
