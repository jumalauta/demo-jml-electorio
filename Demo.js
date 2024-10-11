
const deg2rad = 0.01745329251;
window.camPos = [0.0,0.0,0.0];
window.camPosLength = 1.0;
window.camFov = 0.0;
window.beat = 60/135;
window.pattern = window.beat*8;
window.camNear = 0.0;
window.camFar = 0.0;
window.redPercentage = 0.0;
window.bluePercentage = 0.0;
includeFile('multiSceneEffects/PostProcess.js');
includeFile('multiSceneEffects/dof.js')
includeFile('multiSceneEffects/EffectExplosion.js');
includeFile('sceneIntro/intro.js');
includeFile('multiSceneEffects/background.js');
includeFile('dynamicDemo/EffectStarfield.js');
Demo.prototype.cameraSetup = function() {
  this.loader.addAnimation({
      "camera": "cam1"
      ,"position":[{"x":0,"y":0,"z":0.0}]
      ,"lookAt":[{"x":0,"y":0.0,"z":0.0}]
      ,"up":[{"x":0,"y":1,"z":0}]
      ,"perspective":[{"fov":45,"aspect":16/9,"near":0.1,"far":1000}]
      ,"runPreFunction": (animation)=>{
          animation.position[0].x = 0 + Sync.get('General:CamRot')*Math.sin(Sync.get('General:CamRotSpeed')*getSceneTimeFromStart());
          animation.position[0].z = Sync.get('General:CamDistance') + Sync.get('General:CamRot')*Math.cos(Sync.get('General:CamRotSpeed')*getSceneTimeFromStart());
          animation.position[0].y = Sync.get('General:CamY');
          window.camPos = [animation.position[0].x,animation.position[0].y,animation.position[0].z];
          window.camNear = animation.perspective[0].near;
          //window.camFar = animation.perspective[0].far;
          window.camFar = animation.perspective[0].far;
          window.camFov = animation.perspective[0].fov*deg2rad;
          
          // console.log("camPos "+window.camPos);
          // console.log("camInvProjMat: " + window.camInvProjMat.elements + " camToWorldMat: "+ window.camToWorldMat.elements);
        }
  });    

  this.loader.addAnimation({
      "light": {
          "type": "Directional",
          "properties": { "intensity": 5.85 },
          "castShadow": true
      }
      ,position:[{x:()=>window.camPos[0],y:()=>window.camPos[1],z:()=>window.camPos[2]}]
      
      ,"color": [{
          "r": ()=>Sync.get('Light:R'), "g": ()=>Sync.get('Light:G'), "b": ()=>Sync.get('Light:B')
      }]
  });    
};

Demo.prototype.setScene = function (sceneName) {
    this.loader.setScene(sceneName);
    this.cameraSetup();
};

const settings = new Settings();
//settings.engine.preload = false;
settings.demo.renderer.sortObjects = false;
settings.demo.renderer.logarithmicDepthBuffer = false;
settings.demo.sync.rocketFile = 'sync/bzdr.rocket';
settings.demo.sync.beatsPerMinute = 135;
settings.demo.sync.rowsPerBeat = 8;
settings.demo.music.loop = true;
settings.demo.duration = 135000;
settings.demo.camera.near = 0.1;
settings.demo.camera.far = 1000.0;
settings.demo.image.texture.minFilter = 'NearestFilter';
settings.demo.image.texture.magFilter = 'NearestFilter';
//settings.demo.image.texture.wrapS = 'RepeatWrapping';
//settings.demo.image.texture.wrapT = 'RepeatWrapping';
settings.demo.fbo.color.texture.minFilter = 'NearestFilter';
settings.demo.fbo.color.texture.magFilter = 'NearestFilter';
//settings.demo.fbo.color.texture.wrapS = 'RepeatWrapping';
//settings.demo.fbo.color.texture.wrapT = 'RepeatWrapping';
settings.demo.model.shape.spline = { material: { type: 'Basic', transparent: true } };

