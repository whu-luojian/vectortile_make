var test = require('tape')
var path = require('path')
var fs = require('fs')
var tilelive = require('@mapbox/tilelive')
var Omnivore = require('./src/omnivore')
var Timedsource = require('./src/timedsource')
var datasets = require('./config/data_input_path')
var util = require('util')

Omnivore.registerProtocols(tilelive)
Timedsource.registerProtocols(tilelive)

var data_input_type = 'geojson'
var tilejson_output = 'tilejson.json'
var tilejson_output_path = path.resolve(__dirname, './data_output/tilejson', tilejson_output)
//生成tilejson!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
test('getInfo', function (t) {
  tilelive.load('omnivore://' + datasets[data_input_type], function (err, src) {
    src.getInfo(function (err, info) {
      // 生成tilejson文件在data_output文件夹下
      var tilejson = JSON.stringify(info)
      fs.writeFile(tilejson_output_path, tilejson, function (err) {
        if (err) {
          console.log(err)
        }
        console.log("tilejson created success")
      })
      t.notOk(err)
      t.equal(info.vector_layers[0].id, 'landuse');
      src.close(t.end)
    })
  })
})

//生成切片！！！！！！！！！！！！！！！！！！！！！！！！！
//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

test('tilelive.copy', function (t) {
  var src = 'omnivore://' + datasets[data_input_type];
  //  var dst = 'mbtiles://'+path.join(tmp, crypto.randomBytes(12).toString('hex') + '.tilelivecopy.mbtiles');
  var dst = 'Timedsource://{time:50}'
  var options = {
    progress: report
  };

  tilelive.copy(src, dst, options, function (err) {
    if (err) throw err
    t.ifError(err)
    t.end()
  })
});

// Used for progress report
function report(stats, p) {
  console.log(util.format('\r\033[K[%s] %s%% %s/%s @ %s/s | ✓ %s □ %s | %s left',
    pad(formatDuration(process.uptime()), 4, true),
    pad((p.percentage).toFixed(4), 8, true),
    pad(formatNumber(p.transferred), 6, true),
    pad(formatNumber(p.length), 6, true),
    pad(formatNumber(p.speed), 4, true),
    formatNumber(stats.done - stats.skipped),
    formatNumber(stats.skipped),
    formatDuration(p.eta)
  ));
}

function formatDuration(duration) {
  var seconds = duration % 60;
  duration -= seconds;
  var minutes = (duration % 3600) / 60;
  duration -= minutes * 60;
  var hours = (duration % 86400) / 3600;
  duration -= hours * 3600;
  var days = duration / 86400;

  return (days > 0 ? days + 'd ' : '') +
    (hours > 0 || days > 0 ? hours + 'h ' : '') +
    (minutes > 0 || hours > 0 || days > 0 ? minutes + 'm ' : '') +
    seconds + 's';
}

function pad(str, len, r) {
  while (str.length < len) str = r ? ' ' + str : str + ' ';
  return str;
}

function formatNumber(num) {
  num = num || 0;
  if (num >= 1e6) {
    return (num / 1e6).toFixed(2) + 'm';
  } else if (num >= 1e3) {
    return (num / 1e3).toFixed(1) + 'k';
  } else {
    return num.toFixed(0);
  }
  return num.join('.');
}