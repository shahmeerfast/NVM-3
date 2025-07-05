import { ChangeEvent, useState } from "react";
import { MultiDateTimePicker } from "../datetime-picker";
import { Winery, TastingInfo, Tours, WineDetail, BookingInfo, FoodPairingOption } from "@/app/interfaces";
import { MultipleImageUpload } from "../Multi-image-upload";
import { regions, timeOptions, wineTypes, specialFeatures } from "@/data/data";
import Select from "react-select";
import { FaMapMarkerAlt } from "react-icons/fa";
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
  const [newWine, setNewWine] = useState({ id: "", name: "", description: "" });
  const [newTasting, setNewTasting] = useState({ id: "", name: "", description: "", price: 0, timeslot: "" });
  const [newTour, setNewTour] = useState({ description: "", cost: 0 });
  const [otherFeature, setOtherFeature] = useState({ description: "", cost: 0 });

  const handleTastingPriceChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value) || 0;
    setFormData((prev) => ({
      ...prev,
      tasting_info: { ...prev.tasting_info, tasting_price: value } as TastingInfo,
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
    if (newWine.name && newWine.description) {
      setFormData((prev) => ({
        ...prev,
        wine_details: [
          ...((prev.wine_details as WineDetail[]) || []),
          { id: crypto.randomUUID(), name: newWine.name, description: newWine.description },
        ],
      }));
      setNewWine({ id: "", name: "", description: "" });
    }
  };

  const removeWine = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      wine_details: (prev.wine_details as WineDetail[]).filter((_, i) => i !== index),
    }));
  };

  const submitTour = () => {
    if (newTour.description && newTour.cost >= 0) {
      setFormData((prev) => ({
        ...prev,
        tours: {
          ...prev.tours,
          tour_options: [{ description: newTour.description, cost: newTour.cost }],
        } as Tours,
      }));
      setNewTour({ description: "", cost: 0 });
    }
  };

  const addOtherFeature = () => {
    if (otherFeature.description && otherFeature.cost >= 0) {
      setFormData((prev) => ({
        ...prev,
        booking_info: {
          ...prev.booking_info,
          other_features: [
            ...(prev.booking_info?.other_features || []),
            { description: otherFeature.description, cost: otherFeature.cost, feature_id: crypto.randomUUID() },
          ],
        } as BookingInfo,
      }));
      setOtherFeature({ description: "", cost: 0 });
    }
  };

  const removeFeature = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      booking_info: {
        ...prev.booking_info,
        other_features: (prev.booking_info?.other_features || []).filter((_, i) => i !== index),
      } as BookingInfo,
    }));
  };

  const handleExternalBookingLinkChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      booking_info: { ...prev.booking_info, external_booking_link: e.target.value } as BookingInfo,
    }));
  };
  const handleNumberOfwineChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value) || 1;
    setFormData((prev) => ({
      ...prev,
      tasting_info: { ...prev.tasting_info, number_of_wines_per_tasting: value } as TastingInfo,
    }));
  };

  const handleTastingTitleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      tasting_info: { ...prev.tasting_info, tasting_title: e.target.value } as TastingInfo,
    }));
  };
  const handleTastingDescriptionChange = (e: any) => {
    setFormData((prev) => ({
      ...prev,
      tasting_info: { ...prev.tasting_info, tasting_description: e.target.value } as TastingInfo,
    }));
  };
  return (
    <div className="space-y-4">
      <div className="form-control">
        <label className="label">Tasting Title</label>
        <input
          type="text"
          placeholder="Enter tasting title"
          className="input input-bordered"
          value={formData.tasting_info.tasting_title || ""}
          onChange={handleTastingTitleChange}
        />
      </div>

      <div className="form-control">
        <label className="label">Tasting Description</label>
        <textarea
          name="description"
          placeholder="Description"
          className="textarea textarea-bordered"
          value={formData.tasting_info.tasting_description || ""}
          onChange={handleTastingDescriptionChange}
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="form-control">
          <label className="label">Number of People Min</label>

          <input
            type="number"
            placeholder="Enter min number"
            className="input input-bordered"
            value={formData.booking_info.number_of_people[0] || ""}
            onChange={(e) => {
              formData.booking_info.number_of_people[0] = +e.target.value;
              setFormData({ ...formData });
            }}
          />
        </div>
        <div className="form-control">
          <label className="label">Number of People Max</label>

          <input
            type="number"
            placeholder="Enter max number"
            className="input input-bordered"
            value={formData.booking_info.number_of_people[1] || ""}
            onChange={(e) => {
              formData.booking_info.number_of_people[1] = +e.target.value;
              setFormData({ ...formData });
            }}
          />
        </div>
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
          <Select
            isMulti
            options={timeOptions.map((time) => ({ value: time, label: time }))}
            value={formData.tasting_info.available_times?.map((time) => ({ value: time, label: time }))}
            onChange={(selected) =>
              handleSelectChange(
                { target: { selectedOptions: selected.map((s) => ({ value: s.value })) } } as any,
                "available_times"
              )
            }
          />
        </div>
        <div className="form-control">
          <label className="label">Wine Types</label>
          <Select
            isMulti
            options={wineTypes.map((wt) => ({ value: wt, label: wt }))}
            value={formData.tasting_info.wine_types?.map((wt) => ({ value: wt, label: wt }))}
            onChange={(selected) =>
              handleSelectChange({ target: { selectedOptions: selected.map((s) => ({ value: s.value })) } } as any, "wine_types")
            }
          />
        </div>
      </div>
      <label className="label">Number of Wines Per Tasting</label>
      <div className="grid grid-cols-2 gap-4">
        <div className="form-control">
          <input
            type="number"
            placeholder="Enter min number"
            className="input input-bordered"
            value={formData.tasting_info.number_of_wines_per_tasting || ""}
            onChange={handleNumberOfwineChange}
          />
        </div>
      </div>

      {/* AVA & Booking */}
      <div className="grid grid-cols-2 gap-4">
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

        <div className="form-control">
          <label className="label flex items-center gap-1">
            Select AVA
            <FaMapMarkerAlt style={{ color: "#5A0C2C" }} />
          </label>
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
              type="text"
              placeholder="Wine description"
              className="input input-bordered w-full"
              value={newWine.description || ""}
              onChange={(e) => setNewWine({ ...newWine, description: e.target.value })}
            />
            <button type="button" className="btn btn-primary" onClick={addWine}>
              Add Wine
            </button>
          </div>
          <div className="mt-2">
            {formData.wine_details?.map((wine, index) => (
              <div key={wine.id} className="flex justify-between items-center p-2 border-b">
                <span>{wine.name}</span>
                <button type="button" className="btn btn-xs btn-error" onClick={() => removeWine(index)}>
                  Remove
                </button>
              </div>
            )) || null}
          </div>
        </div>

        {/* Time Slot */}
        <div className="form-control">
          <label className="label">Tour (Optional)</label>
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
            <button type="button" className="btn btn-primary" onClick={submitTour}>
              Submit
            </button>
          </div>
          <div className="mt-2">
            {formData.tours?.tour_options?.map((tour, index) => (
              <div key={index} className="flex justify-between items-center p-2 border-b">
                <span>
                  {tour.description}: ${tour.cost}
                </span>
                <button
                  type="button"
                  className="btn btn-xs btn-error"
                  onClick={() =>
                    setFormData((prev) => ({
                      ...prev,
                      tours: {
                        ...prev.tours,
                        tour_options: [],
                      } as Tours,
                    }))
                  }
                >
                  Remove
                </button>
              </div>
            )) || null}
          </div>
        </div>
      </div>

      {/* <div className="grid grid-cols-2 gap-4">
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
              type="text"
              placeholder="Description"
              className="input input-bordered w-full"
              value={newTasting.description}
              onChange={(e) => setNewTasting({ ...newTasting, description: e.target.value })}
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
            {formData?.tastings?.map((tasting, index) => (
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

 
      </div> */}

      <div className="grid grid-cols-2 gap-4">
        {/* Food Pairings */}
        <div className="form-control">
          <label className="label">Food Available</label>
          <div className="space-y-2">
            <input
              type="text"
              placeholder="Food Available #1"
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
              Add Food Available
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
        <div className="form-control">
          <label className="label">Other Features </label>
          <div className="space-y-2">
            <input
              type="text"
              placeholder="Other Feature #1"
              className="input input-bordered w-full"
              value={otherFeature.description}
              onChange={(e) => setOtherFeature({ ...otherFeature, description: e.target.value })}
            />
            <input
              type="number"
              placeholder="Feature Cost"
              className="input input-bordered w-full"
              value={otherFeature.cost || ""}
              onChange={(e) => setOtherFeature({ ...otherFeature, cost: parseFloat(e.target.value) || 0 })}
              min={0}
              step="0.01"
            />
            <button type="button" className="btn btn-primary" onClick={addOtherFeature}>
              Add Feature
            </button>
          </div>
          <div className="mt-2">
            {formData.booking_info?.other_features?.map((feature, index) => (
              <div key={index} className="flex justify-between items-center p-2 border-b">
                <span>
                  {feature.description}: ${feature.cost}
                </span>
                <button type="button" className="btn btn-xs btn-error" onClick={() => removeFeature(index)}>
                  Remove
                </button>
              </div>
            )) || null}
          </div>
        </div>
        {/* Additional Guests */}
      </div>
      {/* Payment Method and Total */}
      <div className="form-control">
        <label className="label">Payment Method</label>
        <div className="flex flex-col gap-2">
          <label className="flex items-center">
            <input
              type="radio"
              name="paymentMethod"
              value="pay_winery"
              checked={formData.booking_info.payment_method === "pay_winery"}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  booking_info: { ...prev.booking_info, payment_method: e.target.value } as BookingInfo,
                }))
              }
              className="radio"
            />
            <span className="ml-2">Pay at Winery</span>
          </label>
          <label className="flex items-center">
            <input
              type="radio"
              name="paymentMethod"
              value="pay_stripe"
              checked={formData.booking_info.payment_method === "pay_stripe"}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  booking_info: { ...prev.booking_info, payment_method: e.target.value } as BookingInfo,
                }))
              }
              className="radio"
            />
            <span className="ml-2">Pay in NVW App(stripe)</span>
          </label>
        </div>
      </div>

      {/* Total Amount */}
      <div className="form-control">
        <label className="label">
          Total Amount:{" "}
          {(formData.tasting_info.tasting_price || 0) +
            (formData.tours.tour_price || 0) +
            (formData.food_pairing_options?.reduce((sum, pairing) => sum + (pairing.price || 0), 0) || 0) +
            (formData.booking_info?.other_features?.reduce((sum, guest) => sum + (guest.cost || 0), 0) || 0)}
        </label>
      </div>
    </div>
  );
};
