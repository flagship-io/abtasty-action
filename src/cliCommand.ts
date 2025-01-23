import { exec, ExecOptions } from 'child_process'
import * as fs from 'fs'
import { join } from 'path'
import { setError } from './error'

export const CliVersion = '1.2.1'
export const actionVersion = '0.0.1'

export class Cli {
  exec(
    command: string,
    options: ExecOptions
  ): Promise<{ stdout: string; stderr: string }> {
    return new Promise<{ stdout: string; stderr: string }>(
      (resolve, reject) => {
        exec(
          command + ' --user-agent=abtasty-ext-action/v' + actionVersion,
          options,
          (error, stdout, stderr) => {
            if (error) {
              reject({ error, stdout, stderr })
            }
            resolve({ stdout, stderr })
          }
        )
      }
    )
  }

  async CliBin(): Promise<string> {
    try {
      const abtastyDir = 'abtasty-cli'
      const abtastyDirWindows = '\\abtasty-cli'

      if (process.platform.toString() === 'win32') {
        return `${abtastyDirWindows}\\${CliVersion}\\abtasty-cli.exe`
      }
      if (process.platform.toString() === 'darwin') {
        return `${abtastyDir}/${CliVersion}/abtasty-cli`
      }
      await fs.promises.access(join(abtastyDir, `${CliVersion}/abtasty-cli`))
      return `${abtastyDir}/${CliVersion}/abtasty-cli`
    } catch (err: any) {
      setError(`Error: ${err}`, false)
      return err.error
    }
  }

  async Resource(
    product: string,
    resource: string,
    method?: string,
    args?: string
  ): Promise<string> {
    try {
      const cliBin = await this.CliBin()
      if (!cliBin) {
        return ''
      }
      const command =
        method === 'list'
          ? `${cliBin} ${product} ${resource} ${method} ${args} --output-format json`
          : `${cliBin} ${product} ${resource} ${method} ${args}`
      console.log(command)
      const output = await this.exec(command, {})
      console.log(output)
      if (output.stderr) {
        return `error occurred with command ${command}`
      }
      return output.stdout
    } catch (err: any) {
      console.log(err)
      return err.toString()
    }
  }
}
