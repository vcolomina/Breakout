/**
 * Created by spries on 02/06/2016.
 */
///////////////////////////////////    Objecte game
function Game(){
    this.AMPLADA_TOTXO= 50; this.ALÇADA_TOTXO=25; // MIDES DEL TOTXO EN PÃXELS
    this.canvas,  this.context;       // context per poder dibuixar en el Canvas
    this.width, this.height;          // mides del canvas

    this.paddle;   // la raqueta
    this.ball;     // la pilota
    this.totxo;

    this.reversPaddle;

    this.willFrame = true;

    this.vida = 2;

    this.NIVELLS;

    this.nivellActual = 0;


    this.lol = [];

    this.t=0;      // el temps

    // Events del teclat
    this.key={
        RIGHT:{code: 39, pressed:false},
        LEFT :{code: 37, pressed:false}
    };

}

Game.prototype.inicialitzar = function(){
    this.t = 0;

    this.canvas = document.getElementById("game");
    this.width = this.AMPLADA_TOTXO*15;  // 15 totxos com a mÃ xim d'amplada
    this.canvas.width = this.width;
    this.height = this.ALÇADA_TOTXO*25;
    this.canvas.height =this.height;
    this.context = this.canvas.getContext("2d");

    this.paddle = new Paddle();
    this.reversPaddle = new reversPaddle();


    this.ball = new Ball();

    this.llegirNivells();

    var variableX = 0;
    var variableY = 0;



        for(var j = 0; j<this.NIVELLS[this.nivellActual].totxos.length; j++) {

            var string = this.NIVELLS[this.nivellActual].totxos[j];

            for (var k = 0; k < string.length; k++) {

                var lletra = string.charAt(k);
                if (lletra != " ") {
                    this.totxo = new Totxo(variableX, variableY, 50, 25, this.NIVELLS[this.nivellActual].colors[lletra]);
                    this.lol.push(this.totxo);
                }

                variableX = variableX + 50;
            }
            variableX = 0;
            variableY = variableY + 25
        }




    // Events amb jQuery
    $(document).on("keydown", {game:this},function(e) {
        if(e.keyCode==e.data.game.key.RIGHT.code){
            e.data.game.key.RIGHT.pressed = true;
        }
        else if(e.keyCode==e.data.game.key.LEFT.code){
            e.data.game.key.LEFT.pressed = true;
        }
    });
    $(document).on("keyup", {game:this},function(e) {
        if(e.keyCode==e.data.game.key.RIGHT.code){
            e.data.game.key.RIGHT.pressed = false;
        }
        else if(e.keyCode==e.data.game.key.LEFT.code){
            e.data.game.key.LEFT.pressed = false;
        }
    });

    this.t=new Date().getTime();     // inicialitzem el temps

    if(this.willFrame)
        requestAnimationFrame(mainLoop);

    else
        this.willFrame = true;
    
}

Game.prototype.draw = function(){


    if(game.lol.length == 0) {
        this.nivellActual++;
        console.log(this.nivellActual)
        delete game;
        delete this.paddle;
        delete this.ball;

        this.willFrame = false;

        game.inicialitzar();
    }

    this.context.clearRect(0, 0, this.width, this.height);

    for(var k = 0; k < this.lol.length; k++)
        this.lol[k].draw(this.context);

    this.paddle.draw(this.context);

    this.ball.draw(this.context);



    this.reversPaddle.draw(this.context);
};

Game.prototype.update = function(){
    var dt=Math.min((new Date().getTime() -this.t)/1000, 1); // temps, en segons, que ha passat des del darrer update
    this.t=new Date().getTime();

    this.paddle.update();    // Moviment de la raqueta
    this.ball.update(dt);    // moviment de la bola, depen del temps que ha passat

    this.reversPaddle.update();

};


//////////////////////////////////////////////////////////////////////
// ComenÃ§a el programa
var game;
$(document).ready(function(){
    game= new Game();  	   // Inicialitzem la instÃ ncia del joc
    game.inicialitzar();   // estat inicial del joc

});

function mainLoop(){

    game.update();
    game.draw();
    requestAnimationFrame(mainLoop);

}



