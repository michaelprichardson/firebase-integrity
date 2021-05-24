interface BaseRule {
  name: string
  path: string
}

interface IncrementStaticRule extends BaseRule {
  incrementField: string
}

declare function isIncrementStaticRule(x: any): x is IncrementStaticRule

interface IncrementWhereRule extends BaseRule {
  incrementField: string
  where: {
    fieldPath: string
    operation: string
    value: any
  }
}

declare function isIncrementWhereRule(x: any): x is IncrementWhereRule