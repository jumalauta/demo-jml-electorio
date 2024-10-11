
Demo.prototype.sceneActualIntro = function () {
    this.setScene('actualIntro');
 
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

}
