import { Winery } from "@/app/interfaces";
import { TagInput } from "../tag-input";
import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

type WineDetailsFormProps = {
  formData: Winery;
  setFormData: React.Dispatch<React.SetStateAction<Winery>>;
};

export const WineDetailsForm: React.FC<WineDetailsFormProps> = ({ formData, setFormData }) => {
  const wineTypeOptions = ["Red", "White", "Rosé", "Sparkling", "Dessert", "Fortified"];
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const toggleAccordion = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  const handleWineChange = (index: number, field: string, value: any) => {
    const updated = [...formData.wine_details];
    if (!updated[index]) {
      updated[index] = { wine_id: "", name: "", type: "", year: 0, tasting_notes: "", pairing_suggestions: [] };
    }
    updated[index] = { ...updated[index], [field]: value };
    setFormData((prev) => ({ ...prev, wine_details: updated }));
  };

  const addWine = () =>
    setFormData((prev) => ({
      ...prev,
      wine_details: [
        ...prev.wine_details,
        { wine_id: "", name: "", type: "", year: 0, tasting_notes: "", pairing_suggestions: [] },
      ],
    }));

  const removeWine = (index: number) =>
    setFormData((prev) => ({ ...prev, wine_details: prev.wine_details.filter((_, i) => i !== index) }));

  return (
    <div className="space-y-4">
      {formData.wine_details.map((wine, i) => (
        <div key={i} className="border rounded-lg">
          <div
            className="flex justify-between items-center p-4 bg-gray-100 rounded-t-lg cursor-pointer"
            onClick={() => toggleAccordion(i)}
          >
            <h3 className="font-bold">
              #{i + 1}: {wine.name || "Unnamed Wine"}
            </h3>
            <div className="flex items-center">
              <button type="button" className="btn btn-xs btn-error mr-2" onClick={() => removeWine(i)}>
                Remove
              </button>

              {activeIndex === i ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
            </div>
          </div>

          <div className={`overflow-hidden transition-all duration-700 ${activeIndex === i ? "max-h-[1000px] p-4" : "max-h-0"}`}>
            <div className="form-control mt-2">
              <label className="label">Wine Name</label>
              <input
                type="text"
                placeholder="Enter name"
                className="input input-bordered"
                value={wine.name}
                onChange={(e) => handleWineChange(i, "name", e.target.value)}
              />
            </div>
            <div className="form-control mt-2">
              <label className="label">Wine Type</label>
              <select
                className="select select-bordered"
                value={wine.type}
                onChange={(e) => handleWineChange(i, "type", e.target.value)}
              >
                <option value="">Select type</option>
                {wineTypeOptions.map((wt) => (
                  <option key={wt} value={wt}>
                    {wt}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-control mt-2">
              <label className="label">Year</label>
              <input
                type="number"
                placeholder="Enter year"
                className="input input-bordered"
                value={wine.year || ""}
                onChange={(e) => handleWineChange(i, "year", parseInt(e.target.value) || 0)}
              />
            </div>
            <div className="form-control mt-2">
              <label className="label">Tasting Notes</label>
              <textarea
                placeholder="Enter notes"
                className="textarea textarea-bordered"
                value={wine.tasting_notes}
                onChange={(e) => handleWineChange(i, "tasting_notes", e.target.value)}
              />
            </div>
            <div className="form-control mt-2">
              <label className="label">Pairing Suggestions</label>
              <TagInput
                tags={wine.pairing_suggestions}
                onChange={(newTags) => handleWineChange(i, "pairing_suggestions", newTags)}
                placeholder="Add suggestions"
              />
            </div>
          </div>
        </div>
      ))}
      <button type="button" className="btn btn-primary mt-4" onClick={addWine}>
        Add Wine
      </button>
    </div>
  );
};
