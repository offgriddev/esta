import {Command} from 'commander'
import {estimate} from '../lib/index.js'
import {readFile} from 'fs/promises'
import {parse} from 'csv/sync'
const columns = [
  'Summary',
  'Key',
  'StatusDate',
  'Labels',
  'EpicName',
  'EpicColor',
  'EpicLink',
  'Complexity'
]
export const getEstimateProbability = new Command()
  .name('get-estimate-probability')
  .alias('gep')
  .argument('<data>', 'location for export')
  .argument(
    '<avg-speed>',
    'Average hours (24hour cycle) to deliver 1 unit of complexity'
  )
  .argument(
    '<possible-hours>',
    'Total possible hours in a given week (5 days = 120)'
  )
  .argument('<number-of-devs>', 'Number of devs assigned to the project')
  .argument('<sample-size>', 'Amount of iterations')
  .description('Calculates estimates based on a Jira export')
  .action(async (data, avgSpeed, possibleHours, devCount, sampleSize) => {
    const contents = await readFile(data, 'utf-8')
    const records = parse(contents, {from_line: 2, columns})
    const estimatesInWeeks = []
    logger.info(`Taking ${sampleSize} samples of a random distribution.`)
    for (let i = 0; i < sampleSize; i++) {
      const {weeks} = await estimate(records, avgSpeed, possibleHours, devCount)
      estimatesInWeeks.push(weeks.length)
    }
    // get results by count and percentage
    const average =
      estimatesInWeeks.reduce((prev, cur) => prev + cur, 0) /
      estimatesInWeeks.length
    logger.info(`Average Estimate in Weeks: ${average}`)
    const uniques = [...new Set(estimatesInWeeks)]
    const percentageOfResults = []
    for (const uniq of uniques) {
      const count = estimatesInWeeks.filter(x => x === uniq).length
      const percentage = (count / estimatesInWeeks.length) * 100
      percentageOfResults.push({weeks: uniq, count, percentage})
    }
    logger.info(JSON.stringify(percentageOfResults, '', 2))
  })
