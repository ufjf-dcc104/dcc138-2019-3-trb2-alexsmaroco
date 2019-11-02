var canvas;
var ctx;
var map;
var pc1;
var pc2;
var dt;
var images;
var anterior = 0;
var frame = 0;
var fim = false;

function init(){
  canvas = document.getElementsByTagName('canvas')[0];
  canvas.width = (13*40);
  canvas.height = (13*40)+20;
  ctx = canvas.getContext("2d");
  images = new ImageLoader();
  images.load("pc","assets/pc.png");
  map = new Map(Math.floor(canvas.height/40), Math.floor(canvas.width/40));
  //map.images = images;
  map.setCells([
    [1,1,1,1,1,1,1,1,1,1,1,1,1],
    [1,0,0,2,2,2,2,2,2,2,2,2,1],
    [1,0,1,2,1,2,1,2,1,2,1,2,1],
    [1,2,2,2,2,2,2,2,2,2,2,2,1],
    [1,2,1,2,1,2,1,2,1,2,1,2,1],
    [1,2,2,2,2,2,2,2,2,2,2,2,1],
    [1,2,1,2,1,2,1,2,1,2,1,2,1],
    [1,2,2,2,2,2,2,2,2,2,2,2,1],
	[1,2,1,2,1,2,1,2,1,2,1,2,1],
	[1,2,2,2,2,2,2,2,2,2,2,2,1],
    [1,2,1,2,1,2,1,2,1,2,1,0,1],
    [1,2,2,2,2,2,2,2,2,2,0,0,1],
    [1,1,1,1,1,1,1,1,1,1,1,1,1],
  ]);
  //map.cooldownPowerup = 5;
  map.spawnPowerupFixo(10);
  pc1 = new Sprite();
  pc1.id = "1";
  pc1.x = 60;
  pc1.y = 60;
  pc1.vidas = 3;
  pc1.imunidade = 1;
  pc1.imgkey = "pc";

  pc2 = new Sprite();
  pc2.id = "2";
  pc2.x = 460;
  pc2.y = 380+80;
  pc2.vidas = 3;
  pc2.imunidade = 1;
  pc2.imgkey = "pc";
  initControls();
  requestAnimationFrame(passo);
}


function passo(t){
  dt = (t-anterior)/1000;
  requestAnimationFrame(passo);
  ctx.clearRect(0,0, canvas.width, canvas.height);
  if(!this.fim) {
		// countdown das bombas
		for (var i = pc1.bombs.length-1;i>=0; i--) {
			pc1.bombs[i].timer-=dt;
			if(pc1.bombs[i].timer < 0) {
				explodir(pc1.bombs[i], map);
				pc1.bombs.splice(i, 1);
			}
		}
		for (var i = pc2.bombs.length-1;i>=0; i--) {
			pc2.bombs[i].timer-=dt;
			if(pc2.bombs[i].timer < 0) {
				explodir(pc2.bombs[i], map);
				pc2.bombs.splice(i, 1);
			}
		}
		// spawna powerups de tempos em tempos !! pode spawnar mais de um no mesmo lugar
		//map.spawnPowerup(dt);
		pc1.mover(map, dt);
		pc2.mover(map, dt);
	}

	map.desenhar(ctx, images);
	pc1.desenhar(ctx, images);
	pc2.desenhar(ctx, images);
    desenhaInfo(ctx);
	anterior = t;
}



