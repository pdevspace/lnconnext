'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { SocialIcon } from '@/components/ui/social-icon';
import { Bitcoiner } from '@/model/bitcoiner';
import { User, Edit, Trash2, Share2 } from 'lucide-react';
import Link from 'next/link';

interface BitcoinerCardProps {
  bitcoiner: Bitcoiner;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  showActions?: boolean;
}

export const BitcoinerCard: React.FC<BitcoinerCardProps> = ({ 
  bitcoiner, 
  onEdit, 
  onDelete, 
  showActions = false 
}) => {
  return (
    <Card className="hover:shadow-lg transition-all duration-200 hover:scale-[1.02] group">
      <CardContent className="p-6">
        {/* Profile Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center group-hover:bg-primary/10 transition-colors">
              <User className="w-6 h-6 text-muted-foreground group-hover:text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-lg text-foreground truncate">
                {bitcoiner.name}
              </h3>
              <p className="text-sm text-muted-foreground">
                {bitcoiner.socialMedia.length} social link{bitcoiner.socialMedia.length !== 1 ? 's' : ''}
              </p>
            </div>
          </div>
          {showActions && (
            <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button size="sm" variant="outline" onClick={() => onEdit?.(bitcoiner.id)}>
                <Edit className="w-3 h-3" />
              </Button>
              <Button size="sm" variant="destructive" onClick={() => onDelete?.(bitcoiner.id)}>
                <Trash2 className="w-3 h-3" />
              </Button>
            </div>
          )}
        </div>

        {/* Social Media Links */}
        <div className="space-y-2">
          {bitcoiner.socialMedia.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {bitcoiner.socialMedia.slice(0, 3).map((social) => (
                <a
                  key={social.id}
                  href={social.urlLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-muted hover:bg-muted/80 text-xs text-muted-foreground hover:text-foreground transition-colors"
                  title={social.displayText}
                >
                  <SocialIcon platform={social.platform} className="w-3 h-3" />
                  <span className="truncate max-w-[100px]">{social.username}</span>
                </a>
              ))}
              {bitcoiner.socialMedia.length > 3 && (
                <span className="text-xs text-muted-foreground">
                  +{bitcoiner.socialMedia.length - 3} more
                </span>
              )}
            </div>
          ) : (
            <div className="text-center py-4 text-muted-foreground">
              <Share2 className="w-6 h-6 mx-auto mb-2 opacity-50" />
              <p className="text-xs">No social media links</p>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="mt-4 pt-4 border-t">
          <div className="flex justify-between items-center">
            <Button 
              variant="ghost" 
              size="sm" 
              asChild
            >
              <Link href={`/bitcoiner/${bitcoiner.id}`} className="text-primary hover:text-primary/80">
                View Profile
              </Link>
            </Button>
            {showActions && (
              <div className="flex space-x-1">
                <Button size="sm" variant="outline" onClick={() => onEdit?.(bitcoiner.id)}>
                  Edit
                </Button>
                <Button size="sm" variant="destructive" onClick={() => onDelete?.(bitcoiner.id)}>
                  Delete
                </Button>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
