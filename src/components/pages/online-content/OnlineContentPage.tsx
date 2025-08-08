// "use client";

// import { Badge } from "@/components/ui/badge";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardTitle } from "@/components/ui/card";
// import { Input } from "@/components/ui/input";

// import { OnlineContent } from "@/types/online";
// import { ArrowRight, Calendar, Clock, Eye, Filter, Radio, ThumbsUp, Users, Users2, Video, Youtube } from "lucide-react";
// import Link from "next/link";
// import { useState } from "react";

// export default function OnlineContentPage() {
//   const [searchQuery, setSearchQuery] = useState("");
//   const [selectedCategory, setSelectedCategory] = useState("");
//   const [selectedContentType, setSelectedContentType] = useState("");

//   const categories = [
//     "All",
//     "Bitcoin Analysis",
//     "Bitcoin Education",
//     "Bitcoin Development",
//     "Bitcoin Security",
//     "Bitcoin Debate",
//   ];
//   const contentTypes = [
//     { value: "", label: "All Types", icon: Video },
//     { value: "video", label: "Videos", icon: Video },
//     { value: "youtube-live", label: "YouTube Live", icon: Youtube },
//     { value: "live", label: "Live Streams", icon: Radio },
//     { value: "webinar", label: "Webinars", icon: Users2 },
//     { value: "zoom-meeting", label: "Zoom Meetings", icon: Users2 },
//     { value: "youtube-series", label: "YouTube Series", icon: Video },
//   ];

//   const filteredContent = [{} as OnlineContent].filter(content => {
//     const matchesSearch =
//       content.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
//       content.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
//       content.participants.some(participant => participant.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
//       content.series?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
//       content.channel?.name.toLowerCase().includes(searchQuery.toLowerCase());

//     const matchesCategory =
//       selectedCategory === "All" || selectedCategory === "" || content.category === selectedCategory;
//     const matchesContentType = selectedContentType === "" || content.contentType === selectedContentType;

//     return matchesSearch && matchesCategory && matchesContentType;
//   });

//   const getContentTypeIcon = (contentType: string) => {
//     switch (contentType) {
//       case "video":
//         return Video;
//       case "youtube-live":
//         return Youtube;
//       case "live":
//         return Radio;
//       case "webinar":
//         return Users2;
//       case "zoom-meeting":
//         return Users2;
//       case "youtube-series":
//         return Video;
//       default:
//         return Video;
//     }
//   };

//   const getContentTypeColor = (contentType: string) => {
//     switch (contentType) {
//       case "video":
//         return "bg-blue-500";
//       case "youtube-live":
//         return "bg-red-500";
//       case "live":
//         return "bg-purple-500";
//       case "webinar":
//         return "bg-green-500";
//       case "zoom-meeting":
//         return "bg-indigo-500";
//       case "youtube-series":
//         return "bg-orange-500";
//       default:
//         return "bg-gray-500";
//     }
//   };

//   const formatDuration = (minutes: number) => {
//     const hours = Math.floor(minutes / 60);
//     const mins = minutes % 60;
//     return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
//   };

//   const formatViewCount = (count: number) => {
//     if (count >= 1000000) {
//       return `${(count / 1000000).toFixed(1)}M`;
//     } else if (count >= 1000) {
//       return `${(count / 1000).toFixed(1)}K`;
//     }
//     return count.toString();
//   };

//   const handleAddToCalendar = (content: OnlineContent) => {
//     const calendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(content.title)}&dates=${content.startDate.toISOString().replace(/[-:]/g, "").split(".")[0]}Z/${content.endDate?.toISOString().replace(/[-:]/g, "").split(".")[0] || content.startDate.toISOString().replace(/[-:]/g, "").split(".")[0]}Z&details=${encodeURIComponent(content.description)}&location=${encodeURIComponent(content.url)}`;
//     window.open(calendarUrl, "_blank");
//   };

//   const handleShare = (content: OnlineContent) => {
//     if (navigator.share) {
//       navigator.share({
//         title: content.title,
//         text: content.description,
//         url: content.url,
//       });
//     } else {
//       navigator.clipboard.writeText(content.url);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-background">
//       {/* Fixed Header Bar */}
//       <div className="border-b bg-card fixed top-[70px] left-0 w-full z-40">
//         <div className="max-w-7xl mx-auto px-4 py-2 flex items-center justify-between">
//           <h1 className="text-xl font-bold">Online Content</h1>
//           <div className="flex gap-2">
//             <Input
//               placeholder="Search videos, speakers, or channels..."
//               value={searchQuery}
//               onChange={e => setSearchQuery(e.target.value)}
//               className="w-64"
//             />
//             <Button variant="outline" className="flex items-center gap-2">
//               <Filter className="h-4 w-4" />
//               Filter
//             </Button>
//           </div>
//         </div>
//       </div>
//       {/* Main Content */}
//       <div className="max-w-7xl mx-auto px-4 py-6 mt-[130px]">
//         {/* Content Grid */}
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//           {filteredContent.map(content => {
//             const ContentTypeIcon = contentTypes.find(type => type.value === content.contentType)?.icon || Video;
//             const contentTypeColor = content.contentType === "youtube-live" ? "bg-red-500" : "bg-blue-500";

