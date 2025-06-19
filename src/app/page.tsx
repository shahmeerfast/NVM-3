"use client";
import { useState, useEffect } from "react";
import AuthModal from "@/components/modal/AuthModal";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useItinerary } from "@/store/itinerary";
import { Winery } from "./interfaces";
import WineryCard from "@/components/cards/winnery-list";
import Filter from "@/components/filter-bar/filter-box";
import { SessionStorageService } from "@/lib/localstorage.config";
import { useAuthStore } from "@/store/authStore";
import axios from "axios";

export default function Home() {
  const [showPopup, setShowPopup] = useState(false);
  const { itinerary, setItinerary } = useItinerary();
  const { user, loading } = useAuthStore();
  const [filteredWineries, setFilteredWineries] = useState<Winery[]>([]);
  const [wineries, setWineries] = useState<Winery[]>([]);

  const fetchWineries = async () => {
    const response = await axios.get("/api/winery");
    setWineries(response.data.wineries);
  };

  useEffect(() => {
    fetchWineries();
  }, []);

  const addToItinerary = (winery: any) => {
    setItinerary([...itinerary, winery]);
    toast.success(`${winery.name} added to your itinerary!`);
  };

  useEffect(() => {
    if (!loading) {
      const config = SessionStorageService.getConfig();
      if (config && config.isGuest) return setShowPopup(false);
      if (user) return setShowPopup(false);
      setShowPopup(true);
    }
  }, [loading]);

  return (
    <div className="min-h-screen relative md:top-20 top-[50px] bg-gray-100">
      {showPopup && <AuthModal setShowPopup={setShowPopup} />}
      <div className="grid grid-cols-1 lg:grid-cols-4 p-4 max-w-[1600px] mx-auto">
        <div className="lg:col-span-1 sm:col-span-1 mb-10">
          <Filter wineries={wineries} onFilterApply={setFilteredWineries} />
        </div>

        <div className="col-span-3 sm:w-full space-y-6 lg:ml-10 mb-20">
          {filteredWineries.length === 0 ? (
            <p className="text-center text-lg text-gray-600">No wineries match your filters</p>
          ) : (
            filteredWineries.map((winery, index) => <WineryCard key={index} winery={winery} addToItinerary={addToItinerary} />)
          )}
        </div>
      </div>
    </div>
  );
}