///////////////////////////////////    Raqueta
function Paddle(){
    this.width = 150;
    this.height = 20;
    this.x = (game.width/2 - this.width/2) + 150;
    this.y = game.height-50;
    this.vx = 10;
    this.color = "#fbb"; // vermell
}

function reversPaddle(){
    this.width = 150;
    this.height = 20;
    this.x = (game.width/2 - this.width/2) ;
    this.y = game.height-50;
    this.vx = -10;
    this.color = "#000"; // vermell
}

Paddle.prototype.update = function(){
    if (game.key.RIGHT.pressed) {
        this.x = Math.min(game.width - this.width, this.x + this.vx);
    }
    else if (game.key.LEFT.pressed) {
        this.x = Math.max(0, this.x - this.vx);
    }
}

reversPaddle.prototype.update = function(){
    if (game.key.RIGHT.pressed) {
        this.x = Math.min(game.width - this.width, this.x + this.vx);
    }
    else if (game.key.LEFT.pressed) {
        this.x = Math.max(0, this.x - this.vx);
    }
}

Paddle.prototype.draw = function(ctx){
    ctx.save();
    ctx.fillStyle=this.color;
    ctx.fillRect(this.x, this.y, this.width, this.height);
    ctx.restore();
};

reversPaddle.prototype.draw = function(ctx){
    ctx.save();
    ctx.fillStyle=this.color;
    ctx.fillRect(this.x, this.y, this.width, this.height);
    ctx.restore();
};


///////////////////////////////////    Pilota
function Ball(){
    this.x = 0; this.y = 0;         // posiciÃ³ del centre de la pilota
    this.vx = 300;  this.vy = 310;  // velocitat = 300 pÃ­xels per segon, cal evitar els 45 graus en el check!!
    this.radi = 10;                 // radi de la pilota
    this.color = "#333";  // gris fosc
}

