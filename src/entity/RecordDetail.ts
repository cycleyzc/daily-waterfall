import Dexie from 'dexie'
import { itemCategories } from '@/constants/category'
import Notebook from './Notebook'
interface RecordDetailField {
  id?: number
  name?: string
  note?: string
  timestamp: number
  category: itemCategories
  income: number
  expense: number
  parentID: number
}

class RecordDetail extends Dexie {
  public recordDetail: Dexie.Table<RecordDetailField, number>
  // public recordDetail: Dexie.Table<any, any>
  constructor () {
    super('RecordDetail')
    this.version(1).stores({
      detail: '++id, name, note, timestamp, category, income, expense, parentID'
    })
    this.recordDetail = this.table('detail')
  }

  /**
   * 新增条目
   */
  public async addNewItem ({
    name,
    note,
    date,
    category,
    income,
    expense,
    parentID
  }): Promise<number> {
    let timestamp: number
    timestamp = date instanceof Date ? date.getTime() : date
    const item: RecordDetailField = {
      name,
      note,
      category,
      income,
      expense,
      parentID,
      timestamp
    }
    const id = await this.recordDetail.add(item)
    const count = await this.recordDetail
      .where({ parentID: String(parentID) })
      .count()

    const nb = new Notebook()
    const result = await nb.changeCount(parseInt(parentID), count)
    console.log('count result', result)
    return id
  }

  /**
   * 根据账本id查询所有条目
   * @param parentID 账本id
   */
  public async queryAllByNotebook (parentID: number): Promise<any> {
    const data = await this.recordDetail
      .where({ parentID: String(parentID) })
      .toArray()
    return data
  }

  /**
   * 修改条目
   * @param id 条目id
   * @param item 需要修改的字段
   */
  public async updateField (id: number, item: any): Promise<any> {
    const data = await this.recordDetail.update(id, item)
    if (data) {
      return true
    } else {
      return false
    }
  }

  /**
   * 删除条目
   * @param id 条目id, 如果存在条目id, 删除单条条目, 否则, 删除账本id下的所有条目
   * @param parentID 账本id
   */
  public async removeItem ({
    id,
    parentID
  }: {
  id?: number
  parentID: any
  }): Promise<any> {
    if (id) {
      const result = await this.recordDetail.delete(id)
      const count = await this.recordDetail
        .where({ parentID: String(parentID) })
        .count()
      const nb = new Notebook()
      const rc = await nb.changeCount(parseInt(parentID), count)
      return result
    } else if (parentID) {
      const items = await this.queryAllByNotebook(parentID)
      const itemIDs = items.map(v => v.id)
      const result = await this.recordDetail.bulkDelete(itemIDs)
      const nb = new Notebook()
      const rc = await nb.changeCount(parseInt(parentID), 0)
      return result
    } else {
      return null
    }
  }
}

export default RecordDetail
