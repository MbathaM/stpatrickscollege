import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Pencil, Trash2, Share2, Eye } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface NoteCardProps {
  id: string;
  title: string;
  content: string;
  color?: string;
  tags?: string[];
  updatedAt: string;
  isShared: boolean;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onShare: (id: string) => void;
  onView: (id: string) => void;
}

export function NoteCard({
  id,
  title,
  content,
  color = "bg-card",
  tags = [],
  updatedAt,
  isShared,
  onEdit,
  onDelete,
  onShare,
  onView,
}: NoteCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const formattedDate = formatDistanceToNow(new Date(updatedAt), { addSuffix: true });
  
  // Truncate content if it's too long
  const truncatedContent = content.length > 150 
    ? `${content.substring(0, 150)}...` 
    : content;

  return (
    <Card 
      className={`${color} h-full transition-all duration-200 ${isHovered ? 'shadow-md scale-[1.02]' : ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg">{title}</CardTitle>
          {isShared && (
            <Badge variant="outline" className="ml-2">
              Shared
            </Badge>
          )}
        </div>
        <CardDescription className="text-xs">
          Updated {formattedDate}
        </CardDescription>
      </CardHeader>
      <CardContent className="pb-2">
        <p className="text-sm whitespace-pre-line">{truncatedContent}</p>
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between pt-2">
        <Button variant="ghost" size="sm" onClick={() => onView(id)}>
          <Eye className="h-4 w-4 mr-1" />
          View
        </Button>
        <div className="flex space-x-1">
          <Button variant="ghost" size="icon" onClick={() => onEdit(id)}>
            <Pencil className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => onShare(id)}>
            <Share2 className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => onDelete(id)}>
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}