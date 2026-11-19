import { QuestionAnswer } from "@/app/types/cosxs";
import IRepository from "./IRepository";
import { SimpleORM } from "@/app/_libs/simpleORM";
import { prisma } from "@/libs/prisma";
import { wait } from "@/app/_libs/promiseUtils";

export default class QuestionAnswerRepository implements IRepository<QuestionAnswer> {
    private _answers: SimpleORM<QuestionAnswer>;     
    private _development: boolean;
    
    constructor() {
        this._answers = new SimpleORM<QuestionAnswer>("cosxs_qanswer");      
        this._development = true && process.env.NODE_ENV == "development";    
    }

    async all(): Promise<QuestionAnswer[]> {
        throw new Error("Method not implemented.");
    }

    
    async filter(filter: any): Promise<QuestionAnswer[] | null> {
        if (this._development) {
            return (await this._answers.all()).filter(
                (x) =>
                (filter.id == undefined || x.id == filter.id) &&
                (filter.question_id == undefined || x.question_id == filter.question_id) &&
                (filter.cid == undefined || x.couple_id == filter.cid)
            );
        }
        var f: any = {};

        if (filter.cid != undefined) f["couple_id"] = filter.cid;
        if (filter.question_id != undefined) f["question_id"] = filter.question_id;
        if (filter.id != undefined) f["id"] = filter.id;

        return await prisma.questionAnswer.findMany({
        where: f,
        });
    }
    async create(
        anwserData: Omit<QuestionAnswer, "id" | "created_at">
    ): Promise<QuestionAnswer | undefined> {
        try {
        const now = new Date().toISOString().split("T")[0];
          if (this._development) {
            await wait(1000);
            const answerWithDates = {
              ...anwserData,
              created_at: now,
            } as QuestionAnswer;
            return await this._answers.create(answerWithDates);
          }
    
          return await prisma.questionAnswer.create({
            data: {
              message: anwserData.message,
              user_id: anwserData.user_id || null,
              couple_id: anwserData.couple_id || null,
              created_at: now,
              question_id: anwserData.question_id
            },
          });
        } catch (ex) {
          console.error("Error creating answer:", ex);
          return undefined;
        }
      }
    
    
    find(id: number): Promise<QuestionAnswer | null> {
        throw new Error("Method not implemented.");
    }
    
  async remove(id: number): Promise<boolean> {
    if (this._development) {
      return await this._answers.remove(id);
    }

    try {
      const data = await prisma.questionAnswer.delete({
        where: { id },
      });
      return data != null;
    } catch (ex) {
      console.error("Error deleting answer:", ex);
      return false;
    }
  }


}

export const QuestionRepository : IRepository<QuestionAnswer> = new QuestionAnswerRepository();