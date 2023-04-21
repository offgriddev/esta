import core from '@actions/core'
import tscomplex from 'ts-complex'

type ComplexityResult = {source: string; complexity: number}
// current support only ts
export function analyzeTypeScript(sourceFiles: string[]): ComplexityResult[] {
  const metrics = []
  for (const file of sourceFiles) {
    const halstead = tscomplex.calculateCyclomaticComplexity(file)
    const complexity = halstead[Object.keys(halstead)[0]] || 0

    core.info(`${file}: ${complexity}`)
    metrics.push({
      source: file,
      complexity
    })
  }

  return metrics
}
