// app/utils/simple-orm.ts

import { query } from "./pg";

export class SimpleORM<T extends { id?: number }> {
    constructor(private tableName: string) {}

    // Método para ejecutar consultas SQL
    private async executeQuery(sql: string, params: any[] = []): Promise<any> {
        try {
            const result = await query(sql, params);
            return result;
        } catch (error) {
            console.error('Error en SimpleORM:', error);
            throw error;
        }
    }

    // Encontrar uno por ID
    async find(id: number): Promise<T | null> {
        const result = await this.executeQuery(
            `SELECT * FROM "${this.tableName}" WHERE id = $1`,
            [id]
        );
        return result.rows[0] as T || undefined;
    }

    // Encontrar varios con condiciones opcionales
    async findMany(conditions?: Partial<T>, limit?: number): Promise<T[]> {
        let sql = `SELECT * FROM "${this.tableName}"`;
        const params: any[] = [];
        
        if (conditions && Object.keys(conditions).length > 0) {
            const whereClauses = Object.keys(conditions).map((key, index) => {
                params.push((conditions as any)[key]);
                return `${key} = $${index + 1}`;
            });
            sql += ` WHERE ${whereClauses.join(' AND ')}`;
        }
        
        if (limit) {
            sql += ` LIMIT $${params.length + 1}`;
            params.push(limit);
        }
        
        const result = await this.executeQuery(sql, params);
        return result.rows as T[];
    }

    // Crear un nuevo registro
    async create(data: Omit<T, 'id'>): Promise<T> {
        const columns = Object.keys(data).join(', ');
        const placeholders = Object.keys(data)
            .map((_, index) => `$${index + 1}`)
            .join(', ');
        
        const values = Object.values(data);
        
        const sql = `
            INSERT INTO "${this.tableName}" (${columns})
            VALUES (${placeholders})
            RETURNING *
        `;
        
        const result = await this.executeQuery(sql, values);
        return result.rows[0] as T;
    }

    // Eliminar por ID
    async remove(id: number): Promise<boolean> {
        const result = await this.executeQuery(
            `DELETE FROM "${this.tableName}" WHERE id = $1 RETURNING id`,
            [id]
        );
        return result.rowCount > 0;
    }

    // Actualizar registro
    async update(id: number, data: Partial<T>): Promise<T | undefined> {
        const updates = Object.keys(data)
            .map((key, index) => `${key} = $${index + 2}`)
            .join(', ');
        
        const values = [id, ...Object.values(data as any)];
        
        const sql = `
            UPDATE "${this.tableName}" 
            SET ${updates}
            WHERE id = $1
            RETURNING *
        `;
        
        const result = await this.executeQuery(sql, values);
        return result.rows[0] as T || undefined;
    }

    // Obtener todos los registros (alias de findMany sin condiciones)
    async all(): Promise<T[]> {
        return this.findMany();
    }

    // Contar registros
    async count(conditions?: Partial<T>): Promise<number> {
        let sql = `SELECT COUNT(*) FROM "${this.tableName}"`;
        const params: any[] = [];
        
        if (conditions && Object.keys(conditions).length > 0) {
            const whereClauses = Object.keys(conditions).map((key, index) => {
                params.push((conditions as any)[key]);
                return `${key} = $${index + 1}`;
            });
            sql += ` WHERE ${whereClauses.join(' AND ')}`;
        }
        
        const result = await this.executeQuery(sql, params);
        return parseInt(result.rows[0].count);
    }
}