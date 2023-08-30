const core = require('@actions/core');
const github = require('@actions/github');
const https = require('https');
const exec = require('child_process').exec;
const PATH_TO_DYNAMIC_CHECKS = 'https://raw.githubusercontent.com/sebryu/github-actions-generated-comments/main/PULL_REQUEST_DYNAMIC_CHECKS.md';


/**
 * @returns {Promise}
 */
function getDynamicChecksContent() {
  return new Promise((resolve, reject) => {
      https
          .get(PATH_TO_DYNAMIC_CHECKS, (res) => {
              let fileContents = '';
              res.on('data', (chunk) => {
                  fileContents += chunk;
              });
              res.on('end', () => {
                  // format fileContents if needed
                  resolve(fileContents);
              });
          })
          .on('error', reject);
  });
}

async function run() {
  const token = core.getInput('GITHUB_TOKEN', { required: true });

  const baseSha = github.context.payload.pull_request.base.sha;
  const sha = github.sha;
  const execResponse = await exec(`git diff --name-only --diff-filter=ACMRT ${baseSha} ${sha}`);
  const changedFiles = execResponse.stdout.split('\n');
  const hasTsFiles = changedFiles.some((file) => file.endsWith('.ts'));
  console.log('Changed files:', changedFiles);
  console.log('Has ts files:', hasTsFiles);

  const [repoOwner, repoName] = process.env.GITHUB_REPOSITORY.split('/');
  const prNumber = github.context.payload.pull_request.number;

  const octokit = github.getOctokit(token);

  const { data } = await octokit.rest.pulls.get({
    owner: repoOwner,
    repo: repoName,
    pull_number: prNumber,
  });

  // if pull request doesn't contain .ts changes then exit

  body = data.body;

  const dynamicChecksContent = await getDynamicChecksContent();

  // check if body already contains this dynamic section (i.e PR has been updated)
  if (body.includes(dynamicChecksContent)) {
    console.log('Pull request already contains dynamic checks section');
    return;
  }

  body += dynamicChecksContent;

  await octokit.rest.pulls.update({
    owner: repoOwner,
    repo: repoName,
    body: body,
    pull_number: prNumber,
  });
}

run();