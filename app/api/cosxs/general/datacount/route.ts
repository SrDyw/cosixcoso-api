import { Journals } from "@/app/repository/contracts/JournalRepository";
import { NextRequest, NextResponse } from "next/server";

type DataCountReponse = {
    journal: number,
    events: number,
    todos: number,
}


export  const GET = async (request : NextRequest) => {
    const journalCount = await Journals.count();
    
    return NextResponse.json({
        journal: journalCount
    });
}