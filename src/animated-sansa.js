var Crafty = require('craftyjs')
var $ = window.$

var width = 600
var height = 400

Crafty.init(width, height, 'game')

var game = $('.game-container')
game.on('click', function () {
  this.requestPointerLock()
})

Crafty.background('rgb(0,0,0)')

Crafty.e('Paddle, 2D, DOM, Color, Fourway')
    .color('red')
    .css('border-radius', '100%')
    .attr({ x: width / 2 - 5, y: height / 2 - 5, w: 10, h: 10 })
    .fourway(4)
