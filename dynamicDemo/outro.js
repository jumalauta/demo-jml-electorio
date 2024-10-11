Demo.prototype.sceneOutro = function () {
    this.setScene('outro');

/*
  
Boring technical demonstration

JML R&D division presents:
Hybrid vertex-raymarching renderer

Following demonstration shows some of the new features

This peach uses traditional vertex-based rendering

This carrot is raymarched

Notice the smooth intersection between objects

[ENGINE FOOTAGE]
*/
this.loader.addAnimation([{
  "object":{
      "name":"sceneOutro/obj_bgCube.obj"
    }
  ,"position":[{
      "x":0,
      "y":0,
      "z":0
  }]
  ,"color":[{
      "r":1.0,
      "g":1.0,
      "b":1.0
  }]
  ,"scale":[{"uniform3d":5.0}]
  ,"angle":[{
    "degreesX":0.0,
    "degreesY":0.0,
    "degreesZ":0.0
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



    this.loader.addAnimation([{
      start:10.5,duration:33,
      "object":{
          "name":"obj_peach.obj"
        }
      ,"position":[{
          "x":()=>Sync.get('Outro:PeachX'),
          "y":()=>Sync.get('Outro:PeachY'),
          "z":()=>Sync.get('Outro:PeachZ'),
      }]
      ,"color":[{
          "r":1.0,
          "g":1.0,
          "b":1.0
      }]
      ,"scale":[{"uniform3d":1.0}]
      ,"angle":[{
        "degreesX":0.0,
        "degreesY":0.0,
        "degreesZ":0.0
      }]
    }]);

    
    this.loader.addAnimation({
      start:15.5,duration:33,
      image: ['white.png'],
      perspective: '3d',

      position:[{"x":0,"y":0,"z":0.0}],
      scale: [{ uniform2d: 1.0}],        
      "material":{
        depthTest: true,
        depthWrite: true    
      },
      
      "shader":{
        "name":["rayMarcher.vs","rayMarcher.fs"],
        "variable":
        [          
          {"name":"MAX_STEPS","type":"float","value":[50.0]},
          {"name":"camPos","type":"vec3","value":[()=>window.camPos]},
          {"name":"camDirection","type":"vec3","value":[()=>window.camDirection]},
          {"name":"camNear","type":"mat4","value":[()=>window.camNear]},
          {"name":"camFar","type":"mat4","value":[()=>window.camFar]},
          {"name":"camFov","type":"mat4","value":[()=>window.camFov]},
          {"name":"carrotPosZ","type":"float","value":[()=>Sync.get('Outro:CarrotPos')]}
        ]
      }
  });
  this.addText('JML R&D DIVISION PRESENTS', 1, 9, 0, 0.125,0);
  this.addText('HYBRID VERTEX-RAYMARCHING RENDERER', 3, 7, 0, 0.0625,0);
  this.addText('FOLLOWING DEMONSTRATION ', 6, 4, 0, -0.05,0);
  this.addText('IS NOT FOR PUBLIC DISTRIBUTION', 6, 4, 0, -0.1,0);

  this.addText('THIS PEACH USES VERTEX-BASED RENDERING', 11, 4, 0, -0.13,0);

  this.addText('THIS CARROT IS RAYMARCHED', 16, 4, 0, -0.13,0);

  this.addText('OBSERVE THE SMOOTH INTERSECTION', 21.5, 14, 0, -0.13,0);
  this.addText('[ENGINE FOOTAGE]', 10, 39, 0, 0.2,-.55);



}
Demo.prototype.addText = function(text, startTime, durationTime, x, y,scalemod)
  {
    this.loader.addAnimation([{
      start:startTime,duration:durationTime,
      "text":{"string":text,"name":"multiSceneEffects/techfont.ttf"
      },
      "perspective":"2d", 
      "color":[{"r":.0,"g":.0,"b":.0}],
      "position":[{"x":x-.001,"y":y-.001,"z":0}],
      "scale":[{"uniform2d":1.5+scalemod}],
    }]);
    this.loader.addAnimation([{
      start:startTime,duration:durationTime,
      "text":{"string":text,"name":"multiSceneEffects/techfont.ttf"
      },
      "perspective":"2d", 
      "color":[{"r":.0,"g":.0,"b":.0}],
      "position":[{"x":x+.001,"y":y+.001,"z":0}],
      "scale":[{"uniform2d":1.5+scalemod}],
    }]);
    this.loader.addAnimation([{
      start:startTime,duration:durationTime,
      "text":{"string":text,"name":"multiSceneEffects/techfont.ttf"
      },
      "perspective":"2d", 
      "color":[{"r":1.0,"g":1.0,"b":1.0}],
      "position":[{"x":x,"y":y,"z":0}],
      "scale":[{"uniform2d":1.5+scalemod}],
    }]);
  }