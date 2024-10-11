Demo.prototype.createPostProcess = function (initialInputImage, finalOutputFbo, shaderDefinitions) {
  let inputImage = initialInputImage;
  let outputFbo = undefined;
  for(let i = 0; i < shaderDefinitions.length; i++) {
    if (i > 0) {
      inputImage = `${outputFbo}.color.fbo`;
    }
    outputFbo = `${finalOutputFbo}_${`00${i}`.slice(-3)}`;
    if (i === shaderDefinitions.length - 1) {
      outputFbo = finalOutputFbo;
    }

    this.loader.addAnimation({fbo:{name:outputFbo,action:'begin',storeDepth:false}});
    this.loader.addAnimation({
      image: [inputImage, ...shaderDefinitions[i].additionalImages || []],
      // LUT needs LinearFilter to work properly
      textureProperties: [{},{minFilter: 'LinearFilter', magFilter: 'LinearFilter'}],
      shader: shaderDefinitions[i].shader,
    });
    this.loader.addAnimation({fbo:{name:outputFbo,action:'unbind'}});
  }
}

Demo.prototype.addPostProcess = function (image, bypass) {
  if (bypass) {
    this.loader.addAnimation({
      image: [image],
    });
    return;
  }

  this.createPostProcess(
    image,
    'glowFbo',
    [
    {shader: {name: 'multiSceneEffects/colorClamp.fs', 'variable': [
      {'name':'threshold','value':[0.17]},
    ]}},
    {shader: {name: 'multiSceneEffects/glow.fs', 'variable': [
      {'name':'direction','value':[()=>[1.,0.]]},
      {'name':'samples','value':[()=>Sync.get('PostProc:GlowSamples')]},
      {'name':'spread','value':[()=>1/1920*5*Sync.get('PostProc:GlowSpread')]},
      {'name':'intensity','value':[()=>Sync.get('PostProc:GlowIntensity')]}
    ]}},
    {shader: {name: 'multiSceneEffects/glow.fs', 'variable': [
      {'name':'direction','value':[()=>[0.,1.]]},
      {'name':'samples','value':[()=>Sync.get('PostProc:GlowSamples')]},
      {'name':'spread','value':[()=>1/1080*4*Sync.get('PostProc:GlowSpread')]},
      {'name':'intensity','value':[()=>Sync.get('PostProc:GlowIntensity')]}
    ]}},
  ]);
  
  this.loader.addAnimation({fbo:{name:'finalGlowFbo',action:'begin',storeDepth:false}});
  this.loader.addAnimation({
    image: image,
  });
  this.loader.addAnimation({
    image: 'glowFbo.color.fbo',
    color:[{'a':0.3}]
  });
  this.loader.addAnimation({
    image: 'glowFbo.color.fbo',
    scale:[{'uniform2d':1.05}],
    color:[{'a':0.2}]
  });
  this.loader.addAnimation({
    image: 'glowFbo.color.fbo',
    scale:[{'uniform2d':1.1}],
    color:[{'a':0.1}]
  });
  this.loader.addAnimation({fbo:{name:'finalGlowFbo',action:'unbind'}});

  const randSize = 0.08;
  const randShift = randSize/2;
  this.createPostProcess(
    'finalGlowFbo.color.fbo',
    'finalFbo',
    [
      {additionalImages: ['spectogram.png'], 
        shader:{name:'multiSceneEffects/distortion.fs',
          variable:[
               {name:'timeMultiplier',value:[0.8]}
              ,{name:'fftShift',value:[0.8]}
              ,{name:'mixShift',value:[()=>Sync.get('PostProc:Distortion')]}, //1.0 == distortion disabled
              ,{name:'pixelSize',value:[()=> 0.007,0.007]}
              ,{name:'noiseWaveSpeed',value:[10]}
              ,{name:'noiseWaveSize',value:[0.05]}
              ,{name:'noiseLuminance',value:[1]}
              ,{name:'noiseAlpha',value:[0.01]}
              ,{name:'colorComponentDistortionX',value:[()=> Math.random()*randSize-randShift,Math.random()*randSize-randShift,Math.random()*randSize-randShift,0.00]}
              ,{name:'colorComponentDistortionY',value:[()=> Math.random()*randSize-randShift,Math.random()*randSize-randShift,Math.random()*randSize-randShift,0.00]}
          ]
        }
    },
    {additionalImages: ['multiSceneEffects/lut.png'],
      shader: {name: 'multiSceneEffects/postProcess.fs', "variable": [
        {"name":"exposure","value":[()=>Sync.get('PostProc:Exposure')]},
        {"name":"exposureBoom","value":[()=>Sync.get('PostProc:ExposureBoom')*(getSceneTimeFromStart()%window.beat)]},
        {"name":"postContrast","value":[()=>Sync.get('PostProc:Contrast')]},
        {"name":"fadeToBlack","value":[()=>Sync.get('PostProc:FadeToBlack')]},
        {"name":"fadeToWhite","value":[()=>Sync.get('PostProc:FadeToWhite')]},
        {"name":"lensEffect","value":[()=>Sync.get('PostProc:LensEffect')]}
      ]}},
  ]);

  this.loader.addAnimation({
    image: 'finalFbo.color.fbo',
    "position":[{
      "x":()=>(Math.random()*Sync.get('PostProc:Shake'))-0.5*Sync.get('PostProc:Shake'),
      "y":()=>(Math.random()*Sync.get('PostProc:Shake'))-0.5*Sync.get('PostProc:Shake')
      }]
    });
}

