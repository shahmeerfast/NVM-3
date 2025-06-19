"use client";
import { useState } from "react";
import { useItinerary } from "@/store/itinerary";
import { Winery } from "@/app/interfaces";

interface ItinerarySummaryProps {
  wineries: Winery[];
  onConfirm: () => void;
}

export default function ItinerarySummary({ wineries, onConfirm }: ItinerarySummaryProps) {
  const totalPrice = wineries.reduce((total, winery) => total + winery.tasting_info.price_range[0], 0);
  const totalTime = wineries.length * 1.5;

  return (
    <div>
      <div className="card shadow-sm bg-white p-6 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Itinerary Summary</h2>
        <p>Total Wineries: {wineries.length}</p>
        {/* <p>Estimated Total Time: {totalTime} hours</p> */}
        <p>Approximate Cost: ${totalPrice.toFixed(2)}</p>

        <div className="mt-6">
          <button onClick={onConfirm} className="btn btn-success w-full">
            Confirm Itinerary
          </button>
        </div>
      </div>
    </div>
  );
}
