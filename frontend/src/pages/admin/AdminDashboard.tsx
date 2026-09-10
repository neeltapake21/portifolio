import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  Video,
  Star,
  Plus,
  Trash2,
  Edit2,
  ExternalLink,
  LogOut,
  Sparkles,
  CheckCircle,
  XCircle,
  Eye,
  RefreshCw,
  Film,
  MessageSquare,
  Instagram,
  Youtube,
  AlertCircle,
} from "lucide-react";
import { VideoReview, CustomerTestimonial, PlatformType } from "../../types/feedback";
import {
  isAdminAuthenticated,
  getAdminSession,
  logoutAdmin,
  getVideoReviews,
  addVideoReview,
  toggleVideoReview,
  deleteVideoReview,
  getTestimonials,
  addTestimonial,
  updateTestimonial,
  deleteTestimonial,
  toggleTestimonialFeatured,
  resetToDefaults,
  FEEDBACK_UPDATE_EVENT,
} from "../../services/feedbackStore";
import { parseMediaUrl, detectPlatform } from "../../utils/mediaParser";

export function AdminDashboard() {
  const navigate = useNavigate();
  const session = getAdminSession();

  // Route protection
  useEffect(() => {
    if (!isAdminAuthenticated()) {
      navigate("/admin/login", { replace: true });
    }
  }, [navigate]);

  const [activeTab, setActiveTab] = useState<"reels" | "testimonials">("reels");
  const [reels, setReels] = useState<VideoReview[]>([]);
  const [testimonials, setTestimonials] = useState<CustomerTestimonial[]>([]);
  const [notification, setNotification] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Form State: Reels
  const [reelTitle, setReelTitle] = useState("");
  const [reelUrl, setReelUrl] = useState("");
  const [reelPlatform, setReelPlatform] = useState<PlatformType>("instagram");
  const [reelPreview, setReelPreview] = useState<string | null>(null);

  // Form State: Testimonials
  const [editingTestimonialId, setEditingTestimonialId] = useState<string | null>(null);
  const [clientName, setClientName] = useState("");
  const [serviceAvailed, setServiceAvailed] = useState("");
  const [rating, setRating] = useState(5);
  const [reviewText, setReviewText] = useState("");
  const [isFeatured, setIsFeatured] = useState(true);

  // Load Data
  const reloadData = () => {
    setReels(getVideoReviews(false));
    setTestimonials(getTestimonials(false));
  };

  useEffect(() => {
    reloadData();

    const handleUpdate = () => reloadData();
    window.addEventListener(FEEDBACK_UPDATE_EVENT, handleUpdate);
    return () => window.removeEventListener(FEEDBACK_UPDATE_EVENT, handleUpdate);
  }, []);

  const showToast = (text: string, type: "success" | "error" = "success") => {
    setNotification({ text, type });
    setTimeout(() => setNotification(null), 3500);
  };

  const handleLogout = () => {
    logoutAdmin();
    navigate("/admin/login");
  };

  // URL Change Handler for Reel Auto-detection & Live Preview
  const handleReelUrlChange = (url: string) => {
    setReelUrl(url);
    if (url.trim()) {
      const detected = detectPlatform(url);
      setReelPlatform(detected);
      const parsed = parseMediaUrl(url, detected);
      if (parsed.isValid) {
        setReelPreview(parsed.embedUrl);
      } else {
        setReelPreview(null);
      }
    } else {
      setReelPreview(null);
    }
  };

  // Add Reel
  const handleAddReel = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reelTitle.trim() || !reelUrl.trim()) {
      showToast("Please fill in both video title and URL.", "error");
      return;
    }

    const parsed = parseMediaUrl(reelUrl, reelPlatform);
    if (!parsed.isValid) {
      showToast("Could not recognize video URL. Please check YouTube Shorts or Instagram Reel link.", "error");
      return;
    }

    addVideoReview({
      title: reelTitle.trim(),
      platform: parsed.platform,
      media_url: reelUrl.trim(),
      is_active: true,
    });

    setReelTitle("");
    setReelUrl("");
    setReelPreview(null);
    showToast("New Video Reel added successfully!");
  };

  // Save / Update Testimonial
  const handleSaveTestimonial = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName.trim() || !reviewText.trim()) {
      showToast("Please provide client name and review text.", "error");
      return;
    }

    if (editingTestimonialId) {
      updateTestimonial(editingTestimonialId, {
        client_name: clientName.trim(),
        service_availed: serviceAvailed.trim() || undefined,
        rating,
        review_text: reviewText.trim(),
        is_featured: isFeatured,
      });
      setEditingTestimonialId(null);
      showToast("Testimonial updated successfully!");
    } else {
      addTestimonial({
        client_name: clientName.trim(),
        service_availed: serviceAvailed.trim() || undefined,
        rating,
        review_text: reviewText.trim(),
        is_featured: isFeatured,
      });
      showToast("New Testimonial added to showcase!");
    }

    setClientName("");
    setServiceAvailed("");
    setRating(5);
    setReviewText("");
    setIsFeatured(true);
  };

  const handleStartEditTestimonial = (item: CustomerTestimonial) => {
    setEditingTestimonialId(item.id);
    setClientName(item.client_name);
    setServiceAvailed(item.service_availed || "");
    setRating(item.rating);
    setReviewText(item.review_text);
    setIsFeatured(item.is_featured);
    window.scrollTo({ top: 300, behavior: "smooth" });
  };

  const handleCancelEdit = () => {
    setEditingTestimonialId(null);
    setClientName("");
    setServiceAvailed("");
    setRating(5);
    setReviewText("");
    setIsFeatured(true);
  };

  const handleResetData = () => {
    if (window.confirm("Reset all reels and testimonials to default clinic data? Custom entries will be restored to seed state.")) {
      resetToDefaults();
      showToast("Store reset to initial clinic defaults!");
    }
  };

  // Quick stats
  const activeReelsCount = reels.filter((r) => r.is_active).length;
  const featuredReviewsCount = testimonials.filter((t) => t.is_featured).length;
  const avgRating =
    testimonials.length > 0
      ? (testimonials.reduce((acc, t) => acc + t.rating, 0) / testimonials.length).toFixed(1)
      : "5.0";

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-charcoal pb-20">
      {/* Top Navbar */}
      <header className="sticky top-0 z-30 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link to="/" className="flex flex-col">
              <span className="font-heading italic text-xl font-bold tracking-tight text-primary">
                Sovelo Aesthetics
              </span>
              <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest">
                CMS Management Portal
              </span>
            </Link>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/"
              target="_blank"
              rel="noreferrer"
              className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-gray-200 text-xs font-semibold text-gray-700 hover:text-primary hover:border-primary transition-all"
            >
              <ExternalLink className="h-3.5 w-3.5" />
              View Live Website
            </Link>

            <div className="h-4 w-px bg-gray-200 hidden sm:block" />

            <div className="text-right hidden md:block">
              <div className="text-xs font-semibold text-charcoal">{session?.email || "Administrator"}</div>
              <div className="text-[10px] text-green-600 font-medium flex items-center justify-end gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
                Live Session Active
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-gray-100 hover:bg-red-50 text-gray-600 hover:text-red-600 text-xs font-semibold transition-colors"
            >
              <LogOut className="h-3.5 w-3.5" />
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {/* Toast Notification */}
        {notification && (
          <div
            className={`mb-6 p-4 rounded-2xl flex items-center justify-between border shadow-sm transition-all animate-fade-in ${
              notification.type === "success"
                ? "bg-green-50 border-green-200 text-green-800"
                : "bg-red-50 border-red-200 text-red-800"
            }`}
          >
            <div className="flex items-center gap-2 text-sm font-medium">
              {notification.type === "success" ? (
                <CheckCircle className="h-5 w-5 text-green-600" />
              ) : (
                <AlertCircle className="h-5 w-5 text-red-600" />
              )}
              <span>{notification.text}</span>
            </div>
            <button
              onClick={() => setNotification(null)}
              className="text-xs font-bold opacity-60 hover:opacity-100 px-2"
            >
              ✕
            </button>
          </div>
        )}

        {/* Overview Stats Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">Active Video Reels</p>
              <h3 className="text-2xl font-bold font-heading text-charcoal mt-1">
                {activeReelsCount} <span className="text-xs text-gray-400 font-sans font-normal">/ {reels.length} total</span>
              </h3>
            </div>
            <div className="w-12 h-12 rounded-xl bg-pink-50 flex items-center justify-center text-primary">
              <Film className="h-6 w-6" />
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">Featured Testimonials</p>
              <h3 className="text-2xl font-bold font-heading text-charcoal mt-1">
                {featuredReviewsCount} <span className="text-xs text-gray-400 font-sans font-normal">/ {testimonials.length} reviews</span>
              </h3>
            </div>
            <div className="w-12 h-12 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600">
              <MessageSquare className="h-6 w-6" />
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">Average Rating</p>
              <h3 className="text-2xl font-bold font-heading text-charcoal mt-1 flex items-center gap-1.5">
                {avgRating} <span className="text-amber-400 text-lg">★</span>
              </h3>
            </div>
            <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center text-amber-500">
              <Star className="h-6 w-6 fill-current" />
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-gray-200 pb-4 mb-8">
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab("reels")}
              className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold transition-all ${
                activeTab === "reels"
                  ? "bg-primary text-white shadow-md"
                  : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
              }`}
            >
              <Video className="h-4 w-4" />
              Manage Reels ({reels.length})
            </button>
            <button
              onClick={() => setActiveTab("testimonials")}
              className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold transition-all ${
                activeTab === "testimonials"
                  ? "bg-primary text-white shadow-md"
                  : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
              }`}
            >
              <Star className="h-4 w-4" />
              Manage Testimonials ({testimonials.length})
            </button>
          </div>

          <button
            onClick={handleResetData}
            title="Reset store to original default clinic data"
            className="inline-flex items-center gap-1.5 text-xs text-gray-500 hover:text-charcoal px-3 py-1.5 rounded-lg border border-dashed border-gray-300 hover:border-gray-400 transition-colors"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            Restore Sample Data
          </button>
        </div>

        {/* TAB 1: MANAGE REELS */}
        {activeTab === "reels" && (
          <div className="space-y-8">
            {/* Add Reel Form */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-sm">
              <div className="flex items-center gap-2 mb-6">
                <div className="p-2 rounded-xl bg-pink-50 text-primary">
                  <Plus className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="font-heading text-xl font-bold text-charcoal">Add Video Review Reel</h2>
                  <p className="text-xs text-gray-500">
                    Supports Instagram Reels (`instagram.com/reel/...`) and YouTube Shorts (`youtube.com/shorts/...`)
                  </p>
                </div>
              </div>

              <form onSubmit={handleAddReel} className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal mb-1.5">
                      Video Caption / Title <span className="text-primary">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={reelTitle}
                      onChange={(e) => setReelTitle(e.target.value)}
                      placeholder="e.g. Laser Hair Removal - 3 Session Results"
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal mb-1.5">
                      Platform
                    </label>
                    <div className="flex gap-3">
                      <button
                        type="button"
                        onClick={() => setReelPlatform("instagram")}
                        className={`flex-1 py-2.5 px-4 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
                          reelPlatform === "instagram"
                            ? "border-pink-500 bg-pink-50 text-pink-700 shadow-sm"
                            : "border-gray-200 bg-gray-50 text-gray-600 hover:bg-gray-100"
                        }`}
                      >
                        <Instagram className="h-4 w-4 text-pink-600" />
                        Instagram Reel
                      </button>
                      <button
                        type="button"
                        onClick={() => setReelPlatform("youtube")}
                        className={`flex-1 py-2.5 px-4 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
                          reelPlatform === "youtube"
                            ? "border-red-500 bg-red-50 text-red-700 shadow-sm"
                            : "border-gray-200 bg-gray-50 text-gray-600 hover:bg-gray-100"
                        }`}
                      >
                        <Youtube className="h-4 w-4 text-red-600" />
                        YouTube Shorts
                      </button>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal mb-1.5">
                    Reel / Short URL <span className="text-primary">*</span>
                  </label>
                  <input
                    type="url"
                    required
                    value={reelUrl}
                    onChange={(e) => handleReelUrlChange(e.target.value)}
                    placeholder="https://www.instagram.com/reel/C_oA8qUv6mF/ or https://www.youtube.com/shorts/..."
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent font-mono text-xs"
                  />
                </div>

                {/* Live Preview Box */}
                {reelPreview && (
                  <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200">
                    <p className="text-xs font-semibold text-gray-500 mb-2 flex items-center gap-1.5">
                      <Eye className="h-3.5 w-3.5 text-primary" /> Live Embed Preview:
                    </p>
                    <div className="w-48 aspect-[9/16] rounded-xl overflow-hidden bg-black mx-auto shadow-md">
                      <iframe
                        src={reelPreview}
                        title="Reel Preview"
                        className="w-full h-full border-0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    </div>
                  </div>
                )}

                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary hover:bg-primary-light text-white text-sm font-semibold shadow-md transition-all"
                  >
                    <Plus className="h-4 w-4" />
                    Add Reel to Showcase
                  </button>
                </div>
              </form>
            </div>

            {/* Reels Grid List */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-heading text-lg font-bold text-charcoal">
                  Current Video Reels ({reels.length})
                </h3>
                <span className="text-xs text-gray-500">Changes reflect instantly on homepage</span>
              </div>

              {reels.length === 0 ? (
                <div className="bg-white rounded-3xl p-12 text-center border border-gray-200">
                  <Film className="h-10 w-10 text-gray-300 mx-auto mb-3" />
                  <p className="text-sm font-semibold text-gray-600">No video reels added yet.</p>
                  <p className="text-xs text-gray-400 mt-1">Use the form above to add your first customer review reel.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {reels.map((reel) => {
                    const parsed = parseMediaUrl(reel.media_url, reel.platform);
                    return (
                      <div
                        key={reel.id}
                        className={`bg-white rounded-3xl overflow-hidden border transition-all shadow-sm hover:shadow-md flex flex-col ${
                          reel.is_active ? "border-gray-200" : "border-gray-200 opacity-60 bg-gray-50/50"
                        }`}
                      >
                        {/* 9:16 Video Container */}
                        <div className="relative aspect-[9/16] bg-black w-full overflow-hidden">
                          <iframe
                            src={parsed.embedUrl}
                            title={reel.title}
                            className="w-full h-full border-0"
                            loading="lazy"
                            allowFullScreen
                          />

                          {/* Status Badge */}
                          <div className="absolute top-3 right-3 z-10">
                            {reel.is_active ? (
                              <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-green-500 text-white shadow-sm flex items-center gap-1">
                                <span className="h-1.5 w-1.5 rounded-full bg-white animate-ping" />
                                Active
                              </span>
                            ) : (
                              <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-gray-600 text-white shadow-sm">
                                Hidden
                              </span>
                            )}
                          </div>

                          {/* Platform Tag */}
                          <div className="absolute top-3 left-3 z-10">
                            {reel.platform === "instagram" ? (
                              <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-pink-600 text-white shadow-sm flex items-center gap-1">
                                <Instagram className="h-3 w-3" /> Instagram
                              </span>
                            ) : (
                              <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-red-600 text-white shadow-sm flex items-center gap-1">
                                <Youtube className="h-3 w-3" /> YouTube
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Content & Actions */}
                        <div className="p-4 flex-1 flex flex-col justify-between">
                          <div>
                            <h4 className="font-semibold text-sm text-charcoal line-clamp-2" title={reel.title}>
                              {reel.title}
                            </h4>
                            <a
                              href={reel.media_url}
                              target="_blank"
                              rel="noreferrer"
                              className="text-[11px] text-primary hover:underline mt-1 inline-flex items-center gap-1 truncate max-w-full"
                            >
                              <ExternalLink className="h-3 w-3 flex-shrink-0" />
                              <span className="truncate">{reel.media_url}</span>
                            </a>
                          </div>

                          <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between">
                            <button
                              onClick={() => toggleVideoReview(reel.id)}
                              className={`text-xs font-semibold px-3 py-1.5 rounded-xl border transition-colors ${
                                reel.is_active
                                  ? "border-amber-200 text-amber-700 bg-amber-50 hover:bg-amber-100"
                                  : "border-green-200 text-green-700 bg-green-50 hover:bg-green-100"
                              }`}
                            >
                              {reel.is_active ? "Hide Reel" : "Show Reel"}
                            </button>

                            <button
                              onClick={() => {
                                if (window.confirm(`Delete reel "${reel.title}"?`)) {
                                  deleteVideoReview(reel.id);
                                  showToast("Reel deleted.");
                                }
                              }}
                              className="p-2 rounded-xl text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                              title="Delete reel"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 2: MANAGE TESTIMONIALS */}
        {activeTab === "testimonials" && (
          <div className="space-y-8">
            {/* Add / Edit Testimonial Form */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-xl bg-purple-50 text-purple-600">
                    {editingTestimonialId ? <Edit2 className="h-5 w-5" /> : <Plus className="h-5 w-5" />}
                  </div>
                  <div>
                    <h2 className="font-heading text-xl font-bold text-charcoal">
                      {editingTestimonialId ? "Edit Customer Review" : "Add Curated Customer Testimonial"}
                    </h2>
                    <p className="text-xs text-gray-500">
                      Curate genuine 5-star patient reviews showcased on the homepage
                    </p>
                  </div>
                </div>

                {editingTestimonialId && (
                  <button
                    onClick={handleCancelEdit}
                    className="text-xs text-gray-500 hover:text-charcoal px-3 py-1.5 rounded-lg border border-gray-200"
                  >
                    Cancel Edit
                  </button>
                )}
              </div>

              <form onSubmit={handleSaveTestimonial} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal mb-1.5">
                      Client Name <span className="text-primary">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={clientName}
                      onChange={(e) => setClientName(e.target.value)}
                      placeholder="e.g. Priya Sharma"
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal mb-1.5">
                      Treatment / Service Availed
                    </label>
                    <input
                      type="text"
                      value={serviceAvailed}
                      onChange={(e) => setServiceAvailed(e.target.value)}
                      placeholder="e.g. Hydrafacial, PRP Hair, Laser"
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal mb-1.5">
                      Rating (1 to 5 Stars)
                    </label>
                    <div className="flex items-center gap-1.5 py-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setRating(star)}
                          className="p-1 hover:scale-125 transition-transform"
                        >
                          <Star
                            className={`h-6 w-6 ${
                              star <= rating
                                ? "text-amber-400 fill-amber-400"
                                : "text-gray-200 hover:text-amber-300"
                            }`}
                          />
                        </button>
                      ))}
                      <span className="text-xs font-bold text-gray-600 ml-2">{rating} / 5 Stars</span>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal mb-1.5">
                    Review Text / Quote <span className="text-primary">*</span>
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={reviewText}
                    onChange={(e) => setReviewText(e.target.value)}
                    placeholder="Describe the patient's experience, results achieved, doctor care..."
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-y"
                  />
                </div>

                <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
                  <label className="inline-flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isFeatured}
                      onChange={(e) => setIsFeatured(e.target.checked)}
                      className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                    />
                    <span className="text-xs font-semibold text-charcoal">
                      Feature on Homepage Showcase
                    </span>
                  </label>

                  <div className="flex gap-2">
                    {editingTestimonialId && (
                      <button
                        type="button"
                        onClick={handleCancelEdit}
                        className="px-5 py-2.5 rounded-full border border-gray-300 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors"
                      >
                        Cancel
                      </button>
                    )}
                    <button
                      type="submit"
                      className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-primary hover:bg-primary-light text-white text-sm font-semibold shadow-md transition-all"
                    >
                      {editingTestimonialId ? (
                        <>
                          <CheckCircle className="h-4 w-4" /> Save Changes
                        </>
                      ) : (
                        <>
                          <Plus className="h-4 w-4" /> Add Testimonial
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </form>
            </div>

            {/* Testimonials List */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-heading text-lg font-bold text-charcoal">
                  Curated Reviews ({testimonials.length})
                </h3>
                <span className="text-xs text-gray-500">Displaying in order of priority</span>
              </div>

              {testimonials.length === 0 ? (
                <div className="bg-white rounded-3xl p-12 text-center border border-gray-200">
                  <MessageSquare className="h-10 w-10 text-gray-300 mx-auto mb-3" />
                  <p className="text-sm font-semibold text-gray-600">No testimonials found.</p>
                  <p className="text-xs text-gray-400 mt-1">Use the form above to add your first customer review.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {testimonials.map((item) => (
                    <div
                      key={item.id}
                      className={`bg-white rounded-3xl p-6 border flex flex-col justify-between shadow-sm hover:shadow-md transition-all ${
                        item.is_featured ? "border-gray-200" : "border-gray-200 opacity-60 bg-gray-50/50"
                      }`}
                    >
                      <div>
                        {/* Rating & Status */}
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex text-amber-400 text-sm">
                            {Array.from({ length: 5 }).map((_, idx) => (
                              <Star
                                key={idx}
                                className={`h-4 w-4 ${
                                  idx < item.rating ? "fill-amber-400 text-amber-400" : "text-gray-200"
                                }`}
                              />
                            ))}
                          </div>
                          {item.is_featured ? (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-pink-50 text-primary border border-pink-100">
                              ★ Featured
                            </span>
                          ) : (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-gray-100 text-gray-500">
                              Hidden
                            </span>
                          )}
                        </div>

                        {/* Review text */}
                        <p className="text-sm italic text-gray-700 leading-relaxed line-clamp-4">
                          &quot;{item.review_text}&quot;
                        </p>
                      </div>

                      <div className="mt-6 pt-4 border-t border-gray-100">
                        <div className="flex items-center justify-between mb-3">
                          <div>
                            <h4 className="text-sm font-bold text-charcoal">{item.client_name}</h4>
                            {item.service_availed && (
                              <p className="text-xs text-primary font-medium">{item.service_availed}</p>
                            )}
                          </div>
                          <span className="text-[10px] text-gray-400">
                            {new Date(item.created_at).toLocaleDateString()}
                          </span>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex items-center justify-between pt-2 border-t border-dashed border-gray-100">
                          <button
                            onClick={() => toggleTestimonialFeatured(item.id)}
                            className="text-xs font-semibold text-gray-500 hover:text-primary"
                          >
                            {item.is_featured ? "Unfeature" : "Feature on Home"}
                          </button>

                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => handleStartEditTestimonial(item)}
                              className="p-1.5 rounded-lg text-gray-400 hover:text-primary hover:bg-pink-50 transition-colors"
                              title="Edit review"
                            >
                              <Edit2 className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => {
                                if (window.confirm(`Delete review from "${item.client_name}"?`)) {
                                  deleteTestimonial(item.id);
                                  showToast("Review deleted.");
                                }
                              }}
                              className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                              title="Delete review"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
