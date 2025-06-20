"use client";
import { useEffect, useState } from "react";
import { Winery } from "@/app/interfaces";

interface BookingData {
  selectedDate: string;
  selectedTime: string;
  tasting: boolean;
  tour: boolean;
  foodPairings: { name: string; price: number }[];
}

interface WineryCardProps {
  winery: Winery;
  onUpdate: (id: string, data: BookingData) => void;
  onRemove: (id: string) => void;
}

export default function WineryBookingCard({ winery, onUpdate, onRemove }: WineryCardProps) {
  const availableSlots = winery.booking_info?.available_slots || [];
  const uniqueDatesSet = new Set(availableSlots.map((slot) => new Date(slot).toISOString().split("T")[0]));
  const availableDates = Array.from(uniqueDatesSet).sort();
  const minDate = availableDates.length > 0 ? availableDates[0] : "";
  const maxDate = availableDates.length > 0 ? availableDates[availableDates.length - 1] : "";
  const initialDate = availableDates.length > 0 ? availableDates[0] : "";

  const [selectedDate, setSelectedDate] = useState<string>(initialDate);
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [availableTimes, setAvailableTimes] = useState<string[]>([]);
  const [selections, setSelections] = useState({
    tasting: true,
    tour: winery.tours?.available ?? false,
    foodPairings: [] as { name: string; price: number }[],
  });

  useEffect(() => {
    if (selectedDate) {
      const timesForDate = availableSlots.filter((slot) => {
        const slotDate = new Date(slot).toISOString().split("T")[0];
        return slotDate === selectedDate;
      });
      setAvailableTimes(timesForDate);
      setSelectedTime("");
    } else {
      setAvailableTimes([]);
    }
  }, [selectedDate, availableSlots]);

  useEffect(() => {
    if (selectedDate && selectedTime) {
      onUpdate(winery._id || winery.name, {
        selectedDate,
        selectedTime,
        tasting: selections.tasting,
        tour: selections.tour,
        foodPairings: selections.foodPairings,
      });
    }
  }, [selectedDate, selectedTime, selections, winery._id, winery.name, onUpdate]);

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const dateValue = e.target.value;
    if (availableDates.includes(dateValue)) {
      setSelectedDate(dateValue);
    } else {
      alert("Selected date is not available for booking.");
      setSelectedDate(initialDate);
    }
  };

  const handleSelectionChange = (key: "tasting" | "tour", value: boolean) => {
    setSelections((prev) => ({ ...prev, [key]: value }));
  };

  const handleFoodPairingChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedOptions = Array.from(e.target.selectedOptions, (option) => ({
      name: option.value,
      price: Number(option.dataset.price) || 0,
    }));
    setSelections((prev) => ({ ...prev, foodPairings: selectedOptions }));
  };

  return (
    <div className="card shadow-sm bg-white rounded-xl p-4 md:p-6 flex flex-col md:flex-row gap-4 items-start w-full">
      <div className="flex-grow bg-white w-full">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-800 truncate">{winery.name}</h2>
          <button
            onClick={() => onRemove(winery._id || winery.name)}
            className="text-red-500 text-sm hover:text-red-600 transition"
          >
            Remove
          </button>
        </div>
        <p className="text-xs text-gray-500">{winery.location?.address ?? "Address not available"}</p>

        <div className="flex items-center justify-between text-sm text-gray-700 mt-2 gap-2">
          <span className="flex items-center gap-1">💰 Tasting: ${winery.tasting_info?.tasting_price?.toFixed(2) ?? "N/A"}</span>
          <span className="flex items-center gap-1">
            ⏰ {winery.tasting_info?.available_times?.slice(0, 3).join(", ") ?? "No times available"}
            {winery.tasting_info?.available_times?.length > 3 && "..."}
          </span>
        </div>

        <div className="mt-4 space-y-2">
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id={`tasting-${winery._id || winery.name}`}
              checked={selections.tasting}
              onChange={(e) => handleSelectionChange("tasting", e.target.checked)}
              className="checkbox checkbox-primary"
            />
            <label htmlFor={`tasting-${winery._id || winery.name}`} className="text-sm">
              Wine Tasting (${winery.tasting_info?.tasting_price?.toFixed(2) ?? "N/A"})
            </label>
          </div>

          {winery.tours?.available && (
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id={`tour-${winery._id || winery.name}`}
                checked={selections.tour}
                onChange={(e) => handleSelectionChange("tour", e.target.checked)}
                className="checkbox checkbox-primary"
              />
              <label htmlFor={`tour-${winery._id || winery.name}`} className="text-sm">
                Tour (${winery.tours?.tour_price?.toFixed(2) ?? "N/A"})
              </label>
            </div>
          )}
        </div>

        <div className="mt-4 flex flex-wrap md:flex-nowrap gap-4">
          {/* Date */}
          <div className="w-full md:w-1/3">
            <label className="block text-xs font-medium text-gray-600">Date</label>
            <input
              type="date"
              value={selectedDate}
              onChange={handleDateChange}
              min={minDate}
              max={maxDate}
              className="w-full text-sm rounded-md h-10 p-2 box-border"
              disabled={availableDates.length === 0}
            />
          </div>

          {/* Time */}
          <div className="w-full md:w-1/3">
            <label className="block text-xs font-medium text-gray-600">Time</label>
            <select
              className="w-full text-sm rounded-md h-10 p-2 box-border appearance-none"
              value={selectedTime}
              onChange={(e) => setSelectedTime(e.target.value)}
              disabled={!selectedDate || availableTimes.length === 0}
            >
              <option value="" disabled>
                Select a time
              </option>
              {availableTimes.length > 0 ? (
                availableTimes.map((time, idx) => (
                  <option key={idx} value={time}>
                    {new Date(time).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </option>
                ))
              ) : (
                <option value="" disabled>
                  No times available
                </option>
              )}
            </select>
          </div>

          {/* Food Pairings */}
          {winery.tasting_info?.food_pairing_options?.length > 0 && (
            <div className="w-full md:w-1/3">
              <label className="block text-xs font-medium text-gray-600">Food Pairings</label>
              <select className="select select-bordered w-full text-sm h-10" onChange={handleFoodPairingChange}>
                {winery.tasting_info.food_pairing_options.map((option) => (
                  <option key={option.name} value={option.name} data-price={option.price}>
                    {option.name} (${option.price.toFixed(2)})
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
