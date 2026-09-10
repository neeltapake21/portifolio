import { useState, useEffect } from "react";
import { Film, Play, ExternalLink, Instagram, Youtube, Sparkles } from "lucide-react";
import { VideoReview } from "../../types/feedback";
import { getVideoReviews, FEEDBACK_UPDATE_EVENT } from "../../services/feedbackStore";
import { parseMediaUrl } from "../../utils/mediaParser";

export function VideoReviews() {
  const [reels, setReels] = useState<VideoReview[]>([]);

  const loadReels = () => {
    setReels(getVideoReviews(true)); // only active
  };

  useEffect(() => {
    loadReels();

    const handleUpdate = () => loadReels();
    window.addEventListener(FEEDBACK_UPDATE_EVENT, handleUpdate);
    return () => window.removeEventListener(FEEDBACK_UPDATE_EVENT, handleUpdate);
  }, []);

  if (reels.length === 0) {
    return null;
  }

  return (
    <section className="py-20 bg-gradient-to-b from-white via-soft-gray/40 to-white overflow-hidden border-t border-gray-100">
      <div className="container-xl">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-50 text-primary text-xs font-bold uppercase tracking-wider mb-3">
            <Sparkles className="h-3.5 w-3.5" />
            Video Testimonials
          </div>
          <h2 className="font-heading text-3xl sm:text-4xl font-bold text-charcoal tracking-tight">
            Real Results: Client Journeys
          </h2>
          <p className="mt-3 text-sm sm:text-base text-gray-600">
            Watch authentic transformations, clinical expertise, and treatment journeys directly from our happy patients.
          </p>
        </div>

        {/* Video Reels Grid / Carousel */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {reels.map((reel) => {
            const parsed = parseMediaUrl(reel.media_url, reel.platform);
            return (
              <div
                key={reel.id}
                className="group relative bg-white rounded-3xl overflow-hidden shadow-card border border-gray-100 hover:shadow-xl transition-all duration-300 flex flex-col"
              >
                {/* 9:16 Ratio Container */}
                <div className="relative w-full aspect-[9/16] bg-black overflow-hidden rounded-t-3xl">
                  <iframe
                    src={parsed.embedUrl}
                    title={reel.title}
                    className="w-full h-full border-0"
                    loading="lazy"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />

                  {/* Platform Indicator */}
                  <div className="absolute top-3 left-3 z-10 pointer-events-none">
                    {reel.platform === "instagram" ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-pink-600/90 text-white backdrop-blur-sm shadow">
                        <Instagram className="h-3 w-3" /> Reel
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-red-600/90 text-white backdrop-blur-sm shadow">
                        <Youtube className="h-3 w-3" /> Shorts
                      </span>
                    )}
                  </div>
                </div>

                {/* Card Caption & Action Footer */}
                <div className="p-5 flex-1 flex flex-col justify-between bg-white">
                  <div>
                    <h3 className="font-semibold text-sm text-charcoal leading-snug line-clamp-2">
                      {reel.title}
                    </h3>
                  </div>

                  <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between">
                    <span className="text-[11px] font-medium text-gray-400">Verified Client Story</span>
                    <a
                      href={reel.media_url}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:text-primary-light transition-colors"
                    >
                      <span>Watch Full</span>
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
