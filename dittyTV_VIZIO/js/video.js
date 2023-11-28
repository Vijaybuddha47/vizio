function load_video() {

    VIDEO_PLAYER = "";
    var features = [],
        type = "video/",
        url = "",
        menuType = APP_DATA_ARRAY[SELECTED_MENU_INDEX]['menu_type'],
        clickToPlayPause = true,
        alwaysShowControls = true;

    // if (menuType == 'L') {
    //     if (APP_DATA_ARRAY[SELECTED_MENU_INDEX].categories[FIRST_PAGE_SELECTED_INDEX]['cat_type'] == "S") PLAY_VAST_TAG = false;
    // } else if (menuType == 'S') PLAY_VAST_TAG = false;


    if (menuType == "L") {
        if (APP_DATA_ARRAY[SELECTED_MENU_INDEX].categories[FIRST_PAGE_SELECTED_INDEX]['cat_type'] == "L") {
            if (APP_DATA_ARRAY[SELECTED_MENU_INDEX].categories[FIRST_PAGE_SELECTED_INDEX]['vast_tag'] && AD_PLAY) {
                get_adurl(APP_DATA_ARRAY[SELECTED_MENU_INDEX]['categories'][FIRST_PAGE_SELECTED_INDEX]['vast_tag']);
                if (AD_URL) url = AD_URL;
                else {
                    APP_DATA_ARRAY[SELECTED_MENU_INDEX]['categories'][FIRST_PAGE_SELECTED_INDEX]['vast_tag'];
                    AD_PLAY = false;
                }
                // url = AD_URL = APP_DATA_ARRAY[SELECTED_MENU_INDEX]['categories'][FIRST_PAGE_SELECTED_INDEX]['vast_tag'];
            } else
                url = APP_DATA_ARRAY[SELECTED_MENU_INDEX]['categories'][FIRST_PAGE_SELECTED_INDEX]['stream_url'];

        } else {
            if (APP_DATA_ARRAY[SELECTED_MENU_INDEX].categories[FIRST_PAGE_SELECTED_INDEX]['vast_tag'] && AD_PLAY) {
                get_adurl(APP_DATA_ARRAY[SELECTED_MENU_INDEX].categories[FIRST_PAGE_SELECTED_INDEX]['vast_tag']);
                if (AD_URL) url = AD_URL;
                else {
                    url = CHANNEL_DATA_ARRAY['channels'][THIRD_PAGE_SELECTED_INDEX]['url'];
                    AD_PLAY = false;
                }
            } else
                url = CHANNEL_DATA_ARRAY['channels'][THIRD_PAGE_SELECTED_INDEX]['url'];
        }

    } else if (menuType == "S") {
        if (APP_DATA_ARRAY[SELECTED_MENU_INDEX].menu_name == "Search") {
            if (APP_DATA_ARRAY[SELECTED_MENU_INDEX]['vast_tag'] && AD_PLAY) {
                get_adurl(APP_DATA_ARRAY[SELECTED_MENU_INDEX]['vast_tag']);
                if (AD_URL) url = AD_URL;
                else {
                    url = CHANNEL_DATA_ARRAY['channels'][THIRD_PAGE_SELECTED_INDEX]['url'];
                    AD_PLAY = false;
                }
            } else
                url = CHANNEL_DATA_ARRAY['channels'][THIRD_PAGE_SELECTED_INDEX]['url'];
        }
    }

    if ((url.toLowerCase()).indexOf(".m3u") < 0) features = ['current', 'progress', 'duration'];

    if ((url.toLowerCase()).indexOf(".m3u") > -1) type = type + "hls";
    else type = type + "mp4";

    if (AD_PLAY) {
        clickToPlayPause = false;
        alwaysShowControls = false;
        features = [];
        PLAY_VAST_TAG = true;
    } else PLAY_VAST_TAG = false;


    show_hide_video_container();

    console.log(url, type);
    url = "https://tv.ads.vizio.com/rt/26525?w=1920&h=1080&cb=[Replace_with_Cachebuster_Macro]&ip=[REPLACE_with_IP_macro]&ua=[REPLACE_with_USER_AGENT_macro]&did=ecd567e-6cea-4784-a24e-7469ed87cfc4&ifa_type=vida&lmt=0&us_privacy=[Replace_with_US_PRIVACY_macro]&pod_max_dur=[REPLACE_with_PodMaxDuration_macro]&rating=[Replace_with_Rating_macro]&app_bundle=vizio.dittytv&app_name=DittyTV&content_genre=[REPLACE_with_GENRE_macro]&channel_name=1809&app_store_url=";

    // Add vidoe player
    add_focus("videoSection", "");
    SN.focus("videoSection");

    $("#video_container").html('<video controls id="videoPlayer" style="max-width:100%;" poster="" preload="none" class="video_box"><source src="" type="' + type + '" id="videoURL"></video>');

    $("#videoURL").attr('src', url);

    MEDIA_OBJ = new MediaElementPlayer("videoPlayer", {
        stretching: "auto",
        pluginPath: 'player/',
        features: features,
        clickToPlayPause: clickToPlayPause,
        alwaysShowControls: alwaysShowControls,
        success: function (media) {
            media.load();
            media.play();
            VIDEO_PLAYER = media;

            media.addEventListener('loadedmetadata', function () {
                //console.log("loadedmetadata");
            });

            media.addEventListener('progress', function () {
                //console.log("3333333333333");
            });

            media.addEventListener('play', function (e) {
                console.log("play", e);
                if (AD_URL && AD_PLAY && PLAY_VAST_TAG) {
                    // impression tracking event
                    dfp_tracking_event("impression");
                    // start tracking event
                    dfp_tracking_event("start");
                    VAST_ADS_COUNTER++;
                }
            });

            media.addEventListener('error', function (e) {
                console.log("error.............", e);
                $(".mejs__overlay-error").hide();
                if (PLAY_VAST_TAG) {
                    dfp_tracking_event("error");
                    PLAY_VAST_TAG = false;
                }
                PLAY_VIDEO = true;
                retry_error_popup();
                media.pause();
            });

            media.addEventListener('ended', function (e) {
                console.log("end video..............." + e);
                if (AD_URL && AD_PLAY) {
                    if (PLAY_VAST_TAG) {
                        // end tracking event
                        // dfp_tracking_event("complete");
                        PLAY_VAST_TAG = false;
                    }
                    AD_URL = '';
                    AD_PLAY = false;
                    PLAY_VIDEO = false;
                    load_video();
                } else closeVideo();
            });

            media.addEventListener('timeupdate', function (e) { });

            media.addEventListener('canplay', function (e) {
                PLAY_VIDEO = true;
            });

        },
        error: function (e) {
            console.log("Media element player error:" + e);
        }
    });
}

