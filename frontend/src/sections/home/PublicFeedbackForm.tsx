import React, { useState } from "react";
import { Star, MessageCircle, Sparkles, Send, CheckCircle2 } from "lucide-react";

export function PublicFeedbackForm() {
  const [clientName, setClientName] = useState("");
  const [treatment, setTreatment] = useState("Hydrafacial / Medi-facials");
  const [customTreatment, setCustomTreatment] = useState("");
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [feedback, setFeedback] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const clinicWhatsAppNumber = "918177955821";

  const handleRatingHover = (val: number) => setHoverRating(val);
  const handleRatingLeave = () => setHoverRating(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!clientName.trim() || !feedback.trim()) {
      return;
    }

    const selectedService = treatment === "Other" ? customTreatment.trim() || "General Consultation" : treatment;

    // Strict payload structure as requested
    const payload =
      `*New Patient Review - Sovelo Aesthetic*\n` +
      `*Name:* ${clientName.trim()}\n` +
      `*Rating:* ${rating} / 5 Stars\n` +
      `*Service:* ${selectedService}\n` +
      `*Feedback:* "${feedback.trim()}"`;

    const encoded = encodeURIComponent(payload);
    const whatsappUrl = `https://wa.me/${clinicWhatsAppNumber}?text=${encoded}`;

    // Open WhatsApp in new window/tab
    window.open(whatsappUrl, "_blank", "noopener,noreferrer");

    setSubmitted(true);
  };

  const handleReset = () => {
    setClientName("");
    setTreatment("Hydrafacial / Medi-facials");
    setCustomTreatment("");
    setRating(5);
    setFeedback("");
    setSubmitted(false);
  };

  return (
    <section className="py-20 bg-white border-t border-gray-100">
      <div className="container-xl max-w-4xl">
        <div className="bg-gradient-to-br from-soft-gray via-pink-50/30 to-white rounded-3xl p-8 sm:p-12 border border-pink-100/60 shadow-card">
          {/* Section Header */}
          <div className="text-center max-w-xl mx-auto mb-10">
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider mb-3">
              <Sparkles className="h-3.5 w-3.5" />
              Your Voice Matters
            </div>
            <h2 className="font-heading text-3xl sm:text-4xl font-bold text-charcoal tracking-tight">
              Share Your Experience
            </h2>
            <p className="mt-3 text-sm text-gray-600">
              Had a treatment with Dr. Suryawanshi? Help others on their aesthetic journey by sharing your honest feedback directly with our clinical team.
            </p>
          </div>

          {submitted ? (
            <div className="bg-white rounded-2xl p-8 text-center border border-green-200 shadow-sm animate-fade-in max-w-md mx-auto">
              <div className="w-14 h-14 rounded-full bg-green-50 text-green-600 flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="h-8 w-8" />
              </div>
              <h3 className="font-heading text-xl font-bold text-charcoal">
                Thank You for Your Review!
              </h3>
              <p className="text-xs text-gray-600 mt-2">
                We&apos;ve opened WhatsApp for you to send your review directly to Dr. Suryawanshi&apos;s team. Our team reviews every story before featuring them.
              </p>
              <button
                type="button"
                onClick={handleReset}
                className="mt-6 inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-primary text-white text-xs font-semibold shadow hover:bg-primary-light transition-all"
              >
                Submit Another Review
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl mx-auto">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {/* 1. Full Name */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal mb-1.5">
                    Your Full Name <span className="text-primary">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    placeholder="e.g. Rohini Deshmukh"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-sm text-charcoal focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all shadow-sm"
                  />
                </div>

                {/* 2. Doctor / Treatment */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal mb-1.5">
                    Doctor / Treatment Attended <span className="text-primary">*</span>
                  </label>
                  <select
                    value={treatment}
                    onChange={(e) => setTreatment(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-sm text-charcoal focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all shadow-sm"
                  >
                    <option value="Laser Hair Removal">Laser Hair Removal</option>
                    <option value="Hydrafacial / Medi-facials">Hydrafacial / Medi-facials</option>
                    <option value="PRP Hair Treatment">PRP Hair Treatment</option>
                    <option value="Weight Loss & Slimming">Weight Loss & Slimming</option>
                    <option value="PCOS & Hormonal Wellness">PCOS & Hormonal Wellness</option>
                    <option value="Chemical Peel & Brightening">Chemical Peel & Brightening</option>
                    <option value="Dr. Suryawanshi Consultation">Dr. Suryawanshi Consultation</option>
                    <option value="Other">Other / Custom Treatment</option>
                  </select>
                </div>
              </div>

              {treatment === "Other" && (
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal mb-1.5">
                    Specify Treatment / Service
                  </label>
                  <input
                    type="text"
                    required
                    value={customTreatment}
                    onChange={(e) => setCustomTreatment(e.target.value)}
                    placeholder="Enter treatment name"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-sm text-charcoal focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all shadow-sm"
                  />
                </div>
              )}

              {/* 3. Star Rating Selection */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal mb-1.5 text-center sm:text-left">
                  Rate Your Experience <span className="text-primary">*</span>
                </label>
                <div className="flex items-center justify-center sm:justify-start gap-2 bg-white px-5 py-3 rounded-xl border border-gray-200 shadow-sm">
                  {[1, 2, 3, 4, 5].map((star) => {
                    const currentStarActive = (hoverRating || rating) >= star;
                    return (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        onMouseEnter={() => handleRatingHover(star)}
                        onMouseLeave={handleRatingLeave}
                        className="p-1.5 hover:scale-125 transition-transform"
                        aria-label={`Rate ${star} out of 5 stars`}
                      >
                        <Star
                          className={`h-7 w-7 transition-colors ${
                            currentStarActive
                              ? "text-amber-400 fill-amber-400 drop-shadow-sm"
                              : "text-gray-200 hover:text-amber-300"
                          }`}
                        />
                      </button>
                    );
                  })}
                  <span className="ml-3 text-xs font-bold text-gray-700">
                    {rating} of 5 Stars
                  </span>
                </div>
              </div>

              {/* 4. Feedback Comments */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal mb-1.5">
                  Detailed Feedback / Comments <span className="text-primary">*</span>
                </label>
                <textarea
                  rows={4}
                  required
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  placeholder="Tell us about the clinic hygiene, procedure comfort, doctor advice, and visible results..."
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-sm text-charcoal focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all shadow-sm resize-y"
                />
              </div>

              {/* Submit CTA with WhatsApp integration */}
              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-4 px-8 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm sm:text-base shadow-lg hover:shadow-xl transition-all transform active:scale-[0.99] flex items-center justify-center gap-3 group"
                >
                  <MessageCircle className="h-5 w-5 fill-white/20 group-hover:scale-110 transition-transform" />
                  <span>Send Review via WhatsApp</span>
                  <Send className="h-4 w-4 opacity-80" />
                </button>
                <p className="text-[11px] text-center text-gray-400 mt-2.5">
                  Your feedback is directly routed to Dr. Suryawanshi&apos;s team at +91 81779 55821 for clinical verification.
                </p>
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
