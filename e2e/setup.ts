export default async function globalSetup() {
  require.extensions['.svg'] = function () {
    return '';
  };
}
