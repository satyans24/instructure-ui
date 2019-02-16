/*
 * The MIT License (MIT)
 *
 * Copyright (c) 2015 - present Instructure, Inc.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */
const { getPackageJSON } = require('@instructure/pkg-utils')
const { error, info, confirm } = require('@instructure/command-utils')

const {
  publishPackages,
  bumpPackages,
  createNPMRCFile
} = require('./utils/npm')
const {
  checkIfGitTagExists,
  checkIfCommitIsReviewed,
  isReleaseCommit
} = require('./utils/git')
const {
  setupGit,
  checkWorkingDirectory,
  resetToCommit
} = require('./utils/git')
const { getConfig } = require('./utils/config')

try {
  const pkgJSON = getPackageJSON()
  // optional version argument:
  // e.g. ui-scripts --publish 5.11.0-dev
  publish(pkgJSON.name, pkgJSON.version, process.argv[3], getConfig(pkgJSON))
} catch (err) {
  error(err)
  process.exit(1)
}

async function publish (packageName, currentVersion, requestedVersion = 'prerelease', config = {}) {
  setupGit()
  createNPMRCFile(config)
  checkWorkingDirectory()

  let versionToRelease, npmTag

  if (isReleaseCommit(currentVersion)) {
    checkIfGitTagExists(currentVersion)
    checkIfCommitIsReviewed()
    info(`📦  Currently on release commit for ${currentVersion} of ${packageName}.`)
    versionToRelease = currentVersion
    npmTag = 'latest'
  } else {
    try {
      versionToRelease = await bumpPackages(packageName, requestedVersion)
    } catch (err) {
      error(err)
      process.exit(1)
    }
    info(`📦  Not on a release commit--${versionToRelease} will be a pre-release.`)
    npmTag = 'rc'
  }

  info(`📦  Version: ${versionToRelease}, Tag: ${npmTag}`)

  if (!process.env.CI) {
    const reply = await confirm('Continue? [y/n]\n')
    if (!['Y', 'y'].includes(reply.trim())) {
      process.exit(0)
    }
  }

  try {
    await publishPackages(packageName, versionToRelease, npmTag)
  } catch (err) {
    error(err)
    process.exit(1)
  }

  if (npmTag === 'rc') {
    resetToCommit('HEAD')
  }

  info(`📦  Version ${versionToRelease} of ${packageName} was successfully released!`)
}