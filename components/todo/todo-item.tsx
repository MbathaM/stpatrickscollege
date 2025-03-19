import { useState } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Pencil, Trash2, Share2, Calendar } from "lucide-react";
import { formatDistanceToNow, format } from "date-fns";

interface TodoItemProps {
  id: string;
  title: string;
  description?: string;
  isCompleted: boolean;
  dueDate?: string;
  priority?: string;
  isShared: boolean;
  updatedAt: string;
  onToggleComplete: (id: string, isCompleted: boolean) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onShare: (id: string) => void;
}

export function TodoItem({
  id,
  title,
  description,
  isCompleted,
  dueDate,
  priority = "medium",
  isShared,
  updatedAt,
  onToggleComplete,
  onEdit,
  onDelete,
  onShare,
}: TodoItemProps) {
  const [isHovered, setIsHovered] = useState(false);
  const formattedDate = formatDistanceToNow(new Date(updatedAt), { addSuffix: true });
  
  // Get priority color
  const getPriorityColor = () => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
      case "medium":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
      case "low":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300";
    }
  };

  return (
    <Card 
      className={`transition-all duration-200 ${isHovered ? 'shadow-md' : ''} ${isCompleted ? 'opacity-70' : ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <CardHeader className="pb-2 flex flex-row items-start space-x-2">
        <Checkbox 
          checked={isCompleted} 
          onCheckedChange={() => onToggleComplete(id, !isCompleted)}
          className="mt-1"
        />
        <div className="flex-1">
          <div className="flex justify-between items-start">
            <CardTitle className={`text-lg ${isCompleted ? 'line-through text-muted-foreground' : ''}`}>
              {title}
            </CardTitle>
            <div className="flex space-x-1">
              {isShared && (
                <Badge variant="outline" className="ml-2">
                  Shared
                </Badge>
              )}
              <Badge className={getPriorityColor()}>
                {priority}
              </Badge>
            </div>
          </div>
          {description && (
            <p className={`text-sm mt-1 ${isCompleted ? 'line-through text-muted-foreground' : ''}`}>
              {description}
            </p>
          )}
          {dueDate && (
            <div className="flex items-center mt-1 text-xs text-muted-foreground">
              <Calendar className="h-3 w-3 mr-1" />
              {format(new Date(dueDate), "PPP")}
            </div>
          )}
        </div>
      </CardHeader>
      <CardFooter className="flex justify-between pt-2">
        <span className="text-xs text-muted-foreground">
          Updated {formattedDate}
        </span>
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