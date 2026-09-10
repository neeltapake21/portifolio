export type PlatformType = "instagram" | "youtube";

export interface VideoReview {
  id: string;
  title: string;
  platform: PlatformType;
  media_url: string;
  created_at: string;
  is_active: boolean;
}

export interface CustomerTestimonial {
  id: string;
  client_name: string;
  service_availed?: string;
  rating: number; // 1 to 5
  review_text: string;
  is_featured: boolean;
  created_at: string;
}

export interface AdminSession {
  email: string;
  token: string;
  expires_at: number;
}
