export default function AppLoading() {
  return (
    <div className="space-y-6" aria-busy="true" aria-label="Cargando">
      <div className="space-y-3">
        <div className="skeleton h-3 w-40" />
        <div className="skeleton h-10 w-72 max-w-full" />
        <div className="skeleton h-4 w-96 max-w-full" />
      </div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="skeleton h-32 rounded-[1.4rem]" />
        ))}
      </div>
      <div className="grid gap-5 lg:grid-cols-[1.55fr_0.85fr]">
        <div className="skeleton h-80 rounded-[1.75rem]" />
        <div className="skeleton h-80 rounded-[1.75rem]" />
      </div>
    </div>
  );
}
