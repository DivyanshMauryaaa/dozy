'use client';

import { useSession } from '@/components/SessionProvider';
import supabase from '@/lib/supabase';
import { useEffect, useState } from 'react'; 

const Notes = () => {
    const [notes, setNotes] = useState<any>([]);
    const session = useSession();

    const user = session.user;

    const GetNotesFromDb = async () => {
        const { data: recievedNotes, error } = await supabase.from('notes')
            .select('*')
            .order('created_at', { ascending: false })
            .eq('user_id', user?.id);

        if (error) {
            throw error;
        }

        setNotes(recievedNotes);
    }

    useEffect(() => {
        if (user) {
            GetNotesFromDb();
        }
    }, [user]);

    return (
        <div>
            {notes.length === 0 && (
                <div className="text-center text-gray-500 mt-10">
                    No notes found. Start creating your first note!
                </div>
            )}
        </div>
    )
}

export default Notes;