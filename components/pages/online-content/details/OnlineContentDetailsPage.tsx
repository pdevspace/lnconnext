"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { OnlineContent } from "@/types/online";
import {
  ArrowLeft,
  Calendar,
  CalendarPlus,
  Clock,
  ExternalLink,
  Eye,
  Github,
  Heart,
  Linkedin,
  Mic,
  Play,
  Radio,
  Share2,
  Tv,
  Twitter,
  Users,
  Users2,
  Video,
  Youtube,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

interface OnlineContentDetailsPageProps {
  contentId: string;
}
export default function OnlineContentDetailsPage({ contentId }: OnlineContentDetailsPageProps) {
  const [content, setContent] = useState<OnlineContent>({} as OnlineContent);
  const [savedContent, setSavedContent] = useState(false);

  const isLive = content.isLive;
  const isUpcoming = content.isUpcoming;

  const handleSaveContent = () => {
    setSavedContent(!savedContent);
  };

  const handleShareContent = () => {
    if (navigator.share) {
      navigator.share({
        title: content.title,
        text: content.description,
        url: content.url,
      });
    } else {
      navigator.clipboard.writeText(content.url);
    }
  };

  const handleAddToCalendar = () => {
    const calendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(content.title)}&dates=${content.startDate.toISOString().replace(/[-:]/g, "").split(".")[0]}Z/${content.endDate?.toISOString().replace(/[-:]/g, "").split(".")[0] || content.startDate.toISOString().replace(/[-:]/g, "").split(".")[0]}Z&details=${encodeURIComponent(content.description)}&location=${encodeURIComponent(content.url)}`;
    window.open(calendarUrl, "_blank");
  };

  const getContentTypeIcon = (contentType: string) => {
    switch (contentType) {
      case "video":
        return Video;
      case "youtube-live":
        return Youtube;
      case "live":
        return Radio;
      case "webinar":
        return Users2;
      case "zoom-meeting":
        return Mic;
      case "youtube-series":
        return Tv;
      default:
        return Video;
    }
  };

  const getContentTypeColor = (contentType: string) => {
    switch (contentType) {
      case "video":
        return "bg-blue-500";
      case "youtube-live":
        return "bg-red-500";
      case "live":
        return "bg-purple-500";
      case "webinar":
        return "bg-green-500";
      case "zoom-meeting":
        return "bg-indigo-500";
      case "youtube-series":
        return "bg-orange-500";
      default:
        return "bg-gray-500";
    }
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  const formatViewCount = (count: number) => {
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M`;
    } else if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`;
    }
    return count.toString();
  };

  const getContentStatus = () => {
    if (isLive) return { text: "LIVE NOW", color: "bg-red-500" };
    if (isUpcoming) return { text: "UPCOMING", color: "bg-green-500" };
    return { text: "AVAILABLE", color: "bg-blue-500" };
  };

  const status = getContentStatus();
  const ContentTypeIcon = getContentTypeIcon(content.contentType);
  const contentTypeColor = getContentTypeColor(content.contentType);

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation Header */}
      <div className="border-b bg-card">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/online-content">
              <Button variant="ghost" className="flex items-center gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back to Online Content
              </Button>
            </Link>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={handleAddToCalendar}>
                <CalendarPlus className="h-4 w-4 mr-2" />
                Add to Calendar
              </Button>
              <Button variant="outline" size="sm" onClick={handleShareContent}>
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleSaveContent}
                className={savedContent ? "bg-red-50 border-red-200" : ""}
              >
                <Heart className={`h-4 w-4 mr-2 ${savedContent ? "fill-current text-red-500" : ""}`} />
                {savedContent ? "Saved" : "Save"}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="relative">
        <div className="relative h-96 md:h-[500px] overflow-hidden bg-black">
          <div className="w-full h-full bg-cover bg-center" style={{ backgroundImage: `url(${content.thumbnail})` }}>
            <div className="absolute inset-0 bg-black/40" />

            <div className="absolute top-4 left-4">
              <Badge className={`${status.color} text-white border-0`}>{status.text}</Badge>
            </div>

            <div className="absolute top-4 left-32">
              <Badge className={`${contentTypeColor} text-white border-0`}>
                <ContentTypeIcon className="h-3 w-3 mr-1" />
                {content.contentType.replace("-", " ").toUpperCase()}
              </Badge>
            </div>

            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center cursor-pointer hover:bg-white/30 transition-colors">
                <Play className="h-10 w-10 text-white ml-1" />
              </div>
            </div>

            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
              <div className="max-w-4xl mx-auto">
                {content.series && (
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                      {content.series.name} • Episode {content.series.episode}
                      {content.series.totalEpisodes && ` of ${content.series.totalEpisodes}`}
                    </Badge>
                  </div>
                )}

                <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">{content.title}</h1>

                <div className="flex flex-wrap items-center gap-4 text-white/90 text-sm">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    {content.startDate.toLocaleDateString()}
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {content.startDate.toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                    {content.duration && ` • ${formatDuration(content.duration)}`}
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    {content.participants.length} participants
                  </div>
                  {content.viewCount && (
                    <div className="flex items-center gap-1">
                      <Eye className="h-4 w-4" />
                      {formatViewCount(content.viewCount)} views
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-card border-b">
          <div className="max-w-4xl mx-auto px-6 py-4">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                {content.channel && (
                  <div className="flex items-center gap-2">
                    <img src={content.channel.avatar} alt={content.channel.name} className="w-8 h-8 rounded-full" />
                    <div>
                      <div className="font-medium">{content.channel.name}</div>
                      {content.channel.subscriberCount && (
                        <div className="text-sm text-muted-foreground">
                          {formatViewCount(content.channel.subscriberCount)} subscribers
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              <div className="flex gap-2">
                <Button>
                  <Play className="h-4 w-4 mr-2" />
                  {isLive ? "Join Live" : isUpcoming ? "Set Reminder" : "Watch Now"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="space-y-6">
          {/* About Section */}
          <Card>
            <CardHeader>
              <CardTitle>About This Content</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed mb-6">{content.description}</p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-semibold">Content Details</h4>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Type:</span>
                      <span className="capitalize">{content.contentType.replace("-", " ")}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Duration:</span>
                      <span>{content.duration ? formatDuration(content.duration) : "N/A"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Participants:</span>
                      <span>{content.participants.length} participants</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Organizer:</span>
                      <span>{content.organizer}</span>
                    </div>
                    {content.viewCount && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Views:</span>
                        <span>{formatViewCount(content.viewCount)}</span>
                      </div>
                    )}
                    {content.likeCount && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Likes:</span>
                        <span>{formatViewCount(content.likeCount)}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-semibold">Watch Options</h4>
                  <div className="space-y-3">
                    {content.youtubeUrl && (
                      <Button
                        variant="outline"
                        className="w-full justify-start"
                        onClick={() => window.open(content.youtubeUrl, "_blank")}
                      >
                        <Youtube className="h-4 w-4 mr-2 text-red-500" />
                        Watch on YouTube
                      </Button>
                    )}
                    <Button
                      variant="outline"
                      className="w-full justify-start"
                      onClick={() => window.open(content.url, "_blank")}
                    >
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Open Original Link
                    </Button>
                    {content.zoomMeetingId && (
                      <div className="space-y-2 p-3 border rounded-lg">
                        <div className="font-medium text-sm">Zoom Meeting Details</div>
                        <div className="text-sm text-muted-foreground">
                          <div>Meeting ID: {content.zoomMeetingId}</div>
                          {content.zoomPassword && <div>Password: {content.zoomPassword}</div>}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Participants */}
          <Card>
            <CardHeader>
              <CardTitle>Featured Participants</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {content.participants.map(participant => (
                  <Card key={participant.id} className="cursor-pointer hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-start gap-4">
                        <img
                          src={participant.avatar}
                          alt={participant.name}
                          className="w-16 h-16 rounded-full object-cover"
                        />
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-sm truncate">{participant.name}</h4>
                          <p className="text-xs text-muted-foreground mb-2">{participant.title}</p>
                          <p className="text-xs text-muted-foreground mb-2 line-clamp-2">{participant.bio}</p>
                          <div className="flex flex-wrap gap-1 mb-2">
                            {participant.expertise.slice(0, 2).map(skill => (
                              <Badge key={skill} variant="secondary" className="text-xs">
                                {skill}
                              </Badge>
                            ))}
                          </div>
                          <div className="flex gap-1">
                            {participant.socialLinks.map(link => {
                              const getIcon = (platform: string) => {
                                switch (platform) {
                                  case "twitter":
                                    return Twitter;
                                  case "linkedin":
                                    return Linkedin;
                                  case "github":
                                    return Github;
                                  case "youtube":
                                    return Youtube;
                                  default:
                                    return ExternalLink;
                                }
                              };
                              const Icon = getIcon(link.platform);
                              return (
                                <Button
                                  key={link.platform}
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => window.open(link.url, "_blank")}
                                  className="h-6 w-6 p-0"
                                >
                                  <Icon className="h-3 w-3" />
                                </Button>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Series Info */}
          {content.series && (
            <Card>
              <CardHeader>
                <CardTitle>{content.series.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="flex-1">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-primary h-2 rounded-full"
                          style={{
                            width: `${1 * 100}%`,
                          }}
                        />
                      </div>
                      <div className="text-sm text-muted-foreground mt-1">
                        Progress: {content.series.episode} of {content.series.totalEpisodes} episodes
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Tags */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-wrap gap-2">
                {content.tags.map(tag => (
                  <Badge key={tag} variant="outline">
                    {tag}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
