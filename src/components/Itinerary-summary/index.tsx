"use client";
import { useEffect, useState } from "react";
import { Winery } from "@/app/interfaces";
import { BookingData, ItineraryWinery } from "@/store/itinerary";

interface ItinerarySummaryProps {
  wineries: ItineraryWinery[];
  onConfirm: () => void;
}

export default function ItinerarySummary({ wineries, onConfirm }: ItinerarySummaryProps) {
  const [totalPrice, setTotalPrice] = useState(0);

  useEffect(() => {
    const calculateTotalPrice = () => {
      return wineries.reduce((total, winery) => {
        console.log("winery", winery);
        let wineryCost = 0;
        const bookingDetails = winery.bookingDetails;

        // Add tasting price for all wineries, regardless of selection
        if (winery.tasting_info?.tasting_price) {
          wineryCost += winery.tasting_info.tasting_price;
        }

        // Add food pairing prices if selected
        if (bookingDetails?.foodPairings) {
          wineryCost += bookingDetails.foodPairings.reduce((sum, pairing) => sum + pairing.price, 0);
        }

        return total + wineryCost;
      }, 0);
    };

    setTotalPrice(calculateTotalPrice());
  }, [wineries]);

  const totalTime = wineries.length * 1.5;

  return (
    <div className="card shadow-sm bg-white p-6 rounded-lg">
      <h2 className="text-xl font-semibold mb-4">Itinerary Summary</h2>
      <p>Total Wineries: {wineries.length}</p>
      <p>Approximate Cost: ${totalPrice.toFixed(2)}</p>

      <div className="mt-4">
        <h3 className="text-sm font-semibold text-gray-700">Breakdown</h3>
        {wineries.length === 0 ? (
          <p className="text-sm text-gray-600">No wineries selected.</p>
        ) : (
          <ul className="text-sm text-gray-600">
            {wineries.map((winery) => (
              <li key={winery._id || winery.name} className="mt-2">
                <span className="font-medium">{winery.name}</span>
                {winery.bookingDetails &&
                (winery.bookingDetails.tasting ||
                  winery.bookingDetails.foodPairings?.length > 0) ? (
                  <ul className="ml-4 list-disc">
                    {winery.bookingDetails?.tasting && winery.tasting_info?.tasting_price && (
                      <li>Tasting: ${winery.tasting_info.tasting_price.toFixed(2)}</li>
                    )}
          
                    {winery.bookingDetails?.foodPairings?.map((pairing) => (
                      <li key={pairing.name}>
                        {pairing.name}: ${pairing.price.toFixed(2)}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="ml-4 text-gray-500">No options selected</p>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="mt-6">
        <button
          onClick={onConfirm}
          className="btn btn-success w-full"
          disabled={wineries.some((w) => !w.bookingDetails?.selectedTime)}
        >
          Confirm Itinerary
        </button>
      </div>
    </div>
  );
}