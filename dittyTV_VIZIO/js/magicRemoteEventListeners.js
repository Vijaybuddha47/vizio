/*
 * Copyright (c) 2020 LG Electronics Inc.
 * SPDX-License-Identifier: CC0-1.0
 */
var itemArray = document.getElementsByClassName("focusable");

function addEventListeners() {
    for (var i = 0; i < itemArray.length; i++) {
        itemArray[i].addEventListener("mouseover", _onMouseOverEvent);
        itemArray[i].addEventListener("click", _onClickEvent);
    }
}

function _onClickEvent(e) {
    elementId = e.target.id;
    console.log(elementId + " is clicked!");
    if (elementId.search("play_pause_button") > -1 || elementId == "") return;
    $(".detail_container").removeClass("search_result_container");
    // When popup is clicked
    if ($(".modal_container").hasClass("active")) {
        var modalName = $(".modal_container").attr("data-modal-name");
        console.log(modalName, "modalName");
        if ($('#noButton').is(":focus")) {
            console.log('hide popup');
            hide_show_modal(false, 'EXIT');

        } else if ($("#yesButton").is(":focus")) {
            console.log('exit app');
            VIZIO.exitApplication();
        } else if ($("#retryButton").is(":focus")) {
            hide_show_modal(false, modalName);
            if (modalName == "RETRY_CANCEL") {
                if ($('#video_container').is(':visible') && $('#video_container').hasClass('active')) load_video();
                else if (AUDIO_PLAYER != "") {
                    AUDIO_PLAYER.pause();
                    AUDIO_PLAYER = "";
                    $("#audio_container").html('');
                    $("#audio_container").hide();

                    $(".audio_container").removeClass('active');

                    $(".subcat_container").addClass("active").css("display", "flex");
                    SN.focus("subcatList");
                    load_audio();
                }

            } else if (modalName == "RETRY_EXIT") {
                parse_main_feed();
            }

        } else if ($("#cancelButton").is(":focus")) {
            hide_show_modal(false, modalName);
            if (modalName == "RETRY_CANCEL") {
                if ($('#video_container').is(':visible') && $('#video_container').hasClass('active')) closeVideo();
                else if (AUDIO_PLAYER != "") closeAudio();
            } else if (modalName == "RETRY_EXIT") {
                VIZIO.exitApplication();
            }
        }

        // For menu is clicked
    } else if ($(".menu_container").hasClass("active")) {
        SELECTED_MENU_INDEX = $('#' + e.target.id).closest('div').index();
        TIME_STAMP = jQuery.now();
        change_search_list_view();
        call_menu_data();

        // For home list  is clicked
    } else if ($(".home_container").hasClass("active")) {
        console.log('category operation');
        FIRST_PAGE_SELECTED_INDEX = $('#' + e.target.id).closest('div').index();
        var catType = APP_DATA_ARRAY[SELECTED_MENU_INDEX].categories[FIRST_PAGE_SELECTED_INDEX]['cat_type'];
        CAT_FEED_URL = APP_DATA_ARRAY[SELECTED_MENU_INDEX].categories[FIRST_PAGE_SELECTED_INDEX]['feed_url'];

        TIME_STATMP = jQuery.now();
        PAGE_COUNTER = 1;
        ITEM_COUNTER = 0;
        LOAD_NEXT_PAGE = 0;

        if (catType == 'S') {
            set_cat_list_data(TIME_STATMP);

        } else if (catType == 'L') {
            $(".home_container").removeClass("active");
            var url = APP_DATA_ARRAY[SELECTED_MENU_INDEX]['categories'][FIRST_PAGE_SELECTED_INDEX]['stream_url'];
            console.log(url);
            if (url.indexOf("ads.wurl_channel") !== -1) AD_PLAY = false;
            else AD_PLAY = true;

            load_video();

        } else if (catType == 'P') {
            set_subcat_list(TIME_STATMP);
        }

        // For subcategories page
    } else if ($(".cat_container").hasClass("active") && !$(".error_msg").hasClass("active")) {
        console.log('sub-category operation');
        TIME_STATMP = jQuery.now();
        PAGE_COUNTER = 1;
        ITEM_COUNTER = 0;
        LOAD_NEXT_PAGE = 0;

        SECOND_PAGE_SELECTED_INDEX = $('#' + e.target.id).closest('div').index();
        SUB_CAT_FEED_URL = SUBCAT_DATA_ARRAY[SECOND_PAGE_SELECTED_INDEX]['stream_feed_url'];
        set_subcat_list(TIME_STATMP);

        // 
    } else if ($(".subcat_container").hasClass("active")) {
        console.log('audio/video operation');
        var menuType = APP_DATA_ARRAY[SELECTED_MENU_INDEX]['menu_type'];
        if (menuType == 'L') {
            var catType = APP_DATA_ARRAY[SELECTED_MENU_INDEX].categories[FIRST_PAGE_SELECTED_INDEX]['cat_type'];
            if ((e.target.id).search("subCatPlayIcon") > -1) THIRD_PAGE_SELECTED_INDEX = THIRD_PAGE_FOCUSED_INDEX;
            else THIRD_PAGE_SELECTED_INDEX = $('#' + e.target.id).closest('div').index();

            if (catType == 'S') {
                AD_PLAY = true;
                load_video();

            } else if (catType == 'P') {
                PLAY_AUDIO = false;
                THIRD_PAGE_SELECTED_INDEX = $('#' + e.target.id).closest('div').index();
                var obj = CHANNEL_DATA_ARRAY['channels'][THIRD_PAGE_SELECTED_INDEX];
                $("#subCatDesc").text(obj['description']);

                if (SELECTED_AUDIO == "" || SELECTED_AUDIO != "div#" + e.currentTarget.id) {
                    if (SELECTED_AUDIO) closeAudio();

                    SELECTED_AUDIO = "div#" + e.currentTarget.id;
                    load_audio();
                }
            }

        } else if (menuType == 'S') {
            if ((e.target.id).search("subCatPlayIcon") > -1) THIRD_PAGE_SELECTED_INDEX = THIRD_PAGE_FOCUSED_INDEX;
            else THIRD_PAGE_SELECTED_INDEX = $('#' + e.target.id).closest('div').index();
            AD_PLAY = true;
            load_video();
        }
    }
}

function _onMouseOverEvent(e) {
    var elementId = e.target.id;
    console.log("focus container id", elementId);

    for (var i = 0; i < itemArray.length; i++) {
        itemArray[i].blur();
    }

    if (elementId != "") {
        if (elementId.search("yesButton") > -1) $("#yesButton").focus();
        else if (elementId.search("noButton") > -1) $("#noButton").focus();
        else if (elementId.search("retryButton") > -1) $("#retryButton").focus();
        else if (elementId.search("cancelButton") > -1) $("#cancelButton").focus();
        else if (elementId.search("searchInputText") > -1) $("#searchInputText").focus();
        else if (elementId.search("about") > -1) $("#aboutBox").focus();
        else if ($("#" + elementId).closest('li').length > 0) $("#" + elementId).closest('li').focus();
    }
}