(function() {
  $(function() {
    /*  키프레임 위에서 아래로 재생순서임. 애니메이션 한 그룹이 끝나고 다음 코드 실행*/
    /*  Globals 전역변수 설정
    -------------------------------------------------- */
    var PROPERTIES =               ['translateX', 'translateY', 'opacity', 'rotate', 'scale'],
        $window =                  $(window),
        $body =                    $('body'),
        wrappers =                 [],
        currentWrapper =           null,
        scrollTimeoutID =          0,
        bodyHeight =               0,
        windowHeight =             0,
        windowWidth =              0,
        prevKeyframesDurations =   0,
        scrollTop =                0,
        relativeScrollTop =        0,
        currentKeyframe =          0,
        keyframes = [
          {
            /* 씬1. 인트로*/
            'wrapper' : '#intro',
            'duration' : '100%',
            'animations' :  [
              {
                'selector'    : '.name',                            /* 인트로 텍스트 1  위로 더 많이 올라가면서 사라짐 */
                'translateY'  : -140,
                'opacity'     : 0
              } , {
                'selector'    : '.byline',                          /*   인트로 텍스트 2  위로 올라가면서 사라짐*/
                'translateY'  : -110,
                'opacity'     : 0
              } , {
                'selector'    : '.twitter',
                'opacity'     : [1, 0]
              }
            ]
          } , {
             /* 씬2. 두줄 설명과 사각형 폭발*/
            'wrapper' : '#explosion',
            'duration' : '150%',
            'animations' :  [
              {
                'selector'    : '.explosion-byline',                      /* 텍스트 1    위로 올라오면서 나타탐 */
                'translateY'  : '-25%',
                'opacity'     : [0, 1.75] // hack to accelrate opacity speed
              } , {
                'selector'    : '#domExplosionList',                         /* 박스 그룹객체   박스 통째 올라오면서 나타남 */
                'translateY'  : '-70%',
                'opacity'     : [0, 1] // hack to accelrate opacity speed
              }
            ]
          } , {
                /* 씬2. 사각형 그룹 폭발*/
            'wrapper' : '#explosion',
            'duration' : '150%',
            'animations' :  [
              {
                'selector'    : '.dei-1',                             /* 박스 1  좌상으로 두배 커지며 사라짐 */
                'translateY'  : '-15%',
                'translateX'  : '-10%',
                'opacity'     : [1, 0],
                'scale'       : 2,
              } , {
                'selector'    : '.dei-2',                                  /* 박스 2  좌상으로 사라짐*/
                'translateY'  : '-5%',
                'translateX'  : '-4%',
                'opacity'     : [1, 0] // hack to decelrate opacity speed
              } , {
                'selector'    : '.dei-3',                                    /* 박스 3  우상으로 조금 커지며 사라짐*/
                'translateY'  : '-9%',
                'translateX'  : '2%',
                'opacity'     : [1, 0], // hack to accelrate opacity speed
                'scale'       : 1.2,
              } , {
                'selector'    : '.dei-4',                                        /* 박스 4  우상으로 많이 커지며 사라짐*/
                'translateY'  : '-17%',
                'translateX'  : '8%',
                'opacity'     : [1, 0], // hack to accelrate opacity speed
                'scale'       : 1.5,
              } , {
                'selector'    : '.dei-5',                                          /* 박스 5  좌상으로 두배 커지며 사라짐*/
                'translateY'  : '-2%',
                'translateX'  : '-15%',
                'opacity'     : [1, 0],
                'scale'       : 2,
              } , {
                'selector'    : '.dei-6',                                      /* 박스 6  좌상으로 조금 커지며 사라짐*/
                'translateY'  : '-1%',
                'translateX'  : '-7%',
                'opacity'     : [1, 0], // hack to decelrate opacity speed
                'scale'       : 1.2,
              } , {
                'selector'    : '.dei-7',                                        /* 박스 7  우상으로 조금 커지며 사라짐 */
                'translateY'  : '-4%',
                'translateX'  : '2%',
                'opacity'     : [1, 0], // hack to accelrate opacity speed
                'scale'       : 1.1,
              } , {
                'selector'    : '.dei-8',                                        /* 박스 8  우상으로 커지며 사라짐*/
                'translateY'  : '-3%',
                'translateX'  : '12%',
                'opacity'     : [1, 0], // hack to accelrate opacity speed
                'scale'       : 1.8,
              } , {
                'selector'    : '.dei-9',                                        /* 박스 9   좌하로 조금 커지며 사라짐 */
                'translateY'  : '3%',
                'translateX'  : '-12%',
                'opacity'     : [1, 0],
                'scale'       : 1.5,
              } , {
                'selector'    : '.dei-10',                                         /* 박스 10   좌하로 사라짐*/
                'translateY'  : '5%',
                'translateX'  : '-4%',
                'opacity'     : [1, 0] // hack to decelrate opacity speed
              } , {
                'selector'    : '.dei-11',                                         /* 박스 11  우하로 조금 커지며 사라짐 */
                'translateY'  : '8%',
                'translateX'  : '6%',
                'opacity'     : [1, 0], // hack to accelrate opacity speed
                'scale'       : 1.4,
              } , {
                'selector'    : '.dei-12',                                           /* 박스 12 우하로  두배 커지며 사라짐 */
                'translateY'  : '1%',
                'translateX'  : '20%',
                'opacity'     : [1, 0], // hack to accelrate opacity speed
                'scale'       : 1.9,
              } , {
                'selector'    : '.dei-13',                                             /* 박스 13 좌하로 커지며 사라짐 */
                'translateY'  : '8%',
                'translateX'  : '-12%',
                'opacity'     : [1, 0],
                'scale'       : 1.8,
              } , {
                'selector'    : '.dei-14',                                             /* 박스 14  좌하로 조금 커지며 사라짐 */
                'translateY'  : '4%',
                'translateX'  : '-3%',
                'opacity'     : [1, 0], // hack to decelrate opacity speed
                'scale'       : 1.3,
              } , {
                'selector'    : '.dei-15',                                         /* 박스 15   우하로 커지며 사라짐  */
                'translateY'  : '14%',
                'translateX'  : '5%',
                'opacity'     : [1, 0], // hack to accelrate opacity speed
                'scale'       : 1.7,
              } , {
                'selector'    : '.dei-16',                                             /* 박스 16   우하로 두배 커지며 사라짐 */
                'translateY'  : '6%',
                'translateX'  : '9%',
                'opacity'     : [1, 0], // hack to accelrate opacity speed
                'scale'       : 2,
              }
            ]
          } , {
            'wrapper' : '#explosion',                                                /* 텍스트   위로 올라가며 사라짐 */
            'duration' : '100%',
            'animations' :  [
              {
                'selector'    : '.explosion-byline',
                'translateY'  : ['-25%', '-40%'],
                'opacity'     : [1, 0] // hack to accelrate opacity speed
              }
            ]
          } , {
            'wrapper' : '#images',
            'duration' : '150%',
            'animations' :  [
              {
                'selector'    : '.images-byline',                                 /* 텍스트   위로 올라오며 나타남  */
                'translateY'  : '-25%',
                'opacity'     : [0, 1.75] // hack to accelrate opacity speed
              } , {
                'selector'    : '#mediumHomepage',                                /* 홈페이지이미지   위로 올라옴  */
                'translateY'  : '-90%'
              } , {
                'selector'    : '.iphone',                                        /* 아이폰이미지   위로 올라옴   */
                'translateY'  : '-66%'
              }
            ]
          } , {
            'wrapper' : '#images',             /* 스크롤 해도 반응없는 공백 구간   */
            'duration' : '75%',
            'animations' :  []
          } , {
            'wrapper' : '#images',
            'duration' : '150%',
            'animations' :  [
              {
                'selector'    : '.images-byline',                                          /* 텍스트  1   Y좌표 유지하면서 작아지면서 사라짐 */
                'translateY'  : ['-25%', '-25%'],
                'scale'       : .7,
                'opacity'     : [1.75, -.75] // hack to accelrate opacity speed
              } , {
                'selector'    : '.images-byline-2',                                          /* 텍스트  2   위로 올라오면서 나타남 */
                'opacity'     : [0, 1],
                'translateY'  : '-15%'
              } , {
                'selector'    : '#mediumHomepage',                                         /* 홈페이지  Y좌표 유지하면서 작아지면서 사라짐 */
                'translateY'  : ['-90%', '-90%'],
                'scale'       : .8,
                'opacity'     : -.75
              } , {
                'selector'    : '.iphone',                                 /* 아이폰    로테이션하면서 커지면서 위로 이동 */
                'translateY'  : ['-66%', '-90%'],
                'translateX'  : '-2%',
                'rotate'      : -90,
                'scale'       : 1.3
              } , {
                'selector'    : '#medium-profile-iphone',                      /* 아이폰   커버 1  아웃  */
                'scale'       : .9,
                'translateX'  : '20%',
              } , {
                'selector'    : '#davegamache-dot-com',                           /* 아이폰   커버 2  인  */
                'scale'       : [.5, 1]
              }
            ]
          } , {
            'wrapper' : '#images',
            'duration' : '40%',
            'animations' :  []
          } , {
            'wrapper' : '#images',
            'duration' : '150%',
            'animations' :  [
              {
                'selector'    : '.images-byline-2',                                    /* 텍스트  2   페이드 아웃  */
                'opacity'     : [1, .5],
                'translateY'  : ['-15%', '50%'],
                'opacity'     : [1, -2]
              } , {
                'selector'    : '.iphone',                                             /* 아이폰  페이드 아웃  */
                'translateY'  : ['-90%', '5%'],
                'translateX'  : ['-2%', '-2%'],
                'rotate'      : [-90, -90],
                'scale'       : [1.3, 1.3]
              } , {
                'selector'    : '#medium-profile-iphone',
                'translateX'  : ['20%', '20%']
              } , {
                'selector'    : '#davegamache-dot-com',
                'scale'       : [1, 1]
              }
            ]
          } , {
            'wrapper' : '#links',
            'duration' : '100%',
            'animations' :  [
              {
                'selector'    : '#links',                                         /* 링크 객체 페이드 인  */
                'opacity'     : [0, 2],
                'scale'       : [.8, 1]
              } , {
                'selector'    : '.twitter',
                'opacity'     : [0, 1]
              }
            ]
          } , {
            'duration' : '100%',
            'animations' :  []
          }
        ]

    /*  Construction
    -------------------------------------------------- */
    init = function() {
      scrollIntervalID = setInterval(updatePage, 10);
      setupValues();
      $window.resize(throwError)
      if(isTouchDevice) {
        $window.resize(throwError)
      }
    }

    setupValues = function() {
      scrollTop = $window.scrollTop();
      windowHeight = $window.height();
      windowWidth = $window.width();
      convertAllPropsToPx();
      buildPage();
    }

    buildPage = function() {
      var i, j, k;
      for(i=0;i<keyframes.length;i++) { // loop keyframes
          bodyHeight += keyframes[i].duration;
          if($.inArray(keyframes[i].wrapper, wrappers) == -1) {
            wrappers.push(keyframes[i].wrapper);
          }
          for(j=0;j<keyframes[i].animations.length;j++) { // loop animations
            Object.keys(keyframes[i].animations[j]).forEach(function(key) { // loop properties
              value = keyframes[i].animations[j][key];
              if(key !== 'selector' && value instanceof Array === false) {
                var valueSet = [];
                valueSet.push(getDefaultPropertyValue(key), value);
                value = valueSet;
              }
              keyframes[i].animations[j][key] = value;
            });
          }
      }
      $body.height(bodyHeight);
      $window.scroll(0);
      currentWrapper = wrappers[0];
      $(currentWrapper).show();
    }

    convertAllPropsToPx = function() {
      var i, j, k;
      for(i=0;i<keyframes.length;i++) { // loop keyframes
        keyframes[i].duration = convertPercentToPx(keyframes[i].duration, 'y');
        for(j=0;j<keyframes[i].animations.length;j++) { // loop animations
          Object.keys(keyframes[i].animations[j]).forEach(function(key) { // loop properties
            value = keyframes[i].animations[j][key];
            if(key !== 'selector') {
              if(value instanceof Array) { // if its an array
                for(k=0;k<value.length;k++) { // if value in array is %
                  if(typeof value[k] === "string") {
                    if(key === 'translateY') {
                      value[k] = convertPercentToPx(value[k], 'y');
                    } else {
                      value[k] = convertPercentToPx(value[k], 'x');
                    }
                  }
                } 
              } else {
                if(typeof value === "string") { // if single value is a %
                  if(key === 'translateY') {
                    value = convertPercentToPx(value, 'y');
                  } else {
                    value = convertPercentToPx(value, 'x');
                  }
                }
              }
              keyframes[i].animations[j][key] = value;
            }
          });
        }
      }
    }

    getDefaultPropertyValue = function(property) {
      switch (property) {
        case 'translateX':
          return 0;
        case 'translateY':
          return 0;
        case 'scale':
          return 1;
        case 'rotate':
          return 0;
        case 'opacity':
          return 1;
        default:
          return null;
      }
    }

    /*  Animation/Scrolling
    -------------------------------------------------- */
    updatePage = function() {
      window.requestAnimationFrame(function() {
        setScrollTops();
        if(scrollTop > 0 && scrollTop <= (bodyHeight - windowHeight)) {
          animateElements();
          setKeyframe();
        }
      });
    }

    setScrollTops = function() {
      scrollTop = $window.scrollTop();
      relativeScrollTop = scrollTop - prevKeyframesDurations;
    }

    animateElements = function() {
      var animation, translateY, translateX, scale, rotate, opacity;
      for(var i=0;i<keyframes[currentKeyframe].animations.length;i++) {
        animation   = keyframes[currentKeyframe].animations[i];
        translateY  = calcPropValue(animation, 'translateY');
        translateX  = calcPropValue(animation, 'translateX');
        scale       = calcPropValue(animation, 'scale');
        rotate      = calcPropValue(animation, 'rotate');
        opacity     = calcPropValue(animation, 'opacity');

        $(animation.selector).css({
          'transform':    'translate3d(' + translateX +'px, ' + translateY + 'px, 0) scale('+ scale +') rotate('+ rotate +'deg)',
          'opacity' : opacity
        })
      }
    }

    calcPropValue = function(animation, property) {
      var value = animation[property];
      if(value) {
        value = easeInOutQuad(relativeScrollTop, value[0], (value[1]-value[0]), keyframes[currentKeyframe].duration);
      } else {
        value = getDefaultPropertyValue(property);
      }
      // value = +value.toFixed(2) 
      // TEMPORARILY REMOVED CAUSE SCALE DOESN'T WORK WITHA AGRESSIVE ROUNDING LIKE THIS
      return value;
    }

    easeInOutQuad = function (t, b, c, d) {
      //sinusoadial in and out
      return -c/2 * (Math.cos(Math.PI*t/d) - 1) + b;
    };

    setKeyframe = function() {
      if(scrollTop > (keyframes[currentKeyframe].duration + prevKeyframesDurations)) {
          prevKeyframesDurations += keyframes[currentKeyframe].duration;
          currentKeyframe++;
          showCurrentWrappers();
      } else if(scrollTop < prevKeyframesDurations) {
          currentKeyframe--;
          prevKeyframesDurations -= keyframes[currentKeyframe].duration;
          showCurrentWrappers();
      }
    }

    showCurrentWrappers = function() {
      var i;
      if(keyframes[currentKeyframe].wrapper != currentWrapper) {
        $(currentWrapper).hide();
        $(keyframes[currentKeyframe].wrapper).show();
        currentWrapper = keyframes[currentKeyframe].wrapper;
      }
    }

    /*  Helpers
    -------------------------------------------------- */

    convertPercentToPx = function(value, axis) {
      if(typeof value === "string" && value.match(/%/g)) {
        if(axis === 'y') value = (parseFloat(value) / 100) * windowHeight;
        if(axis === 'x') value = (parseFloat(value) / 100) * windowWidth;
      }
      return value;
    }

    throwError = function() {
      $body.addClass('page-error')
    }

    isTouchDevice = function() {
      return 'ontouchstart' in window // works on most browsers 
      || 'onmsgesturechange' in window; // works on ie10
    }

    init();

  })
}).call(this);