"use client";
import { useState } from "react";
import useSWR from "swr";
import Link from "next/link";

const fetcher = (url: string) => fetch(url, { method: "GET" }).then((res) => res.json());

export default function Dashboard() {
  const [page, setPage] = useState(1);
  const limit = 10;
  const [selectedBooking, setSelectedBooking] = useState<any>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const { data, error, mutate } = useSWR(`/api/admin/bookings?page=${page}&limit=${limit}`, fetcher);

  if (error) return <div>Error loading bookings.</div>;
  if (!data) return <div className="p-4">Loading bookings...</div>;

  const { bookings, totalPages, currentPage } = data;

  const handleConfirm = async (bookingId: string) => {
    try {
      const res = await fetch(`/api/admin/bookings/${bookingId}/confirm`, {
        method: "PATCH",
      });
      if (res.ok) {
        mutate();
      } else {
        console.error("Failed to confirm booking");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleCancel = async (bookingId: string) => {
    try {
      const res = await fetch(`/api/admin/bookings/${bookingId}/cancel`, {
        method: "PATCH",
      });
      if (res.ok) {
        mutate();
      } else {
        console.error("Failed to cancel booking");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const openModal = (booking: any) => {
    setSelectedBooking(booking);
    setModalOpen(true);
  };

  const closeModal = () => {
    setSelectedBooking(null);
    setModalOpen(false);
  };

  return (
    <div className="min-h-screen p-4 bg-gray-100 pt-20">
      <h3 className="text-2xl font-bold mb-4">Dashboard</h3>
      <div className="mb-4 flex flex-wrap gap-4">
        <Link href="/admin/dashboard/winery" className="btn btn-primary">
          Add Winery
        </Link>
        <Link href="/admin/dashboard/winery/list" className="btn btn-secondary">
          Wineries List
        </Link>
      </div>

      <h1>Bookings</h1>
      <hr />
      <div className="overflow-x-auto">
        <table className="table table-zebra w-full">
          <thead>
            <tr>
              <th>Booking Id</th>
              <th>User Name</th>
              <th>Email</th>
              <th>Booking Date</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {bookings && bookings.length > 0 ? (
              bookings.map((booking: any) => (
                <tr key={booking._id}>
                  <td className="font-mono">{booking._id}</td>
                  <td>{booking.userId?.name || "N/A"}</td>
                  <td>{booking.userId?.email || "N/A"}</td>
                  <td>
                    {new Date(booking.createdAt).toLocaleString("en-US", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: true,
                    })}
                  </td>
                  <td className="capitalize">{booking.status}</td>
                  <td>
                    <div className="flex gap-2">
                      {booking.status === "pending" && (
                        <>
                          <button className="btn btn-sm btn-success" onClick={() => handleConfirm(booking._id)}>
                            Confirm
                          </button>
                          <button className="btn btn-sm btn-error" onClick={() => handleCancel(booking._id)}>
                            Cancel
                          </button>
                        </>
                      )}
                      <button className="btn btn-sm btn-info" onClick={() => openModal(booking)}>
                        View Details
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="text-center">
                  No bookings found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div className="mt-4 flex justify-center items-center gap-4">
        <button className="btn btn-sm" disabled={page === 1} onClick={() => setPage((prev) => Math.max(prev - 1, 1))}>
          Previous
        </button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <button
          className="btn btn-sm"
          disabled={page === totalPages}
          onClick={() => setPage((prev) => (prev < totalPages ? prev + 1 : prev))}
        >
          Next
        </button>
      </div>

      {/* Booking Details Modal */}
      {modalOpen && selectedBooking && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-md shadow-md max-w-3xl w-full relative">
            <button className="absolute top-2 right-2 text-gray-600" onClick={closeModal}>
              X
            </button>
            <h2 className="text-xl font-bold mb-4">Booking Details</h2>
            <div className="space-y-2">
              <p>
                <strong>Booking ID:</strong> {selectedBooking._id}
              </p>
              <p>
                <strong>User Name:</strong> {selectedBooking.userId?.name || "N/A"}
              </p>
              <p>
                <strong>Email:</strong> {selectedBooking.userId?.email || "N/A"}
              </p>
              <p>
                <strong>Status:</strong> {selectedBooking.status}
              </p>
              <p>
                <strong>Created At:</strong>{" "}
                {new Date(selectedBooking.createdAt).toLocaleString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: true,
                })}
              </p>

              <div className="mt-4">
                <h3 className="text-lg font-semibold mb-2">Wineries:</h3>
                {selectedBooking.wineries && selectedBooking.wineries.length > 0 ? (
                  selectedBooking.wineries.map((winery: any, index: number) => (
                    <div key={index} className="border p-2 mb-2 rounded">
                      <p>
                        <strong>Winery Name:</strong> {winery.wineryId?.name || "N/A"}
                      </p>
                      <p>
                        <strong>Date:</strong>{" "}
                        {new Date(winery.datetime).toLocaleString("en-US", {
                          weekday: "long",
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                          hour12: true,
                        })}
                      </p>
                      <p>
                        <strong>Number of Guests:</strong> {winery.numberOfGuests}
                      </p>
                    </div>
                  ))
                ) : (
                  <p>No winery details available.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
