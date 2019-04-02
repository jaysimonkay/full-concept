/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
/*
	Home Portal App - Design concent
	Designed to Raspberry Pi 2

	Note: you can switch back to home if you slide to right the page

	For more information follow me on Twitter @Icebobcsi
	https://twitter.com/Icebobcsi

	Icons: http://fontawesome.io/
	Animation: https://greensock.com/gsap
	Weather icons: http://vclouds.deviantart.com/art/VClouds-Weather-Icons-179152045
	Home screen inspired by: https://www.behance.net/gallery/20006383/PORTAL-Inspire-Greatness

*/

let mapLoaded = false;

const showPage = function(pageName, cb) {
    const $page = $(`.page.page-${pageName}`);

    const $prevPage = $(".page:visible");
    if ($prevPage.attr("class") === $page.attr("class")) {
        return $page;
    }

    // console.log("Show page " + pageName);

    const tl = new TimelineLite({
        paused: true,
        onComplete() {
            if (!mapLoaded && (pageName === "map")) {
                showMap();
                mapLoaded = true;
            }

            if (cb) { return cb(); }
        }
    });

    if ($prevPage.length > 0) {
        // Slide out old
        tl.to($prevPage, 0.5, {
            x: 800,
            ease: Power3.easeIn,
            clearProps: "scale",
            onComplete() { return $prevPage.hide(); }
        });
    }

    tl.from($page, 0.5, {
        scale: 0.6,
        delay: 0.2,
        ease: Power3.easeOut,
        onStart() { return $page.show(); }
    });

    // Animate home page
    if (pageName === "home") {
        tl.from(".page-home .panel-time", 0.6, {
            x: -400,
            ease: Power3.easeOut
        });

        tl.from(".page-home .panel-weather", 0.6, {
            x: "+=400",
            ease: Power3.easeOut
        }, '-=0.3');

        tl.staggerFrom(".page-home .panel-functions .icon", 1.5, {
            y: 150,
            clearProps: "opacity, scale",
            ease: Elastic.easeOut
        }, 0.2, "-=0.4");

        tl.staggerFrom(".page-home .panel-calendar li", 1.5, {
            x: -400,
            ease: Power3.easeOut
        }, 0.2, "-=2");

        tl.staggerFrom(".page-home .panel-tasks li", 1.5, {
            x: 400,
            ease: Power3.easeOut
        }, 0.2, "-=1.8");
    }

    // Animate weather page
    if (pageName === "weather") {
        tl.from(".page-weather .panel-now", 0.6, {
            x: -500,
            ease: Power3.easeOut
        });

        tl.from(".page-weather .panel-today", 0.6, {
            x: -500,
            ease: Power3.easeOut
        }, '-=0.2');

        tl.from(".page-weather .panel-location", 0.4, {
            x: "+=400",
            ease: Power3.easeOut
        }, '-=0.5');

        tl.staggerFrom(".page-weather .panel-forecast .box", 1.2, {
            y: 150,
            delay: 0.5,
            ease: Elastic.easeOut
        }, 0.1, "-=0.5");
    }

    // Animate calendar page
    if (pageName === "calendar") {
        tl.staggerFrom(".page-calendar .panel-calendar", 1.0, {
            y: -150,
            autoAlpha: 0,
            ease: Power3.easeOut
        }, 0.3);

        tl.staggerFrom(".page-calendar .panel-calendar li", 1.0, {
            y: 150,
            autoAlpha: 0,
            ease: Power3.easeOut
        }, 0.1, "-=0.6");
    }

    // Animate calendar page
    if (pageName === "tasks") {
        tl.staggerFrom(".page-tasks .panel-tasklist", 1.0, {
            y: -150,
            autoAlpha: 0,
            ease: Power3.easeOut
        }, 0.3, "-=0.2");

        tl.staggerFrom(".page-tasks .panel-tasklist li", 1.0, {
            y: 150,
            autoAlpha: 0,
            ease: Power3.easeOut
        }, 0.1, "-=0.8");
    }


    // Play
    tl.play();

    return $page;
};


