'use client';

import { Editor } from '@/components/RichText/markdown/editor';
import { useSession } from '@/components/SessionProvider';
import { useTheme } from '@/context/ThemeContext';
import supabase from '@/lib/supabase';
import { Trash2 } from 'lucide-react';
import { useEffect, useState, useRef } from 'react';
import { MarkdownRenderer } from '@/components/RichText/markdown/rendererComp';

interface Note {
    id: string;
    title: string;
    content: string;
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

    //Dialog options for adding
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [newNoteTitle, setNewNoteTitle] = useState('');
    const [newNoteLabel, setNewNotelabel] = useState('');
    const [newNoteColor, setNewNoteColor] = useState('');
    const [newNotePinned, setNewNotePinned] = useState(false);
    const [newNoteCategory, setNewNoteCategory] = useState('');

    //selected Note
    const [selectedNoteId, setSelectedNoteId] = useState<string | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [editedTitle, setEditedTitle] = useState('');
    const [editedContent, setEditedContent] = useState('');

    // Loading and action states
    const [isLoading, setIsLoading] = useState(true);
    const [isDeleting, setIsDeleting] = useState<string | null>(null);
    const [isSaving, setIsSaving] = useState(false);
    const [isCreating, setIsCreating] = useState(false);

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

        //Add Notes
        const newNote = {
            title: newNoteTitle,
            content: "",
            user_id: user?.id,
            label: newNoteLabel,
            color: newNoteColor,
            is_pinned: newNotePinned,
            category: newNoteCategory,
        };

        const { error, data } = await supabase.from('notes')
            .insert([
                newNote
            ]);

        if (error) throw error;

        else if (!error) {
            setNewNoteTitle('');
            setNewNotelabel('');
            setNewNoteColor('');
            setNewNotePinned(false);
            setNewNoteCategory('');
            setIsDialogOpen(false);
        }

