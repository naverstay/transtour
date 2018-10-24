var $body, $doc, $header, articleSlider, tabSlider, heroVideoHolder, heroBlock, slider_timer, $motion, win_h = 0;

function hideDropDowns() {
    $('._open').removeClass('_open');
}

$(function ($) {
    win_h = window.screen.height;
    $doc = $(document);
    $body = $('body');
    $header = $('.header');
    $motion = $('.motion');
    heroBlock = $('.heroBlock');
    heroVideoHolder = $('.heroVideoHolder');

    $body.delegate('.tabLink', 'click', function (e) {
        var btn = $(e.target), target = $(btn.attr('href'));

        if (!btn.attr('href')) {
            btn = btn.closest('a');
            target = $(btn.attr('href'));
        }

        if (target.length) {
            target.show().siblings().hide();
            btn.parent().addClass('_active').siblings().removeClass('_active');
        }

        return false;
    }).delegate('.subMenuLink', 'click', function () {
        $(this).parent().toggleClass('_open');
        return false;
    }).delegate('.mobMenuBtn', 'click', function () {
        $body.toggleClass('menu_opened');
        return false;
    });

    $doc.click(function (e) {
        if ($(e.target).parents().filter('.menu_item._submenu').length !== 1) {
            hideDropDowns();
        }
    });

    initArticleSlider();

    initWayPoints();

    resizeUpdater();

    initSelect2();
});

function getScrollTop() {
    return window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
}

function checkMotion() {
    var scr_top = getScrollTop();

    $motion.each(function () {
        var el = $(this);

        //console.log(el.offset().top, scr_top, win_h * .8);

        if (el.offset().top < (scr_top + win_h * .8)) {
            el.addClass('active');
        }
    });

}

function initWayPoints() {
    var section = $('.wayPointSection');

    if (section.length) {
        var magic = 65;
        var asidePagination = $('.asidePagination').css('height', section.first()[0].offsetHeight);

// ======================================
// Helper functions
// ======================================
// Get section or article by href
        function getRelatedContent(el) {
            return $($(el).attr('href'));
        }

// Get link by section or article id
        function getRelatedNavigation(el) {
            return $('.asideLink[href=#' + $(el).attr('id') + ']');
        }

// ======================================
// Smooth scroll to content
// ======================================
        $('.asideLink').on('click', function (e) {
            e.preventDefault();
            var btn = $(this);
            $('html,body').animate({scrollTop: getRelatedContent(this).offset().top}, function () {
                btn.parent().addClass('_active').siblings().removeClass('_active');
            });
            return false;
        });

// ======================================
// Waypoints
// ======================================
// Default cwaypoint settings
// - just showing

        section.waypoint({
            context: window,
            continuous: true,
            enabled: true,
            horizontal: false,
            offset: 0,
            triggerOnce: false,
            handler: function (direction) {
                getRelatedNavigation(this).parent().addClass('_active').siblings().removeClass('_active');
            }
        });

        section.first().waypoint({
            handler: function (direction) {
                if (direction === 'down') {
                    asidePagination.addClass('_fixed')//.css('margin-top', 0);
                } else {
                    asidePagination.removeClass('_fixed')//.css('margin-top', 0);
                }
            },
            offset: function () {
                //center of the section
                return ((window.screen.height - section.first()[0].offsetHeight) / 2) - magic;
            }
        });

        section.last().waypoint({
            handler: function (direction) {
                if (direction === 'down') {
                    asidePagination.removeClass('_fixed').addClass('_scrolled').css('margin-top', section.last().offset().top - section.first()[0].offsetHeight + magic * 2);
                } else {
                    asidePagination.removeClass('_scrolled').addClass('_fixed').css('margin-top', 0);
                }
            },
            offset: function () {
                //center of the section
                return -((window.screen.height - section.last()[0].offsetHeight) / 2);
            }
        });
    }
}

function initArticleSlider() {
    articleSlider = $('.articleSlider').slick({
        dots: false,
        infinite: false,
        speed: 300,
        prevArrow: '.prevArticle',
        nextArrow: '.nextArticle',
        slide: '.slide',
        slidesToShow: 4,
        slidesToScroll: 1,
        responsive: [
            {
                breakpoint: 1210,
                settings: {
                    slidesToShow: 3
                }
            },
            {
                breakpoint: 768,
                settings: "unslick"
            }
        ]
    });
}

