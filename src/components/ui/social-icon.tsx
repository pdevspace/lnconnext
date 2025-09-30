import { Facebook, Youtube, Twitter, Linkedin, Instagram, Share2, Globe } from 'lucide-react';

interface SocialIconProps {
  platform: string;
  className?: string;
  variant?: 'default' | 'compact' | 'minimal';
}

export const SocialIcon: React.FC<SocialIconProps> = ({ 
  platform, 
  className = "w-4 h-4",
  variant = 'default'
}) => {
  const getIconClass = () => {
    switch (variant) {
      case 'compact':
        return "w-3 h-3";
      case 'minimal':
        return "w-3 h-3";
      default:
        return className;
    }
  };

  const iconProps = { className: getIconClass() };
  
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
    case 'website':
    case 'web':
      return <Globe {...iconProps} />;
    default:
      return <Share2 {...iconProps} />;
  }
};
