function Sprite(){
  this.x = 0;
  this.y = 0;
  this.gx = -1;
  this.gy = -1;
  this.vx = 0;
  this.vy = 0;
  this.SIZE = 16;
  this.pose = 0;
  this.frame = 0;
  this.poses = [
    {row: 11, col:1, frames:8, v: 4},
    {row: 10, col:1, frames:8, v: 4},
    {row: 9, col:1, frames:8, v: 4},
    {row: 8, col:1, frames:8, v: 4},
    {row: 11, col:0, frames:1, v: 4},
  ];
  this.imgkey = "pc";
  this.cooldown = 1;
  this.bombs = [];
  this.maxBombs = 3;
  this.power = 1;
}

Sprite.prototype.desenhar = function (ctx, images) {
  this.desenharSombra(ctx);
  this.desenharPose(ctx, images);
  for(var i = 0; i < this.bombs.length; i++) {
	   this.bombs[i].desenharBomba(ctx);
  }
}

Sprite.prototype.desenharSombra = function (ctx) {
  ctx.save();
  ctx.translate(this.x, this.y);
  ctx.fillStyle = "rgba(0,0,0,0.3)";
  ctx.beginPath();
  //ctx.fillRect(-this.SIZE/2, -this.SIZE/2, this.SIZE, this.SIZE);
  ctx.arc(0, 0, this.SIZE/2, 0, 2*Math.PI);
  ctx.fill();
  ctx.closePath;
  ctx.restore();
};

Sprite.prototype.desenharPose = function (ctx, images) {
  ctx.save();
  ctx.translate(this.x, this.y);
  images.drawFrame(ctx,
    this.imgkey,
    this.poses[this.pose].row,
    Math.floor(this.frame),
    -32,-56, 64
  );
  ctx.restore();
};

Sprite.prototype.desenharBomba = function(ctx) {
	ctx.save();
	ctx.translate(this.x, this.y);
	ctx.beginPath();
	ctx.arc(0, 0, this.w/2, 0, 2*Math.PI);
	ctx.fill();
	ctx.closePath();
	ctx.restore();
}


Sprite.prototype.desenhaExplosao = function(ctx,x,y) {
	ctx.save();
	ctx.translate(x, y);
	ctx.fillStyle = "black";
	ctx.beginPath();
	ctx.arc(0, 0, 10, 0, 2*Math.PI);
	ctx.fill();
	ctx.closePath();
	ctx.restore();
}

Sprite.prototype.desenhaPowerup = function(ctx) {
	ctx.save();
	ctx.translate(this.x, this.y);
	if(this.tipo == 0) {
		ctx.fillStyle = "brown";
	} else if(this.tipo == 1) {
		ctx.fillStyle = "green";
	}
	ctx.beginPath();
	ctx.arc(0, 0, 15, 0, 2*Math.PI);
	ctx.fill();
	ctx.closePath();
	ctx.restore();
}

Sprite.prototype.mover = function (map, dt) {
  if(this.cooldown > 0)
    this.cooldown-=dt;
  if(this.imunidade > 0)
    this.imunidade-=dt;

  this.gx = Math.floor(this.x/map.SIZE);
  this.gy = Math.floor(this.y/map.SIZE);
  
  // testa se pisou em powerup
  if(map.cells[this.gy][this.gx].tipoObjeto === "powerup") {
    switch(map.cells[this.gy][this.gx].objeto.tipo) {
      case 0:
        this.power++;
        break;
      case 1:
        this.maxBombs++;
        break;
      default: console.log("Powerup com tipo errado!");
    }
    map.cells[this.gy][this.gx].objeto = null;
    map.cells[this.gy][this.gx].tipoObjeto = undefined;
  }
  if(this.vx > 0 && map.cells[this.gy][this.gx+1].tipo != "vazio") {
    this.x += Math.min((this.gx+1)*map.SIZE - (this.x+this.SIZE/2),this.vx*dt);
	
  } else if(this.vx < 0 && map.cells[this.gy][this.gx-1].tipo != "vazio"){
      this.x += Math.max((this.gx)*map.SIZE - (this.x-this.SIZE/2),this.vx*dt);

	}
  else {
    this.x = this.x + this.vx*dt;
  }
  
  if(this.vy > 0 && map.cells[this.gy+1][this.gx].tipo != "vazio"){
    this.y += Math.min((this.gy+1)*map.SIZE - (this.y+this.SIZE/2),this.vy*dt);

  } else if(this.vy < 0 && map.cells[this.gy-1][this.gx].tipo != "vazio"){
      this.y += Math.max((this.gy)*map.SIZE - (this.y-this.SIZE/2),this.vy*dt);
	}
  else {
    this.y = this.y + this.vy*dt;
  }

  this.frame += this.poses[this.pose].v*dt;
  if(this.imgkey === "pc" && (this.vx == 0 && this.vy == 0)) this.frame = 0;
  if(this.frame>this.poses[this.pose].frames-1){
    this.frame = 0;
  }
  
};

