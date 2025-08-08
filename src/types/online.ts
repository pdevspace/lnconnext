import { Speaker } from "./event";

export interface YouTubeChannel {
  name: string;
  url: string;
  subscriberCount?: number;
  avatar?: string;
}

export interface OnlineContent {
  id: string;
  title: string;
  description: string;
  contentType:
    | "video"
    | "live"
    | "webinar"
    | "youtube-live"
    | "zoom-meeting"
    | "youtube-series";
  startDate: Date;
  endDate?: Date;
  duration?: number; // in minutes
  url: string;
  youtubeUrl?: string;
  zoomMeetingId?: string;
  zoomPassword?: string;
  series?: {
    name: string;
    episode?: number;
    totalEpisodes?: number;
  };
  channel?: YouTubeChannel;
  participants: Speaker[];
  thumbnail?: string;
  tags: string[];
  category: string;
  isLive?: boolean;
  isUpcoming?: boolean;
  viewCount?: number;
  likeCount?: number;
  organizer?: string;
  socialMedia?: {
    twitter?: string;
    instagram?: string;
    facebook?: string;
  };
}