Ball.prototype.update = function(dt){
    var dtXoc;      // temps empleat fins al xoc
    var xoc=false;  // si hi ha xoc en aquest dt
    var k;          // proporciÃ³ de la trajectoria que supera al xoc
    var trajectoria={};
    trajectoria.p1={x:this.x, y:this.y};
//		var deltaX=this.vx*dt;
//		var deltaY=this.vy*dt;
    trajectoria.p2={x:this.x + this.vx*dt, y:this.y + this.vy*dt};  // nova posiciÃ³ de la bola

    // mirem tots els possibles xocs de la bola
    // Xoc amb la vora de sota de la pista
    if (trajectoria.p2.y + this.radi > game.height && game.vida > 0){
        // hem perdut l'intent actual

        k=(trajectoria.p2.y+this.radi - game.height)/this.vy;
        // ens colÂ·loquem just tocant la vora de la dreta
        this.x=100;
        this.y=100;
        dtXoc=k*dt;  // temps que queda
        game.vida--;
        xoc=true;


    }

    // Xoc amb la vora de dalt de la pista
    if (trajectoria.p2.y - this.radi < 0){
        k=(trajectoria.p2.y-this.radi)/this.vy;  // k sempre positiu
        // ens colÂ·loquem just tocant la vora de dalt
        this.x=trajectoria.p2.x-k*this.vx;
        this.y=this.radi;
        this.vy = -this.vy;
        dtXoc=k*dt;  // temps que queda
        xoc=true;
    }

    // Xoc amb la vora dreta de la pista
    if (trajectoria.p2.x + this.radi > game.width){
        k=(trajectoria.p2.x+this.radi - game.width)/this.vx;
        // ens colÂ·loquem just tocant la vora de la dreta
        this.x=game.width-this.radi;
        this.y=trajectoria.p2.y-k*this.vy;
        this.vx = -this.vx;
        dtXoc=k*dt;  // temps que queda
        xoc=true;
    }

    // Xoc amb la vora esquerra de la pista
    if (trajectoria.p2.x - this.radi< 0){
        k=(trajectoria.p2.x-this.radi)/this.vx;  // k sempre positiu
        // ens colÂ·loquem just tocant la vora de l'esquerra
        this.x=this.radi;
        this.y=trajectoria.p2.y-k*this.vy;
        this.vx = -this.vx;
        dtXoc=k*dt;  // temps que queda
        xoc=true;
    }

    // Xoc amb la raqueta
    var rXoc=Utilitats.interseccioSegmentRectangle(trajectoria,{p:{x:game.paddle.x, y:game.paddle.y-this.radi},
        w:game.paddle.width,
        h:game.paddle.height});
    if(rXoc){
        xoc=true;
        this.x=rXoc.p.x;
        this.y=rXoc.p.y;
        switch(rXoc.vora){
            case "superior":
            case "inferior":  this.vy = -this.vy; break;
            case "esquerra":
            case "dreta"   :  this.vx = -this.vx; break;
        }
        dtXoc=(Utilitats.distancia(rXoc.p,trajectoria.p2)/Utilitats.distancia(trajectoria.p1,trajectoria.p2))*dt;
    }



    // Xoc amb el mur
    // xoc amb un totxo

    for(var i = 0; i <game.lol.length; i++) {
        var pXoc = Utilitats.interseccioSegmentRectangle(trajectoria, {
            p: {x: game.lol[i].x - this.radi, y: game.lol[i].y - this.radi},
            w: game.lol[i].w + 2 * this.radi,
            h: game.lol[i].h + 2 * this.radi
        });
        if (pXoc) {
            xoc = true;
            game.lol.splice(i, 1);
            this.x = pXoc.p.x;
            this.y = pXoc.p.y;
            switch (pXoc.vora) {
                case "superior":
                case "inferior":
                    this.vy = -this.vy;
                    break;
                case "esquerra":
                case "dreta"   :
                    this.vx = -this.vx;
                    break;
            }
            dtXoc = (Utilitats.distancia(pXoc.p, trajectoria.p2) / Utilitats.distancia(trajectoria.p1, trajectoria.p2)) * dt;
        }
    }





    // actualitzem la posiciÃ³ de la bola
    if(xoc){
        this.update(dtXoc);  // crida recursiva
    }
    else{
        this.x=trajectoria.p2.x;
        this.y=trajectoria.p2.y;
    }



};


Ball.prototype.draw = function(ctx){
    ctx.save();
    ctx.fillStyle=this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radi, 0, 2*Math.PI);   // pilota rodona
    ctx.fill();
    ctx.stroke();
    ctx.restore();
};

///////////////////////////////////    Totxo
function Totxo(x,y,w,h,color){
    this.x=x; this.y=y;         // posiciÃ³, en pÃ­xels respecte el canvas
    this.w=w; this.h=h;         // mides
    this.color=color;
}

Totxo.prototype.draw = function(ctx){
    ctx.save();
    ctx.fillStyle=this.color;
    ctx.fillRect(this.x, this.y, this.w, this.h);
    ctx.strokeStyle="#333";
    ctx.strokeRect(this.x, this.y, this.w, this.h);
    ctx.restore();
};


//////////////////////////////////////////////////////////////////////
// Utilitats
var Utilitats={};
Utilitats.esTallen = function(p1,p2,p3,p4){
    function check(p1,p2,p3){
        return (p2.y-p1.y)*(p3.x-p1.x) < (p3.y-p1.y)*(p2.x-p1.x);
    }
    return check(p1,p2,p3) != check(p1,p2,p4) && check(p1,p3,p4) != check(p2,p3,p4);
}

// si retorna undefined Ã©s que no es tallen
Utilitats.puntInterseccio = function(p1,p2,p3,p4){
    var A1, B1, C1, A2, B2, C2, x, y, d;
    if(Utilitats.esTallen(p1,p2,p3,p4)){
        A1=p2.y-p1.y; B1=p1.x-p2.x; C1=p1.x*p2.y-p2.x*p1.y;
        A2=p4.y-p3.y; B2=p3.x-p4.x; C2=p3.x*p4.y-p4.x*p3.y;
        d=A1*B2-A2*B1;
        if(d!=0){
            x=(C1*B2-C2*B1)/d;
            y= (A1*C2-A2*C1)/d;
            return {x:x, y:y};
        }
    }
}

