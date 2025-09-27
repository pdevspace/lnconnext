import { Facebook, Youtube, Twitter, Linkedin, Instagram, Share2 } from 'lucide-react';
import { Platform } from '@/model/bitcoiner';

interface SocialIconProps {
  platform: string;
  className?: string;
}

export const SocialIcon: React.FC<SocialIconProps> = ({ platform, className = "w-4 h-4" }) => {
  const iconProps = { className };
  
  switch (platform.toLowerCase()) {
    case 'facebook':
      return <Facebook {...iconProps} />;
    case 'youtube':
      return <Youtube {...iconProps} />;
    case 'twitter':
      return <Twitter {...iconProps} />;
    case 'linkedin':
      return <Linkedin {...iconProps} />;
    case 'instagram':
      return <Instagram {...iconProps} />;
    default:
      return <Share2 {...iconProps} />;
  }
};
