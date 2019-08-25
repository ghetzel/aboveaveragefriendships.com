'use strict';

window.app = {};

$(function(){
    try {
    // if (!$.cookie('windows98startup')) {
    //     $.cookie('windows98startup', true);
        new buzz.sound('/assets/sounds/the-microsoft-sound', {
            formats: [ 'ogg', 'mp3', 'aac' ]
        }).play();
    // }

    // window.onbeforeunload = function() {
    //     new buzz.sound('/assets/sounds/logoff', {
    //         formats: [ 'ogg', 'mp3', 'aac' ]
    //     }).play();
    // }
    } catch (e) { ; }

    var cascadeOffsetX = 20;
    var cascadeOffsetY = 20;
    var cascadeResetLowerMargin = 64;
    var pageCenterX = window.innerWidth / 2;
    var pageCenterY = (window.innerHeight / 2) - cascadeResetLowerMargin;
    var originalStartX = pageCenterX;
    var originalStartY = pageCenterY;
    var startX = originalStartX;
    var startY = originalStartY;
    var startD = 30;
    window.topZ = 10000;

    window.app.load = function(el, url, success) {
        var win = $(el).closest('.w9x-window');

        if (win.length) {
            return win.find('.w9x-window-contents').load(url, function(){
                if ($.isFunction(success)) {
                    success(win);
                }
            });
        }
    }

    window.app.select = function(el) {
        var link = $(el);
        var expl = $(link).closest('.w9x-icon-container');

        if (expl.length) {
            expl.find('a').removeClass('icon-selected');
            link.addClass('icon-selected');
        }
    }

    // generic implementation of all modal pop-up dialogs/prompts/alerts.
    window.app.message = function(config) {
        var config = (config || {});
        var body  = $('<div></div>');
        var dbody = $('<div></div>').addClass('w9x-dialog-body');

        if (config.icon) {
            dbody.append(
                $('<i></i>').addClass('ico-32 ico-' + config.icon)
            );
        }

        dbody.append($('<div></div>').html(config.message));
        body.append(dbody);

        if ($.isArray(config.buttons)) {
            var buttonrow = $('<div></div>').addClass('w9x-dialog-buttons');

            $.each(config.buttons, function(i, button) {
                var btn = $('<button></button>').addClass('btn').text(button.label);

                switch (button.action) {
                case 'close':
                    btn.attr('onclick', "window.app.closeWindow(this)");
                    break;
                }

                if ($.isArray(button.attrs)) {
                    $.each(button.attrs, function(v, k) {
                        btn.attr(k, v);
                    });
                }

                buttonrow.append(btn);
            });

            if (buttonrow.length) {
                body.append(buttonrow);
            }
        }

        window.app.newWindow(false, {
            'title':      (config.title || 'Alert'),
            'body':       body,
            'classes':    'w9x-dialog',
            'noMaximize': true,
            'noMinimize': true,
            'width':      (config.width || 300),
            'height':     (config.height || 120),
        });

        if (config.sound) {
            new buzz.sound('/assets/sounds/' + config.sound, {
                formats: [ 'ogg', 'mp3', 'aac' ]
            }).play();
        }
    }

    window.app.error = function(title, message) {
        window.app.message({
            'icon':    'error',
            'sound':   'chord',
            'title':   title,
            'message': message,
            'buttons': [{
                'label':  'OK',
                'action': 'close',
            }],
        });
    }

    window.app.closeWindow = function(el) {
        $(el).closest('.w9x-window').remove();
        startX = pageCenterX;
        startY = pageCenterY;
    }

    // open a new window
    window.app.newWindow = function(url, config) {
        var win = null;

        config = (config || {});

        if (config.unmanaged) {
            win = $('<div></div>')

            win.load(url, function(){
                sync(win);
            });
        } else {
            win = $('<div></div>').addClass('w9x-frame w9x-window' + (config.classes ? ' ' + config.classes : ''));
            win.uniqueId();

            var ttb = $('<div></div>').addClass('w9x-titlebar');

            var act = $('<div></div>').addClass('w9x-titlebar-actions');
            var con = $('<div></div>').addClass('w9x-window-contents');

            ttb.text(config.title || 'New Window');

            if (!config.noMaximize) {
                ttb.on('click', function(e){
                    win.css({
                        'z-index': ++window.topZ,
                    });
                });

                ttb.on('dblclick', function(e){
                    win.toggleClass('state-maximized');
                });
            }

            if (!config.noMinimize) {
                act.append($('<a></a>').addClass('btn btn-minimize'));
            }

            if (!config.noMaximize) {
                act.append(
                    $('<a></a>').addClass('btn btn-maximize').on('click', function(e){
                        win.toggleClass('state-maximized');
                    })
                );
            }

            act.append(
                $('<a></a>').addClass('btn btn-close').on('click', function(e){
                    $(win).remove();
                })
            );

            ttb.append(act);
            win.append(ttb);
            win.append(con);

            var width = parseInt(config.width   || window.innerWidth * 0.6);
            var height = parseInt(config.height || window.innerHeight * 0.8);

            win.width(width);
            win.height(height);

            win.draggable({
                handle: '.w9x-titlebar',
            });

            if (config.x == 'center') {
                config.x = pageCenterX;
            }

            if (config.y == 'center') {
                config.y = pageCenterY;
            }

            config.x = (config.x || startX);
            config.y = (config.y || startY);

            // set initial window position
            win.css({
                'left':    config.x - (width / 2),
                'top':     config.y - (height / 2),
                'z-index': ++window.topZ,
            });

            // increment global start positions for the "cascade" effect
            startX += startD;
            startY += startD;

            // reset the cascade from the top, moving over and down a bit
            if (startY > ($(window).height() - cascadeResetLowerMargin)) {
                originalStartX += cascadeOffsetX;
                originalStartY += cascadeOffsetY;
                startY = originalStartY;
                startX = originalStartX;
            }

            if (url) {
                con.load(url, function(){
                    sync(win);
                });
            } else if (config.body) {
                con.empty().append(config.body);
            }
        }

        $('body').append(win);
    };

    // global click handler
    $(document).on('click', function(e){
        // unless a click originates from the Start menu or Start button,
        // close the Start menu
        var el = $(e.target);

        if (
            !el.closest('#start').length &&
            !el.closest('.btn-start').length
        ) {
            $('#start').removeClass('open');
        }

        // handle selection/deselection

        if (el.not('.icon-selected')) {
            $('.icon-selected').removeClass('icon-selected');
        }

        // <A> clicks
        var a = el.closest('a');

        if (a.length) {
            if (a.attr('data-webview-action')) {
                switch (a.attr('data-webview-action')) {
                case 'back':
                    a.closest('.w9x-window').find('.w9x-webview').get(0).contentWindow.history.back();
                    break;
                case 'forward':
                    a.closest('.w9x-window').find('.w9x-webview').get(0).contentWindow.history.forward();
                    break;
                case 'stop':
                    a.closest('.w9x-window').find('.w9x-webview').get(0).contentWindow.stop();
                    break;
                case 'refresh':
                    a.closest('.w9x-window').find('.w9x-webview').get(0).contentWindow.location.reload();
                    break;
                case 'home':
                    a.closest('.w9x-window').find('.w9x-webview').get(0).contentWindow.location.href = 'https://gary.cool/comply.html';
                    break;
                }
            } else if (a.attr('data-target')) {
                $(a.attr('data-target')).load(a.attr('href'));
            } else if (
                (el.closest('#start').length && a.attr('href')) ||
                (a.attr('data-type') == 'link')
            ) {
                window.app.newWindow(a.attr('href'), {
                    title:     a.attr('title'),
                    width:     a.attr('data-window-width'),
                    height:    a.attr('data-window-height'),
                    unmanaged: (a.attr('data-window-unmanaged') == 'true'),
                });

                $('#start').removeClass('open');
            } else {
                window.app.select(a);
            }

            e.preventDefault();
        }
    });

    // global double-click handler
    $(document).on('dblclick', function(e){
        var a = $(e.target).closest('a');

        if (a.attr('data-target')) {
            return;
        } else if (a.length) {
            if (a.attr('href')) {
                window.app.newWindow(a.attr('href'), {
                    title:     a.attr('title'),
                    width:     a.attr('data-window-width'),
                    height:    a.attr('data-window-height'),
                    unmanaged: (a.attr('data-window-unmanaged') == 'true'),
                });

                return;
            }

            e.preventDefault();
        }
    });

    var sync = function(el) {
        // el.find('.menu').menu();
        // el.find('.menubar').menu({
        //     position: {
        //         my: 'top-48 left',
        //     },
        // });
    };

    $('#taskbar .btn-start').on('click', function(e){
        $('#start').toggleClass('open');
    });

    var syncTime = function() {
        $('time').each(function(i, e){
            var el = $(e);

            if (el.attr('data-format')) {
                el.text(moment().format(el.attr('data-format')))
            }
        })
    }

    setInterval(syncTime, 1000);
    syncTime();

    Mousetrap.addKeycodes({
        91: 'lwin',
        92: 'rwin'
    });

    Mousetrap.bind(['lwin', 'rwin', 'ctrl+esc'], function(){
        $('#start').toggleClass('open');
    });

    Mousetrap.bind('esc', function(){
        $('#start').removeClass('open');
    });

    Mousetrap.bind('alt+f4', function(e){
        console.log('CLOSE');

        if (e.preventDefault) {
            e.preventDefault();
        } else {
            // internet explorer
            e.returnValue = false;
        }
    });

    Mousetrap.bind('up', function(){
        if ($('#start').hasClass('open')) {

        }
    })

    $('#desktop').focus();

    window.app.newWindow('/views/_ie.html?url=https://aboveaveragefriendships.com/main.html', {
        title: 'Above-Average Friendships, LLC - Microsoft Internet Explorer',
    });

    // window.app.error('Error', "An error has occurred and there's nothing you can do about it.");

    // var doit = true;

    // setInterval(function(){
    //     if (doit) {
    //         window.app.error('Error', "An error has occurred and there's nothing you can do about it.");
    //     }

    //     doit = (Math.random() < 0.6);
    // }, 100);

    clippy.load('Clippy', function(agent) {
        // Do anything with the loaded agent
        var idles = agent.animations().filter(function(anim){
            return /^Idle/.test(anim);
        });

        var agents = [
            'Bonzi',
            'Clippy',
            'F1',
            'Genie',
            'Genius',
            'Links',
            'Merlin',
            'Peedy',
            'Rocky',
            'Rover',
        ];

        var helps = {
            'This is a little over my head, I need to call for assistance.': function(){
                clippy.load(agents[Math.floor(Math.random()*agents.length)], function(helper) {
                    helper.show();
                    helper.speak('Please state the nature of the computer emergency.');

                    var helperIdles = helper.animations()

                    setInterval(function(){
                        helper.play(helperIdles[Math.floor(Math.random()*helperIdles.length)]);
                    }, 10000);

                    $(helper._el).on('click', function(){
                        var anim = agent.animations().filter(function(anim){
                            return !(/^Idle/.test(anim));
                        });

                        helper.play(anim[Math.floor(Math.random()*anim.length)]);
                    })
                });
            },
        };

        agent.show();
        agent.play('Greeting');
        agent.speak('Welcome!');
        agent.speak("My name is Clorpy, and I'm here to help you.");
        agent.speak("At any time, just click on me and I'll be here to offer assistance with whatever you need.");
        agent.moveTo(window.innerWidth - 120, window.innerHeight - 130);

        $(agent._el).on('click', function(){
            var keys = Object.keys(helps);
            var say = keys[Math.floor(Math.random()*keys.length)];
            var fn = helps[say];

            try {
                agent.stopCurrent();
                agent.closeBalloon();
            } catch (e) {
                ;
            }

            if ($.isFunction(fn)) {
                agent.speak(say, false, fn);
            } else {
                agent.speak(say);
            }
        });

        setInterval(function(){
            agent.play(idles[Math.floor(Math.random()*idles.length)]);
        }, 10000);
    });
});