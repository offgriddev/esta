import {Command} from 'commander'
import {estimate} from '../../lib/estimate'
import {readFile} from 'fs/promises'
import {parse} from 'csv/sync'
import {logger} from '../lib/logger'
import {ProjectTaskData} from '../../lib/types'
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
export const calculateEstimate = new Command()
  .name('calculate-estimate')
  .alias('ce')
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
  .description('Calculates estimates based on a Jira export')
  .action(async (data, avgSpeed, possibleHours, devCount, sampleSize) => {
    const contents = await readFile(data, 'utf-8')
    const records: ProjectTaskData[] = parse(contents, {from_line: 2, columns})
    const {totalComplexity, weeks} = await estimate(
      records,
      avgSpeed,
      possibleHours,
      devCount
    )
    logger.info(JSON.stringify(weeks, undefined, 2))
    logger.info(`Total complexity to deliver: ${totalComplexity}`)
    logger.info(`Number of Devs: ${devCount}`)
    logger.info(
      `Average delivery speed for 1 unit of complexity (in hours): ${avgSpeed}`
    )
    logger.info(
      `Total hours possible per developer on project per week: ${possibleHours}, ${Math.round(
        (possibleHours / 120) * 100
      )}% of a normal working week`
    )
    logger.info(`Total amount of weeks: ${weeks.length}`)
  })
