export interface IStorageRepository {
    upload(name: string, file: File): Promise<string>
}
