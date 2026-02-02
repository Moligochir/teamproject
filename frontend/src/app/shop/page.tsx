"use client";

import { useState } from "react";
import { ShoppingBag, Upload, X } from "lucide-react";

interface Post {
  id: number;
  image: string;
  price: string;
  phone: string;
  createdAt: Date;
}

export default function ShopPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [image, setImage] = useState<string>("");
  const [price, setPrice] = useState("");
  const [phone, setPhone] = useState("");
  const [imagePreview, setImagePreview] = useState<string>("");

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setImage(result);
        setImagePreview(result);
      };
      reader.readAsDataURL(file);
    }
  };

  const clearImage = () => {
    setImage("");
    setImagePreview("");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!image || !price || !phone) {
      alert("Please fill in all fields");
      return;
    }

    const newPost: Post = {
      id: Date.now(),
      image,
      price,
      phone,
      createdAt: new Date(),
    };

    setPosts([newPost, ...posts]);

    // Clear form
    setImage("");
    setPrice("");
    setPhone("");
    setImagePreview("");
  };

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 flex items-center justify-center gap-3">
            <ShoppingBag className="w-10 h-10" />
            Shop
          </h1>
          <p className="text-muted text-lg max-w-2xl mx-auto">
            Buy and sell items within the community
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Side - Create Post */}
          <div className="lg:col-span-1">
            <div className="bg-card-bg rounded-2xl border border-card-border p-6 sticky top-8">
              <h2 className="text-xl font-semibold mb-4">Create New Listing</h2>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Image Upload */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Product Image
                  </label>

                  {imagePreview ? (
                    <div className="relative">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-full h-48 object-cover rounded-xl border-2 border-card-border"
                      />
                      <button
                        type="button"
                        onClick={clearImage}
                        className="absolute top-2 right-2 bg-primary text-white p-2 rounded-full hover:bg-primary-dark transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-card-border rounded-xl cursor-pointer hover:bg-background transition-colors">
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <Upload className="w-10 h-10 text-muted mb-2" />
                        <p className="text-sm text-muted">
                          Click to upload image
                        </p>
                      </div>
                      <input
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={handleImageChange}
                      />
                    </label>
                  )}
                </div>

                {/* Price */}
                <div>
                  <label
                    htmlFor="price"
                    className="block text-sm font-medium mb-2"
                  >
                    Price
                  </label>
                  <input
                    type="text"
                    id="price"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="w-full px-4 py-3 bg-background border border-card-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="$0.00"
                  />
                </div>

                {/* Phone Number */}
                <div>
                  <label
                    htmlFor="phone"
                    className="block text-sm font-medium mb-2"
                  >
                    Contact Phone Number
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-4 py-3 bg-background border border-card-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="+1 (555) 123-4567"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full px-6 py-3 bg-primary hover:bg-primary-dark text-white rounded-xl font-semibold transition-all"
                >
                  Post Listing
                </button>
              </form>
            </div>
          </div>

          {/* Right Side - All Posts */}
          <div className="lg:col-span-2">
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-2">All Listings</h2>
              <p className="text-muted">
                Total{" "}
                <span className="font-semibold text-foreground">
                  {posts.length}
                </span>{" "}
                items
              </p>
            </div>

            {posts.length === 0 ? (
              <div className="text-center py-20 bg-card-bg rounded-2xl border border-card-border">
                <div className="text-6xl mb-4">🛍️</div>
                <h3 className="text-xl font-bold mb-2">No Listings Yet</h3>
                <p className="text-muted mb-6">
                  Create the first listing to get started!
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {posts.map((post) => (
                  <div
                    key={post.id}
                    className="bg-card-bg rounded-2xl border border-card-border overflow-hidden hover:shadow-lg transition-all hover:border-primary"
                  >
                    <img
                      src={post.image}
                      alt="Product"
                      className="w-full h-48 object-cover"
                    />

                    <div className="p-4">
                      <div className="flex justify-between items-center mb-3">
                        <span className="text-2xl font-bold text-primary">
                          {post.price}
                        </span>
                      </div>

                      <div className="flex items-center text-muted mb-2">
                        <svg
                          className="w-4 h-4 mr-2"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                          />
                        </svg>
                        <span className="text-sm">{post.phone}</span>
                      </div>

                      <div className="text-xs text-muted">
                        Posted {post.createdAt.toLocaleString()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 text-center bg-card-bg rounded-2xl border border-card-border p-8">
          <h2 className="text-2xl font-bold mb-3">Need to Sell Something?</h2>
          <p className="text-muted mb-6">
            Create a listing and connect with buyers in your community
          </p>
        </div>
      </div>
    </div>
  );
}
