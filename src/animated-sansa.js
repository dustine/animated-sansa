var Crafty = require('craftyjs')
var $ = require('jquery')

var debug = true
var width = 600
var height = 400

Crafty.init(width, height, 'game')
Crafty.background('rgb(0,0,0)')

// borders
Crafty.e('Wall, 2D, Canvas, Color')
  .color('red')
  .attr({x: 0, y: 0, h: 20, w: width})

// player particle
var player = Crafty.e('Current, 2D, DOM, Color, Fourway, Collision')
  .color('green')
  .css('border-radius', '100%')
  .attr({x: width / 2 - 5, y: height / 2 - 5, w: 10, h: 10})
  .fourway(4)
  .onHit('Wall', function (hitdata) {
    console.log(this.pos, this._movement, this._speed)
    this.shift(-this._movement.x, -this._movement.y, 0, 0)
    // if (this._movement) {
    //   this.x -= this._movement.x
    //   this.y -= this._movement.y
    // }
    this._speed = 0
  })

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
  player.fourway(4)
}

function lockSuccess () {
  if (document.pointerLockElement === Crafty.stage.elem) {
    player.fourway(0)
    setTimeout(function () {
      Crafty.addEvent(player, Crafty.stage.elem, 'mousemove', updateLocalMouseMovement)
      player.bind('EnterFrame', mouseMove)
      console.log('mouse activated')
    }, 50)
  } else {
    Crafty.removeEvent(player, Crafty.stage.elem, 'mousemove', updateLocalMouseMovement)
    player.unbind('EnterFrame', mouseMove)
    player.fourway(4)
  }
  console.log('pointerlockchange')
}

var _movX, _movY

function updateLocalMouseMovement (me) {
  // this.x += me.movementX
  // this.y += me.movementY
  _movX += me.movementX
  _movY += me.movementY
}

function mouseMove () {
  player.shift(_movX, _movY, 0, 0)
  if (this.hit('Wall')) {
    player.shift(-_movX, -_movY, 0, 0)
  }
  _movX = _movY = 0
  // this.speed.x = me.movementX
  // this.speed.y = me.movementY
}

$(document).on('pointerlockchange', lockSuccess)
$(document).on('pointerlockerror', lockError)
