"use client";
import React, { useRef, useState, useEffect } from "react";
import { Winery } from "@/app/interfaces";
import { BasicInfoForm } from "@/components/winery-stepper/basic-info-step";
import { TastingBookingForm } from "@/components/winery-stepper/tasting-booking-step";
import { fileUpload } from "@/lib/fileUpload";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useRouter, useSearchParams } from "next/navigation";

const initialState: Winery = {
  name: "",
  description: "",
  location: { address: "", latitude: 0, longitude: 0, is_mountain_location: false },
  contact_info: { email: "", phone: "", website: "" },
  tasting_info: [
    {
      tasting_title: "",
      tasting_description: "",
      tasting_price: 0,
      available_times: [],
      wine_types: [],
      number_of_wines_per_tasting: 1,
      special_features: [],
      images: [],
      food_pairing_options: [],
      ava: "",
      tours: {
        available: false,
        tour_price: 0,
        tour_options: [],
      },
      wine_details: [],
      booking_info: {
        booking_enabled: false,
        max_guests_per_slot: 0,
        number_of_people: [1, 10],
        dynamic_pricing: { enabled: false, weekend_multiplier: 1 },
        available_slots: [],
        external_booking_link: "",
      },
      other_features: [],
    },
  ],
  amenities: { virtual_sommelier: false, augmented_reality_tours: false, handicap_accessible: false },
  user_reviews: [],
  transportation: { uber_availability: false, lyft_availability: false, distance_from_user: 0 },
  payment_method: "pay_winery",
};

export default function WineryAdminStepperPage() {
  const [formData, setFormData] = useState<Winery>(initialState);
  const [activeStep, setActiveStep] = useState(0);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [availableSlotDates, setAvailableSlotDates] = useState<Date[]>([]);
  const [loading, setLoading] = useState(false);
  const [tastingImages, setTastingImages] = useState<{ [key: number]: File[] }>({});
  const formRef = useRef<HTMLFormElement>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const wineryId = searchParams.get("id");

  useEffect(() => {
    if (wineryId) {
      setLoading(true);
      axios
        .get(`/api/winery/${wineryId}`)
        .then((res) => {
          if (res.data && res.data.winery) {
            setFormData(res.data.winery);
          }
        })
        .catch(() => toast.error("Failed to load winery for editing."))
        .finally(() => setLoading(false));
    }
  }, [wineryId]);

  const handleNext = () => setActiveStep((prev) => prev + 1);
  const handleBack = () => setActiveStep((prev) => prev - 1);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      // Collect all files from global uploads and individual tastings
      const allFiles: File[] = [...uploadedFiles];
      
      // Add files from individual tastings
      Object.values(tastingImages).forEach(files => {
        allFiles.push(...files);
      });
      
      // Upload all files to ImgBB
      const filesUrls = await fileUpload(allFiles);
      
      const updatedFormData = { ...formData };
      
      if (filesUrls.length > 0) {
        // Distribute URLs properly to each tasting
        let urlIndex = 0;
        updatedFormData.tasting_info = updatedFormData.tasting_info.map((tasting, index) => {
          const filesForThisTasting = tastingImages[index] || [];
          const urlsForThisTasting: string[] = [];
          
          // Get URLs for this tasting's files
          for (let i = 0; i < filesForThisTasting.length && urlIndex < filesUrls.length; i++) {
            urlsForThisTasting.push(filesUrls[urlIndex]);
            urlIndex++;
          }
          
          // Combine with existing images
          const existingImages = tasting.images || [];
          return {
            ...tasting,
            images: [...existingImages, ...urlsForThisTasting]
          };
        });
      }

      if (wineryId) {
        // Update existing winery
        await axios.patch(`/api/admin/wineries/${wineryId}`, updatedFormData);
        toast.success("Winery updated successfully!", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: true,
        });
      } else {
        // Create new winery
        await axios.post("/api/winery", updatedFormData);
        toast.success("Winery added successfully!", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: true,
        });
      }
      setFormData({ ...initialState });
      setUploadedFiles([]);
      setTastingImages({});
      setAvailableSlotDates([]);
      setActiveStep(0);
      router.push("/admin/dashboard/winery/list");
    } catch (error) {
      console.error("Error saving winery:", error);
      toast.error("Error saving winery. Please try again.", {
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
            tastingImages={tastingImages}
            setTastingImages={setTastingImages}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen p-4 bg-gray-100 relative top-20">
      <div className="container mx-auto max-w-4xl bg-base-100 p-5 relative">
        <h1 className="text-3xl font-bold text-center mb-6">{wineryId ? "Edit Winery" : "Add New Winery"}</h1>
        <div className="steps mb-4">
          <div className={`step ${activeStep >= 0 ? "step-primary" : ""}`}>Basic Info</div>
          <div className={`step ${activeStep >= 1 ? "step-primary" : ""}`}>Tasting & Booking</div>
        </div>

        {loading && (
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center z-50">
            <div className="loader border-t-4 border-b-4 border-white w-12 h-12 rounded-full animate-spin"></div>
          </div>
        )}

        <ToastContainer />

        <form ref={formRef} onSubmit={(e) => e.preventDefault()} className="space-y-6" id="winery-form">
          {renderStep()}
          <div className="flex justify-between" style={{ marginBottom: "40px" }}>
            {activeStep > 0 && (
              <button type="button" onClick={handleBack} className="btn">
                Back
              </button>
            )}
            {activeStep < 1 ? (
              <button type="button" onClick={handleNext} className="btn btn-primary ml-auto">
                Next
              </button>
            ) : (
              <button onClick={handleSubmit} className="btn btn-success ml-auto" disabled={loading}>
                {wineryId ? "Update Winery" : "Submit Winery"}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}