/**
 * NOTE: This is a compiled file. DO NOT directly edit this file.
 */
/******/ /* webpack/runtime/compat */
/******/ 
/******/ if (typeof __nccwpck_require__ !== 'undefined') __nccwpck_require__.ab = new URL('.', import.meta.url).pathname.slice(import.meta.url.match(/^file:\/\/\/\w:/) ? 1 : 0, -1) + "/";
/******/ 
/************************************************************************/
var __webpack_exports__ = {};
const core = require('@actions/core');
const github = require('@actions/github');
const fs = require("fs");
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
  const token = core.getInput('token', { required: true });

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

  body += dynamicChecksContent;

  await octokit.rest.pulls.update({
    owner: repoOwner,
    repo: repoName,
    body: body,
    pull_number: prNumber,
  });
}

run();
