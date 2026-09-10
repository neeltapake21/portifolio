import { PlatformType } from "../types/feedback";

export interface ParsedMedia {
  platform: PlatformType;
  embedUrl: string;
  originalUrl: string;
  mediaId: string;
  isValid: boolean;
}

/**
 * Parses Instagram and YouTube URLs and converts them to safe embed URLs.
 */
export function parseMediaUrl(url: string, platformHint?: PlatformType): ParsedMedia {
  const cleanUrl = url.trim();

  // 1. YouTube Detection & Parsing
  if (
    platformHint === "youtube" ||
    cleanUrl.includes("youtube.com") ||
    cleanUrl.includes("youtu.be")
  ) {
    let videoId = "";

    // YouTube Shorts: https://www.youtube.com/shorts/VIDEO_ID
    const shortsMatch = cleanUrl.match(/\/shorts\/([a-zA-Z0-9_-]+)/);
    if (shortsMatch && shortsMatch[1]) {
      videoId = shortsMatch[1];
    }

    // Standard watch URL: https://www.youtube.com/watch?v=VIDEO_ID
    if (!videoId) {
      const watchMatch = cleanUrl.match(/[?&]v=([a-zA-Z0-9_-]+)/);
      if (watchMatch && watchMatch[1]) {
        videoId = watchMatch[1];
      }
    }

    // Short link: https://youtu.be/VIDEO_ID
    if (!videoId) {
      const shortLinkMatch = cleanUrl.match(/youtu\.be\/([a-zA-Z0-9_-]+)/);
      if (shortLinkMatch && shortLinkMatch[1]) {
        videoId = shortLinkMatch[1];
      }
    }

    // Already an embed link: https://www.youtube.com/embed/VIDEO_ID
    if (!videoId) {
      const embedMatch = cleanUrl.match(/\/embed\/([a-zA-Z0-9_-]+)/);
      if (embedMatch && embedMatch[1]) {
        videoId = embedMatch[1];
      }
    }

    if (videoId) {
      return {
        platform: "youtube",
        embedUrl: `https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1`,
        originalUrl: cleanUrl,
        mediaId: videoId,
        isValid: true,
      };
    }
  }

  // 2. Instagram Detection & Parsing
  if (
    platformHint === "instagram" ||
    cleanUrl.includes("instagram.com") ||
    cleanUrl.includes("instagr.am")
  ) {
    let postId = "";

    // Reel: https://www.instagram.com/reel/POST_ID/
    const reelMatch = cleanUrl.match(/\/reel\/([a-zA-Z0-9_-]+)/);
    if (reelMatch && reelMatch[1]) {
      postId = reelMatch[1];
    }

    // Post: https://www.instagram.com/p/POST_ID/
    if (!postId) {
      const postMatch = cleanUrl.match(/\/p\/([a-zA-Z0-9_-]+)/);
      if (postMatch && postMatch[1]) {
        postId = postMatch[1];
      }
    }

    // TV: https://www.instagram.com/tv/POST_ID/
    if (!postId) {
      const tvMatch = cleanUrl.match(/\/tv\/([a-zA-Z0-9_-]+)/);
      if (tvMatch && tvMatch[1]) {
        postId = tvMatch[1];
      }
    }

    if (postId) {
      return {
        platform: "instagram",
        embedUrl: `https://www.instagram.com/reel/${postId}/embed`,
        originalUrl: cleanUrl,
        mediaId: postId,
        isValid: true,
      };
    }
  }

  // Fallback / Unknown
  return {
    platform: platformHint || "instagram",
    embedUrl: cleanUrl,
    originalUrl: cleanUrl,
    mediaId: "",
    isValid: false,
  };
}

/**
 * Detect platform from URL string
 */
export function detectPlatform(url: string): PlatformType {
  const lower = url.toLowerCase();
  if (lower.includes("youtube.com") || lower.includes("youtu.be")) {
    return "youtube";
  }
  return "instagram";
}
