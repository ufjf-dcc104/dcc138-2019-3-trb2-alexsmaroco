function ImageLoader(){
  this.images = {};
  this.tileCut = [];
  this.powerupCut = [];
}

ImageLoader.prototype.load = function (key, imgURL) {
  var img = new Image();
  img.src = imgURL;
  this.images[key] = img;
};

ImageLoader.prototype.drawSprite = function(ctx, key, sx, sy, sw, sh, dx, dy, dw, dh){
  ctx.drawImage(this.images[key],
    sx, sy, sw, sh,
    dx, dy, dw, dh
  );
}

ImageLoader.prototype.drawFrame = function(ctx,key,row,col,x,y, size){
  this.drawSprite(ctx, key, col*size, row*size, size, size, x, y, size, size);
}

ImageLoader.prototype.drawTile = function(ctx,key,tipo,dx,dy,dw,dh){
  this.drawSprite(ctx, key,
  this.tileCut[tipo].ox, this.tileCut[tipo].oy,
  this.tileCut[tipo].w, this.tileCut[tipo].h,
  dx, dy, dw, dh);
}

ImageLoader.prototype.drawBG = function(ctx, key, w, h) {
	ctx.drawImage(this.images[key], 
	0,0, this.images[key].width, this.images[key].height,
	0,0, w, h);
}

ImageLoader.prototype.drawPowerup = function(ctx,key,tipo,dx,dy,dw,dh){
  this.drawSprite(ctx, key,
  this.powerupCut[tipo].ox, this.powerupCut[tipo].oy,
  this.powerupCut[tipo].w, this.powerupCut[tipo].h,
  dx, dy, dw, dh);
}