Utilitats.puntInterseccio2=function (p1,p2,p3,p4){
    // converteix segment1 a la forma general de recta: Ax+By = C
    var a1 = p2.y - p1.y;
    var b1 = p1.x - p2.x;
    var c1 = a1 * p1.x + b1 * p1.y;

    // converteix segment2 a la forma general de recta: Ax+By = C
    var a2 = p4.y - p3.y;
    var b2 = p3.x - p4.x;
    var c2 = a2 * p3.x + b2 * p3.y;

    // calculem el punt intersecciÃ³
    var d = a1*b2 - a2*b1;

    // lÃ­nies paralÂ·leles quan d Ã©s 0
    if (d == 0) {
        return false;
    }
    else {
        var x = (b2*c1 - b1*c2) / d;
        var y = (a1*c2 - a2*c1) / d;
        var puntInterseccio={x:x, y:y};	// aquest punt pertany a les dues rectes
        if(Utilitats.contePunt(p1,p2,puntInterseccio) && Utilitats.contePunt(p3,p4,puntInterseccio) )
            return puntInterseccio;
    }
}

Utilitats.contePunt=function(p1,p2, punt){
    return (valorDinsInterval(p1.x, punt.x, p2.x) || valorDinsInterval(p1.y, punt.y, p2.y));

    // funciÃ³ interna
    function valorDinsInterval(a, b, c) {
        // retorna cert si b estÃ  entre a i b, ambdos exclosos
        if (Math.abs(a-b) < 0.000001 || Math.abs(b-c) < 0.000001) { // no podem fer a==b amb valors reals!!
            return false;
        }
        return (a < b && b < c) || (c < b && b < a);
    }
}


Utilitats.distancia = function(p1,p2){
    return Math.sqrt((p2.x-p1.x)*(p2.x-p1.x)+(p2.y-p1.y)*(p2.y-p1.y));
}

Utilitats.interseccioSegmentRectangle = function(seg,rect){  // seg={p1:{x:,y:},p2:{x:,y:}}
    // rect={p:{x:,y:},w:,h:}
    var pI, dI, pImin, dImin=Infinity, vora;
    // vora superior
    pI=Utilitats.puntInterseccio(seg.p1, seg.p2,
        {x:rect.p.x,y:rect.p.y}, {x:rect.p.x+rect.w, y:rect.p.y});
    if(pI){
        dI=Utilitats.distancia(seg.p1, pI);
        if(dI<dImin){
            dImin=dI;
            pImin=pI;
            vora="superior";
        }
    }
    // vora inferior
    pI=Utilitats.puntInterseccio(seg.p1, seg.p2,
        {x:rect.p.x+rect.w, y:rect.p.y+rect.h},{x:rect.p.x, y:rect.p.y+rect.h});
    if(pI){
        dI=Utilitats.distancia(seg.p1, pI);
        if(dI<dImin){
            dImin=dI;
            pImin=pI;
            vora="inferior";
        }
    }

    // vora esquerra
    pI=Utilitats.puntInterseccio(seg.p1, seg.p2,
        {x:rect.p.x, y:rect.p.y+rect.h},{x:rect.p.x,y:rect.p.y});
    if(pI){
        dI=Utilitats.distancia(seg.p1, pI);
        if(dI<dImin){
            dImin=dI;
            pImin=pI;
            vora="esquerra";
        }
    }
    // vora dreta
    pI=Utilitats.puntInterseccio(seg.p1, seg.p2,
        {x:rect.p.x+rect.w, y:rect.p.y}, {x:rect.p.x+rect.w, y:rect.p.y+rect.h});
    if(pI){
        dI=Utilitats.distancia(seg.p1, pI);
        if(dI<dImin){
            dImin=dI;
            pImin=pI;
            vora="dreta";
        }
    }

    if(vora){
        return {p:pImin,vora:vora}
    }


}

///////////////////////////////////////////////////////////////////////////////////////////////////////

