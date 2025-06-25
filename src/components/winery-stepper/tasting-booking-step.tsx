import { ChangeEvent, useState } from "react";
import { MultiDateTimePicker } from "../datetime-picker";
import { Winery, TastingInfo, Tours, WineDetail, BookingInfo, FoodPairingOption, Tastings } from "@/app/interfaces";
import { MultipleImageUpload } from "../Multi-image-upload";
import { regions, timeOptions, wineTypes, specialFeatures } from "@/data/data";

type TastingBookingFormProps = {
  formData: Winery;
  setFormData: React.Dispatch<React.SetStateAction<Winery>>;
  uploadedFiles: File[];
  setUploadedFiles: React.Dispatch<React.SetStateAction<File[]>>;
  availableSlotDates: Date[];
  setAvailableSlotDates: React.Dispatch<React.SetStateAction<Date[]>>;
};

export const TastingBookingForm: React.FC<TastingBookingFormProps> = ({
  formData,
  setFormData,
  uploadedFiles,
  setUploadedFiles,
  availableSlotDates,
  setAvailableSlotDates,
}) => {
  const [foodPairingOption, setFoodPairingOption] = useState({ id: "", name: "", price: 0 });
  const [newWine, setNewWine] = useState({ id: "", name: "", cost: 0 });
  const [newTimeSlot, setNewTimeSlot] = useState("");
  const [newTasting, setNewTasting] = useState({ id: "", name: "", price: 0, timeslot: "" });
  const [newTour, setNewTour] = useState({ description: "", cost: 0 });
  const [newGuest, setNewGuest] = useState({ description: "", cost: 0 });

  const handleTastingPriceChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value) || 0;
    setFormData((prev) => ({
      ...prev,
      tasting_info: { ...prev.tasting_info, tasting_price: value } as TastingInfo,
    }));
  };

  const handleTourAvailabilityChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      tours: { ...prev.tours, available: e.target.checked, tour_price: e.target.checked ? prev.tours.tour_price : 0 } as Tours,
    }));
  };

  const handleTourPriceChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value) || 0;
    setFormData((prev) => ({
      ...prev,
      tours: { ...prev.tours, tour_price: value } as Tours,
    }));
  };

  const handleSelectChange = (e: ChangeEvent<HTMLSelectElement>, field: "available_times" | "wine_types") => {
    const selected = Array.from(e.target.selectedOptions, (option) => option.value);
    setFormData((prev) => ({
      ...prev,
      tasting_info: { ...prev.tasting_info, [field]: selected } as TastingInfo,
    }));
  };

  const updateSlotDates = (dates: Date[]) => {
    setAvailableSlotDates(dates);
    setFormData((prev) => ({
      ...prev,
      booking_info: { ...prev.booking_info, available_slots: dates.map((d) => d.toISOString()) } as BookingInfo,
    }));
  };

  const handleNumberOfPeopleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value) || 1;
    setFormData((prev) => ({
      ...prev,
      booking_info: { ...prev.booking_info, number_of_people: value } as BookingInfo,
    }));
  };

  const addFoodPairingOption = () => {
    if (foodPairingOption.name && foodPairingOption.price >= 0) {
      setFormData((prev) => ({
        ...prev,
        food_pairing_options: [
          ...((prev.food_pairing_options as FoodPairingOption[]) || []),
          { id: crypto.randomUUID(), name: foodPairingOption.name, price: foodPairingOption.price },
        ],
      }));
      setFoodPairingOption({ id: "", name: "", price: 0 });
    }
  };

  const removeFoodPairingOption = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      food_pairing_options: (prev.food_pairing_options as FoodPairingOption[]).filter((_, i) => i !== index),
    }));
  };

  const addWine = () => {
    if (newWine.name && newWine.cost >= 0) {
      setFormData((prev) => ({
        ...prev,
        wine_details: [
          ...((prev.wine_details as WineDetail[]) || []),
          { id: crypto.randomUUID(), name: newWine.name, cost: newWine.cost },
        ],
      }));
      setNewWine({ id: "", name: "", cost: 0 });
    }
  };

  const removeWine = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      wine_details: (prev.wine_details as WineDetail[]).filter((_, i) => i !== index),
    }));
  };

  const addTimeSlot = () => {
    if (newTimeSlot) {
      setFormData((prev) => ({
        ...prev,
        booking_info: {
          ...prev.booking_info,
          available_slots: [...(prev.booking_info?.available_slots || []), newTimeSlot],
        } as BookingInfo,
      }));
      setNewTimeSlot("");
    }
  };

  const removeTimeSlot = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      booking_info: {
        ...prev.booking_info,
        available_slots: (prev.booking_info?.available_slots || []).filter((_, i) => i !== index),
      } as BookingInfo,
    }));
  };

  const addTasting = () => {
    if (newTasting.name && newTasting.price >= 0 && newTasting.timeslot) {
      setFormData((prev) => ({
        ...prev,
        tastins: [
          ...((prev.tastins as Tastings[]) || []),
          { id: crypto.randomUUID(), name: newTasting.name, price: newTasting.price, time_slots: newTasting.timeslot },
        ],
      }));

      setNewTasting({ id: "", name: "", price: 0, timeslot: "" });
    }
  };

  const removeTasting = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      tasting_info: {
        ...prev.tasting_info,
        food_pairing_options: (prev?.food_pairing_options || []).filter((_, i) => i !== index),
      } as TastingInfo,
    }));
  };

  const addTour = () => {
    if (newTour.description && newTour.cost >= 0) {
      setFormData((prev) => ({
        ...prev,
        tours: {
          ...prev.tours,
          tour_options: [
            ...(prev.tours?.tour_options || []),
            { description: newTour.description, cost: newTour.cost, tour_id: crypto.randomUUID() },
          ],
        } as Tours,
      }));
      setNewTour({ description: "", cost: 0 });
    }
  };

  const removeTour = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      tours: {
        ...prev.tours,
        tour_options: (prev.tours?.tour_options || []).filter((_, i) => i !== index),
      } as Tours,
    }));
  };

  const addGuest = () => {
    if (newGuest.description && newGuest.cost >= 0) {
      setFormData((prev) => ({
        ...prev,
        booking_info: {
          ...prev.booking_info,
          additional_guests: [
            ...(prev.booking_info?.additional_guests || []),
            { description: newGuest.description, cost: newGuest.cost, guest_id: crypto.randomUUID() },
          ],
        } as BookingInfo,
      }));
      setNewGuest({ description: "", cost: 0 });
    }
  };

  const removeGuest = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      booking_info: {
        ...prev.booking_info,
        additional_guests: (prev.booking_info?.additional_guests || []).filter((_, i) => i !== index),
      } as BookingInfo,
    }));
  };

  const handleExternalBookingLinkChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      booking_info: { ...prev.booking_info, external_booking_link: e.target.value } as BookingInfo,
    }));
  };

  return (
    <div className="space-y-4">
      {/* Number of People */}
      <div className="form-control">
        <label className="label">Number of People</label>
        <input
          type="number"
          placeholder="Enter number of people"
          className="input input-bordered"
          value={formData.booking_info.number_of_people || 1} // Default to 1 if undefined
          onChange={handleNumberOfPeopleChange}
          min={1}
        />
      </div>

      {/* Wine Tasting Price */}
      <div className="form-control">
        <label className="label">Wine Tasting Price</label>
        <input
          type="number"
          placeholder="Enter fixed price for tasting (e.g., 100)"
          className="input input-bordered"
          value={formData.tasting_info.tasting_price || ""}
          onChange={handleTastingPriceChange}
          min={0}
          step="0.01"
        />
      </div>

      {/* External Booking Link */}
      <div className="form-control">
        <label className="label">External Booking Link (Optional)</label>
        <input
          type="url"
          placeholder="Enter booking link (e.g., https://winery.com/book)"
          className="input input-bordered"
          value={formData.booking_info.external_booking_link || ""}
          onChange={handleExternalBookingLinkChange}
        />
      </div>

      {/* Tasting Info */}
      <div className="grid grid-cols-2 gap-4">
        <div className="form-control">
          <label className="label">Available Times</label>
          <select
            multiple
            className="select select-bordered"
            value={formData.tasting_info.available_times || []} // Default to empty array if undefined
            onChange={(e) => handleSelectChange(e, "available_times")}
          >
            {timeOptions.map((time) => (
              <option key={time} value={time}>
                {time}
              </option>
            ))}
          </select>
        </div>
        <div className="form-control">
          <label className="label">Wine Types</label>
          <select
            multiple
            className="select select-bordered"
            value={formData.tasting_info.wine_types || []} // Default to empty array if undefined
            onChange={(e) => handleSelectChange(e, "wine_types")}
          >
            {wineTypes.map((wt) => (
              <option key={wt} value={wt}>
                {wt}
              </option>
            ))}
          </select>
        </div>
      </div>
      <label className="label">Number of Wines Per Tasting</label>
      <div className="grid grid-cols-2 gap-4">
        <div className="form-control">
          <input
            type="number"
            placeholder="Enter min number"
            className="input input-bordered"
            value={formData.tasting_info.number_of_wines_per_tasting[0] || ""}
            onChange={(e) => {
              formData.tasting_info.number_of_wines_per_tasting[0] = +e.target.value;
              setFormData({ ...formData });
            }}
          />
        </div>
        <div className="form-control">
          <input
            type="number"
            placeholder="Enter max number"
            className="input input-bordered"
            value={formData.tasting_info.number_of_wines_per_tasting[1] || ""}
            onChange={(e) => {
              formData.tasting_info.number_of_wines_per_tasting[1] = +e.target.value;
              setFormData({ ...formData });
            }}
          />
        </div>
      </div>
      <div className="form-control">
        <label className="label">Special Features</label>
        <select
          className="select select-bordered w-full"
          value={formData.tasting_info.special_features[0] || ""}
          onChange={(e) => {
            const selectedValue = e.target.value;
            setFormData((prev) => ({
              ...prev,
              tasting_info: {
                ...prev.tasting_info,
                special_features: selectedValue ? [selectedValue] : [],
              } as TastingInfo,
            }));
          }}
        >
          <option value="">Select Special Feature</option>
          {specialFeatures.map((feature) => (
            <option key={feature} value={feature}>
              {feature}
            </option>
          ))}
        </select>
      </div>

      {/* AVA & Booking */}
      <div className="grid grid-cols-2 gap-4">
        <div className="form-control">
          <label className="label">Select AVA</label>
          <select
            className="select select-bordered"
            value={formData.ava || ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, ava: e.target.value }))}
          >
            <option value="">Select AVA</option>
            {regions.map((ava) => (
              <option key={ava} value={ava}>
                {ava}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="form-control">
        <label className="label">Available Slots</label>
        <MultiDateTimePicker dates={availableSlotDates} onChange={updateSlotDates} />
      </div>
      <div className="form-control">
        <label className="label">Images Upload</label>
        <MultipleImageUpload files={uploadedFiles} onChange={setUploadedFiles} />
      </div>

      {/* New UI Sections */}
      <div className="grid grid-cols-2 gap-4">
        {/* Wine */}
        <div className="form-control">
          <label className="label">Wine #1</label>
          <div className="space-y-2">
            <input
              type="text"
              placeholder="Wine Name"
              className="input input-bordered w-full"
              value={newWine.name}
              onChange={(e) => setNewWine({ ...newWine, name: e.target.value })}
            />
            <input
              type="number"
              placeholder="Wine Cost (e.g., 20)"
              className="input input-bordered w-full"
              value={newWine.cost || ""}
              onChange={(e) => setNewWine({ ...newWine, cost: parseFloat(e.target.value) || 0 })}
              min={0}
              step="0.01"
            />
            <button type="button" className="btn btn-primary" onClick={addWine}>
              Add Wine
            </button>
          </div>
          <div className="mt-2">
            {formData.wine_details?.map((wine, index) => (
              <div key={wine.id} className="flex justify-between items-center p-2 border-b">
                <span>
                  {wine.name}: ${wine.cost}
                </span>
                <button type="button" className="btn btn-xs btn-error" onClick={() => removeWine(index)}>
                  Remove
                </button>
              </div>
            )) || null}
          </div>
        </div>

        {/* Time Slot */}
        <div className="form-control">
          <label className="label">Tour Options</label>
          <div className="space-y-2">
            <input
              type="text"
              placeholder="Tour Option #1"
              className="input input-bordered w-full"
              value={newTour.description}
              onChange={(e) => setNewTour({ ...newTour, description: e.target.value })}
            />
            <input
              type="number"
              placeholder="Tour Cost"
              className="input input-bordered w-full"
              value={newTour.cost || ""}
              onChange={(e) => setNewTour({ ...newTour, cost: parseFloat(e.target.value) || 0 })}
              min={0}
              step="0.01"
            />
            <button type="button" className="btn btn-primary" onClick={addTour}>
              Add Tour
            </button>
          </div>
          <div className="mt-2">
            {formData.tours?.tour_options?.map((tour, index) => (
              <div key={index} className="flex justify-between items-center p-2 border-b">
                <span>
                  {tour.description}: ${tour.cost}
                </span>
                <button type="button" className="btn btn-xs btn-error" onClick={() => removeTour(index)}>
                  Remove
                </button>
              </div>
            )) || null}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* Tastings */}
        <div className="form-control">
          <label className="label">Tastings</label>
          <div className="space-y-2">
            <input
              type="text"
              placeholder="Tasting #1"
              className="input input-bordered w-full"
              value={newTasting.name}
              onChange={(e) => setNewTasting({ ...newTasting, name: e.target.value })}
            />
            <input
              type="number"
              placeholder="Price per person"
              className="input input-bordered w-full"
              value={newTasting.price || ""}
              onChange={(e) => setNewTasting({ ...newTasting, price: parseFloat(e.target.value) || 0 })}
              min={0}
              step="0.01"
            />
            <input
              type="text"
              placeholder="Time slot"
              className="input input-bordered w-full"
              value={newTasting.timeslot}
              onChange={(e) => setNewTasting({ ...newTasting, timeslot: e.target.value })}
            />
            <button type="button" className="btn btn-primary" onClick={addTasting}>
              Add Tasting
            </button>
          </div>
          <div className="mt-2">
            {formData?.tastins?.map((tasting, index) => (
              <div key={index} className="flex justify-between items-center p-2 border-b">
                <span>
                  {tasting.name}: ${tasting.price}
                </span>
                <button type="button" className="btn btn-xs btn-error" onClick={() => removeTasting(index)}>
                  Remove
                </button>
              </div>
            )) || null}
          </div>
        </div>

        {/* Tour Options */}
        <div className="form-control">
          <label className="label">Additional Guests</label>
          <div className="space-y-2">
            <input
              type="text"
              placeholder="Additional Guest #1"
              className="input input-bordered w-full"
              value={newGuest.description}
              onChange={(e) => setNewGuest({ ...newGuest, description: e.target.value })}
            />
            <input
              type="number"
              placeholder="Guest Cost"
              className="input input-bordered w-full"
              value={newGuest.cost || ""}
              onChange={(e) => setNewGuest({ ...newGuest, cost: parseFloat(e.target.value) || 0 })}
              min={0}
              step="0.01"
            />
            <button type="button" className="btn btn-primary" onClick={addGuest}>
              Add Guest
            </button>
          </div>
          <div className="mt-2">
            {formData.booking_info?.additional_guests?.map((guest, index) => (
              <div key={index} className="flex justify-between items-center p-2 border-b">
                <span>
                  {guest.description}: ${guest.cost}
                </span>
                <button type="button" className="btn btn-xs btn-error" onClick={() => removeGuest(index)}>
                  Remove
                </button>
              </div>
            )) || null}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* Food Pairings */}
        <div className="form-control">
          <label className="label">Food Pairings</label>
          <div className="space-y-2">
            <input
              type="text"
              placeholder="Food Pairing #1"
              className="input input-bordered w-full"
              value={foodPairingOption.name}
              onChange={(e) => setFoodPairingOption({ ...foodPairingOption, name: e.target.value })}
            />
            <input
              type="number"
              placeholder="Price"
              className="input input-bordered w-full"
              value={foodPairingOption.price || ""}
              onChange={(e) => setFoodPairingOption({ ...foodPairingOption, price: parseFloat(e.target.value) || 0 })}
              min={0}
              step="0.01"
            />
            <button type="button" className="btn btn-primary" onClick={addFoodPairingOption}>
              Add Food Pairing
            </button>
          </div>
          <div className="mt-2">
            {formData?.food_pairing_options?.map((pairing, index) => (
              <div key={index} className="flex justify-between items-center p-2 border-b">
                <span>
                  {pairing.name}: ${pairing.price}
                </span>
                <button type="button" className="btn btn-xs btn-error" onClick={() => removeFoodPairingOption(index)}>
                  Remove
                </button>
              </div>
            )) || null}
          </div>
        </div>

        {/* Additional Guests */}
      </div>
    </div>
  );
};
