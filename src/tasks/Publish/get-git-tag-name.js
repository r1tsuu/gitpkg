import { normalisePackageNameNpm } from './normalise-package-name';

export default function getGitTagName(pkg, config) {
  const gitpkgPackageName = config.getTagName(pkg);
  return gitpkgPackageName;
}

function formatDate(date) {
  const padZero = num => num.toString().padStart(2, '0');

  const year = date.getFullYear();
  const month = padZero(date.getMonth() + 1); // Months are zero-based in JavaScript
  const day = padZero(date.getDate());
  const hours = padZero(date.getHours());
  const minutes = padZero(date.getMinutes());
  const seconds = padZero(date.getSeconds());

  return `${year}${month}${day}_${hours}${minutes}${seconds}`;
}

const now = new Date();
const formattedDate = formatDate(now);

/**
 * Returns the default tag name. This function can be replaced in the config file.
 * @param {object} pkg The package.json object.
 */
export function defaultTagNameFormat(pkg) {
  return `${normalisePackageNameNpm(pkg.name)}-v${pkg.version}-${formattedDate}`;
}
