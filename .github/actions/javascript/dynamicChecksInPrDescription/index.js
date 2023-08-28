/**
 * NOTE: This is a compiled file. DO NOT directly edit this file.
 */
/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ 396:
/***/ ((module) => {

module.exports = eval("require")("@actions/core");


/***/ }),

/***/ 716:
/***/ ((module) => {

module.exports = eval("require")("@actions/github");


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __nccwpck_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		var threw = true;
/******/ 		try {
/******/ 			__webpack_modules__[moduleId](module, module.exports, __nccwpck_require__);
/******/ 			threw = false;
/******/ 		} finally {
/******/ 			if(threw) delete __webpack_module_cache__[moduleId];
/******/ 		}
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat */
/******/ 	
/******/ 	if (typeof __nccwpck_require__ !== 'undefined') __nccwpck_require__.ab = __dirname + "/";
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
const core = __nccwpck_require__(396);
const github = __nccwpck_require__(716);
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
})();

module.exports = __webpack_exports__;
/******/ })()
;
