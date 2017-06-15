var slider = function (setting) {
    "use strict";
    // function children(parent) {
    //     var node = parent.firstChild;
    //     var result = [];
    //     if (node) {
    //         do {
    //             if (node.nodeType === 1) {
    //                 result.push(node);
    //             }
    //         } while (node = node.nextSibling)
    //     }
    //     return result;
    // }
    function scrollTo(element, to, duration) {
        if (to === 0) {
            element.scrollLeft = to;
        } else {
            if (duration <= 0) return;
            var difference = to - element.scrollLeft,
                perTick = difference / duration * 10;

            setTimeout(function () {
                element.scrollLeft = element.scrollLeft + perTick;
                if (element.scrollLeft === to) return;
                scrollTo(element, to, duration - 10);
            }, 10);
        }
    }
    function fnSlider(setting) {
        var ui_slide = {};
        if (setting === undefined) {
            ui_slide.dom = document.getElementById('slideWrap')
        } else {
            ui_slide.dom = document.getElementById(setting['id']);
            ui_slide.setInterval = setting['setInterval'];
            ui_slide.setIntervalTime = setting['setIntervalTime'] || 1000;
            ui_slide.setIntervalSpeed = setting['setIntervalSpeed'] || 200;
            ui_slide.button = setting['button'];
            ui_slide.buttonWidth = setting['buttonWidth'] || 50;
            ui_slide.buttonHeight = setting['buttonHeight'] || 50;
        }
        ui_slide.virtualWrap = document.createElement('div');
        ui_slide.item = ui_slide.dom.children;
        ui_slide.itemLength = ui_slide.item.length;
        ui_slide.itemWidth = [];
        ui_slide.wrapWidth = 0;
        ui_slide.num = 0;
        ui_slide.dom.setAttribute('style', 'overflow:hidden;overflow-x:auto;');
        fnSlider.prototype.ptDo(ui_slide)
    }
    fnSlider.prototype = {
        ptStyle: function (ui_slide) {
            var i = 0;
            for (i; i < ui_slide.itemLength; i += 1) {
                var style = ui_slide.item[i].getAttribute('style');
                if (style !== null) {
                    style += ';float:left;'
                } else {
                    style = 'float:left;'
                }
                ui_slide.item[i].setAttribute('style', style);
                ui_slide.wrapWidth += ui_slide.item[i].clientWidth;
                ui_slide.itemWidth.push(ui_slide.wrapWidth);
            }
        },
        ptMoveItem: function (ui_slide) {
            while (ui_slide.item.length > 0) {
                ui_slide.virtualWrap.appendChild(ui_slide.item[0]);
            }
            ui_slide.virtualWrapStyle = 'width:' + ui_slide.wrapWidth + 'px;';
            ui_slide.dom.appendChild(ui_slide.virtualWrap).setAttribute('style', ui_slide.virtualWrapStyle);
            ui_slide.wrapHeight = ui_slide.dom.clientHeight;
        },
        ptSlideInit: function (ui_slide) {
            var i = 0,
                data = 0;
            ui_slide.scrollPosition = [];
            for (i; i < ui_slide.itemLength; i += 1) {
                ui_slide.scrollPosition[i] = ui_slide.itemWidth[i - 1] || data;
            }
            // console.log(ui_slide.scrollPosition)
        },
        ptSlide: function (ui_slide) {
            scrollTo(ui_slide.dom, ui_slide.scrollPosition[ui_slide.num], ui_slide.setIntervalSpeed)
        },
        ptSetInt: function (ui_slide) {
            ui_slide.setIntervalToggle = setInterval(function () {
                if (ui_slide.num < ui_slide.itemLength - 1) {
                    ui_slide.num += 1;
                } else {
                    ui_slide.num = 0;
                }
                fnSlider.prototype.ptSlide(ui_slide);
            }, ui_slide.setIntervalTime)
        },
        ptStopInt: function (ui_slide) {
            clearTimeout(ui_slide.setTimeoutToggle);
            clearInterval(ui_slide.setIntervalToggle);
            if (ui_slide.setInterval) {
                ui_slide.setTimeoutToggle = setTimeout(function () {
                    // 2,리턴된 num값 넣고 실행
                    fnSlider.prototype.ptSetInt(ui_slide);
                }, ui_slide.setIntervalTime * 2)
            }
        },
        ptMouse: function (ui_slide) {
            // 모바일작업해야됨
            if (ui_slide.setInterval) {
                ui_slide.dom.addEventListener('mousedown', function () {
                    ui_slide.mouse = 'down';
                    fnSlider.prototype.ptStopInt(ui_slide);
                });
                // ui_slide.dom.addEventListener('mouseleave',function(){
                //     ui_slide.mouse = 'leave';
                //     fnSlider.prototype.ptStopInt(ui_slide);
                // });
                ui_slide.dom.addEventListener('mouseup', function () {
                    ui_slide.mouse = 'up';
                    ui_slide.currentPosition = ui_slide.dom.scrollLeft;
                    fnSlider.prototype.ptScrollCheck(ui_slide);
                    console.log(ui_slide.num)
                    fnSlider.prototype.ptStopInt(ui_slide);
                })
            }
            ui_slide.dom.addEventListener('mouseup', function () {
                ui_slide.mouse = 'down';
                // 1.scroll위치 체크 후 가장 밀접한 아이템의 ui_slide.num값으로 리턴,
            })
        },
        ptScrollCheck: function (ui_slide) {
            // todo:진행중;
            var i = 0,
                abs = 0,
                near=0,
                min = ui_slide.scrollPosition[ui_slide.itemLength-1];
                // console.log(ui_slide.currentPosition)
            for (i; i < ui_slide.itemLength; i+=1) {
                abs = ((ui_slide.scrollPosition[i] - ui_slide.currentPosition) < 0) ? -(ui_slide.scrollPosition[i] - ui_slide.currentPosition) :
                    (ui_slide.scrollPosition[i] - ui_slide.currentPosition);
                if (abs < min) {
                    min = abs; //MIN
                    near = ui_slide.scrollPosition[i] //near : 가까운값
                    ui_slide.num = i;
                    // return ui_slide.num;
                    // console.log(i)
                }
            }
        },
        ptMakeBtn: function (ui_slide) {
            var btnWidth = ui_slide.buttonWidth,
                btnHeight = ui_slide.buttonHeight,
                commonStyle = 'position: absolute;width:' + btnWidth + 'px;height:' + btnHeight + 'px;margin-top:' + (ui_slide.wrapHeight / 2 - btnHeight / 2) + 'px;',
                leftStyle = 'left:0;',
                rightStyle = 'right:0;',
                btnLeft = document.createElement('button'),
                btnRight = document.createElement('button');
            ui_slide.dom.appendChild(btnLeft);
            ui_slide.dom.appendChild(btnRight);
            btnLeft.setAttribute('style', commonStyle + leftStyle);
            btnRight.setAttribute('style', commonStyle + rightStyle);
        },
        ptBtnAct: function () {

        },
        ptDo: function (ui_slide) {
            this.ptStyle(ui_slide);
            this.ptMoveItem(ui_slide);
            if (ui_slide.setInterval) {
                this.ptSlideInit(ui_slide);
                this.ptSetInt(ui_slide);
                this.ptMouse(ui_slide);
            }
            if (ui_slide.button) {
                this.ptMakeBtn(ui_slide);
                this.ptBtnAct(ui_slide);
                this.ptMouse(ui_slide);
            }
        },
    }
    var newSlider = new fnSlider(setting);
}
// uiwwnw 