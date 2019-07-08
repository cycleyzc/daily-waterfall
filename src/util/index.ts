const randomColor = require('randomcolor')

// 随机颜色的配置项
type rdType = {
  count?: number
  luminosity?: string
  hue?: string
  format?: string
  alpha?: number
}

const defaultColorOption: rdType = {
  count: 10,
  luminosity: 'light',
  hue: 'random'
}

/**
 * 生成随机颜色
 * @param {rdType} options 配置
 * @returns {Array}
 */
export const rdColor = (options: rdType): string[] => {
  const newOption = options
    ? Object.assign({}, defaultColorOption, options)
    : defaultColorOption
  const colors = randomColor(newOption)
  return colors
}
