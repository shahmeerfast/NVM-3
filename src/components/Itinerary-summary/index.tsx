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
        const selectedTastingIndex = bookingDetails?.selectedTastingIndex || 0;
        const currentTastingInfo = winery.tasting_info?.[selectedTastingIndex];

        // Add tasting price for the selected tasting
        if (currentTastingInfo?.tasting_price) {
          wineryCost += currentTastingInfo.tasting_price;
        }

        // Add food pairing prices if selected
        if (bookingDetails?.foodPairings) {
          wineryCost += bookingDetails.foodPairings.reduce((sum, pairing) => sum + pairing.price, 0);
        }

        // Add tour prices if selected
        if (bookingDetails?.tours) {
          wineryCost += bookingDetails.tours.reduce((sum, tour) => sum + tour.price, 0);
        }
        if (bookingDetails?.otherFeature) {
          wineryCost += bookingDetails.otherFeature.reduce((sum, feature) => sum + feature.price, 0);
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
            {wineries.map((winery) => {
              const bookingDetails = winery.bookingDetails;
              const selectedTastingIndex = bookingDetails?.selectedTastingIndex || 0;
              const currentTastingInfo = winery.tasting_info?.[selectedTastingIndex];
              
              return (
                <li key={winery._id || winery.name} className="mt-2">
                  <span className="font-medium">{winery.name}</span>
                  {currentTastingInfo && (
                    <div className="ml-4 text-xs text-gray-500">
                      {currentTastingInfo.tasting_title}
                    </div>
                  )}
                  {bookingDetails &&
                  (bookingDetails.tasting ||
                    bookingDetails.foodPairings?.length > 0 ||
                    bookingDetails.tours?.length > 0 ||
                    bookingDetails.otherFeature?.length > 0) ? (
                    <ul className="ml-4 list-disc">
                      {currentTastingInfo?.tasting_price && (
                        <li>Tasting: ${currentTastingInfo.tasting_price.toFixed(2)}</li>
                      )}
                      {bookingDetails?.foodPairings?.map((pairing) => (
                        <li key={pairing.name}>
                          {pairing.name}: ${pairing.price.toFixed(2)}
                        </li>
                      ))}
                      {bookingDetails?.tours?.map((tour) => (
                        <li key={tour.description}>
                          {tour.description}: ${tour.price.toFixed(2)}
                        </li>
                      ))}
                      {bookingDetails?.otherFeature?.map((feature) => (
                        <li key={feature.description}>
                          {feature.description}: ${feature.price.toFixed(2)}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="ml-4 text-gray-500">No options selected</p>
                  )}
                </li>
              );
            })}
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