function explodir(bomb, map) {
	var gx = Math.floor(bomb.x/map.SIZE);
	var gy = Math.floor(bomb.y/map.SIZE);
	var destruir1 = true;
	var destruir2 = true;
	var destruir3 = true;
	var destruir4 = true;
	var atingiup1 = false;
	var atingiup2 = false;
	
	// tira bomba do grid, se for trata-la como parede
	map.cells[gy][gx].tipo = "vazio";
	
	// caso fique em cima da bomba
	if(pc1.gx == gx && pc1.gy == gy) {
		atingiup1 = true;
	}
	if(pc2.gx == gx && pc2.gy == gy) {
		atingiup2 = true;
	}
	// verifica os arredores
	for(var i = 1; i <= bomb.power; i++) {
		if(gy-i >= 0 && destruir1) {
			switch(map.cells[gy-i][gx].tipo) {
				case "paredeInd":
					destruir1 = false;
					break;
				case "paredeDest":
					map.cells[gy-i][gx].tipo = "vazio";
					destruir1 = false;
					break;
				case "bomba":
					map.cells[gy-i][gx].tipo = "vazio";
					chainReaction((gy-i), gx);
					break;
			}
			// para de destruir ao encontrar parede
			/*
			if(map.cells[gy-i][gx].tipo === "paredeInd") {
				destruir1 = false;
			}
			if(map.cells[gy-i][gx].tipo === "paredeDest") {
				map.cells[gy-i][gx].tipo = "vazio";
				destruir1 = false;
			}
			*/
			if(pc1.gx == gx && pc1.gy == gy-i) {
				atingiup1 = true;
			}
			if(pc2.gx == gx && pc2.gy == gy-i) {
				atingiup2 = true;
			}
			if(destruir1) {
				bomb.desenhaExplosao(ctx,bomb.x, (gy-i)*map.SIZE+map.SIZE/2);
			}
		}
		if(gy+i < map.cells.length && destruir2) {
			// para de destruir ao encontrar parede
			switch(map.cells[gy+i][gx].tipo) {
				case "paredeInd":
					destruir1 = false;
					break;
				case "paredeDest":
					map.cells[gy+i][gx].tipo = "vazio";
					destruir1 = false;
					break;
				case "bomba":
					map.cells[gy+i][gx].tipo = "vazio";
					chainReaction((gy+i), gx);
					break;
			}
			/*
			if(map.cells[gy+i][gx].tipo === "paredeInd") {
				destruir2 = false;
			}
			if(map.cells[gy+i][gx].tipo === "paredeDest") {
				map.cells[gy+i][gx].tipo = "vazio";
				destruir2 = false;
			}
			*/
			if(pc1.gx == gx && pc1.gy == gy+i) {
				atingiup1 = true;
			}
			if(pc2.gx == gx && pc2.gy == gy+i) {
				atingiup2 = true;
			}
			if(destruir2) {
				bomb.desenhaExplosao(ctx,bomb.x, (gy+i)*map.SIZE+map.SIZE/2);
			}
		}
		if(gx-i >= 0 && destruir3) {
			// para de destruir ao encontrar parede
			switch(map.cells[gy][gx-i].tipo) {
				case "paredeInd":
					destruir1 = false;
					break;
				case "paredeDest":
					map.cells[gy][gx-i].tipo = "vazio";
					destruir1 = false;
					break;
				case "bomba":
					map.cells[gy][gx-i].tipo = "vazio";
					chainReaction(gy, (gx-i));
					break;
			}
			/*
			if(map.cells[gy][gx-i].tipo === "paredeInd") {
				destruir3 = false;
			}
			if(map.cells[gy][gx-i].tipo === "paredeDest") {
				map.cells[gy][gx-i].tipo = "vazio";
				destruir3 = false;
			}
			*/
			if(pc1.gx == gx-i && pc1.gy == gy) {
				atingiup1 = true;
			}
			if(pc2.gx == gx-i && pc2.gy == gy) {
				atingiup2 = true;
			}
			if(destruir3) {
				bomb.desenhaExplosao(ctx,(gx-i)*map.SIZE+map.SIZE/2, bomb.y);
			}
		}
		if(gx+i < map.cells[0].length && destruir4) {
			// para de destruir ao encontrar parede
			switch(map.cells[gy][gx+i].tipo) {
				case "paredeInd":
					destruir1 = false;
					break;
				case "paredeDest":
					map.cells[gy][gx+i].tipo = "vazio";
					destruir1 = false;
					break;
				case "bomba":
					map.cells[gy][gx+i].tipo = "vazio";
					chainReaction(gy, (gx+i));
					break;
			}
			/*
			if(map.cells[gy][gx+i].tipo === "paredeInd") {
				destruir4 = false;
			}
			if(map.cells[gy][gx+i].tipo === "paredeDest") {
				map.cells[gy][gx+i].tipo = "vazio";
				destruir4 = false;
			}
			*/
			if(pc1.gx == gx+i && pc1.gy == gy) {
				atingiup1 = true;
			}
			if(pc2.gx == gx+i && pc2.gy == gy) {
				atingiup2 = true;
			}
			if(destruir4) {
				bomb.desenhaExplosao(ctx,(gx+i)*map.SIZE+map.SIZE/2, bomb.y);
			}
		}
	}
	
	if(atingiup1 && pc1.imunidade < 0) {
		pc1.vidas--;
		pc1.imunidade = 1;
	}
	if(atingiup2 && pc2.imunidade < 0) {
		pc2.vidas--;
		pc2.imunidade = 1;
	}
}

