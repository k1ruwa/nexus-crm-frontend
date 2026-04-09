import { Outlet } from 'react-router';
import { MeshBackground } from './MeshBackground';

export function Root() {
  return (
    <div className="min-h-screen bg-slate-100 flex justify-center antialiased font-sans">
      <div className="relative w-full max-w-md min-h-screen bg-slate-50 overflow-x-hidden shadow-2xl">
        <MeshBackground />
        <div className="relative z-10">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
