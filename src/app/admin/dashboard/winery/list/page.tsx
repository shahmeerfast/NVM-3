"use client";

import { useState } from "react";
import useSWR from "swr";

// Simple fetcher for SWR
const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function WineryListPage() {
  const [page, setPage] = useState(1);
  const limit = 10;

  const { data, error, mutate } = useSWR(`/api/admin/wineries?page=${page}&limit=${limit}`, fetcher);

  // Modal state for viewing details
  const [selectedWinery, setSelectedWinery] = useState<any>(null);
  const [modalOpen, setModalOpen] = useState(false);

  if (error) return <div>Error loading wineries.</div>;
  if (!data) return <div className="p-4">Loading wineries...</div>;

  const wineries = data.wineries || [];
  const { totalPages, currentPage } = data;

  const handleDelete = async (wineryId: string) => {
    if (!confirm("Are you sure you want to delete this winery?")) return;
    try {
      const res = await fetch(`/api/admin/wineries/${wineryId}`, {
        method: "DELETE",
      });
      if (res.ok) {
        mutate();
      } else {
        console.error("Failed to delete winery");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const openModal = (winery: any) => {
    setSelectedWinery(winery);
    setModalOpen(true);
  };

  const closeModal = () => {
    setSelectedWinery(null);
    setModalOpen(false);
  };

  return (
    <div className="p-4 top-20 relative bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Wineries</h1>

      {/* Winery List Table */}
      <table className="min-w-full border rounded overflow-hidden shadow-sm">
        <thead className="bg-gray-100">
          <tr>
            <th className="border px-4 py-2 text-left">Name</th>
            <th className="border px-4 py-2 text-left">Location</th>
            <th className="border px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {wineries.map((winery: any) => (
            <tr key={winery._id} className="hover:bg-gray-50">
              <td className="border px-4 py-2">{winery.name}</td>
              <td className="border px-4 py-2">{winery.location.address}</td>
              <td className="border px-4 py-2 text-center">
                <button
                  className="mr-2 bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded"
                  onClick={() => openModal(winery)}
                >
                  View Details
                </button>
                <button
                  className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                  onClick={() => handleDelete(winery._id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination Controls */}
      <div className="flex justify-center items-center mt-6">
        <button
          className="px-4 py-2 bg-gray-300 rounded mr-2 disabled:opacity-50"
          disabled={page === 1}
          onClick={() => setPage(page - 1)}
        >
          Previous
        </button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <button
          className="px-4 py-2 bg-gray-300 rounded ml-2 disabled:opacity-50"
          disabled={page === totalPages}
          onClick={() => setPage(page + 1)}
        >
          Next
        </button>
      </div>

      {/* Winery Details Modal */}
      {modalOpen && selectedWinery && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-5xl w-full p-6 relative overflow-y-auto max-h-[90vh]">
            <button onClick={closeModal} className="absolute top-4 right-4 text-gray-600 hover:text-gray-800 text-2xl">
              &times;
            </button>
            <div className="flex flex-col md:flex-row">
              {/* Winery Image */}
              <div className="md:w-1/3">
                {selectedWinery.images && selectedWinery.images.length > 0 ? (
                  <img src={selectedWinery.images[0]} alt={selectedWinery.name} className="w-full h-auto rounded" />
                ) : (
                  <div className="w-full h-48 bg-gray-200 flex items-center justify-center rounded">No Image Available</div>
                )}
              </div>

              {/* Winery Basic Info */}
              <div className="md:w-2/3 md:pl-8 mt-4 md:mt-0">
                <h2 className="text-3xl font-bold mb-2">{selectedWinery.name}</h2>
                <p className="mb-1">
                  <span className="font-semibold">Address:</span> {selectedWinery.location.address}
                </p>
                <p className="mb-1">
                  <span className="font-semibold">Coordinates:</span> {selectedWinery.location.latitude},{" "}
                  {selectedWinery.location.longitude}
                </p>
                <p className="mb-1">
                  <span className="font-semibold">Mountain Location:</span>{" "}
                  {selectedWinery.location.is_mountain_location ? "Yes" : "No"}
                </p>
                <p className="mb-1">
                  <span className="font-semibold">Contact:</span> {selectedWinery.contact_info?.phone}{" "}
                  {selectedWinery.contact_info?.email && <>({selectedWinery.contact_info.email})</>}
                </p>
                <p className="mb-1">
                  <span className="font-semibold">Website:</span> {selectedWinery.contact_info?.website || "N/A"}
                </p>
                <p className="mb-1">
                  <span className="font-semibold">Description:</span> {selectedWinery.description || "No description available."}
                </p>
              </div>
            </div>

            {/* Detailed Sections */}
            <div className="mt-8 space-y-8">
              {/* Tasting Info */}
              {selectedWinery.tasting_info && (
                <div>
                  <h3 className="text-2xl font-semibold border-b pb-1 mb-4">Tasting Info</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <p>
                      <span className="font-semibold">Price Range:</span> {selectedWinery.tasting_info.price_range.join(" - ")}
                    </p>
                    <p>
                      <span className="font-semibold">Available Times:</span>{" "}
                      {selectedWinery.tasting_info.available_times.join(", ")}
                    </p>
                    <p>
                      <span className="font-semibold">Wine Types:</span> {selectedWinery.tasting_info.wine_types.join(", ")}
                    </p>
                    <p>
                      <span className="font-semibold">Special Features:</span>{" "}
                      {selectedWinery.tasting_info.special_features.join(", ")}
                    </p>
                    <p>
                      <span className="font-semibold">Food Pairings:</span>{" "}
                      {selectedWinery.tasting_info.food_pairings_available ? "Yes" : "No"}
                    </p>
                  </div>
                </div>
              )}

              {/* Wine Details */}
              {selectedWinery.wine_details && selectedWinery.wine_details.length > 0 && (
                <div>
                  <h3 className="text-2xl font-semibold border-b pb-1 mb-4">Wine Details</h3>
                  {selectedWinery.wine_details.map((wine: any, idx: number) => (
                    <div key={idx} className="border rounded p-4 mb-4">
                      <p>
                        <span className="font-semibold">Name:</span> {wine.name}
                      </p>
                      <p>
                        <span className="font-semibold">Type:</span> {wine.type}
                      </p>
                      <p>
                        <span className="font-semibold">Year:</span> {wine.year}
                      </p>
                      <p>
                        <span className="font-semibold">Tasting Notes:</span> {wine.tasting_notes}
                      </p>
                      <p>
                        <span className="font-semibold">Pairing Suggestions:</span> {wine.pairing_suggestions.join(", ")}
                      </p>
                    </div>
                  ))}
                </div>
              )}

              {/* Booking Info */}
              {selectedWinery.booking_info && (
                <div>
                  <h3 className="text-2xl font-semibold border-b pb-1 mb-4">Booking Info</h3>
                  <p>
                    <span className="font-semibold">Booking Enabled:</span>{" "}
                    {selectedWinery.booking_info.booking_enabled ? "Yes" : "No"}
                  </p>
                  <p>
                    <span className="font-semibold">Max Guests per Slot:</span> {selectedWinery.booking_info.max_guests_per_slot}
                  </p>
                  {selectedWinery.booking_info.dynamic_pricing && (
                    <p>
                      <span className="font-semibold">Dynamic Pricing:</span>{" "}
                      {selectedWinery.booking_info.dynamic_pricing.enabled ? "Yes" : "No"}
                    </p>
                  )}
                </div>
              )}

              {/* Amenities */}
              {selectedWinery.amenities && (
                <div>
                  <h3 className="text-2xl font-semibold border-b pb-1 mb-4">Amenities</h3>
                  <p>
                    <span className="font-semibold">Virtual Sommelier:</span>{" "}
                    {selectedWinery.amenities.virtual_sommelier ? "Yes" : "No"}
                  </p>
                  <p>
                    <span className="font-semibold">Augmented Reality Tours:</span>{" "}
                    {selectedWinery.amenities.augmented_reality_tours ? "Yes" : "No"}
                  </p>
                  <p>
                    <span className="font-semibold">Handicap Accessible:</span>{" "}
                    {selectedWinery.amenities.handicap_accessible ? "Yes" : "No"}
                  </p>
                </div>
              )}

              {/* Transportation */}
              {selectedWinery.transportation && (
                <div>
                  <h3 className="text-2xl font-semibold border-b pb-1 mb-4">Transportation</h3>
                  <p>
                    <span className="font-semibold">Uber Availability:</span>{" "}
                    {selectedWinery.transportation.uber_availability ? "Yes" : "No"}
                  </p>
                  <p>
                    <span className="font-semibold">Lyft Availability:</span>{" "}
                    {selectedWinery.transportation.lyft_availability ? "Yes" : "No"}
                  </p>
                  <p>
                    <span className="font-semibold">Distance From User:</span> {selectedWinery.transportation.distance_from_user}{" "}
                    miles
                  </p>
                </div>
              )}

              {/* User Reviews */}
              {selectedWinery.user_reviews && selectedWinery.user_reviews.length > 0 && (
                <div>
                  <h3 className="text-2xl font-semibold border-b pb-1 mb-4">User Reviews</h3>
                  {selectedWinery.user_reviews.map((review: any, idx: number) => (
                    <div key={idx} className="border rounded p-4 mb-4">
                      <p>
                        <span className="font-semibold">Review ID:</span> {review.review_id}
                      </p>
                      <p>
                        <span className="font-semibold">User ID:</span> {review.user_id}
                      </p>
                      <p>
                        <span className="font-semibold">Rating:</span> {review.rating}
                      </p>
                      <p>
                        <span className="font-semibold">Comment:</span> {review.comment}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
