"use client";
import React, { useRef, useState } from "react";
import { Winery } from "@/app/interfaces";
import { BasicInfoForm } from "@/components/winery-stepper/basic-info-step";
import { TastingBookingForm } from "@/components/winery-stepper/tasting-booking-step";
import { WineDetailsForm } from "@/components/winery-stepper/wine-detail-form-step";
import { fileUpload } from "@/lib/fileUpload";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const initialState: Winery = {
  name: "",
  description: "",
  location: { address: "", latitude: 0, longitude: 0, is_mountain_location: false },
  contact_info: { email: "", phone: "", website: "" },
  images: [],
  tasting_info: {
    price_range: [0, 100],
    available_times: [],
    wine_types: [],
    number_of_wines_per_tasting: [1, 2],
    special_features: [],
    food_pairings_available: false,
  },
  wine_details: [],
  ava: "",
  booking_info: {
    booking_enabled: false,
    max_guests_per_slot: 0,
    dynamic_pricing: { enabled: false, weekend_multiplier: 0 },
    available_slots: [],
  },
  amenities: { virtual_sommelier: false, augmented_reality_tours: false, handicap_accessible: false },
  user_reviews: [],
  transportation: { uber_availability: false, lyft_availability: false, distance_from_user: 0 },
};

export default function WineryAdminStepperPage() {
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState<Winery>({ ...initialState });
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [availableSlotDates, setAvailableSlotDates] = useState<Date[]>([]);
  const [loading, setLoading] = useState(false);
  const formRef = useRef<HTMLFormElement | null>(null);

  const handleNext = () => setActiveStep((prev) => prev + 1);
  const handleBack = () => setActiveStep((prev) => prev - 1);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const filesUrls = await fileUpload(uploadedFiles);
      formData.images = filesUrls;

      await axios.post("/api/winery", formData);

      setFormData({ ...initialState });

      setUploadedFiles([]);
      setAvailableSlotDates([]);

      setActiveStep(0);
      toast.success("Winery added successfully!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: true,
      });
    } catch (error) {
      toast.error("Error adding winery. Please try again.", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const renderStep = () => {
    switch (activeStep) {
      case 0:
        return <BasicInfoForm formData={formData} setFormData={setFormData} />;
      case 1:
        return (
          <TastingBookingForm
            formData={formData}
            setFormData={setFormData}
            uploadedFiles={uploadedFiles}
            setUploadedFiles={setUploadedFiles}
            availableSlotDates={availableSlotDates}
            setAvailableSlotDates={setAvailableSlotDates}
          />
        );
      case 2:
        return <WineDetailsForm formData={formData} setFormData={setFormData} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen p-4 bg-gray-100 relative top-20">
      <div className="container mx-auto max-w-4xl bg-base-100 p-5 relative">
        <h1 className="text-3xl font-bold text-center mb-6">Add New Winery</h1>
        <div className="steps mb-4">
          <div className={`step ${activeStep >= 0 ? "step-primary" : ""}`}>Basic Info</div>
          <div className={`step ${activeStep >= 1 ? "step-primary" : ""}`}>Tasting & Booking</div>
          <div className={`step ${activeStep >= 2 ? "step-primary" : ""}`}>Wine Details</div>
        </div>

        {/* Loading spinner */}
        {loading && (
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center z-50">
            <div className="loader border-t-4 border-b-4 border-white w-12 h-12 rounded-full animate-spin"></div>
          </div>
        )}

        {/* Toast notification container */}
        <ToastContainer />

        <form ref={formRef} onSubmit={(e) => e.preventDefault()} className="space-y-6" id="winery-form">
          {renderStep()}
          <div className="flex justify-between">
            {activeStep > 0 && (
              <button type="button" onClick={handleBack} className="btn">
                Back
              </button>
            )}
            {activeStep < 2 ? (
              <button type="button" onClick={handleNext} className="btn btn-primary ml-auto">
                Next
              </button>
            ) : (
              <button onClick={handleSubmit} className="btn btn-success ml-auto" disabled={loading}>
                Submit Winery
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
