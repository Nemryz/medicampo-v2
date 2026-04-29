/**
 * IRepository<T>
 * 
 * I - Interface Segregation: Define un contrato genérico mínimo para repositorios.
 * D - Dependency Inversion: Las capas superiores dependen de esta abstracción, no de implementaciones concretas.
 */
export interface IRepository<T> {
    findById(id: number): Promise<T | null>;
    findAll(): Promise<T[]>;
    create(data: Partial<T>): Promise<T>;
    update(id: number, data: Partial<T>): Promise<T>;
    delete(id: number): Promise<T>;
}
