export enum routePos {
  L = 'left',
  R = 'right'
}

export enum itemFilterDesc {
  COM = '合并数据',
  FIL = '组合筛选'
}

export enum chartConditionName {
  CFPM = 'categoryFeePerMonth', // 按月显示各分类的金额
  CFPY = 'categoryFeePerYear', // 按年显示各分类的总金额
  FPD = 'feePerDay', // 按月显示每天的金额
  FPM = 'feePerMonth', // 按年显示每月的金额
  FPC = 'feePerCategory' // 按分类显示每月的金额
}
