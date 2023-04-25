import * as core from '@actions/core'
import ts from 'typescript'
import {calculateHalstead} from './halstead'
import {calculateComplexity} from './complexity'
import mergeWith from 'lodash.mergewith'
import {HalsteadMetrics} from './types'

type ComplexityResult = {
  source: string
  metrics: Record<string, HalsteadMetrics & {complexity: number}>
}
// current support only ts
export async function analyzeTypeScript(
  sourceFiles: string[],
  scriptTarget: ts.ScriptTarget
): Promise<ComplexityResult[]> {
  const metrics = []
  for (const filename of sourceFiles) {
    const halsteadMetrics = await calculateHalstead(
      filename,
      scriptTarget || ts.ScriptTarget.ES2018
    )
    const complexityMeasure = await calculateComplexity(
      filename,
      scriptTarget || ts.ScriptTarget.ES2018
    )
    const result = mergeWith(halsteadMetrics, complexityMeasure)

    metrics.push({
      source: filename,
      metrics: result
    })
  }

  return metrics
}
