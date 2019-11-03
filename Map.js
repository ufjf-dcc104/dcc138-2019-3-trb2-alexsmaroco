function Map(rows, columns) {
  this.SIZE = 40;
  this.columns = columns;
  this.rows = rows;
  this.cooldownPowerup = 1;
  this.powerups = [];
  this.cells = [];
  for (var r = 0; r < rows; r++) {
    this.cells[r] = [];
    for (var c = 0; c < columns; c++) {
		this.cells[r][c] = {tipo: "vazio", objeto: null, tipoObjeto: undefined};
	  //this.cells[r][c] = 0;
    }
	}
	this.animExplosion = []; // guarda animações de explosoes
}



Map.prototype.desenhar = function (ctx, images) {

  for (var r = 0; r < this.cells.length; r++) {
    for (var c = 0; c < this.cells[0].length; c++) {
			images.drawTile(ctx,
				"tiles", 0,
				c*this.SIZE,r*this.SIZE,
				this.SIZE, this.SIZE);
			switch(this.cells[r][c].tipo) {
				case "paredeInd":
					images.drawTile(ctx,
						"tiles", 1,
						c*this.SIZE,r*this.SIZE,
						this.SIZE, this.SIZE);
					break;
				case "paredeDest":
					images.drawTile(ctx,
						"tiles", 2,
						c*this.SIZE,r*this.SIZE,
						this.SIZE, this.SIZE);
					break;
				case "bomba":
					//ctx.fillStyle = "grey";
					//ctx.fillRect(c*this.SIZE, r*this.SIZE, this.SIZE, this.SIZE);
					break;
				case "vazio":
					if(this.cells[r][c].tipoObjeto === "powerup") {
						this.cells[r][c].objeto.desenhaPowerup(ctx, images);
					}
					break;
			}
    }
  }
	
	for(var i = this.animExplosion.length-1; i >= 0; i--) {
    images.drawExplosion(ctx, this.animExplosion[i].imgkey, this.animExplosion[i].tipo,
    this.SIZE*this.animExplosion[i].gx, this.SIZE*this.animExplosion[i].gy,
    this.SIZE, this.SIZE
  	);
    this.animExplosion[i].duracao-=dt;
    if(this.animExplosion[i].duracao < 0) {
      this.animExplosion.splice(i,1);
    }
  }
  
};

Map.prototype.setCells = function (newCells) {
  for (var i = 0; i < newCells.length; i++) {
    for (var j = 0; j < newCells[i].length; j++) {
      switch (newCells[i][j]) {
        case 1:
          this.cells[i][j] = {tipo: "paredeInd", objeto: null, tipoObjeto: undefined}; // parede indestrutivel
          break;
        case 2:
          this.cells[i][j] = {tipo: "paredeDest", objeto: null, tipoObjeto: undefined}; // parede destrutivel
          break;
        default:
          this.cells[i][j] = {tipo: "vazio", objeto: null, tipoObjeto: undefined}; // vazio
      }
    }
  }
};

// funçao para spawn de powerups em intervalos de tempo -- CORRIGIR
Map.prototype.spawnPowerup = function(dt) {
	this.cooldownPowerup-=dt;
	if(this.cooldownPowerup < 0) {
		var tipo = Math.floor(4+Math.random()*2);
		var gy = 0;
		var gx = 0;
		// busca local possivel
		while(this.cells[gy][gx].tipo != "vazio" || this.cells[gy][gx].tipo != "paredeDest") {
			gy = Math.floor(Math.random()*this.cells.length);
			gx = Math.floor(Math.random()*this.cells[0].length);
		}
		var powerup = new Sprite();
		powerup.x = Math.floor(gx*map.SIZE + map.SIZE/2);
		powerup.y = Math.floor(gy*map.SIZE + map.SIZE/2);
		powerup.gx = gx;
		powerup.gy = gy;
		//gambiarra, teria q usar math.floor em todos as verificaçoes da cell
		// this.cells[gy][gx] += 0.1;
		powerup.tipo = tipo;
		this.powerups.push(powerup);
		this.cooldownPowerup = 1;
	}
}

// Funçao pra spawn um numero fixo de powerups
Map.prototype.spawnPowerupFixo = function(qtd) {
	for(var i = 0; i < qtd; i++) {
		var tipo = Math.floor(Math.random()*2);
		var gy = 0;
		var gx = 0;
		// busca local possivel
		while(this.cells[gy][gx].tipo != "paredeDest" || this.cells[gy][gx].objeto != null) {
			gy = Math.floor(Math.random()*this.cells.length);
			gx = Math.floor(Math.random()*this.cells[0].length);
		}
		var powerup = new Sprite();
		powerup.x = Math.floor(gx*map.SIZE + map.SIZE/2);
		powerup.y = Math.floor(gy*map.SIZE + map.SIZE/2);
		powerup.gx = gx;
		powerup.gy = gy;
		powerup.imgkey = "powerup";
		//this.cells[gy][gx] += 0.1;
		powerup.tipo = tipo;
		this.cells[gy][gx].objeto = powerup;
		this.cells[gy][gx].tipoObjeto = "powerup";
		console.log("Spawn powerup " + i + ": " + gy + ", " + gx);
		//this.powerups.push(powerup);
	}
}

