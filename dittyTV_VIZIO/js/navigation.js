window.addEventListener('load', function () {
    window.SN = SpatialNavigation;
    SN.init(); // When menu foucs

    add_focus("keyboard_container", "key_q");

    // When menu focused
    $('#menuList').on('sn:focused', function (e) {
        console.log("menu focused ...");
        FOCUSED_MENU_INDEX = $('#' + e.target.id).closest('div').index();

        if ($(".home_container").hasClass("active")) $(".loader_page").hide();

        $(".about_box").css("background-color", "");

        if (AUDIO_PLAYER != "") closeAudio();

        $(".home_container, .cat_container, .about_container, .subcat_container, .error_container, .search_container, .loader_page").removeClass("active");
        $(".menu_container").css('visibility', 'visible');
        $(".menu_container").addClass("active");
        $("#menuList > div").removeClass("menu-color");
        $("#menuList div:nth-child(" + (FOCUSED_MENU_INDEX + 1) + ")").focus().addClass("menu-color");
        $("#keyboard_container").css("display", "none");
    });

    // When menu selection
    $('#menuList').on('sn:enter-down', function (e) {
        console.log("menu selected ...");
        $("div#menuList div:nth-child(" + (FOCUSED_MENU_INDEX + 1) + ")").click();
    });

    // Home category list focused
    $('#homeList').on('sn:focused', function (e) {
        console.log("home category list focused ...");
        FIRST_PAGE_FOCUSED_INDEX = $('#' + e.target.id).closest('div').index();

        $(".menu_container").removeClass("active");
        $(".home_container").addClass("active");
        $(".menu_container").css('visibility', 'hidden');

    });

    // When about description selection
    $('#aboutContainer').on('sn:focused', function (e) {
        console.log("Aboout Text focused ...");
        $(".menu_container").removeClass("active");
        $(".menu_container").css('visibility', 'hidden');
        $(".about_container").addClass("active");
    });

    // When category list focused
    $('#catList').on('sn:focused', function (e) {
        console.log("category list focused ...");
        SECOND_PAGE_FOCUSED_INDEX = $('#' + e.target.id).closest('div').index();
        $(".menu_container").removeClass("active");
        $(".menu_container").css('visibility', 'hidden');
        $(".cat_container").addClass("active");
    });

    // When home/catList/subcatList selction
    $('#catList, #subcatList, #homeList').on('sn:enter-down', function (e) {
        console.log("category/subcategory list selected ...", e.currentTarget.id);
        index = $('#' + e.target.id).closest('div').index();
        var onclick = false;
        if ((index != THIRD_PAGE_SELECTED_INDEX && e.currentTarget.id == "subcatList") || !PLAY_AUDIO) onclick = true;

        //if (e.currentTarget.id != "subcatList") onclick = true;
        console.log("onclick", onclick);
        if (onclick) $("#" + e.currentTarget.id + " div#" + e.target.id).click();
    });

    // When sub category list focused
    $('#subcatList').on('sn:focused', function (e) {
        console.log("subcat list focused ...");
        THIRD_PAGE_FOCUSED_INDEX = $('#' + e.target.id).closest('div').index();
        $(".menu_container, .search_container").removeClass("active");
        $(".menu_container").css('visibility', 'hidden');
        $(".subcat_container").addClass("active");
        imgClass = "category_img";
        if (APP_DATA_ARRAY[SELECTED_MENU_INDEX]['menu_type'] != 'S' && APP_DATA_ARRAY[SELECTED_MENU_INDEX].categories[FIRST_PAGE_SELECTED_INDEX]['cat_type'] == 'P') {
            imgClass = "podcast_img";
            $(".pause_icon, .play_icon").hide();
            $("#play_pause_button_" + THIRD_PAGE_FOCUSED_INDEX).show();

            if (AUDIO_PLAYER != "") {
                if (THIRD_PAGE_SELECTED_INDEX == THIRD_PAGE_FOCUSED_INDEX) $("#audio_container").show();
                else $("#audio_container").hide();
                $("#play_pause_button_" + THIRD_PAGE_SELECTED_INDEX).show();
            }
        }

        $("#subCatImg").replaceWith('<img src="' + CHANNEL_DATA_ARRAY['channels'][THIRD_PAGE_FOCUSED_INDEX]['image'] + '" class="' + imgClass + '" id="subCatImg" onerror="image_error(this);">');
        $("#subCatDesc").text(CHANNEL_DATA_ARRAY['channels'][THIRD_PAGE_FOCUSED_INDEX]['description']);

        // For marquee
        /*clearTimeout(AOD_MARQUEE_TIMEOUT_FLAG);
        audioMarqueeHtml = $('#'+ e.target.id).closest('li').find(".sub_title");
        textWidth = calculate_text_width(audioMarqueeHtml.text());
    	
        if (textWidth > IS_POD_TEXT_LEN) {
            audioMarqueeHtml.bind('finished', function() {
                                                                audioMarqueeHtml.marquee('toggle'); 
                                                                AOD_MARQUEE_TIMEOUT_FLAG = setTimeout(function(){
                                                                    audioMarqueeHtml.marquee('toggle');
                                                                }, MARQUEE_TIMEOUT_INTERVAL);
                                                            }
                                                        ).marquee();

            $(".js-marquee-wrapper").addClass('focusable').attr('id', e.target.id+'_marquee');
            counter = 1;
            $(".js-marquee").each(function() {
                $(".js-marquee:nth-child("+ counter +")").addClass('focusable').attr('id', e.target.id+'_marquee_text');
                counter++;
            });

        } else {
            audioMarqueeHtml.marquee('destroy');
        }*/

        // for pagination
        if (APP_DATA_ARRAY[SELECTED_MENU_INDEX]['menu_type'] == 'S' || APP_DATA_ARRAY[SELECTED_MENU_INDEX].categories[FIRST_PAGE_SELECTED_INDEX]['cat_type'] != 'P') {
            if ($("#subcatList div:nth-last-child(-n+12)").is(":focus") && LOAD_NEXT_PAGE) {
                var totalPages = Math.ceil(CHANNEL_DATA_ARRAY['channels']['total'] / PER_PAGE_LIMIT);
                console.log("totalPages", totalPages, PER_PAGE_LIMIT);
                if (PAGE_COUNTER <= totalPages) {
                    LOAD_NEXT_PAGE = 0;
                    TIME_STATMP = jQuery.now();
                    set_subcat_list(TIME_STATMP);
                }
            }
        }
    });

    $('#subcatList').on('sn:unfocused', function (e) {
        //audioMarqueeHtml = $('#'+ e.target.id).closest('li').find(".sub_title");
        //audioMarqueeHtml.marquee('destroy');
    });

    // When video details page focused
    $('#video_container').on('sn:focused', function (e) {
        console.log("video container page focused ...");

        if ($("#video_container").is(":focus")) console.log("currently focus on video container...");
        else console.log("currently focus on description... consolle");
    });


    // When something press from remote keys
    $(window).keydown(function (evt) {
        console.log(evt);
        var catType = "";
        if (_.size(APP_DATA_ARRAY) > 0 && APP_DATA_ARRAY[SELECTED_MENU_INDEX]['menu_type'] == 'L') {
            catType = APP_DATA_ARRAY[SELECTED_MENU_INDEX].categories[FIRST_PAGE_SELECTED_INDEX]['cat_type'];
        }
        switch (evt.keyCode) {
            case 13: // Okay
                if ($(".video_container").hasClass("active") && !AD_PLAY) {
                    if (VIDEO_PLAYER != "" && PLAY_VIDEO) {
                        console.log("Play/Pause Video");
                        if (VIDEO_PLAYER.paused) VIDEO_PLAYER.play();
                        else VIDEO_PLAYER.pause();
                    }

                    // Search results 
                } else if ($(".search_container").hasClass("active") && !$(".menu_container").hasClass("active")) {
                    // if (!$('#searchInputText').is(":focus")) $('#searchInputText').focus();
                    // else request_search_results();

                } else play_pause_audio();

                break;

            case 415: // Play
                if ($(".video_container").hasClass("active") && !AD_PLAY) {
                    console.log("Play Video");
                    if (VIDEO_PLAYER != "" && PLAY_VIDEO) VIDEO_PLAYER.play();

                } else if (PLAY_AUDIO) {
                    if (AUDIO_PLAYER != "") {
                        if (AUDIO_PLAYER.paused) AUDIO_PLAYER.play();
                    }
                }

                break;

            case 19: // Pause
                if ($(".video_container").hasClass("active") && !AD_PLAY) {
                    console.log("Pause Video");
                    if (VIDEO_PLAYER != "" && PLAY_VIDEO) VIDEO_PLAYER.pause();

                } else if (PLAY_AUDIO) {
                    if (AUDIO_PLAYER != "") AUDIO_PLAYER.pause();
                }

                break;

            case 412: // Rewind
                if ($('#video_container').is(':visible') && !AD_PLAY && catType != "L") {
                    console.log("Rewind Video");
                    rewind_video();

                } else if (AUDIO_PLAYER != "") {
                    console.log("Rewind Audio");
                    rewind_audio();
                }

                break;

            case 417: // FastForward
                if ($('#video_container').is(':visible') && !AD_PLAY && catType != "L") {
                    console.log("Forward Video");
                    forward_video();
                } else if (AUDIO_PLAYER != "") {
                    console.log("Forward Audio");
                    forward_audio();
                }

                break;

            case 8: // Return/Back key
                console.log("Back/Return");
                if (APP_DATA_ARRAY[SELECTED_MENU_INDEX]['menu_type'] != 'S') TIME_STATMP = jQuery.now();

                if ($(".keyboard_container").css("display") == "block" && !$(".splash-screen").is(':visible')) {
                    console.log("hide custom keyboard...");
                    // SN.remove("keyboard_container");
                    $("#keyboard_container").css("display", "none");
                    SN.focus("#menu2");

                } else if ($(".menu_container").hasClass("active") && !$(".splash-screen").is(':visible')) {
                    console.log("show exit popup...");
                    hide_show_modal(true, "EXIT", APP_EXIT_MSG);

                    // Back from menu
                } else if ($(".home_container").hasClass("active")) {
                    SN.focus('menuList');

                    // Back from category list to home list
                } else if ($(".cat_container").hasClass("active")) {
                    console.log('return form category');
                    $(".loader_page").removeClass("active").hide();
                    $(".main_container").removeAttr('style');
                    $(".cat_container, .error_container").removeClass("active").hide();
                    $(".error_container").html("");
                    $("#catList").html("").removeAttr("style");

                    $(".home_container").addClass("active").show();
                    set_background("");
                    set_background(APP_DATA_ARRAY[SELECTED_MENU_INDEX].menu_page_bg_poster);
                    SN.focus('homeList');

                    // Back from subcat list to category list
                } else if ($(".subcat_container").hasClass("active") || $(".error_container").hasClass("active")) {
                    console.log('return form sub category');
                    if (APP_DATA_ARRAY[SELECTED_MENU_INDEX]['menu_type'] != 'S') {
                        $("#subCatgHeading, #subCatDesc").text('');
                        $("#subcatList").html("").removeAttr("style");
                        $(".cat_container, .about_container, .subcat_container, .error_container, .search_loader_page, .loader_page").removeClass("active").hide();
                        set_background("");

                        if ((SUBCAT_DATA_ARRAY.length > 1) && (catType != 'P')) {
                            $(".main_container").css("padding-top", "239px");
                            $("#menuList > div").removeClass("menu-color");
                            $(".cat_container").addClass("active").show();
                            $(".error_container").html("");

                            set_background(APP_DATA_ARRAY[SELECTED_MENU_INDEX].categories[FIRST_PAGE_SELECTED_INDEX].cat_bg_poster);
                            SN.focus('catList');

                        } else if ((SUBCAT_DATA_ARRAY.length == 1) && (catType != 'P')) {
                            $(".error_container").html("");
                            $(".home_container").addClass("active").show();
                            $(".main_container").removeAttr('style');

                            set_background(APP_DATA_ARRAY[SELECTED_MENU_INDEX].menu_page_bg_poster);
                            SN.focus('homeList');

                        } else if (catType == 'P') {
                            console.log('return form podcast');
                            SELECTED_AUDIO = '';
                            if (AUDIO_PLAYER != "") closeAudio(evt.keyCode);
                            $(".error_container").html("");
                            $(".main_container").removeAttr('style');
                            $(".home_container").addClass("active").show();
                            set_background(APP_DATA_ARRAY[SELECTED_MENU_INDEX].menu_page_bg_poster);
                            SN.focus('homeList');
                        }

                        // For search list
                    } else {
                        SN.focus('menuList');
                    }

                    // Return from About
                } else if ($(".about_container").hasClass("active")) {
                    console.log('return form about');
                    set_background(APP_DATA_ARRAY[SELECTED_MENU_INDEX].menu_page_bg_poster);
                    SN.resume();
                    SN.focus('menuList');

                    // Return from video screen
                } else if ($('#video_container').is(':visible') && $('#video_container').hasClass('active')) {
                    closeVideo();

                    // Return from popup to channel list
                } else if ($(".modal_container").hasClass("active")) {
                    var modalName = $(".modal_container").attr("data-modal-name");
                    // When exit modal selected
                    if (modalName == "EXIT") {
                        hide_show_modal(false, modalName);

                    } else if (modalName == "RETRY_CANCEL") {
                        hide_show_modal(false, modalName);
                        if ($('#video_container').is(':visible') && $('#video_container').hasClass('active')) closeVideo();
                        else if (AUDIO_PLAYER != "") closeAudio();
                    }
                }

                break;

            case 37: // LEFT arrow
                if ($('#video_container').is(':visible') && !AD_PLAY && catType != "L") {
                    console.log("Rewind Video");
                    rewind_video();

                } else if (AUDIO_PLAYER != "") {
                    console.log("Rewind Audio");
                    rewind_audio();

                }
                break;

            case 39: // RIGHT arrow
                //console.log('forword');
                if ($('#video_container').is(':visible') && !AD_PLAY && catType != "L") {
                    console.log("Forward Video");
                    forward_video();

                } else if (AUDIO_PLAYER != "") {
                    console.log("Forward Audio");
                    forward_audio();

                }
                break;

            case 413: // Stop button
                if ($('#video_container').is(':visible') && $('#video_container').hasClass('active')) closeVideo();
                else if (AUDIO_PLAYER != "") closeAudio();

                break;

            case 40: //Down key
                if ($('.about_box').is(":focus")) {
                    SN.pause();
                    scroll_up_down(-5);
                }
                break;

            case 38: //Up key
                if ($(".about_box").is(":focus")) {
                    console.log('scroller...');
                    var top = $('.about_box').position().top,
                        textTop = $('.about_text').position().top;

                    if (top == textTop) {
                        SN.resume();
                        SN.focus('menuList');
                        //$(".about_box").css("background-color", "");
                    } else {
                        var scroll = 5;
                        scroll_up_down(scroll);
                    }
                }
                break;

            default: console.log("Key code : " + evt.keyCode);
                break;
        }
    });


    $('#keyboard_container').on('sn:focused', function (e) {
        console.log("keyboard focused ...");
        if (($(".keyboard_container").css("display", "block")) && ($(":focus").parent().parent().attr("id") == "keyboard")) {
            $(".menu_container").removeClass("active");
            $(".menu_container").css('visibility', 'hidden');
        }
    });

    $('#keyboard_container').on('sn:enter-down', function (e) {
        console.log("keyboard enter down ...");
        var type = "LETTER"
        if ($("#" + e.target.id).hasClass("special-function")) type = $("#" + e.target.id).attr("data-type");
        switch (type) {
            case "CASE":
                var elements = $('.key-letters');
                if ($("#key_a").text() == $("#key_a").text().toUpperCase()) {
                    elements.each(function () { $("#" + $(this).attr('id')).text($("#" + $(this).attr('id')).text().toLowerCase()); });
                    $("#" + e.target.id).attr('style', function (i, style) { return style && style.replace(/color[^;]+;?/g, ''); });
                } else {
                    elements.each(function () { $("#" + $(this).attr('id')).text($("#" + $(this).attr('id')).text().toUpperCase()); });
                    $("#" + e.target.id).css("color", "#cc7600");
                }
                break;

            case "ENTER":
                resetKeyboard();
                request_search_results();
                break;

            case "BACK":
                $("#keyboard_container").css("display", "none");
                resetKeyboard();
                SN.focus("#menu2")
                break;

            case "SPACE":
                $("#searchInputText").val(($("#searchInputText").val() + " "));
                break;

            case "CLEAR":
                var str = $("#searchInputText").val();
                if (str != '') $("#searchInputText").val(rtrim(str.substring(0, str.length - 1)));
                break;

            case "CLEARALL":
                $("#searchInputText").val('');
                break;

            case "LETTER":
                $("#searchInputText").val(rtrim($("#searchInputText").val() + "" + $("#" + e.target.id).text()));
                break;

            default:
                console.log("keyboard default action...");
        }
    });

});