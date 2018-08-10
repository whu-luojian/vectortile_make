var path = require('path')

var data_input_path = path.resolve(__dirname, '../data_input')

var data_input_config = ['csv', 'geojson', 'shp']
  .reduce(function (memo, type) {
    var file = (function () {
      if (type === 'csv') return 'csv/test.csv'
      if (type === 'geojson') return 'geojson/code.json'
      if (type === 'shp') return ['shp/test.shp', 'shp/test1.shp']
    })()
    memo[type] = Array.isArray(file) ?
      (file.map(function (f) {
        return path.join(data_input_path, f);
      })).join(',') :
      path.join(data_input_path, file);
    return memo;
  }, {})

  console.log(data_input_config)
  module.exports = data_input_config