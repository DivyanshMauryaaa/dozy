'use client'
import { Plus, Trash2 } from 'lucide-react';
import { useState, useEffect } from 'react';

import supabase from '@/lib/supabase';
import { useSession } from '@/components/SessionProvider';
import { useTheme } from '@/context/ThemeContext';
import Link from 'next/link';

const Pages = () => {
    const session = useSession();
    const user = session?.user;
    const { colorScheme } = useTheme();

    const [pages, setPages] = useState<any>([]);
    const [loading, setLoading] = useState(false);
    const [fetchError, setFetchError] = useState<string | null>(null);

    const fetchPages = async () => {
        setLoading(true);

        if (!user) setFetchError('You must be logged in to view pages.');

        const { data: pages, error } = await supabase.from('pages').select('*').eq('user_id', user?.id);
        if (error) { setFetchError('Failed to fetch pages. Please try again later.'); console.log(error); }

        if (!error) setPages(pages);
        setLoading(false);

    }

    useEffect(() => {
        if (user) {
            fetchPages();
        }
    }, [user])

    const handleAddPage = async () => {
        const { error } = await supabase.from('pages').insert({
            title: 'Untitled',
            user_id: user?.id,
        })

        if (error) {
            setFetchError('Failed to create a new page. Please try again later.');
            console.log(error);
        }

        // Fetch pages again to update the list
        fetchPages();
    }

    const handleDeletePage = async (id: string) => {
        const { error } = await supabase.from('pages').delete().eq('id', id).eq('user_id', user?.id);

        if (error) {
            setFetchError('Failed to delete the page. Please try again later.');
            console.log(error);
        }

        fetchPages();
    }


    return (
        <div className="">
            <p className="text-7xl font-bold mb-4 text-center text-gray-700">Pages</p>
            {/* <button className='px-6 py-3 text-gray-500 cursor-pointer border hover:border-gray-300 rounded-xl transition-all duration-150'>New Page</button> */}

            {/* Error handeling from client side... */}
            {fetchError && (
                <p className="text-red-600 text-center mt-4">{fetchError}</p>
            )}

            <div className="m-auto w-[50%] p-4 border border-gray-300 rounded-lg min-h-[500px] max-h-[800px] overflow-y-auto">
                <div className="mb-4 flex justify-between">
                    <p className='text-2xl font-semibold text-gray-800'>Your Pages</p>
                    <button
                        className='px-6 text-gray-500 hover:underline flex gap-2 cursor-pointer transition-all duration-150'
                        onClick={handleAddPage}
                    >
                        <Plus size={22} />New Page
                    </button>
                </div>
                <div className="space-y-4">

                    {loading && (
                        <p>Loading...</p>
                    )}

                    {pages.map((page: any) => (
                        <Link key={page.id} href={`/page/${page.id}`} className="block">

                            <div className="flex cursor-pointer items-center justify-between p-4 bg-white shadow rounded-lg hover:shadow-md transition-shadow duration-150">
                                <span className="text-gray-700">{page.title}</span>

                                {/* Delete Icon */}
                                <button className="text-red-500 hover:text-red-700 transition-colors duration-150 flex gap-3">
                                    <Trash2 size={16}
                                        onClick={() => handleDeletePage(page.id)}
                                    />
                                </button>
                            </div>


                        </Link>
                    ))}

                </div>
            </div>
        </div>
    );
}

export default Pages;