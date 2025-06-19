import { Range } from "react-range";
import Select from "react-select";
import { wineTypes, regions, timeOptions, specialFeatures } from "@/data/data";
import React from "react";
type Filters = {
  priceRange: number[];
  numberOfWines: number[];
  wineType: {
    red: boolean;
    white: boolean;
    sparkling: boolean;
    dessert: boolean;
  };
  ava: string[];
  time: string;
  specialFeatures: string[];
};
interface FilterBlockProps {
  filters: Filters;
  handleFilterChange: (key: string, value: any) => void;
  handleSpecialFeatureChange: (feature: string, checked: boolean) => void;
  isFeaturesOpen: boolean;
  setIsFeaturesOpen: (value: boolean) => void;
}

export const FilterBlock = ({
  filters,
  handleFilterChange,
  handleSpecialFeatureChange,
  isFeaturesOpen,
  setIsFeaturesOpen,
}: FilterBlockProps) => {
  return (
    <>
      {/* Price Range Filter */}
      <div className="grid gap-4 mt-8 mb-5">
        <label className="text-sm text-gray-900 font-extrabold">Price Range</label>
        <Range
          step={10}
          min={0}
          max={1000}
          values={filters.priceRange}
          onChange={(newValues: any) => handleFilterChange("priceRange", newValues)}
          renderTrack={({ props, children }) => (
            <div {...props} className="w-full h-1 bg-neutral-300 rounded-full">
              {React.Children.map(children, (child, index) =>
                React.isValidElement(child) ? React.cloneElement(child, { key: index }) : child
              )}
            </div>
          )}
          renderThumb={({ props }) => {
            const { key, ...newProps } = props;
            return <div key={key} {...newProps} className="w-4 h-4 bg-primary rounded-full shadow-lg focus:outline-none" />;
          }}
        />
        <div className="flex justify-between text-xs">
          <span>${filters.priceRange[0]}</span>
          <span>${filters.priceRange[1]}</span>
        </div>
      </div>

      {/* Number of Wines Filter */}
      <div className="grid gap-4">
        <label className="text-sm text-gray-900 font-extrabold">Number of Wines</label>
        <Range
          step={1}
          min={1}
          max={10}
          values={filters.numberOfWines}
          onChange={(newValues) => handleFilterChange("numberOfWines", newValues)}
          renderTrack={({ props, children }) => (
            <div {...props} className="w-full h-1 bg-neutral-300 rounded-full">
              {React.Children.map(children, (child, index) =>
                React.isValidElement(child) ? React.cloneElement(child, { key: index }) : child
              )}
            </div>
          )}
          renderThumb={({ props }) => {
            const { key, ...newProps } = props;
            return <div {...newProps} className="w-4 h-4 bg-primary rounded-full shadow-lg focus:outline-none" />;
          }}
        />
        <div className="flex justify-between text-xs">
          <span>{filters.numberOfWines[0]}</span>
          <span>{filters.numberOfWines[1]}</span>
        </div>
      </div>

      {/* Wine Type Filter */}
      <div className="mt-4">
        <label className="text-sm text-gray-900 font-extrabold">Wine Type</label>
        <div className="mt-2 flex flex-wrap gap-3">
          {wineTypes.map((type) => (
            <label key={type} className="flex items-center space-x-2 text-xs sm:text-sm">
              <input
                type="checkbox"
                className="checkbox checkbox-primary"
                checked={filters.wineType[type as keyof typeof filters.wineType]}
                onChange={(e) => handleFilterChange("wineType", { ...filters.wineType, [type]: e.target.checked })}
              />
              <span className="capitalize">{type}</span>
            </label>
          ))}
        </div>
      </div>

      {/* AVA Filter */}
      <div className="mt-4">
        <label className="text-sm font-extrabold text-gray-900">American Viticultural Area (AVA)</label>
        <Select
          menuPlacement="top"
          isMulti
          options={[...regions.map((region) => ({ value: region, label: region }))]}
          value={filters.ava.map((ava) => ({ value: ava, label: ava }))}
          onChange={(selectedOptions) =>
            handleFilterChange(
              "ava",
              selectedOptions.map((opt) => opt.value)
            )
          }
          className="w-full mt-2 mb-0"
          classNamePrefix="select"
        />
      </div>

      {/* Time Filter */}
      <div style={{ marginTop: 10 }}>
        <label className="text-sm text-gray-900 font-extrabold">Preferred Time</label>
        <select
          value={filters.time}
          onChange={(e) => handleFilterChange("time", e.target.value)}
          className="select select-bordered w-full mt-2 focus:ring-2 focus:ring-indigo-500 text-xs p-2 sm:text-sm"
        >
          <option value="">Select Time</option>
          {timeOptions.map((time) => (
            <option key={time} value={time}>
              {time}
            </option>
          ))}
        </select>
      </div>

      {/* Special Features Filter */}
      <div className="my-10">
        <button
          onClick={() => setIsFeaturesOpen(!isFeaturesOpen)}
          className="flex justify-between items-center w-full text-sm font-semibold"
        >
          Special Features
          <span>{isFeaturesOpen ? "-" : "+"}</span>
        </button>
        {isFeaturesOpen && (
          <div className="mt-2 flex flex-wrap gap-2">
            {specialFeatures.map((feature) => (
              <label key={feature} className="flex items-center space-x-2 text-xs sm:text-sm">
                <input
                  type="checkbox"
                  className="checkbox checkbox-primary"
                  checked={filters.specialFeatures.includes(feature)}
                  onChange={(e) => handleSpecialFeatureChange(feature, e.target.checked)}
                />
                <span>{feature}</span>
              </label>
            ))}
          </div>
        )}
      </div>
    </>
  );
};
