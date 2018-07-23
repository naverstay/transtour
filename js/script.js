var body, doc, articleSlider;

function hideDropDowns() {
    $('._open').removeClass('_open');
}

$(function ($) {
    doc = $(document);
    body = $('body');

    body.delegate('.subMenuLink', 'click', function () {
        $(this).parent().toggleClass('_open');
        return false;
    });

    doc.click(function (e) {
        if ($(e.target).parents().filter('.menu_item._submenu').length !== 1) {
            hideDropDowns();
        }
    });

    initArticleSlider();

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
            //{
            //    breakpoint: 1210,
            //    settings: {
            //        slidesToShow: 3
            //    }
            //},
            //{
            //    breakpoint: 768,
            //    settings: "unslick"
            //}
        ]
    });
}

$(window).resize(function () {

    if ($(window).width() > 767 && articleSlider === void 0) {
        initArticleSlider();
    }

});