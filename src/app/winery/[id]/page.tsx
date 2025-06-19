"use client";
import { useState, useCallback, useEffect, useRef } from "react";
import {
  FaMapMarkerAlt,
  FaArrowLeft,
  FaArrowRight,
  FaStar,
  FaPhoneAlt,
  FaEnvelope,
  FaWineGlass,
  FaDollarSign,
  FaClock,
  FaGlassCheers,
  FaWhatsapp,
} from "react-icons/fa";
import { useParams } from "next/navigation";
import { Button } from "@/components/buttons/button";
import { Card } from "@/components/cards/card";
import WineDetailsCard from "@/components/cards/wine-details-card";
import BookingCalendar from "@/components/booking-calendar";
import { Winery } from "@/app/interfaces";
import Map from "@/components/map";
import { useItinerary } from "@/store/itinerary";
import { toast } from "react-toastify";
import axios from "axios";

const WineryDetail = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [userLocation, setUserLocation] = useState<GeolocationCoordinates | null>(null);
  const { id } = useParams() as { id: string };
  const { itinerary, setItinerary } = useItinerary();
  const [winery, setWinery] = useState<Winery>(undefined as any);
  const hasFetchedWinery = useRef(false);

  const addToItinerary = () => {
    if (!itinerary.includes(id as any)) {
      setItinerary([...(itinerary as any), winery as any]);
      toast.success(`${winery?.name} added to your itinerary!`);
    } else {
      alert("Winery already in itinerary!");
    }
  };

  const handleLocationPermission = useCallback(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation(position.coords);
          toast.success("We can now show you directions to the winery.");
        },
        (error) => {
          toast.error("Location error");
        }
      );
    }
  }, []);

  const changeImage = (direction: "next" | "prev") => {
    setCurrentImageIndex((prevIndex) => {
      if (direction === "next") {
        return (prevIndex + 1) % winery?.images.length;
      }
      return (prevIndex - 1 + winery?.images.length) % winery?.images.length;
    });
  };

  useEffect(() => {
    if (!hasFetchedWinery.current) {
      const fetchWinery = async () => {
        try {
          const response = await axios.get(`/api/winery/${id}`);
          console.log("Winery Data:", response.data);
          setWinery(response.data.winery);
          hasFetchedWinery.current = true;
        } catch (error) {
          console.error("Error fetching winery:", error);
        }
      };

      fetchWinery();
    }

    return () => {
      hasFetchedWinery.current = false;
    };
  }, [id]);

  if (!winery) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-wine-background md:top-20 top-16 relative">
      {/* Hero Section */}
      <div className="relative h-[80vh] overflow-hidden">
        <img
          src={winery.images[currentImageIndex]}
          alt={winery.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/50 flex items-center justify-center">
          <div className="text-center text-white max-w-4xl px-4">
            <h1 className="font-serif text-6xl mb-6 leading-tight">{winery.name}</h1>
            <p className="text-xl max-w-2xl mx-auto font-light leading-relaxed">
              {winery.description}
            </p>
            <div className="mt-8">
              <Button
                className="bg-wine-primary hover:bg-wine-primary/90 text-white px-8 py-6 text-lg"
                onClick={addToItinerary}
              >
                Book a Tasting
              </Button>
            </div>
          </div>
        </div>
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex space-x-4">
          <Button
            variant="outline"
            size="icon"
            onClick={() => changeImage("prev")}
            className="bg-white/80 hover:bg-white backdrop-blur-sm"
          >
            <FaArrowLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => changeImage("next")}
            className="bg-white/80 hover:bg-white backdrop-blur-sm"
          >
            <FaArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-7xl mx-auto px-4 py-16 space-y-16">
        {/* Quick Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="p-6 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-wine-primary/10 rounded-full">
                <FaWineGlass className="h-6 w-6 text-wine-primary" />
              </div>
              <div>
                <h3 className="font-serif text-lg mb-1">Wine Types</h3>
                <p className="text-gray-600 text-sm capitalize">
                  {winery?.tasting_info.wine_types.join(", ")}
                </p>
              </div>
            </div>
          </Card>
          <Card className="p-6 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-wine-primary/10 rounded-full">
                <FaClock className="h-6 w-6 text-wine-primary" />
              </div>
              <div>
                <h3 className="font-serif text-lg mb-1">Times</h3>
                <p className="text-gray-600 text-sm capitalize">
                  {winery?.tasting_info.available_times.join("\n")}
                </p>
              </div>
            </div>
          </Card>
          <Card className="p-6 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-wine-primary/10 rounded-full">
                <FaDollarSign className="h-6 w-6 text-wine-primary" />
              </div>
              <div>
                <h3 className="font-serif text-lg mb-1">Price Range</h3>
                <p className="text-gray-600 text-sm">
                  ${winery?.tasting_info.price_range[0]} - ${winery?.tasting_info.price_range[1]}
                </p>
              </div>
            </div>
          </Card>
          <Card className="p-6 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-wine-primary/10 rounded-full">
                <FaMapMarkerAlt className="h-6 w-6 text-wine-primary" />
              </div>
              <div>
                <h3 className="font-serif text-lg mb-1">Location</h3>
                <p className="text-gray-600 text-sm">{winery?.ava}</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Wine Details Section */}
        <div className="bg-white rounded-xl p-8 shadow-lg">
          <div className="flex items-center gap-3 mb-8">
            <FaGlassCheers className="h-8 w-8 text-wine-primary" />
            <h2 className="font-serif text-3xl text-wine-primary">Tasting Experience</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="p-6">
              <h3 className="font-serif text-xl mb-4">What to Expect</h3>
              <div className="space-y-4">
                <p className="flex items-center gap-2">
                  <FaWineGlass className="text-wine-primary" />
                  <span>
                    {winery?.tasting_info.number_of_wines_per_tasting[0]} -{" "}
                    {winery?.tasting_info.number_of_wines_per_tasting[1]} wines per tasting
                  </span>
                </p>
                <div>
                  <h4 className="font-medium mb-3">Special Features:</h4>
                  <div className="flex flex-wrap gap-2">
                    {winery?.tasting_info.special_features.map((feature, index) => (
                      <span
                        key={index}
                        className="bg-wine-primary/10 text-wine-primary px-4 py-2 rounded-full text-sm font-medium"
                      >
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </Card>
            <div className="space-y-4">
              <h3 className="font-serif text-xl">Additional Information</h3>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-wine-primary rounded-full"></span>
                  Food pairings {winery?.tasting_info.food_pairings_available ? "available" : "not available"}
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-wine-primary rounded-full"></span>
                  Located in {winery?.ava} region
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Featured Wines Section */}
        <div className="bg-white rounded-lg p-8 shadow-lg">
          <h2 className="font-serif text-3xl mb-6 text-wine-primary">Featured Wines</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {winery?.wine_details.map((wine) => (
              <WineDetailsCard key={wine.wine_id} wine={wine} />
            ))}
          </div>
        </div>

        {/* Booking Calendar */}
        <div className="bg-white rounded-lg p-8 shadow-lg">
          <h2 className="font-serif text-3xl mb-6 text-wine-primary">Book a Tasting</h2>
          <BookingCalendar
            slots={winery?.booking_info.available_slots}
            maxGuests={winery?.booking_info.max_guests_per_slot}
            weekendMultiplier={winery?.booking_info.dynamic_pricing.weekend_multiplier}
          />
        </div>

        {/* Reviews Section */}
        <div className="bg-white rounded-xl p-8 shadow-lg">
          <h2 className="font-serif text-3xl mb-8 text-wine-primary flex items-center gap-3">
            <FaStar className="h-7 w-7" />
            Guest Reviews
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {winery?.user_reviews.map((review) => (
              <Card key={review.review_id} className="p-6 hover:shadow-lg transition-all">
                <div className="flex items-center space-x-2 mb-4">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <FaStar
                        key={i}
                        className={`h-5 w-5 ${i < Math.floor(review.rating) ? "text-wine-secondary" : "text-gray-300"}`}
                      />
                    ))}
                  </div>
                  <span className="font-medium ml-2">{review.rating.toFixed(1)}</span>
                </div>
                <p className="text-gray-600 italic">{review.comment}</p>
              </Card>
            ))}
          </div>
        </div>

        {/* Contact & Directions Section */}
        <div className="bg-white rounded-xl p-8 shadow-lg">
          <h2 className="font-serif text-3xl mb-8 text-wine-primary">Contact & Directions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div className="space-y-6 ">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-wine-primary/10 rounded-full">
                  <FaPhoneAlt className="h-5 w-5 text-wine-primary" />
                </div>
                <div>
                  <h3 className="font-serif text-xl mb-1">Phone</h3>
                  <p className="text-gray-600">{winery?.contact_info.phone}</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-wine-primary/10 rounded-full">
                  <FaEnvelope className="h-5 w-5 text-wine-primary" />
                </div>
                <div className="break-all">
                  <h3 className="font-serif text-xl mb-1">Email</h3>
                  <p className="text-gray-600">{winery?.contact_info.email}</p>
                </div>
              </div>
              {winery?.contact_info.phone && (
                <a
                  href={`https://wa.me/${winery?.contact_info.phone.replace(/\D/g, "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-4"
                >
                  <div className="p-3 bg-wine-primary/10 rounded-full">
                    <FaWhatsapp className="h-5 w-5 text-wine-primary" />
                  </div>
                  <div>
                    <h3 className="font-serif text-xl mb-1">WhatsApp</h3>
                    <p className="text-gray-600">Chat with us</p>
                  </div>
                </a>
              )}
            </div>
            <div className="flex flex-col justify-center">
              <Button
                onClick={handleLocationPermission}
                className="bg-wine-primary hover:bg-wine-primary/90 text-white w-full py-6 text-lg"
              >
                Get Directions
              </Button>
              {userLocation && (
                <p className="text-center mt-4 text-gray-600">
                  {winery?.transportation.distance_from_user.toFixed(1)} miles away
                </p>
              )}
            </div>
          </div>
          {userLocation && <Map userLocation={userLocation} wineryLocation={winery?.location} />}
        </div>
      </div>
    </div>
  );
};

export default WineryDetail;
