"use client";
import { useEffect, useState } from "react";
import { Winery } from "@/app/interfaces";

interface WineryCardProps {
  winery: Winery;
  onUpdate: (id: string, data: { selectedDate: any; selectedTime: any; guests: any }) => void;
  onRemove: (id: string) => void;
}

export default function WineryBookingCard({ winery, onUpdate, onRemove }: WineryCardProps) {
  // Create a unique list of available dates in "YYYY-MM-DD" format.
  const uniqueDatesSet = new Set(
    winery.booking_info.available_slots.map(
      (slot) => new Date(slot).toISOString().split("T")[0]
    )
  );
  const availableDates = Array.from(uniqueDatesSet).sort();

  // Determine the minimum and maximum dates for the HTML date input.
  const minDate = availableDates.length > 0 ? availableDates[0] : "";
  const maxDate = availableDates.length > 0 ? availableDates[availableDates.length - 1] : "";

  // Set the initial date to the first available date (if any).
  const initialDate = availableDates.length > 0 ? availableDates[0] : "";

  const [selectedDate, setSelectedDate] = useState<string>(initialDate);
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [guests, setGuests] = useState<number>(1);
  const [availableTimes, setAvailableTimes] = useState<string[]>([]);

  // Update available times whenever the selected date changes.
  useEffect(() => {
    if (selectedDate) {
      const timesForDate = winery.booking_info.available_slots.filter((slot) => {
        const slotDate = new Date(slot).toISOString().split("T")[0];
        return slotDate === selectedDate;
      });
      setAvailableTimes(timesForDate);
      setSelectedTime("");
    } else {
      setAvailableTimes([]);
    }
  }, [selectedDate, winery.booking_info.available_slots]);

  // Call onUpdate when valid selections are made.
  useEffect(() => {
    if (selectedDate && selectedTime && guests >= 1) {
      onUpdate(winery._id as any, { selectedDate, selectedTime, guests });
    }
  }, [selectedDate, selectedTime, guests]);

  // Handle the date input change event.
  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const dateValue = e.target.value;
    // Validate that the selected date is one of the available dates.
    if (availableDates.includes(dateValue)) {
      setSelectedDate(dateValue);
    } else {
      alert("Selected date is not available for booking.");
      // Optionally, reset to the initial available date.
      setSelectedDate(initialDate);
    }
  };

  return (
    <div className="card shadow-sm bg-white rounded-xl p-4 md:p-6 flex flex-col md:flex-row gap-4 items-start w-full">
      <div className="flex-grow bg-white w-full">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-800 truncate">{winery.name}</h2>
          <button
            onClick={() => onRemove(winery._id as any)}
            className="text-red-500 text-sm hover:text-red-600 transition"
          >
            Remove
          </button>
        </div>
        <p className="text-xs text-gray-500">{winery.location.address}</p>

        <div className="flex items-center justify-between text-sm text-gray-700 mt-2 gap-2">
          <span className="flex items-center gap-1">
            💰 ${winery.tasting_info.price_range[0]} - ${winery.tasting_info.price_range[1]}
          </span>
          <span className="flex items-center gap-1">
            ⏰ {winery.tasting_info.available_times.slice(0, 3).join(", ")}
            {winery.tasting_info.available_times.length > 3 && "..."}
          </span>
        </div>

        {/* Date, Time & Guests Selection */}
        <div className="mt-4 flex md:gap-4 gap-1">
          {/* Built-in HTML Calendar */}
          <div className="w-full">
            <label className="block text-xs font-medium text-gray-600">Date</label>
            <input
              type="date"
              value={selectedDate}
              onChange={handleDateChange}
              min={minDate}
              max={maxDate}
              className="w-full text-sm rounded-md h-10 p-2 box-border "
            />
          </div>

          <div className="w-full">
            <label className="block text-xs font-medium text-gray-600">Time</label>
            <select
              className="w-full text-sm rounded-md h-10 p-2 box-border  appearance-none"
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

          <div className="w-full">
            <label className="block text-xs font-medium text-gray-600">Guests</label>
            <input
              type="number"
              className="input input-bordered w-full text-sm rounded-md h-10"
              min="1"
              max={winery.booking_info.max_guests_per_slot}
              value={guests}
              onChange={(e) => setGuests(Number(e.target.value))}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
