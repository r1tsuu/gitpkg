"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = uploadPackage;

var _path = _interopRequireDefault(require("path"));

var _execLikeShell = _interopRequireDefault(require("./exec-like-shell"));

var _getTempDir = _interopRequireDefault(require("./get-temp-dir"));

var _getGitTagName = _interopRequireDefault(require("./get-git-tag-name"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

async function uploadPackage(config, pkg, registry) {
  // Timestamps are one of the inputs that cause entropy in a commit SHA.  By
  // freezing the timestamps, we ensure that running `gitpkg publish` twice on
  // the same files results in the same SHA.
  //
  // This makes publishing idempotent: you can run `gitpkg publish` as many
  // times as you like, and it won't error unless the underlying files don't
  // match.
  process.env.GIT_AUTHOR_DATE = `1970-01-01T00:00:00.000Z`;
  process.env.GIT_COMMITTER_DATE = `1970-01-01T00:00:00.000Z`;
  const pkgTempDir = await (0, _getTempDir.default)(pkg);

  const pkgTempDirPkg = _path.default.join(pkgTempDir, 'package');

  const gitpkgPackageName = (0, _getGitTagName.default)(pkg, config);
  await (0, _execLikeShell.default)('git init', pkgTempDirPkg);
  await (0, _execLikeShell.default)('git add .', pkgTempDirPkg);
  await (0, _execLikeShell.default)('git commit --no-verify -m gitpkg', pkgTempDirPkg);
  await (0, _execLikeShell.default)(`git remote add origin ${registry}`, pkgTempDirPkg);
  await (0, _execLikeShell.default)(`git tag ${gitpkgPackageName}`, pkgTempDirPkg); // This command looks up the existing tags on the remote.
  //
  // If you push a tag that already exists, it should succeed with
  // "Everything up-to-date".  However, your local copy must know the remote
  // has the matching tag.  Otherwise, you'll receive `gitErrorExists`.
  //
  // By fetching and then pushing, we ensure that:
  // -  If the tag hasn't been pushed yet, it is uploaded and the command
  //    succeeds.
  // -  If an identical tag has already been pushed, the command succeeds with
  //    "Everything up-to-date".
  // -  If the same tag name has already been pushed with different contents
  //    (e.g. you forgot to change the version after making changes), the
  //    push is rejected and an error is thrown.

  await (0, _execLikeShell.default)(`git fetch origin 'refs/tags/*:*'`, pkgTempDirPkg);

  try {
    await (0, _execLikeShell.default)(`git push origin ${gitpkgPackageName}`, pkgTempDirPkg);
  } catch (err) {
    const gitErrorExists = 'Updates were rejected because the tag already exists in the remote.';
    const exists = err.stderr.indexOf(gitErrorExists) > -1;

    if (exists) {
      throw new Error(`The git tag "${gitpkgPackageName}" already exists in "${registry}".`);
    }

    throw err;
  }
}
//# sourceMappingURL=upload-package.js.map