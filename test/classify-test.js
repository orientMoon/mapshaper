var api = require('../'),
  assert = require('assert');

describe('mapshaper-classify.js', function () {

  describe('categorical colors', function () {
    it('options use lists of quoted strings', function (done) {
      var data='plu\nAsian Indian\n"Chinese, except Taiwanese"\nFilipino';
      var cmd = "-i data.csv -classify plu categories='Asian Indian','Chinese, except Taiwanese' colors='#e6194b','#3cb44b' -o";
      api.applyCommands(cmd, {'data.csv': data}, function(err, out) {
        var target='plu,fill\nAsian Indian,#e6194b\n"Chinese, except Taiwanese",#3cb44b\nFilipino,#eee';
        assert.equal(out['data.csv'], target);
        done();
      });
    })

    it('assign a color to each value when categories=* is used', function(done) {
      var data = 'name\ncar\ntruck\ntrain\nbike';
      var cmd = '-i data.csv -classify name categories=* colors=Tableau20 -o';
      api.applyCommands(cmd, {'data.csv': data}, function(err, out) {
        var target = 'name,fill\ncar,#4c78a8\ntruck,#9ecae9\ntrain,#f58518\nbike,#ffbf79';
        assert.equal(out['data.csv'], target);
        done();
      });
    })

  })

  describe('empty field tests', function() {
    it('test 1', function(done) {
      var data = [{foo: null}, {foo: null}];
      var cmd = '-i data.json -classify foo breaks=0,2,4 colors=random -o';
      api.applyCommands(cmd, {'data.json': data}, function(err, out) {
        var json = JSON.parse(out['data.json']);
        assert.deepStrictEqual(json, [
          {foo: null, fill: '#eee'}, {foo: null, fill: '#eee'}]);
        done();
      });
    })

    it('test 1b', function(done) {
      var data = [{foo: NaN}, {foo: NaN}];
      var cmd = '-i data.json -classify foo breaks=0,2,4 colors=random null-value=purple -o';
      api.applyCommands(cmd, {'data.json': data}, function(err, out) {
        var json = JSON.parse(out['data.json']);
        assert.deepStrictEqual(json, [
          {foo: null, fill: 'purple'}, {foo: null, fill: 'purple'}]);
        done();
      });
    })


    it('test 2', function(done) {
      var data = [{foo: null}, {foo: null}];
      var cmd = '-i data.json -classify foo null-value=-2 -o';
      api.applyCommands(cmd, {'data.json': data}, function(err, out) {
        var json = JSON.parse(out['data.json']);
        assert.deepStrictEqual(json, [
          {foo: null, class: -2}, {foo: null, class: -2}]);
        done();
      });
    })
  })

  it('error on unknown color scheme', function(done) {
    var data='value\n1\n2\n3\n4';
    api.applyCommands('-i data.csv -classify value colors=blues -o', {'data.csv': data}, function(err, out) {
      done();
    });
  });

  it('color= option accepts a color scheme name', function(done) {
    var data='value\n1\n2\n3\n4';
    api.applyCommands('-i data.csv -classify value colors=Blues -o format=json', {'data.csv': data}, function(err, out) {
      var data = JSON.parse(out['data.json']);
      assert('fill' in data[0]);
      done();
    });
  })


});