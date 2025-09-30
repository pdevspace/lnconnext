import { Facebook, Youtube, Twitter, Linkedin, Instagram, Globe, Share2 } from "lucide-react";
import { cn } from "@/utils/utils";
import { SocialMedia } from "@/types/event";

interface SocialMediaBoxProps {
  socialMedia: SocialMedia[];
  className?: string;
  variant?: 'default' | 'compact' | 'minimal';
  showText?: boolean;
}

export function SocialMediaBox({ 
  socialMedia, 
  className, 
  variant = 'default',
  showText = true 
}: SocialMediaBoxProps) {
  if (!socialMedia || socialMedia.length === 0) return null;

  const getIcon = (platform: string) => {
    const iconClass = variant === 'compact' ? "h-3 w-3" : "h-4 w-4";
    
    switch (platform.toLowerCase()) {
      case 'facebook':
        return <Facebook className={iconClass} aria-hidden="true" />;
      case 'youtube':
        return <Youtube className={iconClass} aria-hidden="true" />;
      case 'twitter':
        return <Twitter className={iconClass} aria-hidden="true" />;
      case 'linkedin':
        return <Linkedin className={iconClass} aria-hidden="true" />;
      case 'instagram':
        return <Instagram className={iconClass} aria-hidden="true" />;
      default:
        return <Share2 className={iconClass} aria-hidden="true" />;
    }
  };

  const getPlatformColor = (platform: string) => {
    switch (platform.toLowerCase()) {
      case 'facebook':
        return 'hover:bg-blue-500 hover:text-white';
      case 'youtube':
        return 'hover:bg-red-500 hover:text-white';
      case 'twitter':
        return 'hover:bg-sky-500 hover:text-white';
      case 'linkedin':
        return 'hover:bg-blue-600 hover:text-white';
      case 'instagram':
        return 'hover:bg-pink-500 hover:text-white';
      default:
        return 'hover:bg-gray-500 hover:text-white';
    }
  };

  const getVariantClasses = () => {
    switch (variant) {
      case 'compact':
        return "p-1.5 rounded-md text-xs";
      case 'minimal':
        return "p-1 rounded-full";
      default:
        return "p-2 rounded-md";
    }
  };

  return (
    <div className={cn("flex flex-wrap gap-2", className)}>
      {socialMedia.map((social) => (
        <a
          key={social.id}
          href={social.urlLink}
          target="_blank"
          rel="noopener noreferrer"
          className={cn(
            "flex items-center gap-2 transition-all duration-200",
            "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300",
            "hover:shadow-md transform hover:scale-105",
            getPlatformColor(social.platform),
            getVariantClasses()
          )}
          aria-label={`Visit ${social.displayText} on ${social.platform} (opens in new tab)`}
          title={`${social.displayText} - ${social.platform}`}
        >
          {getIcon(social.platform)}
          {showText && variant !== 'minimal' && (
            <span className={cn(
              "font-medium capitalize",
              variant === 'compact' ? "text-xs" : "text-sm"
            )}>
              {social.displayText}
            </span>
          )}
        </a>
      ))}
    </div>
  );
}