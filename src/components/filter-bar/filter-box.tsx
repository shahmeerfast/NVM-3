import { useState, useEffect, useCallback } from "react";
import { Winery } from "@/app/interfaces";
import BottomSheet from "../bottom-sheet";
import { FilterIcon } from "lucide-react";
import { MdRestore } from "react-icons/md";
import { FilterBlock } from "./FilterBlock";
import { Filters, useFilterStore } from "@/hooks/useFilterStore";

interface FilterProps {
  wineries: Winery[];
  onFilterApply: (filteredWineries: Winery[]) => void;
}

const Filter = ({ wineries, onFilterApply }: FilterProps) => {
  const { filters, setFilters } = useFilterStore();

  const [isLoading, setIsLoading] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);
  const [isFeaturesOpen, setIsFeaturesOpen] = useState(true);

  const applyFilters = useCallback(() => {
    setIsLoading(true);
    let filtered = wineries;

    filtered = filtered.filter(
      (winery) =>
        winery.tasting_info.price_range[1] >= filters.priceRange[0] && winery.tasting_info.price_range[0] <= filters.priceRange[1]
    );

    filtered = filtered.filter(
      (winery) =>
        winery.tasting_info.number_of_wines_per_tasting[0] >= filters.numberOfWines[0] &&
        winery.tasting_info.number_of_wines_per_tasting[1] <= filters.numberOfWines[1]
    );

    if (Object.values(filters.wineType).some((value) => value)) {
      filtered = filtered.filter((winery) =>
        Object.keys(filters.wineType).some(
          (type) =>
            filters.wineType[type as keyof typeof filters.wineType] &&
            winery.tasting_info.wine_types.some((wineType) => wineType.toLowerCase() === type.toLowerCase())
        )
      );
    }
    if (filters.ava.length > 0) filtered = filtered.filter((winery) => filters.ava.includes(winery.ava));
    if (filters.time)
      filtered = filtered.filter((winery) =>
        winery.tasting_info.available_times.some((time) => filters.time.toLowerCase() === time.toLowerCase())
      );
    if (filters.specialFeatures.length > 0) {
      filtered = filtered.filter((winery) =>
        filters.specialFeatures.every((feature) => winery.tasting_info.special_features.includes(feature))
      );
    }

    onFilterApply(filtered);
    setIsLoading(false);
  }, [filters, wineries, onFilterApply]);

  useEffect(() => {
    applyFilters();
  }, [filters, applyFilters]);

  const handleFilterChange = (key: string, value: any) => {
    setFilters({ ...filters, [key]: value });
  };

  const handleSpecialFeatureChange = (feature: string, checked: boolean) => {
    if (checked) {
      filters.specialFeatures.push(feature);
    } else {
      const index = filters.specialFeatures.findIndex((spf) => spf === feature);
      console.log({ index });
      filters.specialFeatures.splice(index, 1);
    }
    setFilters({ ...filters, specialFeatures: [...filters.specialFeatures] });
  };

  const resetFilters = () => {
    setFilters({
      priceRange: [0, 1000],
      numberOfWines: [1, 10],
      wineType: { red: false, white: false, sparkling: false, dessert: false },
      ava: [],
      time: "",
      specialFeatures: [],
    });
    setShowResetModal(false);
  };

  const [isBottomSheetOpen, setBottomSheetOpen] = useState(false);
  return (
    <>
      <div className="md:hidden flex flex-row gap-2 w-full">
        <button
          className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 rounded-md transition-all duration-300 ease-in-out bg-primary text-white shadow-glassmorphism text-sm"
          onClick={() => setBottomSheetOpen(true)}
          disabled={isLoading}
          aria-label="Apply Filters"
        >
          <span className="font-medium">Apply Filters</span>
          <FilterIcon size={20} />
        </button>

        <button
          className="flex-3 flex items-center justify-center space-x-2 px-4 py-2 rounded-md border border-wine-primary text-wine-primary bg-transparent hover:bg-wine-primary hover:text-white hover:shadow-neumorphism transition duration-300 ease-in-out text-sm"
          onClick={() => setShowResetModal(true)}
          aria-label="Reset Filters"
        >
          <MdRestore size={20} />
          <span className="font-medium">Reset</span>
        </button>
      </div>

      <BottomSheet isOpen={isBottomSheetOpen} onClose={() => setBottomSheetOpen(false)}>
        <FilterBlock
          filters={filters}
          handleFilterChange={handleFilterChange}
          handleSpecialFeatureChange={handleSpecialFeatureChange}
          isFeaturesOpen={isFeaturesOpen}
          setIsFeaturesOpen={setIsFeaturesOpen}
        />
      </BottomSheet>
      <div className="hidden md:block p-4 bg-white shadow-lg rounded-lg w-full max-w-sm sm:max-w-md space-y-4 md:space-y-6">
        <h2 className="text-lg font-semibold text-gray-800">Filter Wineries</h2>
        <FilterBlock
          filters={filters}
          handleFilterChange={handleFilterChange}
          handleSpecialFeatureChange={handleSpecialFeatureChange}
          isFeaturesOpen={isFeaturesOpen}
          setIsFeaturesOpen={setIsFeaturesOpen}
        />

        <button
          className="flex-3 w-full flex items-center justify-center space-x-2 px-4 py-2 rounded-md border border-wine-primary text-wine-primary bg-transparent hover:bg-wine-primary hover:text-white hover:shadow-neumorphism transition duration-300 ease-in-out text-sm"
          onClick={() => setShowResetModal(true)}
          aria-label="Reset Filters"
        >
          <MdRestore size={20} />
          <span className="font-medium">Reset</span>
        </button>
      </div>

      {showResetModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="modal modal-open">
            <div className="modal-box p-4 max-w-md bg-white rounded-lg shadow-lg">
              <h2 className="text-lg font-semibold">Are you sure?</h2>
              <p className="text-gray-500 mt-2 text-sm">This will reset all the filters.</p>
              <div className="modal-action space-x-3">
                <button className="btn btn-ghost text-xs hover:bg-gray-200" onClick={() => setShowResetModal(false)}>
                  Cancel
                </button>
                <button className="btn btn-primary text-xs hover:bg-indigo-500" onClick={resetFilters}>
                  Reset
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {isLoading && (
        <div className="mt-4 space-y-2">
          <div className="w-full h-4 bg-neutral-200 rounded animate-pulse"></div>
          <div className="w-full h-4 bg-neutral-200 rounded animate-pulse"></div>
          <div className="w-full h-4 bg-neutral-200 rounded animate-pulse"></div>
        </div>
      )}
    </>
  );
};

export default Filter;
