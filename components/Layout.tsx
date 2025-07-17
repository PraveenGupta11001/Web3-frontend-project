import { ReactNode } from "react";
import { useGasStore } from "../store/useGasStore";

export default function Layout({ children }: { children: ReactNode }) {
const { mode, setMode } = useGasStore();

return (
 <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
   <header className="bg-white dark:bg-gray-800 shadow">
     <div className="container mx-auto p-4 flex justify-between items-center">
       <h1 className="text-2xl font-bold">Gas Price Tracker</h1>
       <div>
         <button
           onClick={() => setMode(mode === "live" ? "simulation" : "live")}
           className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2"
         >
           Toggle {mode === "live" ? "Simulation" : "Live"} Mode
         </button>
         <button
           onClick={() => document.documentElement.classList.toggle("dark")}
           className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
         >
           Toggle Dark Mode
         </button>
       </div>
     </div>
   </header>
   <main className="container mx-auto p-4">{children}</main>
 </div>
);
}
