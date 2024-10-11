Demo.prototype.bgEffect = function() {

    this.loader.setScene('main');
    
    this.loader.addAnimation({
        fbo: { name: 'background', action: 'begin', storeDepth: false }
      });
  
      this.loader.addAnimation({
        start:0, duration: 28*window.pattern,
        image: ['bg/bg_bg1.png'],
        perspective: '2d',
    
        scale: [{ uniform3d: 1.0}],
        position:[{"x":0,"y":0,"z":0}],
        shader: {
            name: 'multiSceneEffects/colorcycle.fs',
            variable: [
              { name: 'shiftHue', value: [() => Sync.get('ColorCycle:Hue')] },
              {
                name: 'shiftSaturation',
                value: [() => Sync.get('ColorCycle:Saturation')] 
              },
              { name: 'shiftValue', value: [() => Sync.get('ColorCycle:Shift')] },
              {
                name: 'centerize',
                value: [() => Sync.get('ColorCycle:Centerize')]
              }
              //    {"name":"shiftHue", "value":[()=>Math.sin(getSceneTimeFromStart()*2.0)]},
              //    {"name":"shiftSaturation", "value":[()=>Math.sin(getSceneTimeFromStart()*0.1)]},
              //    {"name":"shiftValue", "value":[()=>Math.sin(getSceneTimeFromStart()*10.0)]}
            ]
          },
        
        textureProperties: [{},{minFilter: 'LinearFilter', magFilter: 'LinearFilter'}],
    });
    
    this.loader.addAnimation({
        "light": {
            "type": "Directional",
            "properties": { "intensity": 5.85 },
            "castShadow": true
        }
        ,position:[{x:()=>0,y:0,z:1}]
        
        ,"color": [{
            "r": 1.0, "g": 1.0, "b": 1.0
        }]
    });     

    this.loader.addAnimation([{
        start:18*window.pattern, duration: 28*window.pattern,
        "object":{
            "name":"obj_peach.obj"
          }
        ,"position":[{
          "x":0,
          "y":0,
          "z":-2,
        }]
        ,"color":[{
            "r":1.0,
            "g":1.0,
            "b":1.0
        }]
        ,"scale":[{"uniform3d":()=>-2.5}]
        ,"angle":[{             
          "degreesY":()=>180+Math.sin(getSceneTimeFromStart()*4)*25,              
          "degreesZ":()=>Math.sin(getSceneTimeFromStart()*4)*25,      
            
        }]
      }]);


    this.loader.addAnimation({
      fbo: { name: 'background', action: 'unbind', storeDepth: false }
    });
    
    
    this.loader.addAnimation({
      fbo: { name: 'backgroundEffect', action: 'begin', storeDepth: false }
    });

    
    this.loader.addAnimation({
        image: ['background.color.fbo'],
        perspective: '2d',

        scale: [{ uniform3d: 1.0}],
        position:[{"x":0,"y":0,"z":0}],
        textureProperties: [{ wrapS: 'RepeatWrapping', wrapT: 'RepeatWrapping' }],
      shader: {
        name: 'multiSceneEffects/background.fs',
        variable: [
          // chainEffectN value = <baseeffect>.<mix amount = .0 (all), .999 (minimum)>
          { name: 'chainEffect0', value: [() => Sync.get('BgEffect:e0')] },
          { name: 'chainEffect1', value: [() => Sync.get('BgEffect:e1')] },
          { name: 'chainEffect2', value: [() => Sync.get('BgEffect:e2')] },
          { name: 'chainEffect3', value: [() => Sync.get('BgEffect:e3')] },
          { name: 'chainEffect4', value: [() => Sync.get('BgEffect:e4')] },
          { name: 'chainEffect5', value: [() => Sync.get('BgEffect:e5')] },
          { name: 'chainEffect6', value: [() => Sync.get('BgEffect:e6')] },
          { name: 'chainEffect7', value: [() => Sync.get('BgEffect:e7')] },
          { name: 'chainEffect8', value: [() => Sync.get('BgEffect:e8')] },
          { name: 'chainEffect9', value: [() => Sync.get('BgEffect:e9')] },
          // chaineffect base effect numbers:
          // 0: no-operation
          // 1: texcoordinate bias
          {
            name: 'coordBias',
            value: [
              () => Sync.get('BgEffect:coordBiasX'),
              () => Sync.get('BgEffect:coordBiasY')
            ]
          },
          // 2: texcoordinate bias 2
          {
            name: 'coordBias2',
            value: [
              () => Sync.get('BgEffect:coordBias2X'),
              () => Sync.get('BgEffect:coordBias2Y')
            ]
          },
          // 3: kaleidoscope
          {
            name: 'kaleidoscopeXangle',
            value: [() => Sync.get('BgEffect:kaleidoAngle')]
          },
          // 4: funky deformation
          // 5: rotozoom
          { name: 'angle', value: [() => Sync.get('BgEffect:rotoAngle')] },
          { name: 'zoom', value: [() => Sync.get('BgEffect:rotoZoom')] },
          // 6: tunnel
          // 7: plasma deformation
          {
            name: 'scale',
            value: [
              () => Sync.get('BgEffect:plasmaScaleX'),
              () => Sync.get('BgEffect:plasmaScaleY')
            ]
          },
          { name: 'speed', value: [() => Sync.get('BgEffect:Speed')] },
          // 8: mirror scroll
          {
            name: 'mirrorSpeed',
            value: [
              () => Sync.get('BgEffect:mirrorSpeedX'),
              () => Sync.get('BgEffect:mirrorSpeedY')
            ]
          }
        ]
      }
    });
    


    
    this.loader.addAnimation({
      fbo: { name: 'backgroundEffect', action: 'unbind', storeDepth: false }
    });
    
    }