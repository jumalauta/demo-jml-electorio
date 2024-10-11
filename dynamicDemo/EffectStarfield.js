

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
  let dead = 0;
  let redBoost = false;
  let blueBoost = false;
  let redMinorBoost = false;
  let blueMinorBoost = false;
  let minorBoostUsed = false;
  let eatThreshold = 0.02;
  const sizeX = areaSize * (16/9);
  const sizeY = areaSize *1.1;

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
      health:2,
      dead:false
    };

    if(entities[i].alignment==-1)
      reds++;
    if(entities[i].alignment==1)
      blues++;

  }
  
  let redMaxHealth=2;
  let blueMaxHealth=2;

  this.loader.addAnimation({
    start: startTime,
    duration: durationTime,
    runPreFunction: ()=>{
      reds=0;
      blues=0;

      if(getSceneTimeFromStart()>60)
      {
        window.suddenDeath = 1;
      }

      for(let i = 0; (i < entities.length);i++)
      {
        if(!entities[i].dead)
          {
        for(let k = i+1; (k < entities.length);k++)
          {
           if(!entities[k].dead)
           {
              let distance = Math.sqrt(
                Math.pow(entities[i].x - entities[k].x,2.0)+
                Math.pow(entities[i].y - entities[k].y,2.0));
              
              let sizeCombined = Math.sqrt(entities[i].size)+Math.sqrt(entities[k].size);
              if(distance<=sizeCombined && window.end < 1)
              {
                if(entities[i].alignment == entities[k].alignment)
                  {
                    let maxHealth = 2;
                    if(entities[i].alignment == -1)
                      maxHealth = redMaxHealth;
                    else
                      maxHealth = blueMaxHealth;

                    if(window.suddenDeath > 0)
                      maxHealth = 2;

                      entities[i].health++;
                      entities[k].health++;

                    if(entities[i].health>maxHealth)
                      entities[i].health = maxHealth;
                    if(entities[k].health>maxHealth)
                      entities[k].health = maxHealth;
                  }
                  else
                  {
                    entities[k].health -= Math.random()*2.0;
                    entities[i].health -= Math.random()*2.0;
                    
                    if(entities[k].health<0)
                    {                      
                      entities[k].alignment = -entities[k].alignment;
                      entities[k].health = 1;
                      if(window.suddenDeath > 0)
                        entities[k].dead = true;
                    }
                    if(entities[i].health<0)
                    {
                      entities[i].alignment = -entities[i].alignment;
                      entities[i].health = 1;
                      if(window.suddenDeath > 0)
                        entities[i].dead = true;
                    }



                    entities[k].xDir=-.55*(Math.random()-.5),
                    entities[i].xDir=-.55*(Math.random()-.5),
                    entities[k].yDir=-.55*(Math.random()-.5),
                    entities[i].yDir=-.55*(Math.random()-.5)
                  }
                }
              }
            }

            if(entities[i].alignment == -1 )
            {
              reds++;
            }
            if(entities[i].alignment == 1 )
            {
              blues++;
            }
            if(entities[i].dead )
            {
              dead++;
            }
        }
       }

       if(getSceneTimeFromStart() > 10 & window.endTime == 9999)
        {
          if(reds<blues && reds <5)
            window.endTime = getSceneTimeFromStart()+2.0;
          if(blues<reds && blues <5)
            window.endTime = getSceneTimeFromStart()+2.0;
          if(getSceneTimeFromStart()>90)
            window.endTime = getSceneTimeFromStart()+2.0;
        }

        if(getSceneTimeFromStart() > window.endTime-1)
          window.preEnd = 1;

        if(getSceneTimeFromStart() > window.endTime)
            window.end = 1;

        if(getSceneTimeFromStart() > window.endTime + 15)
        {
          window.location.hash = 'webdemoexe_exit';
          window.location.reload();
        }
            

        if(window.end)
        {          
          if(reds>blues)
          {          
            window.winnerparty1=1;
            window.winnerparty2=0;
            window.winnerparty3=0;
          }
          else if (reds<blues)
          {
            window.winnerparty1=0;
            window.winnerparty2=1;
            window.winnerparty3=0;
          }
          else
          {
            window.winnerparty1=0;
            window.winnerparty2=0;
            window.winnerparty3=1;
          }
        }

        if(reds - blues < -625 && !redBoost)
        {
          redBoost = true;
          blueBoost = false;
          redMinorBoost = false;
          blueMinorBoost = false;
          redMaxHealth = 2+Math.random()*3;
          blueMaxHealth = 2;
        }
        else if(blues - reds < -625 && !blueBoost)
        {
          redBoost = false;
          blueBoost = true;
          redMinorBoost = false;
          blueMinorBoost = false;
          redMaxHealth = 2;
          blueMaxHealth = 2+Math.random()*3;
        } else if(reds - blues < -425 && !redMinorBoost && !redBoost && !minorBoostUsed)
        {
          redMinorBoost = true;
          blueMinorBoost = false;
          redMaxHealth = 1.5+Math.random()*1;
          blueMaxHealth = 2;
        }
        else if(blues - reds < -425 && !blueMinorBoost && !blueBoost && !minorBoostUsed)
        {
          redMinorBoost = false;
          blueMinorBoost = true;
          redMaxHealth = 2;
          blueMaxHealth = 1.5+Math.random()*1;
        }

        if(dead<1000)
        {
          window.redPercentage = 10*(reds/(1000-dead));
          window.bluePercentage = 10*(blues/(1000-dead));
        }
        if(dead == 1000)
        {
          window.redPercentage = 0.0;
          window.bluePercentage = 0.0; 
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

        if(entities[i].dead)
          color.a = 0.0;
        else
          color.a = 1.0;

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

        object.scale.x = 2.5*entities[i].size;
        object.scale.y = 2.5*entities[i].size;
        object.scale.z = 2.5*entities[i].size;

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
