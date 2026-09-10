import { useState, useEffect } from "react";
import { Star, CheckCircle, Quote, Sparkles } from "lucide-react";
import { CustomerTestimonial } from "../../types/feedback";
import { getTestimonials, FEEDBACK_UPDATE_EVENT } from "../../services/feedbackStore";

export function CuratedTestimonials() {
  const [testimonials, setTestimonials] = useState<CustomerTestimonial[]>([]);

  const loadData = () => {
    setTestimonials(getTestimonials(true)); // only featured
  };

  useEffect(() => {
    loadData();

    const handleUpdate = () => loadData();
    window.addEventListener(FEEDBACK_UPDATE_EVENT, handleUpdate);
    return () => window.removeEventListener(FEEDBACK_UPDATE_EVENT, handleUpdate);
  }, []);

  if (testimonials.length === 0) {
    return null;
  }

  return (
    <section className="py-20 bg-[#F9F9F9] border-t border-gray-100">
      <div className="container-xl">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-50 text-primary text-xs font-bold uppercase tracking-wider mb-3">
            <Sparkles className="h-3.5 w-3.5" />
            Verified Experiences
          </div>
          <h2 className="font-heading text-3xl sm:text-4xl font-bold text-charcoal tracking-tight">
            What Our Patients Say
          </h2>
          <p className="mt-3 text-sm sm:text-base text-gray-600">
            Real stories and clinical transformations from individuals treated by Dr. Suryawanshi &amp; team.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((item) => (
            <article
              key={item.id}
              className="relative bg-white rounded-3xl p-7 border border-gray-100 shadow-card hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
            >
              {/* Decorative Quote Mark */}
              <div className="absolute top-6 right-6 text-pink-100 group-hover:text-pink-200 transition-colors pointer-events-none">
                <Quote className="h-10 w-10 fill-current opacity-80" />
              </div>

              <div>
                {/* 5-Star Rating */}
                <div className="flex items-center gap-1 text-amber-400 mb-4">
                  {Array.from({ length: 5 }).map((_, idx) => (
                    <Star
                      key={idx}
                      className={`h-4 w-4 ${
                        idx < item.rating ? "fill-amber-400 text-amber-400" : "text-gray-200"
                      }`}
                    />
                  ))}
                  <span className="text-xs font-bold text-gray-700 ml-1.5">{item.rating}.0</span>
                </div>

                {/* Review Body */}
                <p className="text-sm sm:text-base text-gray-700 italic leading-relaxed relative z-10">
                  &quot;{item.review_text}&quot;
                </p>
              </div>

              {/* Patient Details & Service */}
              <div className="mt-8 pt-4 border-t border-gray-100 flex items-center justify-between relative z-10">
                <div>
                  <h4 className="font-bold text-sm text-charcoal">{item.client_name}</h4>
                  {item.service_availed ? (
                    <span className="inline-block mt-0.5 text-xs font-semibold text-primary">
                      {item.service_availed}
                    </span>
                  ) : (
                    <span className="inline-block mt-0.5 text-xs text-gray-400">Verified Patient</span>
                  )}
                </div>

                <div className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                  <CheckCircle className="h-3.5 w-3.5 text-emerald-600" />
                  Verified
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
