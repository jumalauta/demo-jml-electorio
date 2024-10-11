
Demo.prototype.sceneIntro = function () {
    this.setScene('intro');
 


  this.loader.addAnimation([{
    "object":{
        "name":"dynamicDemo/obj_bgCube.obj"
      }
    ,"position":[{
        "x":0,
        "y":0,
        "z":1
    }]
    ,"color":[{
        "r":1.0,
        "g":1.0,
        "b":1.0
    }]
    ,"scale":[{"uniform3d":15.0}]
    ,"angle":[{
      "degreesX":()=>Math.sin(getSceneTimeFromStart()),
      "degreesY":()=>Math.sin(getSceneTimeFromStart()*1.3),
      "degreesZ":()=>Math.sin(getSceneTimeFromStart()*1.15),
    }],
    shader: {
      name: 'multiSceneEffects/colorcycle.fs',
      variable: [
        { name: 'shiftHue', value: [0] },
        { name: 'shiftSaturation', value: [0] },
        { name: 'shiftValue', value: [0] },
        { name: 'centerize', value: [0.0] }
      ]
    }
  }]);

  this.loader.addAnimation({
    image: ['white.png'],
    perspective: '3d',

    scale: [{ x: 0.55, y:()=>window.redPercentage}],
    color: [{ r:255,g:0,b:0,a:.90}],
    position:[{"x":7,"y":-10,"z":15}],
    angle:[{
      degreesX:()=>180
     }],
    textureProperties: [{},{minFilter: 'LinearFilter', magFilter: 'LinearFilter'}],
  });

  this.loader.addAnimation({
    image: ['white.png'],
    perspective: '3d',

    scale: [{ x: 0.55, y:()=>window.bluePercentage}],
    color: [{ r:0,g:0,b:255,a:.90}],
    position:[{"x":-7,"y":-10,"z":15}],
    angle:[{
      degreesX:()=>180
     }],
    textureProperties: [{},{minFilter: 'LinearFilter', magFilter: 'LinearFilter'}],
  });

  this.addEffectEntities(
    0,            //startTime
    10000,        //duration
    1000,         //entityAmount
    "dynamicDemo/tex_voterBall.png",
    25, // areaSize
    0.035 // particleSize
  );

}


