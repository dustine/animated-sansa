!function(t){function e(n){if(i[n])return i[n].exports;var r=i[n]={exports:{},id:n,loaded:!1};return t[n].call(r.exports,r,r.exports,e),r.loaded=!0,r.exports}var i={};return e.m=t,e.c=i,e.p="",e(0)}([function(t,e,i){function n(t){function e(t,e){return t/=e,Math.floor(t)}var i=" s";for(i=(t%1e3).toFixed(0)+i;i.length<5;)i="0"+i;if(i="."+i,t=e(t,1e3),i=t%60+i,60>t)return i;for(;i.length<8;)i="0"+i;return i=":"+i,t=e(t,60),t+i}var r=!1;$(function(){function t(t,e,i){i=i||"red";var n=l.getContext("2d"),r=Math.floor(l.width*(t/e))-.5;n.beginPath();var o=n.createLinearGradient(0,0,0,g.height);o.addColorStop(0,"rgb(121, 0, 0)"),o.addColorStop(.5,i),o.addColorStop(1,"rgb(121, 0, 0)"),n.strokeStyle=o,n.lineWidth=1,n.moveTo(r,0),n.lineTo(r,Math.round(.75*l.height)),n.stroke()}function e(t,e,i){i=i||"cyan";var n=g.getContext("2d");n.clearRect(0,0,g.width,g.height);var r=n.createLinearGradient(0,0,0,g.height);r.addColorStop(0,i),r.addColorStop(1,"rgb(0, 199, 205)"),n.fillStyle=r;var o=Math.min(g.width*(t/e),g.width);n.fillRect(0,0,o,g.height)}function o(){var t=g.getContext("2d");t.clearRect(0,0,g.width,g.height),t=l.getContext("2d"),t.clearRect(0,0,l.width,l.height)}function s(t){var e=$(".loop-counter .digit").toArray();for(t=t.toString();t.length<4;)t="0"+t;t.length>4&&(t="10k+");for(var i=0;4>i;++i)e[i].innerHTML=t[i]}function a(t){var e=$(".score-display .digit").toArray();for(t=t.toFixed(0).toString();t.length<e.length;)t="0"+t;if(t.length>e.length)throw"score too bong, "+t;for(var i=0;i<e.length;++i)e[i].innerHTML=t[i]}function h(){return!Crafty.isPaused()&&-1!==["Scratch","Loop"].indexOf(Crafty._current)}function c(){if(document.pointerLockElement===Crafty.stage.elem){if(!E)return;E=!1,S.enableMouse()}else E=!0,S.enableKeyboard()}function f(){}function u(t){this._firstFrame=t.frame}function d(t){this._previousFrames[t.frame]={x:this.x,y:this.y}}!function(){function t(t,e,i){e=t-e-1,e%3===0&&$(i).addClass("-right"),(e+1)%3===0&&$(i).addClass("-left")}$(".counter.-separate").each(function(e,i){var n=$(i).children(),r=n.filter(".digit");r.each(function(e,i){t(r.length,e,i)})})}();var y=$(".timeline"),m=$("#tb-display")[0],l=$("#tb-hits")[0],g=$("#tb-progress")[0];!function(){var t=y.width(),e=.8*y.parent().height();y.height(e),m.width=l.width=g.width=t,m.height=l.height=g.height=e;var i=m.getContext("2d");i.lineWidth=1,i.lineCap="round",i.strokeStyle="#666";for(var n=32,r=2;n>=r;r*=2)for(var o=1;r>o;o++){i.beginPath(),i.moveTo(Math.round(t/r*o)+.5,e);var s=Math.log(r)/Math.log(n*n);i.lineTo(Math.round(t/r*o)+.5,Math.round(e*s+1*e/4)),i.stroke()}}();var x=$("#animated-sansa"),_=x.width(),p=x.height(),v=20,C=100,b=18e4,w=8,M=5,F=4,k=[];Crafty.init(_,p,"animated-sansa"),Crafty.settings.modify("autoPause",!0),Crafty.bind("Pause",function(){h()&&(Crafty.e("2D, DOM, Text, PauseScreen").attr({w:_,y:40,z:2100}).css("text-align","center").text("Paused").textColor("rgba(0, 0, 0, 0.5)").textFont({family:"Open Sans",size:"10em"}),Crafty.e("2D, DOM, Color, PauseScreen").attr({x:0,y:0,w:_,h:p,z:2e3}).color("rgba(128, 128, 128, 0.5)"),Crafty.trigger("RenderScene"))}),Crafty.bind("Unpause",function(){Crafty("PauseScreen").each(function(){this.destroy()})}),Crafty.bind("NewScore",function(t){a(t)}),Crafty.bind("Hit",function(e){k.push({score:e,time:D._dt}),t(D._dt,D._gameEnd)}),i(1)(Crafty,_,p,w,v),i(2)(Crafty),i(3)(Crafty,_,p,v,C,F),i(4)(Crafty,_,p,v,C,F),Crafty.c("Quark",{init:function(){this.requires("2D, DOM, Color, Collision"),this.attr({x:_/2-M,y:p/2-M,w:2*M,h:2*M}),this.css("border-radius","100%"),this.origin("center"),this.collision(new Crafty.circle(M,M,M))}}),Crafty.c("GameClock",{_dt:0,_gameEnd:0,_dead:!1,init:function(){this.requires("2D, Delay")},destroy:function(){this._dead=!0,this.cancelDelay(this._winGame)},_enterFrame:function(t){this._dead||(e(this._dt,this._gameEnd),this._dt+=t.dt)},_winGame:function(){Crafty.scene("GameWon")},gameClock:function(t){return this._gameEnd=t,this.bind("EnterFrame",this._enterFrame),this.delay(this._winGame,t),this},reset:function(){return this._dt=0,this}});var S;x.on("click",function(){h()&&this.requestPointerLock()});var E=!0;$(document).on("pointerlockchange",c),$(document).on("pointerlockerror",f),Crafty.background("black");var D,T,L=1;Crafty.scene("Menu",function(){Crafty.e("2D, DOM, Text").text("Animated Sansa").textColor("#ffffff").textFont({family:"Open Sans",size:"6em"}).attr({w:_,y:40}).css("text-align","center"),Crafty.e("2D, DOM, Mouse, Keyboard, Text").attr({x:(_-400)/2,y:(p-100)/2+100,w:400,h:100}).css({background:"linear-gradient(to bottom, skyBlue 0%, cyan 100%)","border-radius":"0.5em"}).bind("Click",function(){Crafty.scene("Start")}).bind("KeyDown",function(){this.isDown("ENTER")&&Crafty.scene("Start")}).text("Start").textColor("#ffffff").textFont({family:"Open Sans",size:"4em"}).css("text-align","center").css("line-height","100px")}),Crafty.scene("Start",function(){o(),k=[],L=1,S=Crafty.e("Player"),Crafty.scene("Scratch")},function(){T=Crafty.e("Spawner").spawner(18e4)}),Crafty.scene("Loop",function(){r&&Crafty("Quark").each(function(){this.addComponent("WiredHitBox")}),S.one("ExitFrame",u),S.bind("ExitFrame",d),D=Crafty.e("GameClock").gameClock(b),Crafty.trigger("StartLoop"),T.start()},function(){D.destroy(),T.reset(),S.unbind("ExitFrame",d);var t=S._firstFrame||0,e=S._previousFrames||[];S._previousFrames=[];var i=S._tachId;S._tachId=void 0,Crafty.trigger("EndLoop"),0!==e.length&&Crafty.e("Ghost").Ghost(i,t,e)}),Crafty.scene("Scratch",function(){s(L++),Crafty.e("Delay").delay(function(){Crafty.scene("Loop")},2e3)}),Crafty.scene("GameOver",function(){Crafty("Quark").each(function(){this.destroy()}),T.destroy(),Crafty.e("2D, DOM, Text").text("Game Over").textColor("#ffffff").textFont({family:"Open Sans",size:"10em"}).attr({w:_,y:40}).css("text-align","center"),Crafty.e("2D, DOM, Text").text(function(){var t=k[k.length-1];return"Score: "+t.score.toFixed(0)+", over "+n(t.time)}).textColor("#ffffff").textFont({family:"Open Sans",size:"3em"}).attr({w:_,y:240}).css("text-align","center"),Crafty.e("2D, DOM, Text").text(function(){var t=k[0];t.i=0;var e=k[0];e.i=0;for(var i=0;i<k.length;i++)k[i].score>t.score&&(t=k[i],t.i=i),k[i].time>e.time&&(e=k[i],e.i=i);return"Best Score: Attempt "+(t.i+1)+", "+t.score.toFixed(0)+"<br>Best Time: Attempt "+(e.i+1)+", "+n(e.time)}).textColor("#ffffff").textFont({family:"Open Sans",size:"1.5em"}).attr({w:_,y:300}).css("text-align","center"),Crafty.e("2D, DOM, Mouse, Keyboard, Text").attr({x:(_-400)/2,y:(p-100)/2+200,w:400,h:100}).css({background:"linear-gradient(to bottom, blue 0%, darkBlue 100%)","border-radius":"0.5em"}).bind("Click",function(){Crafty.scene("Start")}).bind("KeyDown",function(){this.isDown("ENTER")&&Crafty.scene("Start")}).text("Restart").textColor("#ffffff").textFont({family:"Open Sans",size:"4em"}).css("text-align","center").css("line-height","100px")}),Crafty.scene("GameWon",function(){Crafty("Quark").each(function(){this.destroy()}),T.destroy(),e(1,1),Crafty.e("2D, DOM, Text").text("You win!").textColor("#ffffff").textFont({family:"Open Sans",size:"10em"}).attr({w:_,y:40}).css("text-align","center"),Crafty.e("2D, DOM, Text").text(function(){var t=k[k.length-1];return"Score: "+t.score.toFixed(0)+", over "+n(t.time)}).textColor("#ffffff").textFont({family:"Open Sans",size:"3em"}).attr({w:_,y:240}).css("text-align","center"),Crafty.e("2D, DOM, Text").text(function(){var t=k[0];t.i=0;var e=k[0];e.i=0;for(var i=0;i<k.length;i++)k[i].score>t.score&&(t=k[i],t.i=i),k[i].time>e.time&&(e=k[i],e.i=i);return"Best Score: Attempt "+(t.i+1)+", "+t.score.toFixed(0)+"<br>Best Time: Attempt "+(e.i+1)+", "+n(e.time)}).textColor("#ffffff").textFont({family:"Open Sans",size:"1.5em"}).attr({w:_,y:300}).css("text-align","center"),Crafty.e("2D, DOM, Mouse, Keyboard, Text").attr({x:(_-400)/2,y:(p-100)/2+100,w:400,h:100}).css({background:"linear-gradient(to bottom, skyBlue 0%, cyan 100%)","border-radius":"0.5em"}).bind("Click",function(){Crafty.scene("Start")}).bind("KeyDown",function(){this.isDown("ENTER")&&Crafty.scene("Start")}).text("Restart").textColor("#ffffff").textFont({family:"Open Sans",size:"4em"}).css("text-align","center").css("line-height","100px")}),r&&(Crafty("Quark").each(function(){this.addComponent("WiredHitBox")}),S.addComponent("Keyboard"),S.bind("KeyDown",function(t){t.key===Crafty.keys.R?(this.x=_/2-M,this.y=p/2-M):t.key===Crafty.keys.Q?console.log(this.x,this.y):t.key===Crafty.keys.C&&"Loop"===Crafty._current&&Crafty.scene("Scratch")})),Crafty.scene("Menu")})},function(t,e){function i(t,e,i){return(t-e[0])/(e[1]-e[0])*(i[1]-i[0])+i[0]}var n=100,r=50;t.exports=function(t,e,o,s,a){t.c("PointerWay",{init:function(){var e=this;this._mouseMovement={x:0,y:0},this._mouseSpeed=0,this._mouseMoveAtPointerLock=function(t){e._mouseMovement.x+=t.movementX,e._mouseMovement.y+=t.movementY},t.addEvent(t.stage.elem,t.stage.elem,"mousemove",this._mouseMoveAtPointerLock)},pointerway:function(t){return this.speed(t),this.bind("EnterFrame",this._enterFrame),this},remove:function(){this.unbind("EnterFrame",this._enterFrame),t.removeEvent(t.stage.elem,t.stage.elem,"mousemove",this._mouseMoveAtPointerLock)},_enterFrame:function(){var t={x:this._x,y:this._y},e=this._mouseMovement.x,i=this._mouseMovement.y;this._mouseMovement.x=this._mouseMovement.y=0;var n=Math.hypot(e,i);n>this._speed.x&&(e=this._speed.x*(e/n),i=this._speed.x*(i/n)),this.x+=e,this.y+=i,this.x!==t.x&&this.y!==t.y&&this.trigger("Moved",t),this._callback&&this._callback()},callback:function(t){return console.log("registering callback",this,t),"function"==typeof t&&(this._callback=t.bind(this)),this},speed:function(t){return void 0!==t.x&&void 0!==t.y?(this._speed.x=t.x,this._speed.y=t.y):(this._speed.x=t,this._speed.y=t),this}}),t.c("Player",{init:function(){this.requires("Quark, Fourway, Persist"),this._previousFrames=[],this.z=1e3,this.color("rgb(7, 124, 190)"),this.fourway(3*s/4),this.onHit("Active",function(){t.trigger("Hit",this.score),t.scene("GameOver")}),this.onHit("Tachyon",function(e){t.trigger("Hit",this.score),this.score=0,t.trigger("NewScore",this.score),this._tachId=e[0].obj.id,e.forEach(function(t){t.obj.destroy()}),t.scene("Scratch")}),this.score=0,t.trigger("NewScore",this.score),this.unbind("EnterFrame",this._enterframe),this.bind("EnterFrame",function(){this._enterframe(),this.disableControls||this._collision()}),this.bind("StartLoop",function(){this.bind("ExitFrame",this._score)}),this.bind("EndLoop",function(){this.unbind("ExitFrame",this._score)})},_collision:function(){this._x<a?this.x=a:this._x>e-this.w-a&&(this.x=e-this.w-a),this._y<a?this.y=a:this._y>o-this.h-a&&(this.y=o-this.h-a)},_score:function(){var e=[],o=this;if(t("WhiteTachyon").each(function(){e.push(Math.hypot(o.x+o.w/2-this.x-this.w/2,o.y+o.h/2-this.y-this.h/2)-o.w-this.w)}),e=e.reduce(function(t,e){return Math.min(t,e)},+(1/0)),!(e>n)){e=0>e?0:e;var s=n-e;s*=s,s=i(s,[0,n*n],[0,r]),0!==s&&(this.score+=s,t.trigger("NewScore",this.score))}},enableKeyboard:function(){this.removeComponent("PointerWay"),this.enableControl()},enableMouse:function(){var t=this;this.disableControl(),setTimeout(function(){t.addComponent("PointerWay").pointerway(s).callback(t._collision)},50)}})}},function(t,e){t.exports=function(t){t.c("Ghost",{_f:0,init:function(){this.requires("Quark, Persist, Tween"),this.color("grey"),this.bind("StartLoop",this.start),this.bind("EndLoop",this.reset),this.bind("PlaybackEnd",this._playbackEnd),this._tachId=0,this.z=100},_init:function(){this._f=this._firstFrame,this.attr({x:this._previousFrames[this._firstFrame].x,y:this._previousFrames[this._firstFrame].y,z:100,alpha:1})},_playbackEnd:function(){this.color("rgb(117, 27, 192)"),this.z=150,this.removeComponent("Active"),this.tween({alpha:0},200)},Ghost:function(t,e,i){this._firstFrame=e,this._previousFrames=i,this._tachId=t,this._init()},reset:function(){this.removeComponent("Active"),this.color("grey"),this.cancelTween("alpha"),this.alpha=1,this._init()},start:function(){this.addComponent("Active")}}),t.c("Active",{init:function(){this.requires("Ghost"),this.color("red"),this.bind("EnterFrame",this._enterFrame),this.z=500},remove:function(){this.unbind("EnterFrame",this._enterFrame),this.ignoreHits("Tachyon")},_enterFrame:function(){var t=this.hit("Tachyon");if(t&&this._removeStray(t,"prev"),this._f>=this._previousFrames.length)return void this.trigger("PlaybackEnd");var e=this._previousFrames[this._f++];this.x=e.x,this.y=e.y,t=this.hit("Tachyon"),t&&this._removeStray(t,"post")},_removeStray:function(t,e){var i=this;console.log(t),t.forEach(function(t){console.log(e,t.obj.id,i._tachId),t.obj.destroy()})}})}},function(t,e){t.exports=function(t,e,i,n,r,o){t.c("Tachyon",{init:function(){this.requires("2D, DOM, Color"),this.attr({w:o,h:o}),this.z=300}}),t.c("WhiteTachyon",{_angle:0,_speed:0,init:function(){this.requires("Tachyon"),this._movement={x:0,y:0},this.color("white")},_enterFrame:function(){return this._x<-r?void this.destroy():this._x>e-this.w+r?void this.destroy():this._y<-r?void this.destroy():this._y>i-this.h+r?void this.destroy():(this.x+=this._movement.x,void(this.y+=this._movement.y))},whiteTachyon:function(t,e,i,n,r){return this.id=t,this._angle=n,this._speed=r,this.x=e-Math.round(o/2),this.y=i-Math.round(o/2),this._movement.x=Math.cos(n)*r,this._movement.y=-Math.sin(n)*r,this.origin("center"),this.rotation=(Math.PI-n)*(180/Math.PI),this.bind("EnterFrame",this._enterFrame),this}})}},function(t,e){function i(t,e,i){return(t-e[0])/(e[1]-e[0])*(i[1]-i[0])+i[0]}function n(t,e){return Math.atan2(-(e[1]-t[1]),e[0]-t[0])}function r(t,e){if(t>e){e+=2*Math.PI;for(var i=Math.random()*(e-t)+t;i<-Math.PI;)i+=2*Math.PI;for(;i>Math.PI;)i-=2*Math.PI;return i}return Math.random()*(e-t)+t}t.exports=function(t,e,o,s,a){t.c("Spawner",{_dt:0,_gameEnd:0,_tachId:0,init:function(){this._spawnFrame=0,this._frames=[]},_enterFrame:function(){this._frames[this._dt]||(this._frames[this._dt]=this._generate()),this._spawn(this._frames[this._dt++])},_generate:function(){function t(t){return t._dt>=t._spawnFrame}function h(t){for(var e=[],i=5*Math.random()+1,n=0;i>n;n++){var r=t._tachId++;e.push({type:"White",id:r,speed:4})}return e}function c(t){function i(t){t.x=Math.random()*(e+2*m)-m,t.y=-m,y=[t.x,t.y],t.x<=s?(u=n(y,l.bottomLeft),d=n(y,l.topRight)):t.x>=e-s?(u=n(y,l.topLeft),d=n(y,l.bottomRight)):(u=n(y,l.topLeft),d=n(y,l.topRight)),t.angle=r(u,d)}function h(t){t.x=e+m,t.y=Math.random()*(o+2*m)-m,y=[t.x,t.y],t.y<=s?(u=n(y,l.topLeft),d=n(y,l.bottomRight)):t.y>=o-s?(u=n(y,l.topRight),d=n(y,l.bottomLeft)):(u=n(y,l.topLeft),d=n(y,l.bottomLeft)),t.angle=r(u,d)}function c(t){t.x=Math.random()*(e+2*m)-m,t.y=o+m,y=[t.x,t.y],t.x<=s?(u=n(y,l.bottomRight),d=n(y,l.topLeft)):t.x>=e-s?(u=n(y,l.topRight),d=n(y,l.bottomLeft)):(u=n(y,l.bottomRight),d=n(y,l.bottomLeft)),t.angle=r(u,d)}function f(t){t.x=-m,t.y=Math.random()*(o+2*m)-m,y=[t.x,t.y],t.y<=s?(u=n(y,l.bottomLeft),d=n(y,l.topRight)):t.y>=o-s?(u=n(y,l.bottomRight),d=n(y,l.topLeft)):(u=n(y,l.bottomLeft),d=n(y,l.topLeft)),t.angle=r(u,d)}var u,d,y,m=3*a/4,l={topLeft:[s,s],topRight:[e-s,s],bottomLeft:[s,o-s],bottomRight:[e-s,o-s]};switch(t.type){case"White":var g=Math.floor(4*Math.random());switch(g){case 0:i(t);break;case 1:h(t);break;case 2:c(t);break;case 3:f(t);break;default:throw{name:"unknown side",value:g}}break;case"Cyan":}}if(!t(this))return[];var f=i(this._dt/this._gameEnd,[0,1],[100,4]);this._spawnFrame=this._dt+i(Math.random(),[0,1],[4,f]),console.log(this._spawnFrame-this._dt);var u=h(this);return u.forEach(c),u},_spawn:function(e){e.forEach(function(e){switch(e.type){case"White":t.e("WhiteTachyon").whiteTachyon(e.id,e.x,e.y,e.angle,e.speed);break;case"Cyan":t.e("CyanTachyon").cyanTachyon(e.x,e.y,e.w,e.angle,e.speed)}})},spawner:function(t){return this._gameEnd=t,this},reset:function(){return this._dt=0,this.unbind("EnterFrame"),this},start:function(){return this.bind("EnterFrame",this._enterFrame),this}})}}]);