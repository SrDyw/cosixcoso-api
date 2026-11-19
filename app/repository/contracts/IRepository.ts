export default interface IRepository<T> {
    all(): Promise<T[]>;
    filter(filter: any): Promise<T[] | null>
    find(id: number): Promise<T | null>;
    create(article: T): Promise<T | undefined>;
    remove(id:number): Promise<boolean>;
    count() : Promise<number>;
}