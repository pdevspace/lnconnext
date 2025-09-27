import { Facebook, Youtube, Globe } from "lucide-react";
import { cn } from "@/utils/utils";
import { SocialMedia } from "@/types/event";

interface SocialMediaBoxProps {
  socialMedia: SocialMedia[];
  className?: string;
}

export function SocialMediaBox({ socialMedia, className }: SocialMediaBoxProps) {
  if (!socialMedia || socialMedia.length === 0) return null;

  const getIcon = (platform: string) => {
    switch (platform) {
      case 'facebook':
        return <Facebook className="h-4 w-4" aria-hidden="true" />;
      case 'youtube':
        return <Youtube className="h-4 w-4" aria-hidden="true" />;
      default:
        return <Globe className="h-4 w-4" aria-hidden="true" />;
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
          className="flex items-center gap-2 p-2 rounded-md bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors text-gray-700 dark:text-gray-300"
          aria-label={`Visit ${social.displayText} (opens in new tab)`}
          title={social.displayText}
        >
          {getIcon(social.platform)}
          <span className="text-xs font-medium capitalize">
            {social.displayText}
          </span>
        </a>
      ))}
    </div>
  );
}