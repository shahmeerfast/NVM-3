import { ChangeEvent, useState } from "react";
import { MultiDateTimePicker } from "../datetime-picker";
import { Winery, TastingInfo, Tours, WineDetail, BookingInfo, FoodPairingOption } from "@/app/interfaces";
import { MultipleImageUpload } from "../Multi-image-upload";
import { timeOptions, wineTypes, specialFeatures, regions } from "@/data/data";
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
  const [foodPairingOption, setFoodPairingOption] = useState<FoodPairingOption>({ id: "", name: "", price: 0 });
  const [newWine, setNewWine] = useState<WineDetail>({ id: "", name: "", description: "", year: undefined, tasting_notes: "", photo: "" });
  const [winePhotoFiles, setWinePhotoFiles] = useState<File[]>([]);
  const [newTour, setNewTour] = useState<{ description: string; cost: number }>({ description: "", cost: 0 });
  const [otherFeature, setOtherFeature] = useState<{ description: string; cost: number }>({ description: "", cost: 0 });

  const addTasting = (index: number) => () => {
    const newTasting: TastingInfo = {
      tasting_title: ``,
      tasting_description: "",
      tasting_price: 0,
      available_times: [],
      wine_types: [],
      number_of_wines_per_tasting: 1,
      special_features: [],
      images: uploadedFiles.map((file) => URL.createObjectURL(file)),
      tasting_info: {} as TastingInfo,
      food_pairing_options: [],
      tours: { available: false, tour_price: 0, tour_options: [] },
      wine_details: [],
      ava: "",
      booking_info: {
        booking_enabled: false,
        max_guests_per_slot: 1,
        number_of_people: [1, 10],
        dynamic_pricing: { enabled: false, weekend_multiplier: 1 },
        available_slots: [],
      },
      other_features: [],
    };

    setFormData((prev) => {
      const updatedTastings = [...prev.tasting_info];
      updatedTastings.splice(index + 1, 0, newTasting);
      return { ...prev, tasting_info: updatedTastings };
    });
    setUploadedFiles([]);
    setAvailableSlotDates([]);
  };

  const addInitialTasting = () => {
    const newTasting: TastingInfo = {
      tasting_title: `Tasting 1`,
      tasting_description: "Initial tasting experience",
      tasting_price: 0,
      available_times: [],
      wine_types: [],
      number_of_wines_per_tasting: 1,
      special_features: [],
      images: uploadedFiles.map((file) => URL.createObjectURL(file)),
      tasting_info: {} as TastingInfo,
      food_pairing_options: [],
      tours: { available: false, tour_price: 0, tour_options: [] },
      wine_details: [],
      ava: "",
      booking_info: {
        booking_enabled: false,
        max_guests_per_slot: 1,
        number_of_people: [1, 10],
        dynamic_pricing: { enabled: false, weekend_multiplier: 1 },
        available_slots: [],
      },
      other_features: [],
    };

    setFormData((prev) => ({
      ...prev,
      tasting_info: [newTasting],
    }));
    setUploadedFiles([]);
    setAvailableSlotDates([]);
  };

  const removeTasting = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      tasting_info: prev.tasting_info.filter((_, i) => i !== index),
    }));
  };

  const handleTastingChange = (index: number, field: keyof TastingInfo, value: any) => {
    setFormData((prev) => {
      const updatedTastings = [...prev.tasting_info];
      updatedTastings[index] = { ...updatedTastings[index], [field]: value };
      return { ...prev, tasting_info: updatedTastings };
    });
  };

  const handleTastingPriceChange = (index: number) => (e: ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value) || 0;
    handleTastingChange(index, "tasting_price", value);
  };

  const handleSelectChange = (index: number, field: "available_times" | "wine_types" | "special_features" | "ava") => (selected: any) => {
    const values = selected.map((s: any) => s.value);
    handleTastingChange(index, field, values);
  };

  const updateSlotDates = (index: number) => (dates: Date[]) => {
    setAvailableSlotDates(dates);
    handleTastingChange(index, "booking_info", {
      ...formData.tasting_info[index].booking_info,
      available_slots: dates.map((d) => d.toISOString()),
    });
  };

  const addFoodPairingOption = (index: number) => () => {
    if (foodPairingOption.name && foodPairingOption.price >= 0) {
      setFormData((prev) => {
        const updatedTastings = [...prev.tasting_info];
        updatedTastings[index] = {
          ...updatedTastings[index],
          food_pairing_options: [
            ...(updatedTastings[index].food_pairing_options || []),
            { id: crypto.randomUUID(), name: foodPairingOption.name, price: foodPairingOption.price },
          ],
        };
        return { ...prev, tasting_info: updatedTastings };
      });
      setFoodPairingOption({ id: "", name: "", price: 0 });
    }
  };

  const removeFoodPairingOption = (tastingIndex: number, optionIndex: number) => {
    setFormData((prev) => {
      const updatedTastings = [...prev.tasting_info];
      updatedTastings[tastingIndex] = {
        ...updatedTastings[tastingIndex],
        food_pairing_options: updatedTastings[tastingIndex].food_pairing_options.filter((_, i) => i !== optionIndex),
      };
      return { ...prev, tasting_info: updatedTastings };
    });
  };

  const addWine = (index: number) => () => {
    if (newWine.name && newWine.description) {
      setFormData((prev) => {
        const updatedTastings = [...prev.tasting_info];
        updatedTastings[index] = {
          ...updatedTastings[index],
          wine_details: [
            ...(updatedTastings[index].wine_details || []),
            {
              id: crypto.randomUUID(),
              name: newWine.name,
              description: newWine.description,
              year: newWine.year ? parseInt(newWine.year.toString()) : undefined,
              tasting_notes: newWine.tasting_notes,
              photo: winePhotoFiles[0] ? URL.createObjectURL(winePhotoFiles[0]) : undefined,
            },
          ],
        };
        return { ...prev, tasting_info: updatedTastings };
      });
      setNewWine({ id: "", name: "", description: "", year: undefined, tasting_notes: "", photo: "" });
      setWinePhotoFiles([]);
    }
  };

  const removeWine = (tastingIndex: number, wineIndex: number) => {
    setFormData((prev) => {
      const updatedTastings = [...prev.tasting_info];
      updatedTastings[tastingIndex] = {
        ...updatedTastings[tastingIndex],
        wine_details: updatedTastings[tastingIndex].wine_details.filter((_, i) => i !== wineIndex),
      };
      return { ...prev, tasting_info: updatedTastings };
    });
  };

  const submitTour = (index: number) => () => {
    if (newTour.description && newTour.cost >= 0) {
      setFormData((prev) => {
        const updatedTastings = [...prev.tasting_info];
        updatedTastings[index] = {
          ...updatedTastings[index],
          tours: {
            ...updatedTastings[index].tours,
            available: true,
            tour_options: [...(updatedTastings[index].tours.tour_options || []), { description: newTour.description, cost: newTour.cost }],
          },
        };
        return { ...prev, tasting_info: updatedTastings };
      });
      setNewTour({ description: "", cost: 0 });
    }
  };

  const removeTour = (tastingIndex: number, tourIndex: number) => {
    setFormData((prev) => {
      const updatedTastings = [...prev.tasting_info];
      updatedTastings[tastingIndex] = {
        ...updatedTastings[tastingIndex],
        tours: {
          ...updatedTastings[tastingIndex].tours,
          tour_options: updatedTastings[tastingIndex].tours.tour_options.filter((_, i) => i !== tourIndex),
        },
      };
      return { ...prev, tasting_info: updatedTastings };
    });
  };

  const addOtherFeature = (index: number) => () => {
    if (otherFeature.description && newTour.cost >= 0) {
      setFormData((prev) => {
        const updatedTastings = [...prev.tasting_info];
        updatedTastings[index] = {
          ...updatedTastings[index],
          other_features: [
            ...(updatedTastings[index].other_features || []),
            { description: otherFeature.description, cost: otherFeature.cost },
          ],
        };
        return { ...prev, tasting_info: updatedTastings };
      });
      setOtherFeature({ description: "", cost: 0 });
    }
  };

  const removeFeature = (tastingIndex: number, featureIndex: number) => {
    setFormData((prev) => {
      const updatedTastings = [...prev.tasting_info];
      updatedTastings[tastingIndex] = {
        ...updatedTastings[tastingIndex],
        other_features: updatedTastings[tastingIndex].other_features.filter((_, i) => i !== featureIndex),
      };
      return { ...prev, tasting_info: updatedTastings };
    });
  };

  const handleExternalBookingLinkChange = (index: number) => (e: ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => {
      const updatedTastings = [...prev.tasting_info];
      updatedTastings[index] = {
        ...updatedTastings[index],
        booking_info: { ...updatedTastings[index].booking_info, external_booking_link: e.target.value },
      };
      return { ...prev, tasting_info: updatedTastings };
    });
  };

  const handleNumberOfWinesChange = (index: number) => (e: ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value) || 1;
    handleTastingChange(index, "number_of_wines_per_tasting", value);
  };

  const handleNumberOfPeopleChange = (index: number, position: 0 | 1) => (e: ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value) || 1;
    setFormData((prev) => {
      const updatedTastings = [...prev.tasting_info];
      const newNumberOfPeople = [...updatedTastings[index].booking_info.number_of_people];
      newNumberOfPeople[position] = value;
      updatedTastings[index] = {
        ...updatedTastings[index],
        booking_info: { ...updatedTastings[index].booking_info, number_of_people: newNumberOfPeople as [number, number] },
      };
      return { ...prev, tasting_info: updatedTastings };
    });
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Tasting Booking Form</h2>
      {formData.tasting_info.length === 0 ? (
        <div className="border p-4 rounded-lg">
          <h3 className="text-xl font-semibold">No Tastings Added</h3>
          <button type="button" className="btn btn-primary mt-4" onClick={addInitialTasting}>
            Add First Tasting
          </button>
        </div>
      ) : (
        formData.tasting_info.map((tasting, index) => (
          <div key={index} className="border p-4 rounded-lg">
            <h3 className="text-xl font-semibold">Tasting #{index + 1}</h3>
            <button type="button" className="btn btn-xs btn-error mb-4" onClick={() => removeTasting(index)}>
              Remove Tasting
            </button>

            <div className="form-control">
              <label className="label">Tasting Title</label>
              <input
                type="text"
                placeholder="Enter tasting title"
                className="input input-bordered"
                value={tasting.tasting_title || ""}
                onChange={(e) => handleTastingChange(index, "tasting_title", e.target.value)}
              />
            </div>

            <div className="form-control">
              <label className="label">Tasting Description</label>
              <textarea
                placeholder="Description"
                className="textarea textarea-bordered"
                value={tasting.tasting_description || ""}
                onChange={(e) => handleTastingChange(index, "tasting_description", e.target.value)}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="form-control">
                <label className="label">Number of People Min</label>
                <input
                  type="number"
                  placeholder="Enter min number"
                  className="input input-bordered"
                  value={tasting.booking_info.number_of_people[0] || ""}
                  onChange={handleNumberOfPeopleChange(index, 0)}
                />
              </div>
              <div className="form-control">
                <label className="label">Number of People Max</label>
                <input
                  type="number"
                  placeholder="Enter max number"
                  className="input input-bordered"
                  value={tasting.booking_info.number_of_people[1] || ""}
                  onChange={handleNumberOfPeopleChange(index, 1)}
                />
              </div>
            </div>

            <div className="form-control">
              <label className="label">Wine Tasting Price</label>
              <input
                type="number"
                placeholder="Enter fixed price for tasting (e.g., 100)"
                className="input input-bordered"
                value={tasting.tasting_price || ""}
                onChange={handleTastingPriceChange(index)}
                min={0}
                step="0.01"
              />
            </div>

            <div className="form-control">
              <label className="label">External Booking Link (Optional)</label>
              <input
                type="url"
                placeholder="Enter booking link (e.g., https://winery.com/book)"
                className="input input-bordered"
                value={tasting.booking_info.external_booking_link || ""}
                onChange={handleExternalBookingLinkChange(index)}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="form-control">
                <label className="label">Available Times</label>
                <Select
                  isMulti
                  options={timeOptions.map((time) => ({ value: time, label: time }))}
                  value={tasting.available_times?.map((time) => ({ value: time, label: time }))}
                  onChange={handleSelectChange(index, "available_times")}
                />
              </div>
              <div className="form-control">
                <label className="label">Wine Types</label>
                <Select
                  isMulti
                  options={wineTypes.map((wt) => ({ value: wt, label: wt }))}
                  value={tasting.wine_types?.map((wt) => ({ value: wt, label: wt }))}
                  onChange={handleSelectChange(index, "wine_types")}
                />
              </div>
            </div>

            <div className="form-control">
              <label className="label">Number of Wines Per Tasting</label>
              <input
                type="number"
                placeholder="Enter number of wines"
                className="input input-bordered"
                value={tasting.number_of_wines_per_tasting || ""}
                onChange={handleNumberOfWinesChange(index)}
                min={1}
              />
            </div>
 <div className="grid grid-cols-2 gap-4">
            <div className="form-control">
              <label className="label">Special Features</label>
              <Select
                isMulti
                options={specialFeatures.map((feature) => ({ value: feature, label: feature }))}
                value={tasting.special_features?.map((feature) => ({ value: feature, label: feature }))}
                onChange={handleSelectChange(index, "special_features")}
              />
            </div>
            <div className="form-control">
          <label className="label flex items-center gap-1">
            Select AVA
            <FaMapMarkerAlt style={{ color: "#5A0C2C" }} />
          </label>
          <select
            className="select select-bordered"
            value={tasting.ava || ""}
            onChange={(e) => handleSelectChange(index, "ava")(e)}
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
              <MultiDateTimePicker dates={availableSlotDates} onChange={updateSlotDates(index)} />
            </div>

            <div className="form-control">
              <label className="label">Images Upload</label>
              <MultipleImageUpload
                files={uploadedFiles}
                onChange={(files) => {
                  setUploadedFiles(files);
                  handleTastingChange(index, "images", files.map((file) => URL.createObjectURL(file)));
                }}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="form-control">
                <label className="label">Wine</label>
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
                  <input
                    type="number"
                    placeholder="Wine year"
                    className="input input-bordered w-full"
                    value={newWine.year || ""}
                    onChange={(e) => setNewWine({ ...newWine, year: parseInt(e.target.value) || undefined })}
                  />
                  <input
                    type="text"
                    placeholder="Tasting notes"
                    className="input input-bordered w-full"
                    value={newWine.tasting_notes || ""}
                    onChange={(e) => setNewWine({ ...newWine, tasting_notes: e.target.value })}
                  />
                  <MultipleImageUpload files={winePhotoFiles} onChange={setWinePhotoFiles} />
                  <button type="button" className="btn btn-primary" onClick={addWine(index)}>
                    Add Wine
                  </button>
                </div>
                <div className="mt-2">
                  {tasting.wine_details?.map((wine, wineIndex) => (
                    <div key={wine.id} className="flex justify-between items-center p-2 border-b">
                      <span>{wine.name}</span>
                      <button type="button" className="btn btn-xs btn-error" onClick={() => removeWine(index, wineIndex)}>
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="form-control">
                <label className="label">Tour (Optional)</label>
                <div className="space-y-2">
                  <input
                    type="text"
                    placeholder="Tour Option"
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
                  <button type="button" className="btn btn-primary" onClick={submitTour(index)}>
                    Add Tour
                  </button>
                </div>
                <div className="mt-2">
                  {tasting.tours?.tour_options?.map((tour, tourIndex) => (
                    <div key={tourIndex} className="flex justify-between items-center p-2 border-b">
                      <span>
                        {tour.description}: ${tour.cost}
                      </span>
                      <button type="button" className="btn btn-xs btn-error" onClick={() => removeTour(index, tourIndex)}>
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="form-control">
                <label className="label">Food Available</label>
                <div className="space-y-2">
                  <input
                    type="text"
                    placeholder="Food Available"
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
                  <button type="button" className="btn btn-primary" onClick={addFoodPairingOption(index)}>
                    Add Food Available
                  </button>
                </div>
                <div className="mt-2">
                  {tasting.food_pairing_options?.map((pairing, optionIndex) => (
                    <div key={pairing.id} className="flex justify-between items-center p-2 border-b">
                      <span>
                        {pairing.name}: ${pairing.price}
                      </span>
                      <button type="button" className="btn btn-xs btn-error" onClick={() => removeFoodPairingOption(index, optionIndex)}>
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="form-control">
                <label className="label">Other Features</label>
                <div className="space-y-2">
                  <input
                    type="text"
                    placeholder="Other Feature"
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
                  <button type="button" className="btn btn-primary" onClick={addOtherFeature(index)}>
                    Add Feature
                  </button>
                </div>
                <div className="mt-2">
                  {tasting.other_features?.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex justify-between items-center p-2 border-b">
                      <span>
                        {feature.description}: ${feature.cost}
                      </span>
                      <button type="button" className="btn btn-xs btn-error" onClick={() => removeFeature(index, featureIndex)}>
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-4">
              <button type="button" className="btn btn-primary" onClick={addTasting(index)}>
                Add Tasting
              </button>
            </div>
          </div>
        ))
      )}

      <div className="form-control">
        <label className="label">Payment Method</label>
        <div className="flex flex-col gap-2">
          <label className="flex items-center">
            <input
              type="radio"
              name="paymentMethod"
              value="pay_winery"
              checked={formData.payment_method === "pay_winery"}
              onChange={(e) => setFormData((prev) => ({ ...prev, payment_method: e.target.value }))}
              className="radio"
            />
            <span className="ml-2">Pay at Winery</span>
          </label>
          <label className="flex items-center">
            <input
              type="radio"
              name="paymentMethod"
              value="pay_stripe"
              checked={formData.payment_method === "pay_stripe"}
              onChange={(e) => setFormData((prev) => ({ ...prev, payment_method: e.target.value }))}
              className="radio"
            />
            <span className="ml-2">Pay in NVW App (Stripe)</span>
          </label>
        </div>
      </div>

      <div className="form-control">
        <label className="label">
          Total Amount: $
          {formData.tasting_info.reduce((sum, tasting) => {
            const tastingCost = tasting.tasting_price || 0;
            const tourCost = tasting.tours?.tour_options?.reduce((tSum, tour) => tSum + (tour.cost || 0), 0) || 0;
            const foodCost = tasting.food_pairing_options?.reduce((fSum, pairing) => fSum + (pairing.price || 0), 0) || 0;
            const featureCost = tasting.other_features?.reduce((fSum, feature) => fSum + (feature.cost || 0), 0) || 0;
            return sum + tastingCost + tourCost + foodCost + featureCost;
          }, 0)}
        </label>
      </div>
    </div>
  );
};