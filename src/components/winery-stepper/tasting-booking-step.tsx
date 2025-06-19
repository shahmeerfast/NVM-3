import { ChangeEvent } from "react";
import { MultiDateTimePicker } from "../datetime-picker";
import { TagInput } from "../tag-input";
import { Winery } from "@/app/interfaces";
import { MultipleImageUpload } from "../Multi-image-upload";
import { regions, timeOptions, wineTypes } from "@/data/data";

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

  return (
    <div className="space-y-4">
      {/* Tasting Info */}
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
