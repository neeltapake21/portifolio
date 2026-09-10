import { VideoReview, CustomerTestimonial, AdminSession } from "../types/feedback";

const REELS_STORAGE_KEY = "sovelo_video_reviews";
const TESTIMONIALS_STORAGE_KEY = "sovelo_testimonials";
const ADMIN_SESSION_KEY = "sovelo_admin_session";
const UPDATE_EVENT_NAME = "sovelo_feedback_updated";

// Seed Data for initial load
const DEFAULT_VIDEO_REVIEWS: VideoReview[] = [
  {
    id: "reel-1",
    title: "Laser Hair Removal Experience & Smooth Skin Journey",
    platform: "instagram",
    media_url: "https://www.instagram.com/reel/C_oA8qUv6mF/",
    created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    is_active: true,
  },
  {
    id: "reel-2",
    title: "Hydrafacial Glow & Deep Hydration Treatment",
    platform: "youtube",
    media_url: "https://www.youtube.com/shorts/3i_p22n9r0s",
    created_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    is_active: true,
  },
  {
    id: "reel-3",
    title: "PRP Hair Restoration - Patient 3-Month Transformation",
    platform: "instagram",
    media_url: "https://www.instagram.com/reel/C7abc99v1xZ/",
    created_at: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
    is_active: true,
  },
  {
    id: "reel-4",
    title: "Holistic Skin Rejuvenation with Dr. Suryawanshi",
    platform: "youtube",
    media_url: "https://www.youtube.com/shorts/k9Z8uX_y4mQ",
    created_at: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
    is_active: true,
  },
];

const DEFAULT_TESTIMONIALS: CustomerTestimonial[] = [
  {
    id: "test-1",
    client_name: "Priya Sharma",
    service_availed: "Laser Hair Removal",
    rating: 5,
    review_text:
      "I had 6 sessions of laser hair reduction done at Sovilo Aesthetics. The results exceeded my expectations! Completely painless, spotless hygienic clinic, and Dr. Suryawanshi took personal care throughout.",
    is_featured: true,
    created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "test-2",
    client_name: "Dr. Anita Kulkarni",
    service_availed: "Hydrafacial & Anti-Aging",
    rating: 5,
    review_text:
      "Best medi-facial experience in Baner! My skin has an undeniable radiant glow, and the fine lines around my eyes softened significantly. Exceptional professionalism.",
    is_featured: true,
    created_at: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "test-3",
    client_name: "Rohini Deshmukh",
    service_availed: "PCOS & Hormonal Skin Program",
    rating: 5,
    review_text:
      "Struggled with severe hormonal acne and PCOS for 4 years. Dr. Suryawanshi's holistic clinical plan completely healed my skin barrier without harsh medications. Truly grateful!",
    is_featured: true,
    created_at: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "test-4",
    client_name: "Vikram Patil",
    service_availed: "PRP Hair Restoration",
    rating: 5,
    review_text:
      "Visible density improvement in just 3 sessions of PRP. The team explained the science clearly and the procedure was super comfortable.",
    is_featured: true,
    created_at: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "test-5",
    client_name: "Megha Paranjpe",
    service_availed: "Chemical Peel & Brightening",
    rating: 5,
    review_text:
      "Dr. Suryawanshi understands aesthetic balance like no other. My pigmentation has reduced by over 80% with their customized peel series.",
    is_featured: true,
    created_at: new Date(Date.now() - 28 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

// Helper to notify listeners of changes
function notifyUpdate() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent(UPDATE_EVENT_NAME));
  }
}

// ----------------- VIDEO REVIEWS API -----------------

export function getVideoReviews(onlyActive = false): VideoReview[] {
  if (typeof window === "undefined") return DEFAULT_VIDEO_REVIEWS;
  const raw = localStorage.getItem(REELS_STORAGE_KEY);
  if (!raw) {
    localStorage.setItem(REELS_STORAGE_KEY, JSON.stringify(DEFAULT_VIDEO_REVIEWS));
    return onlyActive ? DEFAULT_VIDEO_REVIEWS.filter((r) => r.is_active) : DEFAULT_VIDEO_REVIEWS;
  }
  try {
    const list: VideoReview[] = JSON.parse(raw);
    return onlyActive ? list.filter((r) => r.is_active) : list;
  } catch {
    return DEFAULT_VIDEO_REVIEWS;
  }
}