function chainReaction(gy, gx) {
	for(let i = pc1.bombs.length-1; i >= 0; i--) {
		if(pc1.bombs[i].gx == gx && pc1.bombs[i].gy == gy) {
			console.log("encontrou bomba");
			explodir(pc1.bombs[i], map);
			pc1.bombs.splice(i, 1);
			return;
		}
	}
	for(let i = pc2.bombs.length-1; i >= 0; i--) {
		if(pc2.bombs[i].gx == gx && pc2.bombs[i].gy == gy) {
			explodir(pc2.bombs[i], map);
			pc2.bombs.splice(i, 1);
			return;
		}
	}
}

function dropBomb(player, map) {
	if(player.cooldown < 0 && player.bombs.length < player.maxBombs) {
		var bomb = new Sprite();
		var gx = Math.floor(player.x/map.SIZE);
		var gy = Math.floor(player.y/map.SIZE);
		// centraliza no grid
		bomb.x = gx*map.SIZE + map.SIZE/2;
		bomb.y = gy*map.SIZE + map.SIZE/2;
		bomb.gx = gx;
		bomb.gy = gy;
		// nao deixa atravessar bombas !! faz personagem bugar e atravessar paredes !!
		//map.cells[Math.floor(this.y/map.SIZE)][Math.floor(this.x/map.SIZE)] = 3;
		bomb.w = 20;
		bomb.h = 20;
		bomb.timer = 2;
		bomb.power = player.power;
		map.cells[gy][gx].tipo = "bomba";
		player.bombs.push(bomb);
		player.cooldown = 0.2;
	}
}



function desenhaInfo(ctx) {
  ctx.font = "15px Arial";
  ctx.fillStyle = "blue";
  ctx.fillText("Player 1: " + pc1.vidas + " vida(s)       " + "Player 2: " + pc2.vidas + " vida(s)", 100, 455+80);
  if(pc1.vidas <= 0) {
	ctx.font = "50px Arial";
	ctx.fillStyle = "blue";
	ctx.fillText("Player 2 venceu!", 50, this.canvas.height/2);
    this.fim = true;
  }
  if(pc2.vidas <= 0) {
    ctx.font = "50px Arial";
	ctx.fillStyle = "blue";
	ctx.fillText("Player 1 venceu!", 50, this.canvas.height/2);
    this.fim = true;
  }
}



function initControls(){
  addEventListener('keydown', function(e){
    switch (e.keyCode) {

		// player 1
	  case 32:
		dropBomb(pc1, map);
		break;
	  case 65:
        pc1.vx = -100;
		pc1.vy = 0;
        pc1.pose = 2;
        e.preventDefault();
        break;
      case 87:
        pc1.vy = -100;
		pc1.vx = 0;
        pc1.pose = 3;
        e.preventDefault();
        break;
      case 68:
        pc1.vx = 100;
		pc1.vy = 0;
        pc1.pose = 0;
        e.preventDefault();
        break;
      case 83:
        pc1.vy = 100;
		pc1.vx = 0;
        pc1.pose = 1;
        e.preventDefault();
        break;
	
		// player 2
	  case 13:
		dropBomb(pc2, map);
		break;
      case 37:
		pc2.vx = -100;
		pc2.vy = 0;
        pc2.pose = 2;
        e.preventDefault();
        break;
      case 38:
        pc2.vy = -100;
		pc2.vx = 0;
        pc2.pose = 3;
        e.preventDefault();
        break;
      case 39:
        pc2.vx = 100;
		pc2.vy = 0;
        pc2.pose = 0;
        e.preventDefault();
        break;
      case 40:
        pc2.vy = 100;
		pc2.vx = 0;
        pc2.pose = 1;
        e.preventDefault();
        break;
      default:

    }
  });
  addEventListener('keyup', function(e){
    switch (e.keyCode) {
		//player 1
	  case 65:
        pc1.vx = 0;
        break;
      case 87:
        pc1.vy = 0;
        break;
      case 68:
        pc1.vx = 0;
        break;
      case 83:
        pc1.vy = 0;
        break;
	
		// player 2
      case 37:
		pc2.vx = 0;
        break;
      case 38:
        pc2.vy = 0;
        break;
      case 39:
        pc2.vx = 0;
        break;
      case 40:
        pc2.vy = 0;
        break;
      default:

    }
  });
}
