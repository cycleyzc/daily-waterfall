import { dateFormat } from './../constants/date'
export const formatDate = (format: dateFormat, time?: number): string => {
  const timestamp: number = time || Date.now()
  const date = new Date(timestamp)
  const dateArr = [date.getFullYear(), date.getMonth() + 1, date.getDate()]
  let target: string
  switch (format) {
    case dateFormat.EN_YMD:
      target = dateArr.join('-')
      break
    case dateFormat.CN_YMD:
      target = `${dateArr[0]}年${dateArr[1]}月${dateArr[2]}日`
      break
    case dateFormat.EN_MD:
      target = dateArr.slice(1, 3).join('-')
      break
    case dateFormat.CN_MD:
      target = `${dateArr[1]}月${dateArr[2]}日`
      break
  }

  return target
}
