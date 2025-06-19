import { ChangeEvent, useState } from "react";
import { MultiDateTimePicker } from "../datetime-picker";
import { TagInput } from "../tag-input";
import { Winery } from "@/app/interfaces";
import { MultipleImageUpload } from "../Multi-image-upload";
import { regions, timeOptions, wineTypes } from "@/data/data";
import { v4 as uuidv4 } from "uuid";

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
  const [tastingOption, setTastingOption] = useState({ id: "", name: "", description: "", price_per_guest: 0 });
  const [foodPairingOption, setFoodPairingOption] = useState({ id: "", name: "", description: "", price: 0 });

  const handlePriceChange = (field: "min" | "max", value: string) => {
    const num = parseFloat(value);
    formData.tasting_info.price_range[field === "min" ? 0 : 1] = num;
    setFormData({ ...formData });
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
    setFormData({ ...formData, booking_info: { ...formData.booking_info, available_slots: dates.map((d) => d.toISOString()) } });
  };

  const handleNumberOfPeopleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value) || 1;
    setFormData((prev) => ({
      ...prev,
      booking_info: { ...prev.booking_info, number_of_people: value },
    }));
  };

  const addTastingOption = () => {
    if (tastingOption.name && tastingOption.description && tastingOption.price_per_guest >= 0) {
      setFormData((prev) => ({
        ...prev,
        tasting_info: {
          ...prev.tasting_info,
          tasting_options: [
            ...prev.tasting_info.tasting_options,
            { ...tastingOption, id: uuidv4() },
          ],
        },
      }));
      setTastingOption({ id: "", name: "", description: "", price_per_guest: 0 });
    }
  };

  const removeTastingOption = (id: string) => {
    setFormData((prev) => ({
      ...prev,
      tasting_info: {
        ...prev.tasting_info,
        tasting_options: prev.tasting_info.tasting_options.filter((opt) => opt.id !== id),
      },
    }));
  };

  const addFoodPairingOption = () => {
    if (foodPairingOption.name && foodPairingOption.description && foodPairingOption.price >= 0) {
      setFormData((prev) => ({
        ...prev,
        tasting_info: {
          ...prev.tasting_info,
          food_pairing_options: [
            ...prev.tasting_info.food_pairing_options,
            { ...foodPairingOption, id: uuidv4() },
          ],
        },
      }));
      setFoodPairingOption({ id: "", name: "", description: "", price: 0 });
    }
  };

  const removeFoodPairingOption = (id: string) => {
    setFormData((prev) => ({
      ...prev,
      tasting_info: {
        ...prev.tasting_info,
        food_pairing_options: prev.tasting_info.food_pairing_options.filter((opt) => opt.id !== id),
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

      {/* Tasting Options */}
      <div className="form-control">
        <label className="label">Tasting Options</label>
        <div className="space-y-2">
          <input
            type="text"
            placeholder="Tasting Name (e.g., Vintage Tasting)"
            className="input input-bordered w-full"
            value={tastingOption.name}
            onChange={(e) => setTastingOption({ ...tastingOption, name: e.target.value })}
          />
          <textarea
            placeholder="Description (e.g., Includes X, Y, and Z)"
            className="textarea textarea-bordered w-full"
            value={tastingOption.description}
            onChange={(e) => setTastingOption({ ...tastingOption, description: e.target.value })}
          />
          <input
            type="number"
            placeholder="Price per Guest"
            className="input input-bordered w-full"
            value={tastingOption.price_per_guest || ""}
            onChange={(e) => setTastingOption({ ...tastingOption, price_per_guest: parseFloat(e.target.value) || 0 })}
            min={0}
            step="0.01"
          />
          <button type="button" className="btn btn-primary" onClick={addTastingOption}>
            Add Tasting Option
          </button>
        </div>
        <div className="mt-2">
          {formData.tasting_info.tasting_options.map((opt) => (
            <div key={opt.id} className="flex justify-between items-center p-2 border-b">
              <span>{opt.name}: {opt.description} (${opt.price_per_guest}/guest)</span>
              <button type="button" className="btn btn-xs btn-error" onClick={() => removeTastingOption(opt.id)}>
                Remove
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Food Pairing Options */}
      <div className="form-control">
        <label className="label">Food Pairing Options</label>
        <div className="space-y-2">
          <input
            type="text"
            placeholder="Food Pairing Name"
            className="input input-bordered w-full"
            value={foodPairingOption.name}
            onChange={(e) => setFoodPairingOption({ ...foodPairingOption, name: e.target.value })}
          />
          <textarea
            placeholder="Description"
            className="textarea textarea-bordered w-full"
            value={foodPairingOption.description}
            onChange={(e) => setFoodPairingOption({ ...foodPairingOption, description: e.target.value })}
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
            Add Food Pairing Option
          </button>
        </div>
        <div className="mt-2">
          {formData.tasting_info.food_pairing_options.map((opt) => (
            <div key={opt.id} className="flex justify-between items-center p-2 border-b">
              <span>{opt.name}: {opt.description} (${opt.price})</span>
              <button type="button" className="btn btn-xs btn-error" onClick={() => removeFoodPairingOption(opt.id)}>
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

      {/* Existing Tasting Info */}
      <div className="grid grid-cols-2 gap-4">
        <div className="form-control">
          <label className="label">Price Range (Min)</label>
          <input
            type="number"
            placeholder="Min"
            className="input input-bordered"
            value={formData.tasting_info.price_range[0] || ""}
            onChange={(e) => handlePriceChange("min", e.target.value)}
          />
        </div>
        <div className="form-control">
          <label className="label">Price Range (Max)</label>
          <input
            type="number"
            placeholder="Max"
            className="input input-bordered"
            value={formData.tasting_info.price_range[1] || ""}
            onChange={(e) => handlePriceChange("max", e.target.value)}
          />
        </div>
      </div>
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
        <TagInput
          tags={formData.tasting_info.special_features}
          onChange={(newTags) =>
            setFormData((prev) => ({
              ...prev,
              tasting_info: { ...prev.tasting_info, special_features: newTags },
            }))
          }
          placeholder="Add features"
        />
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
        <label className="cursor-pointer label">
          <span className="label-text">Food Pairings Available?</span>
          <input
            type="checkbox"
            checked={formData.tasting_info.food_pairings_available}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                tasting_info: { ...prev.tasting_info, food_pairings_available: e.target.checked },
              }))
            }
            className="checkbox"
          />
        </label>
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