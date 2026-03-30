import React from "react";

export default function About() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800 text-gray-900 dark:text-white">
      {/* Hero Section */}
      <section className="relative text-center py-16 px-6">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">About Us</h1>
        <p className="max-w-2xl mx-auto text-lg text-gray-700 dark:text-gray-300">
          Welcome to <span className="font-semibold">Ocean Bites</span>, where we bring you the freshest catch from the sea straight to your plate.
        </p>
      </section>

      {/* Restaurant Story */}
      <section className="py-16 px-6 bg-white dark:bg-gray-900">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-8 items-center">
          <img
            src="https://images.unsplash.com/photo-1553621042-f6e147245754"
            alt="Restaurant"
            className="rounded-lg shadow-lg"
          />
          <div>
            <h2 className="text-3xl font-bold mb-4">Our Story</h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              Founded in 2024, Ocean Bites is a family-run seafood restaurant passionate about delivering an authentic coastal dining experience.
            </p>
            <p className="text-gray-700 dark:text-gray-300">
              We partner with local fishermen to ensure every dish is made with the freshest ingredients from the ocean. Our chefs craft recipes that celebrate the rich flavors of the sea, blending tradition with modern creativity.
            </p>
          </div>
        </div>
      </section>

      {/* Chef Section */}
      <section className="py-16 px-6 bg-blue-50 dark:bg-gray-800">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-8">Meet Our Chef</h2>
          <div className="flex flex-col md:flex-row items-center gap-8">
            <img
              src="https://images.unsplash.com/photo-1551218808-94e220e084d2"
              alt="Chef"
              className="w-64 h-64 object-cover rounded-full shadow-lg"
            />
            <div className="text-left">
              <h3 className="text-2xl font-semibold">Chef Arjun Mehra</h3>
              <p className="text-gray-700 dark:text-gray-300 mt-2">
                With over 20 years of experience in seafood cuisine, Chef Arjun is renowned for his innovative takes on coastal classics. His secret? Letting the natural flavors of the sea shine through.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Info */}
      <section className="py-16 px-6 bg-white dark:bg-gray-900">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Visit Us</h2>
          <p className="text-gray-700 dark:text-gray-300">
            📍 123 Ocean View Road, Mumbai, India  
            📞 +91 98765 43210  
            📧 contact@oceanbites.com
          </p>
        </div>
      </section>
    </div>
  );
}
