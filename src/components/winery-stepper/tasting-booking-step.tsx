import { ChangeEvent, useState } from "react";
import { MultiDateTimePicker } from "../datetime-picker";
import { Winery } from "@/app/interfaces";
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
  const [foodPairingOption, setFoodPairingOption] = useState({ name: "", price: 0 });

  const handleTastingPriceChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value) || 0;
    setFormData((prev) => ({
      ...prev,
      tasting_info: { ...prev.tasting_info, tasting_price: value },
    }));
  };

  const handleTourAvailabilityChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      tours: { ...prev.tours, available: e.target.checked, tour_price: e.target.checked ? prev.tours.tour_price : 0 },
    }));
  };

  const handleTourPriceChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value) || 0;
    setFormData((prev) => ({
      ...prev,
      tours: { ...prev.tours, tour_price: value },
    }));
  };

  const handleSelectChange = (e: ChangeEvent<HTMLSelectElement>, field: "available_times" | "wine_types") => {
    const selected = Array.from(e.target.selectedOptions, (option) => option.value);
    setFormData((prev) => ({
      ...prev,
      tasting_info: { ...prev.tasting_info, [field]: selected },
    }));
  };

  const updateSlotDates = (dates: Date[]) => {
    setAvailableSlotDates(dates);
    setFormData((prev) => ({
      ...prev,
      booking_info: { ...prev.booking_info, available_slots: dates.map((d) => d.toISOString()) },
    }));
  };

  const handleNumberOfPeopleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value) || 1;
    setFormData((prev) => ({
      ...prev,
      booking_info: { ...prev.booking_info, number_of_people: value },
    }));
  };

  const addFoodPairingOption = () => {
    if (foodPairingOption.name && foodPairingOption.price >= 0) {
      setFormData((prev) => ({
        ...prev,
        tasting_info: {
          ...prev.tasting_info,
          food_pairing_options: [...prev.tasting_info.food_pairing_options, { ...foodPairingOption }],
        },
      }));
      setFoodPairingOption({ name: "", price: 0 });
    }
  };

  const removeFoodPairingOption = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      tasting_info: {
        ...prev.tasting_info,
        food_pairing_options: prev.tasting_info.food_pairing_options.filter((_, i) => i !== index),
      },
    }));
  };

  const handleExternalBookingLinkChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      booking_info: { ...prev.booking_info, external_booking_link: e.target.value },
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
          value={formData.booking_info.number_of_people}
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

      {/* Tours */}
      <div className="form-control">
        <label className="cursor-pointer label">
          <span className="label-text">Offer Tours?</span>
          <input
            type="checkbox"
            checked={formData.tours.available}
            onChange={handleTourAvailabilityChange}
            className="checkbox"
          />
        </label>
        {formData.tours.available && (
          <div className="form-control mt-2">
            <label className="label">Tour Price</label>
            <input
              type="number"
              placeholder="Enter fixed price for tour (e.g., 50)"
              className="input input-bordered"
              value={formData.tours.tour_price || ""}
              onChange={handleTourPriceChange}
              min={0}
              step="0.01"
            />
          </div>
        )}
      </div>

      {/* Food Pairing Options */}
      <div className="form-control">
        <label className="label">Food Pairing or Platter Options</label>
        <div className="space-y-2">
          <input
            type="text"
            placeholder="Name (e.g., Cheese Platter)"
            className="input input-bordered w-full"
            value={foodPairingOption.name}
            onChange={(e) => setFoodPairingOption({ ...foodPairingOption, name: e.target.value })}
          />
          <input
            type="number"
            placeholder="Price (e.g., 30)"
            className="input input-bordered w-full"
            value={foodPairingOption.price || ""}
            onChange={(e) => setFoodPairingOption({ ...foodPairingOption, price: parseFloat(e.target.value) || 0 })}
            min={0}
            step="0.01"
          />
          <button type="button" className="btn btn-primary" onClick={addFoodPairingOption}>
            Add Food Pairing/Platter
          </button>
        </div>
        <div className="mt-2">
          {formData.tasting_info.food_pairing_options.map((opt, index) => (
            <div key={index} className="flex justify-between items-center p-2 border-b">
              <span>
                {opt.name}: ${opt.price}
              </span>
              <button type="button" className="btn btn-xs btn-error" onClick={() => removeFoodPairingOption(index)}>
                Remove
              </button>
            </div>
          ))}
        </div>
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
            value={formData.tasting_info.available_times}
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
            value={formData.tasting_info.wine_types}
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
              },
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
            value={formData.ava}
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
    </div>
  );
};