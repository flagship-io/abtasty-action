import axios from 'axios'
import decompress from 'decompress'
import * as fs from 'fs'
import { CliVersion } from './cliCommand'

export async function CliDownloader(binaryDir: string) {
  const abtastyDir = 'abtasty-cli'
  const cliTar = `abtasty-cli/abtasty-cli-${CliVersion}.tar.gz`

  async function installDir(): Promise<void> {
    let platform = process.platform.toString()
    let cliUrl: string
    let arch: string
    const file = fs.createWriteStream(cliTar)

    if (!fs.existsSync(abtastyDir)) {
      fs.mkdirSync(abtastyDir)
    }
    if (!fs.existsSync(binaryDir)) {
      fs.mkdirSync(binaryDir)
    }

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

    if (platform === 'darwin') {
      cliUrl = `https://github.com/flagship-io/abtasty-cli/releases/download/v${CliVersion}/abtasty-cli_${CliVersion}_darwin_all.tar.gz`
    } else {
      cliUrl = `https://github.com/flagship-io/abtasty-cli/releases/download/v${CliVersion}/abtasty-cli_${CliVersion}_${platform}_${arch}.tar.gz`
    }

    try {
      const archivedCLI = await axios.get(cliUrl, {
        responseType: 'arraybuffer',
        method: 'GET',
        headers: {
          'Content-Type': 'application/gzip',
          'Accept-Encoding': 'gzip,deflate,compress,br'
        },
        decompress: true
      })
      file.write(archivedCLI.data)
      file.end()
    } catch (err) {
      console.error(err)
    }
    await decompress(cliTar, binaryDir)
    fs.chmodSync(`${binaryDir}/abtasty-cli`, '777')
  }

  async function download(): Promise<void> {
    await installDir()
  }

  await download()
}
