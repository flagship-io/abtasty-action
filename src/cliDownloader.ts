import { CliVersion } from './cliCommand'
import * as tc from '@actions/tool-cache'
import * as fs from 'fs'

export async function CliDownloader(binaryDir: string) {
  const abtastyDir = 'abtasty-cli'
  let platform = process.platform.toString()
  let cliUrl: string
  let arch: string

  if (platform === 'win32') {
    platform = 'windows'
  }

  switch (process.arch) {
    case 'x64':
      arch = 'amd64'
      break
    case 'ia32':
      arch = '386'
      break
    default:
      arch = process.arch
  }

  let downloadPath = ''

  if (platform === 'darwin') {
    cliUrl = `https://github.com/flagship-io/abtasty-cli/releases/download/v${CliVersion}/abtasty-cli_${CliVersion}_darwin_all.tar.gz`
  } else {
    cliUrl = `https://github.com/flagship-io/abtasty-cli/releases/download/v${CliVersion}/abtasty-cli_${CliVersion}_${platform}_${arch}.tar.gz`
  }

  downloadPath = await tc.downloadTool(cliUrl, binaryDir)
  const archivePath = await tc.extractTar(downloadPath, abtastyDir)
  fs.chmodSync(`${archivePath}/abtasty-cli`, '777')
}
