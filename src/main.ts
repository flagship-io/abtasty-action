import * as core from '@actions/core'
import * as fs from 'fs'
import { Cli, CliVersion } from './cliCommand'
import { CliDownloader } from './cliDownloader'
import {
  FEATURE_LIST_CAMPAIGN,
  FEATURE_LIST_FLAG,
  FEATURE_LIST_GOAL,
  FEATURE_LIST_PROJECT,
  FEATURE_LIST_TARGETING_KEY,
  FEATURE_LIST_VARIATION,
  FEATURE_LIST_VARIATION_GROUP,
  FEATURE_LOAD_RESOURCE,
  FEATURE_LOGIN_AUTH
} from './const'
/**
 * The main function for the action.
 * @returns {Promise<void>} Resolves when the action is complete.
 */

type CliRequest = {
  commandId: string
  product: string
  method: string
  resource: string
  flags: string
}

const buildInputs = () => {
  let commandRequests = {}
  const featureLoginAuth = core.getMultilineInput(FEATURE_LOGIN_AUTH)
  if (core.getInput(FEATURE_LOGIN_AUTH)) {
    commandRequests = {
      ...commandRequests,
      [FEATURE_LOGIN_AUTH]: featureLoginAuth
    }
  }

  const featureListFlag = core.getMultilineInput(FEATURE_LIST_FLAG)
  if (core.getInput(FEATURE_LIST_FLAG)) {
    commandRequests = {
      ...commandRequests,
      [FEATURE_LIST_FLAG]: featureListFlag
    }
  }

  const featureListCampaign = core.getMultilineInput(FEATURE_LIST_CAMPAIGN)
  if (core.getInput(FEATURE_LIST_CAMPAIGN)) {
    commandRequests = {
      ...commandRequests,
      [FEATURE_LIST_CAMPAIGN]: featureListCampaign
    }
  }

  const featureListProject = core.getMultilineInput(FEATURE_LIST_PROJECT)
  if (core.getInput(FEATURE_LIST_PROJECT)) {
    commandRequests = {
      ...commandRequests,
      [FEATURE_LIST_PROJECT]: featureListProject
    }
  }

  const featureListGoal = core.getMultilineInput(FEATURE_LIST_GOAL)
  if (core.getInput(FEATURE_LIST_GOAL)) {
    commandRequests = {
      ...commandRequests,
      [FEATURE_LIST_GOAL]: featureListGoal
    }
  }

  const featureListTargetingKey = core.getMultilineInput(
    FEATURE_LIST_TARGETING_KEY
  )
  if (core.getInput(FEATURE_LIST_TARGETING_KEY)) {
    commandRequests = {
      ...commandRequests,
      [FEATURE_LIST_TARGETING_KEY]: featureListTargetingKey
    }
  }

  const featureListVariationGroup = core.getMultilineInput(
    FEATURE_LIST_VARIATION_GROUP
  )
  if (core.getInput(FEATURE_LIST_VARIATION_GROUP)) {
    commandRequests = {
      ...commandRequests,
      [FEATURE_LIST_VARIATION_GROUP]: featureListVariationGroup
    }
  }

  const featureListVariation = core.getMultilineInput(FEATURE_LIST_VARIATION)
  if (core.getInput(FEATURE_LIST_VARIATION)) {
    commandRequests = {
      ...commandRequests,
      [FEATURE_LIST_VARIATION]: featureListVariation
    }
  }

  const featureLoadResource = core.getMultilineInput(FEATURE_LOAD_RESOURCE)
  if (core.getInput(FEATURE_LOAD_RESOURCE)) {
    commandRequests = {
      ...commandRequests,
      [FEATURE_LOAD_RESOURCE]: featureLoadResource
    }
  }

  return commandRequests
}

const buildCommands = (
  commandRequests: { [s: string]: any } | ArrayLike<any>
) => {
  const cliRequests: CliRequest[] = []
  for (const [key, value] of Object.entries(commandRequests)) {
    let args = ''
    let commandId = ''
    value?.map((f: string) => {
      const f_ = f.replaceAll(' ', '').split(':')
      if (f_[0] === 'commandId') {
        commandId = f_[1]
        return
      }

      args =
        f_.length > 1
          ? args.concat(`--${f_[0]}=${f_[1]} `)
          : args.concat(`--${f_[0]} `)
    })

    const splitted = key.split('-')
    cliRequests.push({
      commandId,
      product: splitted[0],
      method: splitted[1],
      resource: splitted[2],
      flags: args
    } as CliRequest)
  }
  return cliRequests
}

export async function run(): Promise<void> {
  try {
    const abtastyDir = 'abtasty-cli'
    const binaryDir = `${abtastyDir}/${CliVersion}`
    let cliResponse = {}

    if (!fs.existsSync(binaryDir)) {
      await CliDownloader(binaryDir)
    }

    const cli = new Cli()

    const commandRequests = buildInputs()
    const cliRequests = buildCommands(commandRequests)

    for (const r of cliRequests) {
      const result = await cli.Resource(
        r.product,
        r.resource,
        r.method,
        r.flags
      )
      cliResponse = {
        ...cliResponse,
        [r.commandId]: result
      }
    }

    core.setOutput('commandsResult', cliResponse)
  } catch (err) {
    console.log(err)
  }
}
