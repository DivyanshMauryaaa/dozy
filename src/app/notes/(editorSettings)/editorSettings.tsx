import { BaseEditor, Descendant } from 'slate'
import { ReactEditor } from 'slate-react'
import { HistoryEditor } from 'slate-history'

export type CustomElementType =
    | 'paragraph'
    | 'block-quote'
    | 'heading-one'
    | 'heading-two'
    | 'list-item'
    | 'numbered-list'
    | 'bulleted-list'

export type CustomText = {
    text: string
    bold?: boolean
    italic?: boolean
    underline?: boolean
    code?: boolean
}

export type CustomTextKey = keyof Omit<CustomText, 'text'>

export type CustomElement = {
    type: CustomElementType
    children: Descendant[]
}

export type CustomElementWithAlign = CustomElement & {
    align?: 'left' | 'center' | 'right' | 'justify'
}

export type CustomEditor = BaseEditor & ReactEditor & HistoryEditor

declare module 'slate' {
    interface CustomTypes {
        Editor: CustomEditor
        Element: CustomElement | CustomElementWithAlign
        Text: CustomText
    }
}