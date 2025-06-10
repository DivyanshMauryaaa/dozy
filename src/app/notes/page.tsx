'use client';

import { useSession } from '@/components/SessionProvider';
import { useTheme } from '@/context/ThemeContext';
import supabase from '@/lib/supabase';
import { Trash2 } from 'lucide-react';
import { useEffect, useState, useRef } from 'react';
import { MarkdownRenderer } from '@/components/RichText/markdown/rendererComp';
import dynamic from 'next/dynamic';

// Dynamic import to avoid SSR issues
const CustomizableRemirrorEditor = dynamic(
  () => import('./editor/editor'),
  { 
    ssr: false,
    loading: () => <div className="animate-pulse bg-gray-100 h-32 rounded-lg">Loading editor...</div>
  }
);

// Import the ref type
import type { RemirrorEditorRef } from './editor/editor';

interface Note {
    id: string;
    title: string;
    content: string; // Plain text for search/preview
    rich_content?: any; // JSONB for rich editor content
    content_type?: 'text' | 'rich'; // Track content type
    created_at: string;
    user_id: string;
    label?: string;
    color?: string;
    pinned?: boolean;
    category?: string;
    updated_at?: string;
    is_pinned?: boolean;
    is_archived?: boolean;
}

const Notes = () => {
    const [notes, setNotes] = useState<Note[]>([]);
    const [selectedNote, setSelectedNote] = useState<Note | null>(null);
    const session = useSession();
    const user = session.user;
    const { colorScheme } = useTheme();

    // Dialog options for adding
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [newNoteTitle, setNewNoteTitle] = useState('');
    const [newNoteLabel, setNewNotelabel] = useState('');
    const [newNoteColor, setNewNoteColor] = useState('');
    const [newNotePinned, setNewNotePinned] = useState(false);
    const [newNoteCategory, setNewNoteCategory] = useState('');

    // Selected Note
    const [isEditing, setIsEditing] = useState(false);
    const [editedTitle, setEditedTitle] = useState('');
    const [editedContent, setEditedContent] = useState<any>();
    const [editedTextContent, setEditedTextContent] = useState('');

    // Loading and action states
    const [isLoading, setIsLoading] = useState(true);
    const [isDeleting, setIsDeleting] = useState<string | null>(null);
    const [isSaving, setIsSaving] = useState(false);
    const [isCreating, setIsCreating] = useState(false);

    // Editor ref
    const editorRef = useRef<RemirrorEditorRef>(null);

    const getNotes = async () => {
        setIsLoading(true);
        try {
            const { data, error } = await supabase.from('notes')
                .select('*')
                .order('created_at', { ascending: false })
                .eq('user_id', user?.id);

            if (error) throw error;
            setNotes(data || []);
        } catch (error) {
            console.error('Error fetching notes:', error);
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        if (user) {
            getNotes();
        }
    }, [user]);

    const handleNoteAdd = async () => {
        setIsCreating(true);

        try {
            const newNote = {
                title: newNoteTitle,
                content: "", // Plain text content
                rich_content: null, // Rich content starts as null
                content_type: 'text',
                user_id: user?.id,
                label: newNoteLabel,
                color: newNoteColor,
                is_pinned: newNotePinned,
                category: newNoteCategory,
            };

            const { error } = await supabase.from('notes').insert([newNote]);

            if (error) throw error;

            // Reset form
            setNewNoteTitle('');
            setNewNotelabel('');
            setNewNoteColor('');
            setNewNotePinned(false);
            setNewNoteCategory('');
            setIsDialogOpen(false);

            await getNotes(); // Refresh notes
        } catch (error) {
            console.error('Error creating note:', error);
        } finally {
            setIsCreating(false);
        }
    }

    // Handle edit mode
    const handleEditClick = () => {
        setIsEditing(true);
        setEditedTitle(selectedNote?.title || '');
        
        // Load rich content if available, otherwise use plain text
        if (selectedNote?.rich_content && selectedNote?.content_type === 'rich') {
            setEditedContent(selectedNote.rich_content);
            setEditedTextContent(selectedNote.content || '');
        } else {
            setEditedContent(selectedNote?.content || '');
            setEditedTextContent(selectedNote?.content || '');
        }
    };

    // Handle save
    const handleSave = async () => {
        if (!selectedNote) return;

        setIsSaving(true);

        try {
            const updateData: any = {
                title: editedTitle,
                content: editedTextContent || '', // Always save plain text for search
                updated_at: new Date().toISOString()
            };

            // Save rich content if we have it
            if (editedContent && typeof editedContent === 'object') {
                updateData.rich_content = editedContent;
                updateData.content_type = 'rich';
            } else {
                updateData.content_type = 'text';
            }

            const { error } = await supabase
                .from('notes')
                .update(updateData)
                .eq('id', selectedNote.id);

            if (error) throw error;

            // Update local state
            setSelectedNote({
                ...selectedNote,
                title: editedTitle,
                content: editedTextContent || '',
                rich_content: editedContent,
                content_type: typeof editedContent === 'object' ? 'rich' : 'text',
                updated_at: new Date().toISOString(),
            });
            
            setIsEditing(false);
            await getNotes(); // Refresh notes list
        } catch (error) {
            console.error('Error updating note:', error);
        } finally {
            setIsSaving(false);
        }
    };

    // Handle cancel edit
    const handleCancelEdit = () => {
        setIsEditing(false);
        setEditedTitle(selectedNote?.title || '');
        setEditedContent(selectedNote?.rich_content || selectedNote?.content || '');
        setEditedTextContent(selectedNote?.content || '');
        // Clear the editor
        if (editorRef.current) {
            editorRef.current.clear();
        }
    };

    const handleDelete = async (noteId: string, e: React.MouseEvent) => {
        e.stopPropagation();
        setIsDeleting(noteId);

        try {
            const { error } = await supabase
                .from('notes')
                .delete()
                .eq('id', noteId);

            if (error) throw error;

            // If the deleted note was selected, clear the selection
            if (selectedNote?.id === noteId) {
                setSelectedNote(null);
                setIsEditing(false);
            }
            await getNotes(); // Refresh notes list after deletion
        } catch (error) {
            console.error('Error deleting note:', error);
        } finally {
            setIsDeleting(null);
        }
    };

    // Helper function to get initial content for editor
    const getInitialEditorContent = () => {
        if (!selectedNote) return '';
        
        // If we have rich content, use that
        if (selectedNote.rich_content && selectedNote.content_type === 'rich') {
            return selectedNote.rich_content;
        }
        
        // Otherwise use plain text content
        return selectedNote.content || '';
    };

    // Loading component
    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {notes.length === 0 ? (
                <div className="flex items-center justify-center h-screen">
                    <div className="text-center text-gray-500">
                        <p className="text-xl">No notes found.</p>
                        <p className="mt-2">Start creating your first note!</p>
                    </div>
                </div>
            ) : (
                <div className="flex h-screen overflow-hidden">
                    {/* Sidebar */}
                    <div className="w-80 bg-white border-r border-gray-200 overflow-y-auto">
                        <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                            <h1 className="text-xl font-semibold text-gray-800">Your Notes</h1>
                            <button
                                onClick={() => setIsDialogOpen(!isDialogOpen)}
                                className="px-4 py-2 rounded-lg text-white"
                                style={{ backgroundColor: colorScheme.primary }}
                                disabled={isCreating}
                            >
                                {isCreating ? 'Creating...' : 'Add'}
                            </button>
                        </div>

                        {/* Add Note Form */}
                        {isDialogOpen && (
                            <div className='p-3 flex flex-col space-y-2 text-black border-b border-gray-200'>
                                <input 
                                    type="text"
                                    value={newNoteTitle}
                                    placeholder='Note Title'
                                    className="border border-gray-300 rounded-lg p-2 focus:outline-none focus:border-blue-500"
                                    onChange={(e) => setNewNoteTitle(e.target.value)}
                                />
                                <select
                                    className="border border-gray-300 rounded-lg p-2 focus:outline-none focus:border-blue-500"
                                    value={newNoteCategory}
                                    onChange={(e) => setNewNoteCategory(e.target.value)}
                                >
                                    <option value="">Select Category</option>
                                    <option value="work">Work</option>
                                    <option value="personal">Personal</option>
                                    <option value="ideas">Ideas</option>
                                </select>
                                <input 
                                    type="text"
                                    placeholder='Note Label'
                                    className="border border-gray-300 rounded-lg p-2 focus:outline-none focus:border-blue-500"
                                    value={newNoteLabel}
                                    onChange={(e) => setNewNotelabel(e.target.value)}
                                />
                                <div className="flex items-center gap-2">
                                    <label className="text-sm">Pinned:</label>
                                    <input 
                                        type="checkbox"
                                        checked={newNotePinned}
                                        onChange={(e) => setNewNotePinned(e.target.checked)}
                                    />
                                </div>

                                <div className='flex items-center gap-2'>
                                    <div 
                                        className="w-8 h-8 rounded border"
                                        style={{
                                            backgroundColor: newNoteColor || colorScheme.background,
                                        }}
                                    ></div>
                                    <input 
                                        type="color"
                                        value={newNoteColor}
                                        onChange={(e) => setNewNoteColor(e.target.value)}
                                        className="border border-gray-300 rounded p-1 h-8 w-16"
                                    />
                                </div>

                                <button
                                    onClick={handleNoteAdd}
                                    className="px-4 py-2 rounded-lg text-white disabled:opacity-50"
                                    style={{ backgroundColor: colorScheme.primary }}
                                    disabled={isCreating || !newNoteTitle.trim()}
                                >
                                    {isCreating ? 'Creating...' : 'Create New Note'}
                                </button>
                            </div>
                        )}

                        {/* Notes List */}
                        <div className="p-3">
                            {notes.map((note) => (
                                <div
                                    key={note.id}
                                    onClick={() => setSelectedNote(note)}
                                    className={`p-3 mb-2 rounded-lg cursor-pointer border transition-colors hover:bg-gray-50 relative ${
                                        selectedNote?.id === note.id ? 'ring-2 ring-blue-200' : ''
                                    }`}
                                    style={{
                                        backgroundColor: selectedNote?.id === note.id ? colorScheme.background : undefined,
                                        borderColor: note.is_pinned ? colorScheme.accent : 'transparent',
                                    }}
                                >
                                    <div className='absolute top-2 right-2'>
                                        <Trash2 
                                            size={14} 
                                            className={`cursor-pointer text-red-500 hover:text-red-700 ${
                                                isDeleting === note.id ? 'animate-pulse' : ''
                                            }`} 
                                            onClick={(e) => handleDelete(note.id, e)}
                                        />
                                    </div>

                                    {note.color && (
                                        <div 
                                            className="w-3 h-3 rounded-full mb-2"
                                            style={{ backgroundColor: note.color }}
                                        ></div>
                                    )}

                                    <h2 className="font-medium text-gray-900 truncate pr-6">
                                        {note.title}
                                    </h2>
                                    <p className="mt-1 text-sm text-gray-500 truncate">
                                        {note.content}
                                    </p>
                                    <div className="mt-2 flex items-center justify-between">
                                        <p className="text-xs text-gray-400">
                                            {new Date(note.created_at).toLocaleDateString()}
                                            {note.updated_at && note.updated_at !== note.created_at && (
                                                <span className="ml-1">(edited)</span>
                                            )}
                                        </p>
                                        {note.content_type === 'rich' && (
                                            <span className="text-xs bg-blue-100 text-blue-600 px-1 rounded">Rich</span>
                                        )}
                                    </div>
                                    {note.category && (
                                        <span className="inline-block mt-1 px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded">
                                            {note.category}
                                        </span>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="flex-1 overflow-y-auto">
                        {selectedNote ? (
                            <div className="p-8 max-w-4xl mx-auto">
                                {isEditing ? (
                                    <div className="space-y-4">
                                        <input
                                            type="text"
                                            value={editedTitle}
                                            onChange={(e) => setEditedTitle(e.target.value)}
                                            className="w-full text-3xl font-bold border-b border-gray-200 focus:outline-none focus:border-blue-500 pb-2 bg-transparent"
                                            placeholder="Note title..."
                                        />
                                        
                                        <div className="flex justify-end space-x-4">
                                            <button
                                                onClick={handleCancelEdit}
                                                className="px-4 py-2 rounded-lg text-gray-600 hover:bg-gray-100"
                                                disabled={isSaving}
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                onClick={handleSave}
                                                className="px-4 py-2 rounded-lg text-white disabled:opacity-50"
                                                style={{ backgroundColor: colorScheme.primary }}
                                                disabled={isSaving || !editedTitle.trim()}
                                            >
                                                {isSaving ? 'Saving...' : 'Save'}
                                            </button>
                                        </div>

                                        <div className="border rounded-lg overflow-hidden">
                                            <CustomizableRemirrorEditor 
                                                ref={editorRef}
                                                initialContent={getInitialEditorContent()}
                                                placeholder="Start writing your note..."
                                                onChange={setEditedContent}
                                                onTextChange={setEditedTextContent}
                                                minHeight={400}
                                            />
                                        </div>
                                    </div>
                                ) : (
                                    <div>
                                        <div className="flex justify-between items-start mb-4">
                                            <div>
                                                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                                                    {selectedNote.title}
                                                </h1>
                                                <div className="flex items-center gap-4 text-sm text-gray-500">
                                                    <span>Created {new Date(selectedNote.created_at).toLocaleString()}</span>
                                                    {selectedNote.updated_at && selectedNote.updated_at !== selectedNote.created_at && (
                                                        <span>Last edited {new Date(selectedNote.updated_at).toLocaleString()}</span>
                                                    )}
                                                    {selectedNote.category && (
                                                        <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">
                                                            {selectedNote.category}
                                                        </span>
                                                    )}
                                                    {selectedNote.content_type === 'rich' && (
                                                        <span className="px-2 py-1 bg-blue-100 text-blue-600 rounded text-xs">
                                                            Rich Content
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                            <button
                                                onClick={handleEditClick}
                                                className="px-4 py-2 rounded-lg text-white"
                                                style={{ backgroundColor: colorScheme.primary }}
                                            >
                                                Edit
                                            </button>
                                        </div>
                                        
                                        <div className="prose prose-blue max-w-none">
                                            {selectedNote.content ? (
                                                <MarkdownRenderer>
                                                    {selectedNote.content}
                                                </MarkdownRenderer>
                                            ) : (
                                                <p className="text-gray-500 italic">This note is empty. Click Edit to add content.</p>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="flex items-center justify-center h-full text-gray-500">
                                <div className="text-center">
                                    <p className="text-xl mb-2">Select a note to view its contents</p>
                                    <p className="text-sm">Choose a note from the sidebar to start reading or editing</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

export default Notes;