'use client';

import { useState, useEffect } from 'react';
import { useMutation, useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Search, Plus } from 'lucide-react';
import { NoteCard } from '@/components/notes/note-card';
import { NoteEditor } from '@/components/notes/note-editor';
import { authClient } from '@/lib/auth-client';

export default function NotesPageClient() {
  const { data } = authClient.useSession();
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [currentNote, setCurrentNote] = useState(null);

  const notes = useQuery(api.notes.list);
  const deleteNote = useMutation(api.notes.remove);
  const shareNote = useMutation(api.notes.addUserToShare);
  const userId = data?.user?.id as Id<"profile"> 
  const filteredNotes = notes?.filter(note =>
    note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    note.content.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const handleDelete = async (id: Id<'note'>) => {
    if (confirm('Are you sure you want to delete this note?')) {
      try {
        await deleteNote({ id });
        toast.success('Note deleted successfully');
      } catch (error) {
        console.error('Error deleting note:', error);
        toast.error('Failed to delete note');
      }
    }
  };

  const handleShare = async (id: Id<'note'>) => {
    try {
      // Get the user ID from somewhere (you'll need to implement this)
      await shareNote({ id, userId });
      toast.success('Note shared successfully');
    } catch (error) {
      console.error('Error sharing note:', error);
      toast.error('Failed to share note');
    }
  };

  const handleEdit = (id: Id<'note'>) => {
    const note = notes?.find(n => n._id === id);
    if (note) {
      setCurrentNote(note as any); // Type assertion to resolve type mismatch
      setIsEditDialogOpen(true);
    }
  };

  const handleView = (id: Id<'note'>) => {
    const note = notes?.find(n => n._id === id);
    if (note) {
      setCurrentNote(note as any); // Type assertion to handle type mismatch
      setIsEditDialogOpen(true);
    }
  };

  return (
    <div className="container mx-auto py-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-2xl">My Notes</CardTitle>
          <Button onClick={() => setIsAddDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" /> Add New Note
          </Button>
        </CardHeader>
        <CardContent>
          <div className="flex items-center py-4">
            <div className="relative max-w-sm">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                type="search"
                placeholder="Search notes..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredNotes.map((note) => (
              <NoteCard
                key={note._id}
                id={note._id}
                title={note.title}
                content={note.content}
                color={note.color}
                tags={note.tags}
                updatedAt={note._creationTime.toString()}
                isShared={note.isShared}
                onEdit={(id: string) => handleEdit(id as Id<"note">)}
                onDelete={(id: string) => handleDelete(id as Id<"note">)}
                onShare={(id: string) => handleShare(id as Id<"note">)}
                onView={(id: string) => handleView(id as Id<"note">)}
              />
            ))}
          </div>
        </CardContent>
      </Card>

      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent>
          <NoteEditor
            userId={'' as Id<"profile">}
            onSuccess={() => setIsAddDialogOpen(false)}
            onCancel={() => setIsAddDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <NoteEditor
            userId={'' as Id<"profile">}
            note={currentNote || undefined}
            onSuccess={() => setIsEditDialogOpen(false)}
            onCancel={() => setIsEditDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}