        getNotes();
        setIsCreating(false);
    }

    // Handle edit mode
    const handleEditClick = () => {
        setIsEditing(true);
        setEditedTitle(selectedNote?.title || '');
        setEditedContent(selectedNote?.content || '');
    };

    // Handle save
    const handleSave = async () => {
        if (!selectedNote) return;

        setIsSaving(true);

        const { error } = await supabase
            .from('notes')
            .update({
                title: editedTitle,
                content: editedContent,
                updated_at: new Date().toISOString()
            })
            .eq('id', selectedNote.id);

        if (error) {
            console.error('Error updating note:', error);
            setIsSaving(false);
            return;
        }

        // Update local state
        setSelectedNote({
            ...selectedNote,
            title: editedTitle,
            content: editedContent,
            updated_at: new Date().toISOString(),
        });
        setIsEditing(false);
        getNotes(); // Refresh notes list
        setIsSaving(false);
    };

    const handleDelete = async (noteId: string, e: React.MouseEvent) => {
        e.stopPropagation();
        setIsDeleting(noteId);

        const { error } = await supabase
            .from('notes')
            .delete()
            .eq('id', noteId);

        setIsDeleting(null);

        if (error) {
            console.error('Error deleting note:', error);
        } else {
            getNotes(); // Refresh notes list after deletion
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {notes.length === 0 && !isLoading ? (
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
                            >Add</button>
                        </div>
                        <br />

                        {/* Small Add section form */}

                        {isDialogOpen && (
                            <div className='p-3 flex flex-col space-y-2 text-black'>
                                <input type="text"
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
                                <input type="text"
                                    placeholder='Note Label'
                                    className="border border-gray-300 rounded-lg p-2 focus:outline-none focus:border-blue-500"
                                    value={newNoteLabel}
                                    onChange={(e) => setNewNotelabel(e.target.value)}
                                />
                                <div className="flex gap-2">
                                    Pinned:<input type="checkbox"
                                        value={newNotePinned.toString()}
                                        onChange={(e) => setNewNotePinned(e.target.checked)}
                                    />
                                </div>

                                <div className='flex gap-2'>
                                    <div style={{
                                        padding: '10px',
                                        paddingRight: '20px',
                                        borderRadius: '8px',
                                        backgroundColor: newNoteColor || colorScheme.background,
                                    }}></div>

                                    <input type="color"
                                        value={newNoteColor}
                                        onChange={(e) => setNewNoteColor(e.target.value)}
                                        className="border border-gray-300 rounded-lg p-2 focus:outline-none focus:border-blue-500"
                                    />
                                </div>

                                <button
                                    onClick={handleNoteAdd}
                                    className="px-4 py-2 rounded-lg text-white"
                                    style={{ backgroundColor: colorScheme.primary }}
                                >Create New Note</button>
                            </div>
                        )}

                        <div className="p-3">
                            {notes.map((note: any) => (
                                <div
                                    key={note.id}
                                    onClick={() => setSelectedNote(note)}
                                    className={`p-3 mb-2 rounded-lg cursor-pointer border transition-colors hover:bg-gray-50 border-transparent border`}
                                    style={{
                                        backgroundColor: selectedNote?.id === note.id ? (colorScheme.background) : undefined,
                                        borderColor: note.pinned ? colorScheme.accent : 'transparent',
                                    }}
                                >
                                    <div className='py-2'>

                                        <Trash2 size={14} className='cursor-pointer text-red-500' onClick={
                                            (e) => handleDelete(note.id, e)
                                        } />

                                    </div>

                                    {note.color && (
                                        <div className="w-[15px] h-[15px] rounded-full border-none"
                                            style={{
                                                backgroundColor: note.color || colorScheme.background
                                            }}
                                        ></div>
                                    )}

                                    <h2 className="font-medium text-gray-900 truncate">
                                        {note.title}
                                    </h2>
                                    <p className="mt-1 text-sm text-gray-500 truncate">
                                        {note.content}
                                    </p>
                                    <p className="mt-2 text-xs text-gray-400">
                                        {new Date(note.created_at).toLocaleDateString()}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="flex-1 overflow-y-auto">
                        {selectedNote ? (
                            <div className="p-8 max-w-3xl mx-auto">
                                {isEditing ? (
                                    <div className="space-y-4">
                                        <input
                                            type="text"
                                            value={editedTitle}
                                            onChange={(e) => setEditedTitle(e.target.value)}
                                            className="w-full text-3xl font-bold border-b border-gray-200 focus:outline-none focus:border-blue-500 pb-2"
                                            style={{ backgroundColor: 'transparent' }}
                                        />
                                        <div className="flex justify-end space-x-4">
                                            <button
                                                onClick={() => setIsEditing(false)}
                                                className="px-4 py-2 rounded-lg text-gray-600 hover:bg-gray-100"
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                onClick={handleSave}
                                                className="px-4 py-2 rounded-lg text-white"
                                                style={{ backgroundColor: colorScheme.primary }}
                                            >
                                                Save
                                            </button>
                                        </div>

                                        {/* <textarea
                                            value={editedContent}
                                            onChange={(e) => setEditedContent(e.target.value)}
                                            className="w-full h-[calc(100vh-300px)] p-4 rounded-lg focus:outline-none"
                                        />
                                         */}

                                        <div className="prose prose-blue max-w-none whitespace-pre-wrap">
                                            <Editor
                                                initialContent={editedContent}
                                                onChange={setEditedContent}
                                                className="w-full h-[calc(100vh-300px)] p-4 rounded-lg focus:outline-none"
                                            />
                                        </div>
                                    </div>
                                ) : (
                                    <div>
                                        <div className="flex justify-between items-center mb-4">
                                            <h1 className="text-3xl font-bold text-gray-900">
                                                {selectedNote.title}
                                            </h1>
                                            <button
                                                onClick={handleEditClick}
                                                className="px-4 py-2 rounded-lg text-white"
                                                style={{ backgroundColor: colorScheme.primary }}
                                            >
                                                Edit
                                            </button>
                                        </div>
                                        <p className="text-sm text-gray-500 mb-6">
                                            Created on {new Date(selectedNote.created_at).toLocaleString()}
                                        </p>
                                        <div className="prose prose-blue max-w-none whitespace-pre-wrap">
                                            <MarkdownRenderer>
                                                {selectedNote.content}
                                            </MarkdownRenderer>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="flex items-center justify-center h-full text-gray-500">
                                <p>Select a note to view its contents</p>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

export default Notes;