require('dotenv').config()
const exec = require('child_process').execSync

const { version } = require('../package.json')
const paths = require('../webpack/paths')
require('../webpack/assert_vars')([
  'ENVIRONMENT',
  'S3_BUCKET',
  'S3_BUCKET_REGION',
  'S3_ACCESS_KEY_ID',
  'S3_SECRET_ACCESS_KEY'
])

startTask()

function startTask () {
  const buildPath = paths.build
  const command = [
    `AWS_ACCESS_KEY_ID=${process.env.S3_ACCESS_KEY_ID}`,
    `AWS_SECRET_ACCESS_KEY=${process.env.S3_SECRET_ACCESS_KEY}`,
    `AWS_DEFAULT_REGION=${process.env.S3_BUCKET_REGION}`,
    `aws s3 sync ${buildPath} s3://${process.env.S3_BUCKET}/${process.env.ENVIRONMENT}/${version}`,
    `--acl=public-read`
  ].join(' ')
  try {
    console.log('Running command:', command)
    exec(command)
    console.log(`Successfully uploaded to https://${process.env.S3_BUCKET}.s3-website.eu-central-1.amazonaws.com/${process.env.ENVIRONMENT}/${version}`)
  } catch (e) {
    console.log('Publish failed:')
    console.error(e)
  }
}
