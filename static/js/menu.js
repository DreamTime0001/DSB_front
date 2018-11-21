function initMenu() {
    $('.arrow').removeClass('on');
    $('.subMenu ul').hide();
    $('aside li').each(function () {
        if ($(this).hasClass('hover')) {
            $(this).parents().show();
            $(this).parent().prev().children('i').addClass('on')
        }
    });

    //滚动条
    var fiexdHeight = 60;
    var h = $(window).height() - fiexdHeight;
    var w = $("#sider").parent().width();
    $("#sider").slimScroll({
        width: w,
        height: h,
        size: '6px',
        alwaysVisible: true,
        railOpacity: 0.3,
        wheelStep: 10,
        allowPageScroll: false,
        disableFadeOut: false
    });

    function _setScroll() {
        var h = $(window).height() - fiexdHeight;
        $("#sider").slimScroll({
            height: h,
            alwaysVisible: true
        });
    }

    _setScroll();
    $(window).resize(function () {
        _setScroll();
    });
}

function menuClick() {
    //左侧导航点击事件
    $('.subMenu .navTitle').on('click', function (event) {
        var $this = $(this);
        // $this.next('ul').slideToggle();
        var brothers = $this.parent().siblings();
        // brothers.find('> ul').slideUp();

        var arrows = $("aside > i.arrow");
        var arrow_this = $this.find(" > i.arrow");
        var hasOpened = arrow_this.hasClass('on');
        if (hasOpened) {
            $this.next('ul').slideUp();
            arrow_this.removeClass('on');
            brothers.find('.arrow').removeClass('on');
            brothers.find('> ul').slideUp();
        } else {
            $this.next('ul').slideDown();
            arrow_this.addClass('on');
            brothers.find('.arrow').removeClass('on');
            brothers.find('> ul').slideUp();
        }
        event.stopPropagation();
    });
}

function homeMenu() {
    $('.arrow').removeClass('on');
    $('.subMenu ul').hide();
}