Demo.prototype.init = function () {
  const start = 0;
  const duration = 120;
  const bpm = 120;
  const beat = 60/bpm;
  const pattern = beat*8;

  this.sceneIntro();
  this.bgEffect();
  this.loader.setScene('main');

  const scenes = [
    {start: 0*window.pattern, duration: 120, name: 'intro',dof:false},
  ];

  scenes.forEach((scene) => {
    this.loader.addAnimation({start: scene.start, duration: scene.duration, scene:{name:scene.name, fbo:{name:scene.name + 'Fbo'}}});
  });

  this.loader.addAnimation({fbo:{name:'screenDof',action:'begin',storeDepth:false}});
    scenes.forEach((scene) => {
        if (scene.dof) {
            this.loader.addAnimation({start: scene.start, duration: scene.duration, color:scene.color, image: [scene.name + 'Fbo.depth.fbo',scene.name + 'Fbo.color.fbo'],
            material:{blending:'CustomBlending', blendEquation:'MaxEquation', blendSrc:'SrcColorFactor', blendDst:'SrcColorFactor'},
            shader: {name: 'multiSceneEffects/depthToColor.fs'}
            });
        }
    });
  this.loader.addAnimation({fbo:{name:'screenDof',action:'unbind'}});

  this.loader.addAnimation({fbo:{name:'screenFbo',action:'begin',storeDepth:false}});
    scenes.forEach((scene) => {
        if (!scene.prePostProcessing) {
            this.loader.addAnimation({start: scene.start, duration: scene.duration, color:scene.color, image: scene.name + 'Fbo.color.fbo'});
        }

    });
  this.loader.addAnimation({fbo:{name:'screenFbo',action:'unbind'}});
  
  this.loader.addAnimation({fbo:{name:'blur',action:'begin',storeDepth:false}});
    this.loader.addAnimation({image: 'screenFbo.color.fbo',
        shader: { name: 'multiSceneEffects/gaussianBlur.fs',
            variable: [
            {"name":"directions", "value":[32.0]},
            {"name":"quality", "value":[4.0]},
            {"name":"size", "value":[16.0]}
            ]}
    });
  this.loader.addAnimation({fbo:{name:'blur',action:'unbind'}});

  this.loader.addAnimation({fbo:{name:'postProcessableFbo',action:'begin',storeDepth:false}});
    this.loader.addAnimation({
        image: ['screenFbo.color.fbo', 'blur.color.fbo', 'screenDof.color.fbo'],
        shader: { name: 'multiSceneEffects/dof.fs',
            variable: [
                {"name":"dofCenter", "value":[()=>Sync.get('General:dofCenter')]},
                {"name":"dofWidth", "value":[0.1]}
                ]}
    });
  this.loader.addAnimation({fbo:{name:'postProcessableFbo',action:'unbind'}});

  this.addPostProcess('postProcessableFbo.color.fbo');


  let partyNames1 = [
    `Freedom`,
    `People's`,
    `Liberty`,
    `Justice`,
    `Progressive`,
    `National`,
    `Democratic`,
    `Equality`,
    `Social`,
    `Reform`,
    `Patriot`,
    `Green`,
    `Civic`,
    `Independence`,
    `Workers'`,
    `Future`,
    `Färjan`,
    `United`,
    `Fascist`]

  let partyNames2 = [
    `Party`,
    `Alliance`,
    `Union`,
    `League`,
    `Movement`,
    `Coalition`,
    `Revolution`,
    `Bloc`,
    `Order`,
    `Färjan`,
    `Fascism`,
    `Socialism`,
    `Democracy`]

  let party1 = [Math.floor(Math.random()*partyNames1.length), Math.floor(Math.random()*partyNames2.length)];
  let party2 = [Math.floor(Math.random()*partyNames1.length), Math.floor(Math.random()*partyNames2.length)];
  this.loader.addAnimation([{
    "start":0,"duration":666,
    "text":{"string":partyNames1[party1[1]] + " " + partyNames2[party1[1]] + " ","name":"multiSceneEffects/techfont.ttf"
    },
    "perspective":"2d", 
    "color":[{"r":1.0,"g":1.0,"b":1.0}],
    "position":[{"x":-.2,"y":-0.36,"z":0}],
    "scale":[{"uniform2d":1.75}],
  }]);
  this.loader.addAnimation([{
    "start":0,"duration":666,
    "text":{"string":partyNames1[party2[1]] + " " + partyNames2[party2[1]] + " ","name":"multiSceneEffects/techfont.ttf"
    },
    "perspective":"2d", 
    "color":[{"r":1.0,"g":1.0,"b":1.0}],
    "position":[{"x":0.2,"y":-0.36,"z":0}],
    "scale":[{"uniform2d":1.75}],
  }]);

};
