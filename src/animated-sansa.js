var Crafty = require('craftyjs')
// var $ = require('jquery')
var $ = window.$

var debug = true
var width = 600
var height = 400

Crafty.init(width, height, 'game')
Crafty.background('rgb(0,0,0)')

// borders
Crafty.e('Wall, 2D, Canvas, Color')
  .color('red')
  .attr({x: 0, y: 0, h: 20, w: width})
Crafty.e('Wall, 2D, Canvas, Color')
  .color('red')
  .attr({x: 0, y: 0, h: height, w: 20})
Crafty.e('Wall, 2D, Canvas, Color')
  .color('red')
  .attr({x: 0, y: height - 20, h: 20, w: width})
Crafty.e('Wall, 2D, Canvas, Color')
  .color('red')
  .attr({x: width - 20, y: 0, h: height, w: 20})

// player particle
var player = Crafty.e('Current, 2D, DOM, Color, Fourway, Collision')
  .color('rgb(7, 124, 190)')
  .css('border-radius', '100%')
  .attr({x: width / 2 - 5, y: height / 2 - 5, w: 10, h: 10})
  .fourway(4)
  .onHit('Wall', function (hitdata) {
    // this.shift(-this._movement.x, -this._movement.y, 0, 0)
    if (this._movement) {
      this.x -= this._movement.x
      this.y -= this._movement.y
    }
    // this._speed.x = this._speed.y = 0
  })
  .origin('center')
  // .bind('Move', function (oldPosition) {
  //   if (this.hit('Wall')) {
  //     console.log(oldPosition, 'vs', this.pos())
  //     // this.x = oldPosition._x
  //     this.y = oldPosition._y + 1
  //   }
  // })

if (debug) {
  player.addComponent('Keyboard')
  player.bind('KeyDown', function (ke) {
    if (ke.key === Crafty.keys.R) {
      this.x = width / 2 - 5
      this.y = height / 2 - 5
    } else if (ke.key === Crafty.keys.W) {
      console.log(this.x, this.y)
    }
  })
}

// mouse controls

var game = $(Crafty.stage.elem)
game.on('click', function () {
  this.requestPointerLock()
})

// document.addEventListener('pointerlockerror', lockError, false)

// TODO Remove or rework this later
function lockError () {
  console.log('Pointer lock failed')
}

function lockSuccess () {
  // TODO Only bind the EnterFrame once, it's doing every time we click
  if (document.pointerLockElement === Crafty.stage.elem) {
    // enable mouse control, delayed to prevent sudden jump from
    //  accepting the pointer lock prompt
    player.disableControl()
    setTimeout(function () {
      Crafty.addEvent(player, Crafty.stage.elem, 'mousemove', updateLocalMouseMovement)
      player.bind('EnterFrame', mouseMove)
      console.log('mouse activated')
    }, 50)
  } else {
    // reset back to keyboard control
    Crafty.removeEvent(player, Crafty.stage.elem, 'mousemove', updateLocalMouseMovement)
    player.unbind('EnterFrame', mouseMove)
    player._movement.x = 0
    player._movement.y = 0
    player.enableControl()
  }
  console.log('pointerlockchange')
}

var _movX = 0, _movY = 0

function updateLocalMouseMovement (me) {
  _movX += me.movementX
  _movY += me.movementY
}

function mouseMove () {
  player.shift(_movX, _movY, 0, 0)
  player._movement.x = _movX
  player._movement.y = _movY
  player.trigger('Move', {
    _x: this._x - _movX,
    _y: this._y - _movY,
    _w: this._w,
    _h: this._h
  })
  // if (this.hit('Wall')) {
  //   player.shift(-_movX, -_movY, 0, 0)
  //   player._speed.x = player._speed.y = 0
  // }
  _movX = _movY = 0
}

$(document).on('pointerlockchange', lockSuccess)
$(document).on('pointerlockerror', lockError)