var closeVideo = function () {
    console.log("close video");
    $(".circle_loader").removeClass('circle-loader-middle');

    VIDEO_PLAYER.pause();
    AD_PLAY = false;
    PLAY_VIDEO = false;
    PLAY_VAST_TAG = false;

    $("#video_container").html('');
    $("#video_container").hide();

    $(".container_box").show();
    $(".video_container").removeClass('active');

    if (APP_DATA_ARRAY[SELECTED_MENU_INDEX]['menu_type'] == "L") {
        if (APP_DATA_ARRAY[SELECTED_MENU_INDEX].categories[FIRST_PAGE_SELECTED_INDEX]['cat_type'] == "L") {
            $(".home_container").addClass("active");
            $(".detail_container").removeClass("search_result_container");
            SN.focus("homeList");
        } else {
            $(".subcat_container").addClass("active").css("display", "flex");
            SN.focus("subcatList");
        }

    } else if (APP_DATA_ARRAY[SELECTED_MENU_INDEX]['menu_type'] == "S") {
        $(".search_container, .subcat_container").show();
        $(".detail_container").addClass("search_result_container");
        $(".subcat_container").addClass("active");
        SN.focus("subcatList");
    }
};

function forward_video() {
    if ($(".video_container").hasClass("active")) {
        VIDEO_PLAYER.setCurrentTime(VIDEO_PLAYER.getCurrentTime() + MEDIA_FORWARD_INTERVAL);
    }
}

function rewind_video() {
    if ($(".video_container").hasClass("active")) {
        VIDEO_PLAYER.setCurrentTime(VIDEO_PLAYER.getCurrentTime() - MEDIA_REWIND_INTERVAL);
    }
}

