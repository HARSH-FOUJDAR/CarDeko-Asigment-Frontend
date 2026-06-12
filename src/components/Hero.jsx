import React, { useState, useEffect } from "react";
import axios from "axios";

const Hero = () => {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(false);
  const [recommendation, setRecommendation] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [filters, setFilters] = useState({
    budget: "",
    brand: "",
    fuelType: "",
    transmission: "",
    bodyType: "",
  });

  const getAIRecommendation = async () => {
    try {
      setAiLoading(true);
      const res = await axios.post(
        "https://cardeko-asigment-bcakend.onrender.com/ai/recommend",
        {
          budget: filters.budget,
          fuelType: filters.fuelType,
          familySize: 5,
          usage: "Family",
        },
      );
      setRecommendation(res.data.recommendation);
    } catch (error) {
      console.log(error);
    } finally {
      setAiLoading(false);
    }
  };

  const fetchCars = async (appliedFilters = {}) => {
    setLoading(true);
    try {
      const query = new URLSearchParams(
        Object.fromEntries(
          Object.entries(appliedFilters).filter(([_, value]) => value !== ""),
        ),
      ).toString();
      const res = await axios.get(
        `https://cardeko-asigment-bcakend.onrender.com/Cardata?${query}`,
      );
      setCars(res.data.cars || []);
    } catch (error) {
      console.error("Error fetching cars:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCars();
  }, []);

  const handleChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* FILTER SECTION */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 py-10 px-4 sm:px-6 border-b">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-800">
              Find Your Perfect Car
            </h2>
            <p className="text-gray-500 mt-2">
              Filter cars based on your budget and preferences
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-lg">
            <form className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              {/* Budget */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Budget
                </label>
                <select
                  name="budget"
                  value={filters.budget}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 outline-none"
                >
                  <option value="">Select Budget</option>
                  <option value="5-10">₹5 - ₹10 Lakh</option>
                  <option value="10-20">₹10 - ₹20 Lakh</option>
                  <option value="20-30">₹20 - ₹30 Lakh</option>
                </select>
              </div>

              {/* Brand */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Brand
                </label>
                <select
                  name="brand"
                  value={filters.brand}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 outline-none"
                >
                  <option value="">Select Brand</option>
                  <option value="maruti">Maruti</option>
                  <option value="hyundai">Hyundai</option>
                  <option value="tata">Tata</option>
                  <option value="mahindra">Mahindra</option>
                  <option value="kia">Kia</option>
                </select>
              </div>

              {/* Fuel */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Fuel Type
                </label>
                <select
                  name="fuelType"
                  value={filters.fuelType}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 outline-none"
                >
                  <option value="">Select Fuel</option>
                  <option value="petrol">Petrol</option>
                  <option value="diesel">Diesel</option>
                  <option value="electric">Electric</option>
                </select>
              </div>

              {/* Transmission */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Transmission
                </label>
                <select
                  name="transmission"
                  value={filters.transmission}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 outline-none"
                >
                  <option value="">Select Transmission</option>
                  <option value="manual">Manual</option>
                  <option value="automatic">Automatic</option>
                </select>
              </div>

              {/* Body Type */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Body Type
                </label>
                <select
                  name="bodyType"
                  value={filters.bodyType}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 outline-none"
                >
                  <option value="">Select Type</option>
                  <option value="suv">SUV</option>
                  <option value="sedan">Sedan</option>
                  <option value="hatchback">Hatchback</option>
                  <option value="mpv">MPV</option>
                </select>
              </div>
            </form>

            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => fetchCars(filters)}
                className="bg-blue-600 hover:bg-blue-700 transition-all text-white px-8 py-3 rounded-xl font-semibold shadow-md"
              >
                {loading ? "Searching..." : " Search Cars"}
              </button>

              <button
                onClick={getAIRecommendation}
                disabled={aiLoading}
                className="bg-gradient-to-r from-green-500 to-emerald-600 hover:scale-105 transition-all text-white px-8 py-3 rounded-xl font-semibold shadow-md"
              >
                {aiLoading ? "🤖 Consulting AI..." : " Get AI Recommendation"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* AI RECOMMENDATION */}
      {recommendation && (
        <div className="max-w-7xl mx-auto mt-6 px-4">
          <div className="bg-green-50 border-l-4 border-green-500 p-6 rounded-r-xl">
            <h2 className="text-xl font-bold text-green-800 mb-2">
              AI Recommendation
            </h2>
            <p className="text-green-900 whitespace-pre-wrap">
              {recommendation}
            </p>
          </div>
        </div>
      )}

      {/* CAR LIST */}
      <div className="py-10 px-4 max-w-7xl mx-auto">
        {loading ? (
          <div className="flex justify-center p-10">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {cars.map((car) => (
              <div
                key={car._id}
                className="bg-white rounded-xl shadow-lg hover:shadow-xl transition overflow-hidden"
              >
                <img
                  src={
                    car.image ||
                    "https://imgd.aeplcdn.com/642x361/cw/ec/38219/Mahindra-XUV300-Exterior-147500.jpg?wm=0&q=80"
                  }
                  alt={car.name}
                  className="w-full h-48 object-cover"
                />

                <div className="p-4">
                  <h2 className="text-xl font-bold text-gray-800">
                    {car.name}
                  </h2>

                  <p className="text-gray-500 mb-3">{car.brand}</p>

                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm">
                      {car.transmission}
                    </span>

                    <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm">
                      {car.bodyType}
                    </span>

                    <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-sm">
                      {car.fuelType}
                    </span>
                  </div>

                  <p className="text-2xl font-bold text-blue-600 mb-3">
                    ₹ {car.price?.toLocaleString()}
                  </p>

                  <p className="text-gray-600 text-sm">
                    A car is a multi-wheeled motor vehicle primarily designed
                    for passenger transportation.
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Hero;
