// Central place for reading required environment variables (set these as
// Environment Variables in your Vercel project — see README for details).
function required(name) {
  const v = process.env[name];
  if (!v) throw new Error(`Missing required environment variable: ${name}`);
  return v;
}

module.exports = {
  GITHUB_TOKEN: () => required("GITHUB_TOKEN"),   // fine-grained PAT with Contents: read/write on the repo
  GITHUB_OWNER: () => required("GITHUB_OWNER"),   // e.g. "Nilaprem"
  GITHUB_REPO: () => required("GITHUB_REPO"),     // e.g. "nila-portfolio"
  GITHUB_BRANCH: () => process.env.GITHUB_BRANCH || "main",
  ADMIN_PIN: () => required("ADMIN_PIN").trim(),         // the PIN/password used to log into /admin/
  SESSION_SECRET: () => required("SESSION_SECRET"), // long random string, used to sign the session token
  SITE_URL: () => process.env.SITE_URL || "*"     // e.g. https://nilaprem.github.io — used for CORS
};