function get_adurl(dfpUrl) {
    dfpUrl = dfpUrl + Math.floor(Math.random() * 1000000) + 1;
    console.log("adulr....", dfpUrl);

    try {
        var contextType = "",
            newDfpUrl = "",
            keywordString = "",
            customParamString = "",
            videoId = "";

        if (VAST_TAG_ARR.length < 1) {
            VAST_TAG_ARR['wrapper'] = [];
            VAST_TAG_ARR['tracking'] = [];
            VAST_TAG_ARR['inline'] = [];
        }

        $.ajax({
            type: "GET",
            url: dfpUrl,
            async: false,
            dataType: "xml",
            success: function (xml) {
                $(xml).find('Ad').each(function () {
                    var inline = $(this).find('InLine').length;
                    var wrapper = $(this).find('Wrapper').length;

                    if (inline > 0) {
                        var maxWidth = 0;

                        $(this).find('MediaFile').each(function () {
                            var type = $(this).attr('type');
                            if (type == 'video/mp4' || type == 'video/x-mp4') {
                                var width = $(this).attr('width');
                                if (parseInt(width) > parseInt(maxWidth)) {
                                    maxWidth = width;
                                    console.log(VAST_TAG_ARR, $(this).text());
                                    VAST_TAG_ARR['inline'][INLINE_COUNTER] = $.trim($(this).text());
                                }

                            }


                            VAST_TAG_ARR['tracking'][INLINE_COUNTER] = new Array();
                            VAST_TAG_ARR['tracking'][INLINE_COUNTER]['skip_offset_val'] = new Array();
                            VAST_TAG_ARR['tracking'][INLINE_COUNTER]['error'] = new Array();
                            VAST_TAG_ARR['tracking'][INLINE_COUNTER]['impression'] = new Array();
                            VAST_TAG_ARR['tracking'][INLINE_COUNTER]['start'] = new Array();
                            VAST_TAG_ARR['tracking'][INLINE_COUNTER]['firstQuartile'] = new Array();
                            VAST_TAG_ARR['tracking'][INLINE_COUNTER]['midpoint'] = new Array();
                            VAST_TAG_ARR['tracking'][INLINE_COUNTER]['thirdQuartile'] = new Array();
                            VAST_TAG_ARR['tracking'][INLINE_COUNTER]['complete'] = new Array();
                            VAST_TAG_ARR['tracking'][INLINE_COUNTER]['skip'] = new Array();

                            var skipoffsetVal = $(xml).find('Linear').attr('skipoffset');
                            if (typeof skipoffsetVal != 'undefined') {
                                var a = skipoffsetVal.split(':'); // split it at the colons
                                var skipSeconds = (+a[0]) * 60 * 60 + (+a[1]) * 60 + (+a[2]);
                                VAST_TAG_ARR['tracking'][INLINE_COUNTER]['skip_offset_val'] = skipSeconds;
                            } else {
                                VAST_TAG_ARR['tracking'][INLINE_COUNTER]['skip_offset_val'] = "";
                            }

                            VAST_TAG_ARR['tracking'][INLINE_COUNTER]['error'] = $(xml).find('Error').text();
                            VAST_TAG_ARR['tracking'][INLINE_COUNTER]['impression'] = $(xml).find('Impression').text();

                            $(xml).find('Tracking').each(function () {
                                eventType = $(this).attr('event');
                                switch (eventType) {
                                    case "start":
                                        VAST_TAG_ARR['tracking'][INLINE_COUNTER]['start'] = $(this).text();
                                        break;

                                    case "firstQuartile":
                                        VAST_TAG_ARR['tracking'][INLINE_COUNTER]['firstQuartile'] = $(this).text();
                                        break;

                                    case "midpoint":
                                        VAST_TAG_ARR['tracking'][INLINE_COUNTER]['midpoint'] = $(this).text();
                                        break;

                                    case "thirdQuartile":
                                        VAST_TAG_ARR['tracking'][INLINE_COUNTER]['thirdQuartile'] = $(this).text();
                                        break;

                                    case "complete":
                                        VAST_TAG_ARR['tracking'][INLINE_COUNTER]['complete'] = $(this).text();
                                        break;

                                    case "skip":
                                        VAST_TAG_ARR['tracking'][INLINE_COUNTER]['skip'] = $(this).text();
                                        break;
                                }
                            });
                        });
                        INLINE_COUNTER++;
                    } else if (wrapper > 0) {
                        VAST_TAG_ARR['wrapper'][WRAPER_COUNTER] = $.trim($(this).find('VASTAdTagURI').text());
                        WRAPER_COUNTER++;
                    }

                });

                if (VAST_TAG_ARR['wrapper'].length > 0) {
                    get_adurl(VAST_TAG_ARR['wrapper'][0]);
                } else if (VAST_TAG_ARR['inline'].length > 0 && VAST_TAG_ARR['inline'].length > VAST_ADS_COUNTER) {
                    AD_URL = VAST_TAG_ARR['inline'][VAST_ADS_COUNTER];
                } else {
                    AD_URL = "";
                }

            },
            error: function () {
                if (VAST_TAG_ARR['wrapper'].length > 0) {
                    get_adurl(VAST_TAG_ARR['wrapper'][0]);
                } else if (VAST_TAG_ARR['inline'].length > 0 && VAST_TAG_ARR['inline'].length > VAST_ADS_COUNTER) {
                    VAST_ADS_COUNTER++;
                    closeVideo();
                    AD_URL = VAST_TAG_ARR['inline'][VAST_ADS_COUNTER];
                } else {
                    console.log("error in get_add");
                    AD_URL = "";
                }
            }
        });
    } catch (e) {
        console.log("Error in get URL: " + e);
        AD_URL = "";
    }

}

function dfp_tracking_event(eventType) {
    if (VAST_TAG_ARR['tracking'].length > 0) {
        eventUrl = VAST_TAG_ARR['tracking'][VAST_ADS_COUNTER][eventType];
        var log = "DFP " + eventType + " URL => " + eventUrl;
        if (eventUrl != "undefined" && eventUrl != "") {
            switch (eventType) {
                case "impression":
                    console.log(log);
                    break;

                case "error":
                    console.log(log);
                    break;

                case "skip":
                    console.log(log);
                    break;

                case "start":
                    console.log(log);
                    break;

                case "firstQuartile":
                    console.log(log);
                    break;

                case "midpoint":
                    console.log(log);
                    break;

                case "thirdQuartile":
                    console.log(log);
                    break;

                case "complete":
                    console.log(log);
                    break;
            }

            $.ajax({
                type: "GET",
                url: eventUrl,
                async: true,
                success: function (response) {
                    console.log("DFP Suceess: " + response);
                },
                error: function (e) {
                    console.log("DFP Error: " + e);
                }
            });
        } else {
            console.log("DFP event url is null");
        }
    }
}