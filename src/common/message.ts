export enum MSG_TEMPLATE {
  S = '成功',
  F = '失败',
  DEL_BOOK_S = '账本:${bookName}已删除',
  DEL_BOOK_F = '账本:${bookName}删除失败',
  NEW_BOOK_S = '成功新增账本:${bookName}',
  NEW_BOOK_F = '新增账本失败'
}

/**
 * 拼接完整信息, 把template字符串里的${}值替换成data对象里的值
 * @param {String} template 模板(对应枚举MSG)
 * @param {Object} data 拼接的字段
 * @returns {String}
 */
export const renderSentence = (template: string, data: any = {}): string => {
  if (!data || Object.keys(data).length === 0) {
    return template
  } else {
    let result = template
    template.match(/\${\S*}/g).forEach(v => {
      let source = JSON.parse(JSON.stringify(data))
      v.match(/[A-Za-z0-9]*/gi)
        .filter(v => v)
        .forEach(val => {
          source = source[val]
        })
      result = result.replace(v, source)
    })
    return result
  }
}
