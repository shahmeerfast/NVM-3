"use client";
import { Winery } from "@/app/interfaces";
import { createContext, useContext, useState, ReactNode } from "react";

export type ItineraryWinery = Winery & { bookingDetails: { selectedDateTime: string; guests: number } };
interface ItineraryContextType {
  itinerary: ItineraryWinery[];
  setItinerary: React.Dispatch<React.SetStateAction<ItineraryWinery[]>>;
}

const ItineraryContext = createContext<ItineraryContextType | undefined>(undefined);

export const ItineraryProvider = ({ children }: { children: ReactNode }) => {
  const [itinerary, setItinerary] = useState<ItineraryWinery[]>([]);

  return <ItineraryContext.Provider value={{ itinerary, setItinerary }}>{children}</ItineraryContext.Provider>;
};

export const useItinerary = () => {
  const context = useContext(ItineraryContext);
  if (!context) {
    throw new Error("useItinerary must be used within an ItineraryProvider");
  }
  return context;
};
