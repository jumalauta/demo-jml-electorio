Demo.prototype.addDof = function (inputImage, inputDepth) {

    this.loader.addAnimation({fbo:{name:'blur',action:'begin',storeDepth:false}});
    
        this.loader.addAnimation({
            image: inputImage,
            shader: {
                name: 'multiSceneEffects/gaussianBlur.fs',
                variable: [
                {"name":"directions", "value":[32.0]},
                {"name":"quality", "value":[4.0]},
                {"name":"size", "value":[16.0]}
                ]
            }
        });
    
    this.loader.addAnimation({fbo:{name:'blur',action:'unbind'}});
    
    this.loader.addAnimation({fbo:{name:'screenDof',action:'begin',storeDepth:false}});
        this.loader.addAnimation({
            image: [inputImage, 'blur.color.fbo',  inputDepth],
            shader: {
                name: 'multiSceneEffects/dof.fs',
                variable: [
                    {"name":"dofCenter", "value":[.2]},
                    {"name":"dofWidth", "value":[1.2]}
                    ]
            }
        });
    this.loader.addAnimation({fbo:{name:'screenDof',action:'unbind'}});

}