$(function() {
    // $page = showPage "home"

    // Gestures control	
    $('.page').each(function(i, page) {
        if ($(page).hasClass("page-home")) { return; }

        const mc = new Hammer(page, { preventDefault: true });

        const type = "pan";
        mc.get(type).set({ direction: Hammer.DIRECTION_HORIZONTAL, threshold: 10 });
        return mc.on(type + 'right', function(ev) {
            mc.get(type).set({ enable: false });
            console.log(ev);
            return showPage("home", () => mc.get(type).set({ enable: true }));
        });
    });

    // Click handler for home buttons
    $(".page-home .panel-functions .icon").on("click", function() {
        TweenLite.to($(this), 0.5, {
            scale: 2.0,
            clearProps: "opacity, scale",
            opacity: 0
        });

        return showPage($(this).attr('data-page'));
    });

    $(".page-home .panel-weather").on("click", () => showPage("weather"));

    $(".page-home .panel-tasks").on("click", () => showPage("tasks"));

    $(".page-home .panel-tasks li .check").on("click", function(e) {
        e.preventDefault();
        e.stopPropagation();
        return $(this).closest("li").toggleClass("checked");
    });

    $(".page-home .panel-calendar").on("click", () => showPage("calendar"));

    // Task events	
    $(".page-tasks .panel-tasklist li").on("click", function(e) {
        e.preventDefault();
        e.stopPropagation();
        return $(this).toggleClass("checked");
    });

    $(".page-tasks .newItem .text").on("click", function(e) {
        const div = $(e.target).closest(".newItem");
        div.find(".text").hide();
        return div.find("input").val('').show().focus();
    });

    $(".page-tasks .newItem input").on("keypress", function(e) {
        if (e.keyCode === 13) {
            const value = $(e.target).val();
            const div = $(e.target).closest(".newItem");
            div.find(".text").show();
            div.find("input").hide();

            const ul = div.parent().find("ul");

            const newLI = $("<li/>").append([
                $("<div/>").addClass("check"),
                $("<div/>").addClass("title").text(value)
            ]);
            ul.prepend(newLI);

            return TweenMax.from(newLI, 1.2, {
                y: -50,
                ease: Elastic.easeOut
            });
        }
    });

    $(".page-tasks .newItem input").on("blur", function(e) {
        const div = $(e.target).parent();
        div.find(".text").show();
        return div.find("input").hide();
    });

    // News scrolling

    let stopBigNews = false;
    $(".page-news .panel-newslist-big").on("mouseenter", () => stopBigNews = true).on("mouseleave", () => stopBigNews = false);

    let bigIndex = 1;
    setInterval(function() {
        if (stopBigNews) { return; }
        TweenLite.to(".page-news .panel-newslist-big ul", 1.5, { scrollTo: { x: bigIndex * (370 + 4) }, ease: Power2.easeInOut }); // 4 -> 0.25em margin cause of inline-block

        bigIndex++;
        if (bigIndex >= $(".page-news .panel-newslist-big li").length) { return bigIndex = 0; }
    }, 4000);

    let stopSmallNews = false;
    $(".page-news .panel-newslist-small").on("mouseenter", () => stopSmallNews = true).on("mouseleave", () => stopSmallNews = false);

    let smallIndex = 1;
    return setInterval(function() {
        if (stopSmallNews) { return; }

        const li = $(`.page-news .panel-newslist-small li:eq(${smallIndex})`);
        const { top } = li.offset();
        const top0 = $(".page-news .panel-newslist-small li:eq(0)").offset().top;

        TweenLite.to(".page-news .panel-newslist-small", 1.5, { scrollTo: { y: top - top0 }, ease: Power2.easeInOut });

        smallIndex++;
        if (smallIndex >= $(".page-news .panel-newslist-small	li").length) { return smallIndex = 0; }
    }, 3000);
});


// Show traffic map
var showMap = function() {
    const mapOptions = {
        center: {
            lat: 47.480865,
            lng: 19.060265
        },
        zoom: 12,
        // Cobalt Theme
        styles: [{
                featureType: 'all',
                elementType: 'all',
                stylers: [
                    { 'invert_lightness': false },
                    { 'saturation': 20 },
                    { 'lightness': 10 },
                    { 'gamma': 0.5 },
                    { 'hue': '#90C2DC' }
                ]
            }, {
                featureType: 'poi',
                elementType: 'labels',
                stylers: [
                    { 'visibility': 'off' }
                ]
            }

        ]
    };

    const map = new google.maps.Map($(".page-map .map").get(0), mapOptions);

    const trafficLayer = new google.maps.TrafficLayer();
    return trafficLayer.setMap(map);
};