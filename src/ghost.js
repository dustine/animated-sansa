module.exports = function(Crafty) {
  Crafty.c('Ghost', {
    _f: 0,
    init: function() {
      this.requires('Quark, Persist');
      this.color('grey');
      this.bind('ResetGhosts', this.reset);
      this.bind('StartGhosts', this.start);
      this.z = 100;
    },
    _init: function() {
      this.z = 100;
      this._f = this._firstFrame;
      this.x = this._previousFrames[this._firstFrame].x;
      this.y = this._previousFrames[this._firstFrame].y;
    },
    Ghost: function(firstFrame, previousFrames) {
      this._firstFrame = firstFrame;
      this._previousFrames = previousFrames;
      this._init();
    },
    reset: function() {
      this.removeComponent('Active');
      this.color('grey');
      this._init();
    },
    start: function() {
      this.addComponent('Active');
    }
  });

  Crafty.c('Active', {
    init: function() {
      this.requires('Ghost');
      this.color('rgb(209, 210, 167)');
      this.bind('EnterFrame', this._enterFrame);
      this.one('EndPlayback', this._endRecording);
      this.onHit('Tachyon', this._removeStray);
      this.z = 500;
    },
    remove: function() {
      // NOTE: onHit adds the Tachyon thing to EnterFrame
      this.unbind('EnterFrame');
      this.unbind('EndPlayback', this._endRecording);
    },
    // TODO: Separate Active logic from Ghost
    _endRecording: function() {
      this.color('rgb(117, 27, 192)');
      this.z = 150;
      this.removeComponent('Active'); // seppuku
    },
    _enterFrame: function() {
      if (this._f >= this._previousFrames.length) {
        this.trigger('EndPlayback');
        return;
      }
      var pos = this._previousFrames[this._f++];
      this.x = pos.x;
      this.y = pos.y;
    },
    _removeStray: function(data) {
      data.forEach(function(elem) {
        // TODO: Check for paradoxes
        elem.obj.destroy();
      });
    }
  });
};
