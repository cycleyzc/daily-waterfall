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
  year?: number
  month?: number
  day?: number
}

interface QueryCon {
  parentID: string
  year?: any
  month?: any
  [key: string]: any
}

class RecordDetail extends Dexie {
  public recordDetail: Dexie.Table<RecordDetailField, number>
  // public recordDetail: Dexie.Table<any, any>
  constructor () {
    super('RecordDetail')
    this.version(1).stores({
      detail:
        '++id, name, note, timestamp, category, income, expense, parentID, year, month, day'
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
    const itemDate = new Date(item.timestamp)
    item.year = itemDate.getFullYear()
    item.month = itemDate.getMonth() + 1
    item.day = itemDate.getDate()
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
   * @param date 日期对象, exp: {year: '', month: ''}
   */
  public async queryAllByNotebook (parentID: number, date?: any): Promise<any> {
    let query: QueryCon = { parentID: '' }
    query.parentID = String(parentID)
    date.hasOwnProperty('year') ? (query.year = date.year) : null
    date.hasOwnProperty('month') ? (query.month = date.month) : null
    const data = await this.recordDetail.where(query).toArray()
    return data
  }

  /**
   * 修改条目
   * @param id 条目id
   * @param item 需要修改的字段
   */
  public async updateField (id: number, item: any): Promise<any> {
    // 因为新加了字段, 为旧版本数据更新新字段的值
    if (item.hasOwnProperty('timestamp')) {
      const itemDate = new Date(item.timestamp)
      item.year = itemDate.getFullYear()
      item.month = itemDate.getMonth() + 1
      item.day = itemDate.getDate()
    }
    const data = await this.recordDetail.update(id, item)
    console.log('updateField', id, item, data)
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

  public async syncField () {
    const data = await this.recordDetail.toArray()
    for (let i = 0; i < data.length; i++) {
      // 更新新加的年月日字段
      if (!data[i].hasOwnProperty('year') || !data[i].year) {
        const result = await this.updateField(data[i].id, data[i])
      }
    }
  }
}

export default RecordDetail
