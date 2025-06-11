'use client'

import { useState, useEffect, useRef } from 'react';
import supabase from '@/lib/supabase';
import { useParams } from 'next/navigation';
import { v4 as uuidv4 } from 'uuid';

export default function Page() {
    const params = useParams();
    const pageId = params.slug;

    const [page, setPage] = useState<any>({});
    const [blocks, setBlocks] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [focusedBlock, setFocusedBlock] = useState<string | null>(null);

    const blockRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

    // Fetch page
    const getPageData = async () => {
        const { data, error } = await supabase.from('pages').select('*').eq('id', pageId).single();
        if (error) {
            console.error('Error fetching page:', error);
            return null;
        }
        setLoading(false);
        return data;
    };

    // Fetch blocks
    const getBlocks = async () => {
        const { data, error } = await supabase
            .from('blocks')
            .select('*')
            .eq('page_id', pageId)
            .order('position', { ascending: true });

        if (error) {
            console.error('Error fetching blocks:', error);
            return;
        }

        setBlocks(data);
    };

    // Add a block after current block
    const addBlock = async (afterBlockId?: string) => {
        const newBlock = {
            id: uuidv4(),
            page_id: pageId,
            type: 'paragraph',
            content: { text: '' },
            position: 0, // Will be set below
        };

        // Calculate new block position
        let newBlocks = [...blocks];
        let insertIndex = blocks.length;

        if (afterBlockId) {
            const currentIndex = blocks.findIndex((b) => b.id === afterBlockId);
            insertIndex = currentIndex + 1;
        }

        newBlock.position = insertIndex;

        // Update positions of blocks after insertIndex
        newBlocks = newBlocks.map((b, i) => ({
            ...b,
            position: i >= insertIndex ? i + 1 : b.position,
        }));

        const updates = newBlocks.map(({ id, position }) => ({ id, position }));

        // Send position updates to DB
        await Promise.all(
            updates.map((update) =>
                supabase.from('blocks').update({ position: update.position }).eq('id', update.id)
            )
        );

        // Insert new block
        const { error } = await supabase.from('blocks').insert(newBlock);
        if (error) {
            console.error('Error inserting block:', error);
            return;
        }

        await getBlocks();

        // Slight delay to allow DOM to update before focusing
        setTimeout(() => {
            blockRefs.current[newBlock.id]?.focus();
        }, 10);
    };

    const updateBlock = async (id: string, newText: string) => {
        await supabase.from('blocks').update({ content: { text: newText } }).eq('id', id);
    };

    useEffect(() => {
        const load = async () => {
            const pageData = await getPageData();
            if (pageData) setPage(pageData);
            await getBlocks();
        };
        load();
    }, [pageId]);

    return (
        <div>
            {loading && <p>Loading...</p>}

            <div className="header">
                <div className="border-b border-gray-300 p-4 flex items-center justify-between">
                    <h1
                        className="text-6xl font-bold text-gray-700"
                        contentEditable
                        suppressContentEditableWarning
                        onBlur={async (e) => {
                            const newTitle = e.currentTarget.textContent;
                            if (newTitle && newTitle !== page.title) {
                                await supabase.from('pages').update({ title: newTitle }).eq('id', pageId);
                                await getPageData();
                            }
                        }}
                    >
                        {page.title || ''}
                    </h1>
                    <p className="text-gray-500">
                        Created on: {new Date(page.created_at).toLocaleDateString()}
                    </p>
                </div>

                {/* 🔥 Dozy Block Editor */}
                <div className="p-4 space-y-2">
                    {blocks.map((block) => (
                        <div
                            key={block.id}
                            ref={(el) => { blockRefs.current[block.id] = el; }}
                            contentEditable
                            suppressContentEditableWarning
                            className={`
                                px-3 py-2 
                                focus:outline-none 
                                transition-all duration-500
                                relative
                                empty:before:content-[attr(data-placeholder)]
                                before:text-gray-400
                                before:absolute
                                before:pointer-events-none
                                ${!focusedBlock === block.id && 'before:opacity-0'}
                            `}
                            data-placeholder="Start typing here"
                            onFocus={() => setFocusedBlock(block.id)}
                            onBlur={(e) => {
                                setFocusedBlock(null);
                                updateBlock(block.id, e.currentTarget.textContent || '');
                            }}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && !e.shiftKey) {
                                    e.preventDefault();
                                    addBlock(block.id); // Insert after current
                                }

                                const isEmpty = e.currentTarget.textContent === '';
                                const isBackspace = e.key === 'Backspace';

                                if (isBackspace && isEmpty) {
                                    e.preventDefault();

                                    const currentIndex = blocks.findIndex((b) => b.id === block.id);
                                    const prevBlock = blocks[currentIndex - 1];

                                    // Don't delete the very first block (optional)
                                    if (!prevBlock) return;

                                    // Delete current block
                                    const deleteBlock = async () => {
                                        await supabase.from('blocks').delete().eq('id', block.id);
                                        await getBlocks();

                                        // Delay & then focus previous block
                                        setTimeout(() => {
                                            const prevRef = blockRefs.current[prevBlock.id];
                                            prevRef?.focus();

                                            // Place caret at end of prev block
                                            const range = document.createRange();
                                            const sel = window.getSelection();
                                            if (prevRef?.childNodes[0] && sel) {
                                                range.selectNodeContents(prevRef);
                                                range.collapse(false);
                                                sel.removeAllRanges();
                                                sel.addRange(range);
                                            }
                                        }, 10);
                                    };

                                    deleteBlock();
                                }
                            }
                            }
                        >
                            {block.content?.text || ''}
                        </div>
                    ))}

                    {/* Optional Add Block Button */}
                    <button
                        onClick={() => addBlock()}
                        className="mt-4 text-sm text-indigo-600 hover:underline"
                    >
                        + Add block
                    </button>
                </div>
            </div>
        </div>
    );
}