Game.prototype.llegirNivells = function(){
    this.NIVELLS = [
        {
            colors: {
//BOMBA
        l: "#000080", // Lila
        a: "#0000FF", // Lila flojo
        n: "#000000 ", // Negro
        b: "#FFFFFF", // Blanco
        s: "#9370DB", // Rosa
        r:"#FF0000 "//Rojo
},
    totxos: [
        "     nnnn       ",
        "   nnllllnn     ",
        "  naaaaallln    ",
        " naaaaaaallln nn",
        " n a aaaaallnn n",
        "nl a aaaaallnn n",
        "nl a aaaaaln   n",
        "nlaaaaaaaalnss n",
        "nllaaaaaalllnnsn",
        " nllaaaallllnnsn  ",
        " nllllllllln  nn",
        "  nnllllllnn    ",
        " nrrnllllnrrn   ",
        " nrrrnnnnrrrn   ",
        "  nrrn  nrrn    ",
        "   nn    nn     "
    ]
},
    {
        colors: {
//PLANTA
            n:"#FF8C00",//Naranja
            r:"#FF0000 ",//Rojo
            b:"#000000",//Negro
            g:"#32CD32 ",//Verde
            v:"#7CFC00 ",//Vede flojito
        } ,
        totxos: [
            "      bb       ",
            "  b   bnb   n  ",
            " bnb bnnnb bnb ",
            "bnnnnnnnnnnnnnb",
            "brnnnbbnnbbnnnb",
            "brnnbnbnbnnbnnb",
            "brnnnnnnnnnnnnb",
            " brnnnnnnnnnnb ",
            "  brrnnnnnnnnb ",
            "   bbrrrrrbb   ",
            "    bbbbbb     ",
            "  bbbbgvb bbb  ",
            " bgvvbgvbbgvvb ",
            "bggggvbvbggggvb",
            "bggggvbbbggggvb"
        ]
    } ,
        {
            colors: {
//BOO
                b:"#000000 ",//Negro
                g:"#A9A9A9 ",//Gris
                r:"#FF0000"//Rojo
            },
            totxos: [
                "      bbbbb     ",
                "    bbgggggbb   ",
                "   bgg     ggb  ",
                "  bg         gb ",
                " bg       b bgb ",
                "bg bbb    b b gb",
                "bg bbb    b b gb",
                " bgb          gb",
                "bg  b    r r rgb",
                "bg       rrrrrgb",
                "bg      rrrrrrgb",
                "bg      r r rgb ",
                " bg          gb ",
                "  bgg      ggb  ",
                "   bbggggggbb   ",
                "     bbbbbb     "
            ]
        } /*,
        {
            colors: {
//MARIO
                r:"#FF0000", // Roj
                g: "#32CD32 ", // Verde
                 y: "#EBAD00" // groc
},
    totxos: [
        "",
        " rrrrrr ",
        " rrrrrrrrr ",
        " gggyygy ",
        " gygyyygyyy ",
        " gyggyyygyyy ",
        " ggyyyygggg ",
        " yyyyyyy ",
        " ggrggg ",
        " gggrggrggg ",
        " ggggrrrrgggg ",
        " yygryrryrgyy ",
        " yyyrrrrrryyy ",
        " rrr rrr ",
        " ggg ggg ",
        " gggg gggg "
    ]
}*/
    ] ;
}


/*
Game.prototype.llegirNivells = function(){
    this.NIVELLS = [
        {
            colors: {
                t: "#F77", // taronja
                c: "#4CF", // blue cel
                v: "#8D1", // verd
                e: "#D30", // vermell
                l: "#00D", // blau
                r: "#F7B", // rosa
                p: "#BBB" // plata
            },
            totxos: [
                "",
                "",
                " p ",
                " ttttt ",
                " ccccccc ",
                " vvvvvvvvv ",
                " eeeeeeeee ",
                " lllllllll ",
                " r r r r r "
            ]
        }
    ];
}
    */

falta fer que comprovi les colisions amb el reverspaddle amb la pared y la pilota. a mes s'ha de posar la condicio de que no es  mostri sempre y 
modificar el codi per que pogui generar aleatoriament
