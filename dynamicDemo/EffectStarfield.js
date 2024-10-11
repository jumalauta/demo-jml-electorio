

/*
Alku:
Aloituspiste x,y
Suunta x,y

Suoritus:
Liiku suuntaan x,y
y<min || y>max { y=-y; x+random-random
y<min y=-y;

*/

Demo.prototype.addEffectEntities = function (
  startTime,
  durationTime,
  amountOfEntities,
  texture,
  areaSize,
  particleSize
) {

  let entities = new Array(amountOfEntities);
  let reds = 0;
  let blues = 0;
  let eatThreshold = 0.02;
  const sizeX = areaSize * (16/9);
  const sizeY = areaSize;

  for (let i = 0; i < entities.length; i++) {
    let z1 = Math.random();
    entities[i] = {
      x: Math.random() * (sizeX-.5) * 2 - (sizeX-.5),
      y: Math.random() * (sizeY-.5) * 2 - (sizeY-.5),
      z: 0.0,
      xDir: .35*(Math.random()-.5),
      yDir: .35*(Math.random()-.5),
      size: particleSize,
      alive: true,
      alignment:-1 +2*((i+1)%2),
      health:2
    };

    if(entities[i].alignment==-1)
      reds++;
    if(entities[i].alignment==1)
      blues++;

    console.log("start situation reds " + reds + " blues " + blues);
  }
  
  let redMaxHealth=2;
  let blueMaxHealth=2;

  this.loader.addAnimation({
    start: startTime,
    duration: durationTime,
    runPreFunction: ()=>{
      reds=0;
      blues=0;

      for(let i = 0; (i < entities.length);i++)
      {
        for(let k = i+1; (k < entities.length);k++)
          {

              let distance = Math.sqrt(
                Math.pow(entities[i].x - entities[k].x,2.0)+
                Math.pow(entities[i].y - entities[k].y,2.0));
              
              let sizeCombined = Math.sqrt(entities[i].size)+Math.sqrt(entities[k].size);
              if(distance<=sizeCombined)
              {
                if(entities[i].alignment == entities[k].alignment)
                  {
                    let maxHealth = 2;
                    if(entities[i].alignment == -1)
                      maxHealth = redMaxHealth;
                    else
                      maxHealth = blueMaxHealth;

                    entities[i].health++;
                    entities[k].health++;
                    if(entities[i].health>maxHealth)
                      entities[i].health = 2;
                    if(entities[k].health>maxHealth)
                      entities[k].health = 2;
                  }
                  else
                  {
                    entities[k].health -= Math.random()*2.0;
                    entities[i].health -= Math.random()*2.0;
                    
                    if(entities[k].health<0)
                    {
                      entities[k].alignment = -entities[k].alignment;
                      entities[k].health = 1;
                    }
                    if(entities[i].health<0)
                    {
                      entities[i].alignment = -entities[i].alignment;
                      entities[i].health = 1;
                    }



                    entities[k].xDir=-.55*(Math.random()-.5),
                    entities[i].xDir=-.55*(Math.random()-.5),
                    entities[k].yDir=-.55*(Math.random()-.5),
                    entities[i].yDir=-.55*(Math.random()-.5)
                  }
              }
            }

            if(entities[i].alignment == -1 )
            {
              reds++;
            }
            if(entities[i].alignment == 1 )
            {
              blues++
            }
        }
        console.log("reds " + reds + " blues " + blues );

        if(reds - blues < -625)
        {
          redMaxHealth = 3;
          blueMaxHealth = 1;
        }
        else if(blues - reds < -625)
        {
          redMaxHealth = 1;
          blueMaxHealth = 3;
        }
        

      }
  });
  
  this.loader.addAnimation({
    start: startTime,
    duration: durationTime,
    image: texture,
    textureProperties: [
      {},
      { minFilter: 'NearestMipmapNearestFilter', magFilter: 'LinearFilter' }
    ],
    perspective: '3d',
    billboard: true,
    additive: false,
    scale: [{ uniform3d: 0.1 }],
    instancer: {
      count: entities.length, 
      runInstanceFunction: (properties) => {
        const i = properties.index;
        const count = properties.count;
        const time = properties.time;
        let object = properties.object;
        let color = properties.color;
        color.g=0.0;

        if(entities[i].alignment == 1)
        {
          color.r=0.0;
          color.b=1.0;
        }
        if(entities[i].alignment == -1)
        {
          color.b=0.0;
          color.r=1.0;
        }

        object.scale.x = 2*entities[i].size;
        object.scale.y = 2*entities[i].size;
        object.scale.z = 2*entities[i].size;

        entities[i].x += entities[i].xDir;
        entities[i].y += entities[i].yDir;

        
        if(entities[i].x > sizeX || entities[i].x < -sizeX)
          entities[i].xDir = -entities[i].xDir;
        if(entities[i].y > sizeY || entities[i].y < -sizeY)
          entities[i].yDir = -entities[i].yDir;

        // collision check

    
        object.position.z = 0;          
        object.position.x = entities[i].x;
        object.position.y = entities[i].y;
        //object.position.z = stars[i].z1*size*2-size;
      }
    }
  });
};
