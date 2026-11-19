import { number } from "framer-motion";

export type JournalType = {
    id : number;
    emoji: number;
    description: string;
    date: string;
    user_id: string | null;
    couple_id: string | null;
}

export type EventType = {
    id?: number;
    title: string;
    description: string | null;
    start_date: string;  // VARCHAR en DB
    end_date: string;    // VARCHAR en DB
    color: string;
    user_id: string | null;
    created_at?: Date;
    couple_id: string | null;
}

export type MessageType = {
    id?: number;
    sender: string;
    message: string;
    created_at: string;
    couple_id: string | null ;
}

export type OperationResultResponse = {
    message: string;
    error: boolean;
}

// types/cosxs.ts
export type CharacterType = {
    id?: number;
    name: string;
    touches: number;
    emoji: number;
    gender: string;
    couple_id:string | null;
}

// types/cosxs.ts
export type TodoType = {
    id?: number;
    description?: string | null;
    completed: boolean;
    color: string; // 1: Alta, 2: Media, 3: Baja
    due_date?: string | null;
    user_id?: string | null;
    couple_id?: string | null;
    created_at: string;
    updated_at: string;
}

export type QuestionAnswer = {
    id?: number;
    message: string;
    user_id: string | null;
    created_at: string;
    question_id: number;
    couple_id?:  string | null;  
}

export type MediaType = {
    id?: number,
    key: string,
    url: string,
    url2: string | null,
    created_at?: string,
    couple_id: string | null,
    date: Date | null,
    date_string: string | null,
    description: string | null,
    ubication:string | null,
    public_id?:string | null,
}

export type ImageType = {
    id?: number,
    key: string,
    data: string,
    created_at:string,
    couple_id:string
}

export interface CloudinaryUploadResponse {
  asset_id: string;
  public_id: string;
  version: number;
  version_id: string;
  signature: string;
  width: number;
  height: number;
  format: string;
  resource_type: string;
  created_at: string;
  tags: string[];
  bytes: number;
  type: string;
  etag: string;
  placeholder: boolean;
  url: string;
  secure_url: string;
  folder: string;
  original_filename: string;
  api_key: string;
}
