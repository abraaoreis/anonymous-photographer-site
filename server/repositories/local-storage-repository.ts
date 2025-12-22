import { IStorageRepository } from "./interfaces/storage-repository.interface"

export class LocalStorageRepository implements IStorageRepository {
    async upload(name: string, file: File): Promise<string> {
        // Simulação de upload local para desenvolvimento
        // Em uma implementação real, salvaria no sistema de arquivos ou /public
        console.log(`[LocalStorage] Simulando upload de: ${name}`)
        return `/uploads/${name}`
    }
}
