var game = new Phaser.Game(640, 480, Phaser.CANVAS, 'phaser_div');

var fundoJogo;
var player;
//var sprite;

var direcionais;

var botao_voltar;

var tempo;
var timer;
var wave;
var bgmenu;
var textmenu;
var count_descidas = 0;
var tropa;
var municao;
var tempoDisparo = 0;
var botaoDisparo;
var botaoStart;
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
var audio_inicio;
var audio_gameover;


var intervalo_balas = 400;

var tempo_stage = 40000;
var texto_LCD;
var instrucoes = {


		preload: function(){
				game.load.audio('inicio', 'audio/inicio.ogg');
		},
		create: function(){
				var style = { font: "30px Times New Roman", fill: "#ffffff", align: "center" };
				var text = game.add.text(game.world.centerX, game.world.centerY, "INSTRUÇÕES \n\nCOMA O CU DE GERAL", style);
				text.anchor.set(0.5);

				audio_inicio = game.add.audio('inicio');
				audio_inicio.play();

				game.time.events.add(Phaser.Timer.SECOND * 7, jogar, this);


		},
		update: function(){

		}

};

var menu = {

		preload: function(){
				game.load.image('mainmenu', 'img/menu.png');
				game.load.image('textmenu', 'img/menu2.png');
		},
		create: function(){
			botaoStart = game.input.keyboard.addKey(Phaser.Keyboard.ENTER);
			bgmenu = game.add.tileSprite(0, -480, 640, 480, 'mainmenu');
			textmenu = game.add.tileSprite(0, 0, 640, 480, 'textmenu');
			
			textmenu.alpha = 0;

			game.add.tween(bgmenu).to( { y: '+480' }, 2000, Phaser.Easing.Linear.None, true);
			game.time.events.add(Phaser.Timer.SECOND * 2, textMenu, this);
		},
		update: function(){
			if(botaoStart.isDown)
			{
				game.state.start('instrucoes');
			}
		}

};

var gameover = {

		preload: function(){
				
				game.load.image('button', 'img/voltar.png');
				game.load.audio('audiogameover', 'audio/gameover.ogg');
		},
		create: function(){

				

				var style = { font: "100px Times New Roman", fill: "#ff0000", align: "center" };
				var text = game.add.text(game.world.centerX, game.world.centerY, "GAME OVER", style);
				text.anchor.set(0.5);

				audio_gameover = game.add.audio('audiogameover');
				audio_gameover.play();

				botao_voltar = game.add.button(game.world.centerX - 95, 400, 'button', jogar, this, 2, 1, 0);
				botao_voltar.anchor.set(0.5);
				botao_voltar.x = 300;
				botao_voltar.scale.setTo(0.6);

				botao_voltar.alpha = 0;
				text.alpha         = 0;

				game.add.tween(text).to( { alpha: 1 }, 2000, Phaser.Easing.Linear.None, true, 1, 0, false);

				game.time.events.add(Phaser.Timer.SECOND * 3, fadeBotao, this);

		},
		update: function(){

		}

};


var jogo = {


	preload: function(){

		game.load.audio('musica', 'audio/tema.ogg');
		game.load.image('fundo', 'img/fundo.png');
		game.load.image('nave', 'img/soldado.png');
		game.load.image('bala', 'img/bala.png');
		game.load.spritesheet('explosao', 'img/explosaun.png', 128, 128);
		game.load.spritesheet('zumbi', 'img/zumbi.png', 64,64);
		game.load.audio('tiro', 'audio/tei.ogg');
		
		// audios de morte - randômicos
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


		timer = game.time.create(false);
		timer.loop(tempo_stage, fimDeJogo, this);
		timer.start();
		wave = 1;

		player.scale.setTo(0.1, 0.1);
		player.anchor.setTo(0.5, 0.5);
		
		game.physics.arcade.enable(player);
		player.body.collideWorldBounds = true;
		//direções
		direcionais  = game.input.keyboard.createCursorKeys();
		botaoDisparo = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

		carregarArma();

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
				bala.body.velocity.y = -300; //-300
				tempoDisparo = game.time.now + 400;//intervalo_balas; //400
			}
		}
		

		/* QUANDO UMA WAVE MORRE */
		if(count == 0)
		{

			for(var y = 0 ; y < 5 ; y++)
			{
			for (var x = 0 ; x < 9 ; x++) 
				{
					zumbi = tropa.create(x*60, y*40, 'zumbi');
					zumbi.scale.setTo(0.7);
					zumbi.anchor.setTo(0.5);
					zumbi.animations.add('andar', [0,1,2,3], 4, true);
					count_descidas = 0;
					zumbi.animations.play('andar', true);

				}
			}
			
			if(tempo <= 20)
			{
				intervalo_balas = 300;
			}
				municao.destroy();
				carregarArma();
				timer.stop(false);
				timer = game.time.create(false);
				tempo_stage = tempo_stage - 1000;
				timer.loop(tempo_stage, fimDeJogo, this);
				timer.start();
				wave ++;
				count   = 45;
				tropa.x = 50;
				tropa.y = 30;
		}

		game.physics.arcade.overlap(municao, tropa, colisao, null, this);
	},
	render: function()
	{
		tempo = parseInt(timer.duration.toFixed(0) / 1000);
		texto_LCD =  game.debug.text('Onda: ' + wave + ' | Tempo: ' + (tempo + 1), 40, 462);
		

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
	count_descidas ++;

}

function voltarAoMenu()
{
	game.start.start('jogo');
}

function fadeBotao()
{
		game.add.tween(botao_voltar).to( { alpha: 1 }, 1000, Phaser.Easing.Linear.None, true, 1, 0, false);	
}

function textMenu()
{
		//game.add.tween(textmenu).to( { alpha: 1 }, 0, Phaser.Easing.Linear.None, true, 1, 0, false);
		game.add.tween(textmenu).to( { alpha: 1 }, 1000, Phaser.Easing.Linear.None, true, 0, 1000, true);	
}

function jogar() {

    game.state.start('jogo');


}


function fimDeJogo()
{
	musica.stop();
	tropa.remove(zumbi);
	tempo_stage = 40000;
	game.state.start('gameover');
}


function carregarArma()
{
		municao = game.add.group();
		municao.enableBody = true;
		municao.physicsBodyType = Phaser.Physics.ARCADE;
		municao.createMultiple(200, 'bala');

		municao.setAll('anchor.x', 0);
		municao.setAll('anchor.y', 4.1);
		municao.setAll('outOfBoundsKill', true);
		municao.setAll('checkWorldBounds', true);
}


game.state.add('menu', menu);
game.state.add('gameover', gameover);
game.state.add('jogo', jogo);
game.state.add('instrucoes', instrucoes);

game.state.start('menu');
