var game = new Phaser.Game(640, 480, Phaser.CANVAS, 'jogo');

var fundoJogo;
var player;
//var sprite;

var direcionais;

var tropa;
var municao;
var tempoDisparo = 0;
var botaoDisparo;
var audioTiro;
var explosao;
var audiodamorte;
var musica;
var zumbi;
var count = 45;
var morte0;
var morte1;
var morte2;
var morte3;
var morte4;

var menu = {


	preload: function(){

		game.load.audio('musica', 'audio/theme.ogg');
		game.load.image('fundo', 'img/fundo.png');
		game.load.image('nave', 'img/soldado.png');
		game.load.image('bala', 'img/bala.png');
		game.load.spritesheet('explosao', 'img/explosaun.png', 128, 128);
		game.load.spritesheet('zumbi', 'img/zumbi.png', 64,64);
		game.load.audio('tiro', 'audio/tei.ogg');
		
		/* audios de morte - randômicos*/
		game.load.audio('morte0', 'audio/morte/away.ogg');
		game.load.audio('morte1', 'audio/morte/dlc.ogg');
		game.load.audio('morte2', 'audio/morte/ai.ogg');
		game.load.audio('morte3', 'audio/morte/meuc.ogg');
		game.load.audio('morte4', 'audio/morte/bct.ogg');
		


	},
	create: function(){
		//adicionando imagens

		game.physics.startSystem(Phaser.Physics.ARCADE);
		musica = game.add.audio('musica');
		musica.loop = true;
		musica.volume = 0.4;
		musica.play();

		fundoJogo = game.add.tileSprite(0, 0, 640, 480, 'fundo');
		player    = game.add.sprite(game.width/2, 400, 'nave');

		

		audioTiro = game.add.audio('tiro');
		audioTiro.allowMultiple = false;
		audioTiro.volume = 0.2;

		morte0 = game.add.audio('morte0');
		morte0.allowMultiple = false;
		morte0.volume = 0.4;

		morte1 = game.add.audio('morte1');
		morte1.allowMultiple = false;
		morte1.volume = 0.3;
		
		morte2 = game.add.audio('morte2');
		morte2.allowMultiple = false;
		morte2.volume = 0.4;

		morte3 = game.add.audio('morte3');
		morte3.allowMultiple = false;
		morte3.volume = 0.4;

		morte4 = game.add.audio('morte4');
		morte4.allowMultiple = false;
		morte4.volume = 0.4;

		
		player.scale.setTo(0.1, 0.1);
		player.anchor.setTo(0.5, 0.5);
		
		game.physics.arcade.enable(player);
		player.body.collideWorldBounds = true;
		//direções
		direcionais  = game.input.keyboard.createCursorKeys();
		botaoDisparo = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

		municao = game.add.group();
		municao.enableBody = true;
		municao.physicsBodyType = Phaser.Physics.ARCADE;
		municao.createMultiple(20, 'bala');

		municao.setAll('anchor.x', 0);
		municao.setAll('anchor.y', 4.1);
		municao.setAll('outOfBoundsKill', true);
		municao.setAll('checkWorldBounds', true);

		tropa = game.add.group();
		tropa.enableBody = true;
		tropa.physicsBodyType = Phaser.Physics.ARCADE;
		//é tudo invertido nesse krl mds
		for(var y = 0 ; y < 5 ; y++)
		{
			for (var x = 0 ; x < 9 ; x++) 
			{
				zumbi = tropa.create(x*60, y*40, 'zumbi');
				zumbi.scale.setTo(0.7);
				zumbi.anchor.setTo(0.5);
				zumbi.animations.add('andar', [0,1,2,3], 4, true);

				zumbi.animations.play('andar', true);

			}
		}
		tropa.x = 50;
		tropa.y = 30;
		
		var animacao = game.add.tween(tropa).to({x:100}, 3000, Phaser.Easing.Linear.None, true, 0, 3000, true);
		animacao.onLoop.add(descer, this);
	},
	update: function(){



		if(direcionais.left.isDown)
		{
			player.x -= 10;
		}
		else if(direcionais.right.isDown)
		{
			player.x +=10;
		}
		

		var bala;
		if(botaoDisparo.isDown)
		{
			if(game.time.now > tempoDisparo)
			{
				bala = municao.getFirstExists(false);
			}
			if(bala)
			{
				bala.reset(player.x, player.y);
				audioTiro.play();
				bala.body.velocity.y = -300;
				tempoDisparo = game.time.now + 400;
			}
		}
		
		if(count == 0)
		{
			for(var y = 0 ; y < 5 ; y++)
		{
			for (var x = 0 ; x < 9 ; x++) 
			{
				zumbi = tropa.create(x*60, y*40, 'zumbi');
				zumbi.scale.setTo(0.7);
				zumbi.anchor.setTo(0.5);
				zumbi.animations.play('andar', true);

			}
		}
		
		
		count   = 45;
		tropa.x = 50;
		tropa.y = 30;
		}

		game.physics.arcade.overlap(municao, tropa, colisao, null, this);
	}
};



function colisao(bala, alien)
{

	bala.kill();
	alien.kill();
	count--;
	audiodamorte =  Math.floor((Math.random() * 5)); 

	switch(audiodamorte)
	{
		case 0:
			morte0.play();
			break;
		case 1:
			morte1.play();
			break;
		case 2:
			morte2.play();
			break;
		case 3:
			morte3.play();
			break;
		case 4:
			morte4.play();
			break;
			
	}

	explosao = game.add.sprite(alien.body.x, alien.body.y, 'explosao');
	explosao.anchor.setTo(0.3, 0.3);
	explosao.animations.add('explodir', [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40],80, false);
	explosao.animations.play('explodir', true);
}
	

function descer()
{
	tropa.y += 10;
}


game.state.add('menu', menu);
game.state.start('menu');