function initTabSlider() {
    tabSlider = $('.tabSlider').each(function (ind) {
        var slck = $(this);

        slck.slick({
            dots: true,
            infinite: false,
            arrows: false,
            mobileFirst: true,
            speed: 300,
            //prevArrow: '.prevArticle',
            //nextArrow: '.nextArticle',
            slide: '.tab_unit',
            slidesToShow: 1,
            slidesToScroll: 1,
            appendDots: slck.parent().find('.tabDots'),
            responsive: [
                {
                    breakpoint: 768,
                    settings: "unslick"
                }
            ]
        });
    });
}

function heroVideo() {
    var homepageVideo = document.getElementById('homepage-video');

    if (!homepageVideo) {
        return false;
    }

    var startTime = parseInt(homepageVideo.getAttribute('data-start-time'));
    var sources = homepageVideo.getElementsByTagName('source');
    var isPlaying = false;

    homepageVideo.addEventListener('play', videoControl);
    homepageVideo.addEventListener('pause', videoControl);
    homepageVideo.addEventListener('canplay', videoControl);
    homepageVideo.addEventListener('loadedmetadata', videoControl);
    window.addEventListener('resize', videoControl);


    homepageVideo.load();


    function videoControl(e) {
        //console.log(e.type);

        switch (e.type) {

            case 'play':
                isPlaying = true;
                break;

            case 'pause':
                isPlaying = false;
                break;

            case 'canplay':
                homepageVideo.play();
                break;

            case 'loadedmetadata':
                if (startTime > 0) {
                    homepageVideo.currentTime = startTime;
                } else {
                    homepageVideo.currentTime = 0.1;
                }
                break;

            case 'resize':

                //if (document.body.clientWidth >= 870) {
                //    if (!isPlaying) {
                //        homepageVideo.play();
                //    }
                //} else {
                //    homepageVideo.pause();
                //}
                break;
        }
    }
}

function setSameHeight(item, item_in_row) {
    var $item_count = item_in_row;
    var maxHeight = 0, blocks = $(item);
    blocks.css('height', 'auto');
    for (var i = 0; i < blocks.length; i++) {
        maxHeight = blocks.eq(i).height() > maxHeight ? blocks.eq(i).height() : maxHeight;

        if ((i + 1) % $item_count === 0) {
            for (var j = i - $item_count + 1; j < i + 1; j++) {
                blocks.eq(j).height(maxHeight);
            }
            maxHeight = 0;
        }
    }
    if (i % blocks.length) {
        for (var j = i - $item_count; j < i; j++) {
            blocks.eq(j).height(maxHeight);
        }
    }
}

function initSelect2() {
    $('.select2').each(function (ind) {
        var slct = $(this);

        slct.select2({
            minimumResultsForSearch: Infinity,
            dropdownParent: slct.parent(),
            width: '100%'
        });
    });
}

function checkSameHeight() {
    setSameHeight($('.sameHeight'), 3);
    setSameHeight($('.sameHeight2'), 3);
    setSameHeight($('.sameHeight3'), 3);
    setSameHeight($('.sameHeight4'), 3);
}

function checkSlider() {
    if ($(window).width() > 767 && !articleSlider.find('.slick-list').length) {
        initArticleSlider();
    }
    if ($(window).width() < 768 && !($('.tabSlider .slick-list').length)) {
        initTabSlider();
    }
}

function checkFullPage() {
    var h = heroBlock.outerHeight(), w = heroBlock.outerWidth(), ratio = .5625;

    //console.log(h / w, h, w);

    if ((h / w) < ratio) {
        heroVideoHolder.css({width: w, height: w * ratio});
    } else {
        heroVideoHolder.css({width: h * ratio, height: h});
    }
}

function resizeUpdater() {
    clearTimeout(slider_timer);
    slider_timer = setTimeout(function () {
        checkFullPage();
        checkSlider();
        checkSameHeight();
    }, 20);
}

$(window).on('load', function () {

    heroVideo();

}).on('resize', function () {

    win_h = window.screen.height;
    resizeUpdater();

}).on('scroll', function () {

    if ($header) {
        if (getScrollTop()) {
            $header.addClass('_white');
        } else {
            $header.removeClass('_white');
        }
    }

    checkMotion();
});