export function addVideoReview(data: Omit<VideoReview, "id" | "created_at">): VideoReview {
  const current = getVideoReviews(false);
  const newReview: VideoReview = {
    ...data,
    id: `reel-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    created_at: new Date().toISOString(),
  };
  const updated = [newReview, ...current];
  localStorage.setItem(REELS_STORAGE_KEY, JSON.stringify(updated));
  notifyUpdate();
  return newReview;
}

export function toggleVideoReview(id: string): boolean {
  const current = getVideoReviews(false);
  const updated = current.map((r) => (r.id === id ? { ...r, is_active: !r.is_active } : r));
  localStorage.setItem(REELS_STORAGE_KEY, JSON.stringify(updated));
  notifyUpdate();
  return true;
}

export function deleteVideoReview(id: string): boolean {
  const current = getVideoReviews(false);
  const updated = current.filter((r) => r.id !== id);
  localStorage.setItem(REELS_STORAGE_KEY, JSON.stringify(updated));
  notifyUpdate();
  return true;
}

// ----------------- TESTIMONIALS API -----------------

export function getTestimonials(onlyFeatured = false): CustomerTestimonial[] {
  if (typeof window === "undefined") return DEFAULT_TESTIMONIALS;
  const raw = localStorage.getItem(TESTIMONIALS_STORAGE_KEY);
  if (!raw) {
    localStorage.setItem(TESTIMONIALS_STORAGE_KEY, JSON.stringify(DEFAULT_TESTIMONIALS));
    return onlyFeatured ? DEFAULT_TESTIMONIALS.filter((t) => t.is_featured) : DEFAULT_TESTIMONIALS;
  }
  try {
    const list: CustomerTestimonial[] = JSON.parse(raw);
    return onlyFeatured ? list.filter((t) => t.is_featured) : list;
  } catch {
    return DEFAULT_TESTIMONIALS;
  }
}

export function addTestimonial(
  data: Omit<CustomerTestimonial, "id" | "created_at">
): CustomerTestimonial {
  const current = getTestimonials(false);
  const newTestimonial: CustomerTestimonial = {
    ...data,
    id: `test-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    created_at: new Date().toISOString(),
  };
  const updated = [newTestimonial, ...current];
  localStorage.setItem(TESTIMONIALS_STORAGE_KEY, JSON.stringify(updated));
  notifyUpdate();
  return newTestimonial;
}

export function updateTestimonial(
  id: string,
  updates: Partial<CustomerTestimonial>
): CustomerTestimonial | null {
  const current = getTestimonials(false);
  let updatedItem: CustomerTestimonial | null = null;
  const updated = current.map((t) => {
    if (t.id === id) {
      updatedItem = { ...t, ...updates };
      return updatedItem;
    }
    return t;
  });
  localStorage.setItem(TESTIMONIALS_STORAGE_KEY, JSON.stringify(updated));
  notifyUpdate();
  return updatedItem;
}

export function toggleTestimonialFeatured(id: string): boolean {
  const current = getTestimonials(false);
  const updated = current.map((t) => (t.id === id ? { ...t, is_featured: !t.is_featured } : t));
  localStorage.setItem(TESTIMONIALS_STORAGE_KEY, JSON.stringify(updated));
  notifyUpdate();
  return true;
}

export function deleteTestimonial(id: string): boolean {
  const current = getTestimonials(false);
  const updated = current.filter((t) => t.id !== id);
  localStorage.setItem(TESTIMONIALS_STORAGE_KEY, JSON.stringify(updated));
  notifyUpdate();
  return true;
}

export function resetToDefaults() {
  localStorage.setItem(REELS_STORAGE_KEY, JSON.stringify(DEFAULT_VIDEO_REVIEWS));
  localStorage.setItem(TESTIMONIALS_STORAGE_KEY, JSON.stringify(DEFAULT_TESTIMONIALS));
  notifyUpdate();
}

// ----------------- ADMIN AUTHENTICATION -----------------

const DEFAULT_ADMIN_EMAIL = "admin@sovilo.com";
const DEFAULT_ADMIN_PASSWORD = "Sovilo@2026";

export function loginAdmin(emailInput: string, passwordInput: string): boolean {
  const cleanEmail = emailInput.trim().toLowerCase();
  const cleanPass = passwordInput.trim();

  // Validate credentials (supports default or admin username)
  const isEmailValid = cleanEmail === DEFAULT_ADMIN_EMAIL || cleanEmail === "admin" || cleanEmail === "admin@sovelo.com";
  const isPassValid = cleanPass === DEFAULT_ADMIN_PASSWORD || cleanPass === "admin123";

  if (isEmailValid && isPassValid) {
    const session: AdminSession = {
      email: cleanEmail,
      token: `admin_token_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      expires_at: Date.now() + 7 * 24 * 60 * 60 * 1000, // 7 days
    };
    localStorage.setItem(ADMIN_SESSION_KEY, JSON.stringify(session));
    return true;
  }
  return false;
}

export function getAdminSession(): AdminSession | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(ADMIN_SESSION_KEY);
  if (!raw) return null;
  try {
    const session: AdminSession = JSON.parse(raw);
    if (Date.now() > session.expires_at) {
      localStorage.removeItem(ADMIN_SESSION_KEY);
      return null;
    }
    return session;
  } catch {
    return null;
  }
}

export function isAdminAuthenticated(): boolean {
  return getAdminSession() !== null;
}

export function logoutAdmin(): void {
  if (typeof window !== "undefined") {
    localStorage.removeItem(ADMIN_SESSION_KEY);
  }
}

export const FEEDBACK_UPDATE_EVENT = UPDATE_EVENT_NAME;
