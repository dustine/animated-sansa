var Crafty = require('craftyjs')
var $ = require('jquery')

Crafty.init(600, 300, '')

var game = $('#game')
game.on('click', function () {
  this.requestPointerLock()
})

Crafty.background('rgb(127,127,127)')

Crafty.e('Paddle, 2D, DOM, Color, Multiway')
    .color('green')
    .attr({ x: 580, y: 100, w: 10, h: 100 })
    .multiway(4, { UP_ARROW: -90, DOWN_ARROW: 90 })
