import ts from 'typescript'
import {readFile} from 'fs/promises'
import {calculateSloc} from './sloc.js'
import {calculateComplexity} from './complexity.js'
import {calculateHalstead} from './halstead.js'
import mergeWith from 'lodash.mergewith'
import omitBy from 'lodash.omitby'
import isNull from 'lodash.isnull'
import reduce from 'lodash.reduce'

export async function calculateMaintainability(filePath, target) {
  const file = await readFile(filePath)

  const perFunctionHalstead = await calculateHalstead(filePath, target)
  const perFunctionCyclomatic = await calculateComplexity(filePath, target)
  const sourceCodeLength = calculateSloc(file.toString())

  const customizer = (src, val) => {
    if (!!src && Object.keys(src).length !== 0 && !!val) {
      return {volume: src.volume, cyclomatic: val}
    }
    return null
  }
  const merged = mergeWith(perFunctionHalstead, perFunctionCyclomatic)
  const perFunctionMerged = omitBy(merged, isNull)

  const functions = Object.keys(perFunctionMerged)
  if (functions.length === 0) {
    return {averageMaintainability: -1, minMaintainability: -1}
  }

  const maximumMatrics = reduce(
    perFunctionMerged,
    (result, value) => {
      result.volume = Math.max(result.volume, value.volume)
      result.cyclomatic = Math.max(result.complexity, value.cyclomatic)
      return result
    },
    perFunctionMerged[functions[0]]
  )

  const averageMatrics = {cyclomatic: 0, volume: 0, n: 0}
  functions.forEach(aFunction => {
    const matric = perFunctionMerged[aFunction]
    averageMatrics.cyclomatic += matric.cyclomatic
    averageMatrics.volume += matric.volume
    averageMatrics.n++
  })
  averageMatrics.cyclomatic /= averageMatrics.n
  averageMatrics.volume /= averageMatrics.n

  const averageMaintainability = Number.parseFloat(
    (
      171 -
      5.2 * Math.log(averageMatrics.volume) -
      0.23 * averageMatrics.cyclomatic -
      16.2 * Math.log(sourceCodeLength)
    ).toFixed(2)
  )

  const minMaintainability = Number.parseFloat(
    (
      171 -
      5.2 * Math.log(maximumMatrics.volume) -
      0.23 * maximumMatrics.cyclomatic -
      16.2 * Math.log(sourceCodeLength)
    ).toFixed(2)
  )

  return {averageMaintainability, minMaintainability}
}
