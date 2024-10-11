Demo.prototype.sceneDofTest = function () {
  this.setScene('dofTest');

    this.loader.addAnimation({
        "light": {
            "type": "Ambient",
            "properties": { "intensity":1.5 },
            "castShadow": false
        }
        ,"color": [{
          "r": 1.0, "g": 1.0, "b": 1.0
        }]
        ,"position": [{
          "x": 0, "y": 0, "z": 0
        }]
      });

    this.loader.addAnimation([{
        "object":{
          "name":"multiSceneEffects/obj_ak.obj"
        }
       ,"position":[{
          "x":15,
          "y":-15,
          "z":()=>-85+(Math.sin(.5*getSceneTimeFromStart())*75.0)
        }]
        ,"color":[{
          "r":1.0,
          "g":1.0,
          "b":1.0
        }]

       ,"scale":[{"uniform3d":22.0}]
      }]);
}