//             return (
//               <Card key={content.id} className="cursor-pointer hover:shadow-lg transition-shadow">
//                 <div className="relative">
//                   {/* Thumbnail */}
//                   <div
//                     className="relative h-48 bg-cover bg-center rounded-t-lg"
//                     style={{ backgroundImage: `url(${content.thumbnail})` }}
//                   >
//                     <div className="absolute inset-0 bg-black/20" />
//                     {/* Content Type Badge */}
//                     <div className="absolute top-2 left-2">
//                       <Badge className={`${contentTypeColor} text-white border-0`}>
//                         <ContentTypeIcon className="h-3 w-3 mr-1" />
//                         {content.contentType.replace("-", " ").toUpperCase()}
//                       </Badge>
//                     </div>
//                   </div>
//                 </div>
//                 <CardContent className="p-4">
//                   {/* Series Info */}
//                   {content.series && (
//                     <div className="mb-2">
//                       <Badge variant="outline" className="text-xs">
//                         {content.series.name} • Episode {content.series.episode}
//                         {content.series.totalEpisodes && ` of ${content.series.totalEpisodes}`}
//                       </Badge>
//                     </div>
//                   )}
//                   {/* Title */}
//                   <CardTitle className="text-lg mb-2 line-clamp-2">{content.title}</CardTitle>
//                   {/* Description */}
//                   <p className="text-gray-600 text-sm mb-3 line-clamp-2">{content.description}</p>
//                   {/* Channel Info */}
//                   {content.channel && (
//                     <div className="flex items-center gap-2 mb-3">
//                       <img src={content.channel.avatar} alt={content.channel.name} className="w-6 h-6 rounded-full" />
//                       <span className="text-sm font-medium text-gray-700">{content.channel.name}</span>
//                       {content.channel.subscriberCount && (
//                         <span className="text-xs text-gray-500">
//                           {content.channel.subscriberCount.toLocaleString()} subscribers
//                         </span>
//                       )}
//                     </div>
//                   )}
//                   {/* Stats */}
//                   <div className="space-y-2 text-sm text-gray-600 mb-4">
//                     <div className="flex items-center gap-2">
//                       <Calendar className="h-4 w-4" />
//                       <span>{content.startDate.toLocaleDateString()}</span>
//                     </div>
//                     <div className="flex items-center gap-2">
//                       <Clock className="h-4 w-4" />
//                       <span>
//                         {content.startDate.toLocaleTimeString([], {
//                           hour: "2-digit",
//                           minute: "2-digit",
//                         })}
//                       </span>
//                       {content.duration && <span>• {content.duration} min</span>}
//                     </div>
//                     <div className="flex items-center gap-2">
//                       <Users className="h-4 w-4" />
//                       <span>{content.participants.length} participants</span>
//                     </div>
//                     {content.viewCount && (
//                       <div className="flex items-center gap-2">
//                         <Eye className="h-4 w-4" />
//                         <span>{content.viewCount.toLocaleString()} views</span>
//                       </div>
//                     )}
//                     {content.likeCount && (
//                       <div className="flex items-center gap-2">
//                         <ThumbsUp className="h-4 w-4" />
//                         <span>{content.likeCount.toLocaleString()} likes</span>
//                       </div>
//                     )}
//                   </div>
//                   {/* Participants */}
//                   <div className="mb-4">
//                     <div className="flex gap-1 flex-wrap">
//                       {content.participants.slice(0, 3).map(participant => (
//                         <Badge key={participant.id} variant="secondary" className="text-xs">
//                           {participant.name}
//                         </Badge>
//                       ))}
//                       {content.participants.length > 3 && (
//                         <Badge variant="outline" className="text-xs">
//                           +{content.participants.length - 3}
//                         </Badge>
//                       )}
//                     </div>
//                   </div>
//                   {/* Action Buttons */}
//                   <div className="flex items-center justify-between">
//                     <Link href={`/online-content/${content.id}`}>
//                       <Button variant="outline" size="sm" className="flex items-center gap-2">
//                         <ArrowRight className="h-4 w-4" />
//                         Watch
//                       </Button>
//                     </Link>
//                   </div>
//                 </CardContent>
//               </Card>
//             );
//           })}
//         </div>
//         {filteredContent.length === 0 && (
//           <div className="text-center py-12">
//             <p className="text-gray-500 text-lg">No content found matching your criteria.</p>
//             <Button
//               variant="outline"
//               className="mt-4"
//               onClick={() => {
//                 setSearchQuery("");
//                 setSelectedCategory("");
//                 setSelectedContentType("");
//               }}
//             >
//               Clear filters
//             </Button>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }
