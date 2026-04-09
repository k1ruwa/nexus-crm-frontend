export function MeshBackground() {
  return (
    <div className="fixed top-0 left-0 w-full h-full z-0 pointer-events-none">
      <div
        className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-blue-400/25 blur-[100px] animate-pulse"
        style={{ animationDuration: '8s' }}
      />
      <div
        className="absolute top-[25%] right-[-10%] w-[55%] h-[55%] rounded-full bg-rose-300/25 blur-[100px] animate-pulse"
        style={{ animationDuration: '10s' }}
      />
      <div
        className="absolute bottom-[-10%] left-[20%] w-[65%] h-[65%] rounded-full bg-emerald-300/20 blur-[100px] animate-pulse"
        style={{ animationDuration: '12s' }}
      />
    </div>
  );
}
