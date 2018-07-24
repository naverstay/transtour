var $body, $doc, $header, articleSlider, slider_timer;

function hideDropDowns() {
    $('._open').removeClass('_open');
}

$(function ($) {
    $doc = $(document);
    $body = $('body');
    $header = $('.header');

    $body.delegate('.subMenuLink', 'click', function () {
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

    checkSameHeight();
});

function checkSameHeight() {
    setSameHeight($('.sameHeight'), 3);
    setSameHeight($('.sameHeight2'), 3);
    setSameHeight($('.sameHeight3'), 3);
    setSameHeight($('.sameHeight4'), 3);
}

function getScrollTop() {
    return window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
}

$(window).on('scroll', function () {

    if ($header) {
        if (getScrollTop()) {
            $header.addClass('_white');
        } else {
            $header.removeClass('_white');
        }
    }
});

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

$('#catmain_right').find('.boxes').each(function (ind) {
    var firedEl = $(this).find('.item');
    if (firedEl.length) setSameHeight('.item', firedEl.length);
});

function checkSlider() {
    if ($(window).width() > 767 && !articleSlider.find('.slick-list').length) {
        initArticleSlider();
    }
}

$(window).resize(function () {
    clearTimeout(slider_timer);
    slider_timer = setTimeout(function () {
        checkSlider();
        checkSameHeight();
    }, 50);
});