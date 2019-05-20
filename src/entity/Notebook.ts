import Dexie from 'dexie'
import { bookCategories } from './../constants/category'
import RecordDetail from './RecordDetail'

interface NotebookField {
  id?: number
  name: string
  type: bookCategories
  createdAt: number
  updatedAt: number
  // 笔数
  count: number
}

class NoteBook extends Dexie {
  public notebooks: Dexie.Table<NotebookField, number>
  constructor () {
    super('NoteBook')
    this.version(1).stores({
      books: '++id, name, createdAt, updatedAt, count'
    })
    this.notebooks = this.table('books')
  }

  public async createNewBook (
    name: string,
    type: bookCategories = bookCategories.NORMAL
  ): Promise<object> {
    const book = {
      name: name,
      type: type,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      count: 0
    }
    const id = await this.notebooks.add(book)
    return Object.assign({ id: id }, book)
  }

  public async queryAll (): Promise<any> {
    const data = await this.notebooks.toArray()
    return data
  }

  public async changeCount (id: number, count: number): Promise<boolean> {
    const result = await this.notebooks.update(id, {
      count: String(count)
    })
    if (result) {
      return true
    } else {
      return false
    }
  }

  public async removeOldBook (id: number): Promise<any> {
    const result = await this.notebooks.delete(id)
    console.log('removeOldBook', result)
    const recordRetail = new RecordDetail()
    await recordRetail.removeItem({ parentID: id })
    return result
  }

  public async updateField (id: number, info: any) {
    const result = await this.notebooks.update(id, info)
    return result === 1
  }
}

export default NoteBook
