"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = getYarnLineage;
exports.setYarnLineageForTesting = setYarnLineageForTesting;

var _execa = _interopRequireDefault(require("execa"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

let yarnLineage = undefined;

async function getYarnLineage() {
  if (yarnLineage !== undefined) {
    return yarnLineage;
  }

  try {
    const {
      stdout
    } = await (0, _execa.default)('yarn', ['--version']);
    yarnLineage = parseInt(stdout) > 1 ? 'berry' : 'classic';
  } catch (e) {
    yarnLineage = null;
  }

  return yarnLineage;
}

function setYarnLineageForTesting(value) {
  yarnLineage = value;
}
//# sourceMappingURL=get-yarn-lineage.js.map