
Demo.prototype.sceneIntro = function () {
    this.setScene('intro');
 
    this.loader.addAnimation({
      image: ['white.png'],
      perspective: '3d',

      scale: [{ uniform3d: 18.0}],
      color: [{ r:0,g:0,b:0}],
      position:[{"x":0,"y":0,"z":45}],
      angle:[{
        degreesX:()=>180+2.5*Math.sin(-1.5*getSceneTimeFromStart()),
        degreesZ:()=>6.5*Math.sin(-1.5*getSceneTimeFromStart()*2.0)
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


