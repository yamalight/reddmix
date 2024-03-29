/**
 * @type {import('@remix-run/dev/config').AppConfig}
 */
module.exports = {
  appDirectory: 'app',
  browserBuildDirectory: 'public/build',
  publicPath: '/build/',
  serverBuildDirectory: 'api/build',
  serverDependenciesToBundle: ['snudown-js/dist/snudown_es.js'],
};
