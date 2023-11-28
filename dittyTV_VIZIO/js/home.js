function parse_main_feed() {
    $.ajax({
        type: "GET",
        url: MAIN_FEED_URL,
        dataType: "json",
        async: true,
        cache: false,
        timeout: REQUEST_TIMEOUT * 1000,
        success: function (data) {
            if (_.size(data.app.menus) > 0 && data.app.status == 1) {
                APP_DATA_ARRAY = data.app.menus;
                NO_RECORD_MSG = data.app.no_record;
                TOKEN = data.app.configuration.app_profile.stream_feed_token;
                set_menu();
            } else {
                if (navigator.onLine) msg = NET_CONNECTION_ERR;
                else msg = DATA_PARSE_ERR;
                addEventListeners();
                hide_show_modal(true, "RETRY_EXIT", msg);
            }
        },
        error: function (xhr, error) {
            console.log("error", error, xhr);
            if (navigator.onLine) msg = NET_CONNECTION_ERR;
            else msg = DATA_PARSE_ERR;
            addEventListeners();
            hide_show_modal(true, "RETRY_EXIT", msg);
        }
    });
}

// Create Menu here
function set_menu() {
    var str = '',
        totalMenu = APP_DATA_ARRAY.length,
        counter = 0;

    if (totalMenu > 0) {
        for (var i = 0; i < totalMenu; i++) {
            // if (APP_DATA_ARRAY[i]['menu_type'] != "S") {
            var focusName = "menu" + counter;
            upFocus = ' data-sn-up="null"',
                tabindex = '0',
                rightFocus = '',
                leftFocus = '';

            // Actual Menu
            if (i == 0) leftFocus = ' data-sn-left="null"';
            else leftFocus = '';

            if (i == (totalMenu - 1)) rightFocus = ' data-sn-right="null"';
            else rightFocus = '';

            str += '<div class="menu_list_box focusable" tabindex="' + tabindex + '" id="' + focusName + '" ' + leftFocus + rightFocus + upFocus + '>' + APP_DATA_ARRAY[i]['menu_name'] + '</div>';
            counter++;
        }
        // }

        $(".splash-screen").hide();
        $("#menuList").html(str);
        $(".container_box").show();
        $(".menu_container").addClass("active");

        addEventListeners();
        SN.add({
            id: 'menuList',
            selector: '#menuList .focusable',
            defaultElement: '#menu0',
            enterTo: 'last-focused'
        });
        SN.makeFocusable();
        //SN.focus('menuList');
        //$("#menuList li:nth-child("+ (SELECTED_MENU_INDEX + 1) +")").focus();

        set_background(APP_DATA_ARRAY[SELECTED_MENU_INDEX].menu_page_bg_poster);
        call_menu_data();

    } else {
        $(".splash-screen").hide();
        $("#menuList").html(str);
        $(".container_box").show();
        $(".menu_container").addClass("active");
    }
}

function set_home_screen() {
    $(".main_container").removeAttr('style');
    $(".home_container, .cat_container, .about_container, .subcat_container, .error_container, .search_container, .search_loader_page").removeClass("active").hide();
    $(".error_container").html("");
    $("#catList, #subcatList").html("").removeAttr("style");
    $(".home_container").show();

    var focusName = "",
        rigthFocus = "",
        leftFocus = "",
        upFocus = "",
        downFocus = "",
        title = "",
        imgSrc = "",
        str = "";

    totalItems = APP_DATA_ARRAY[SELECTED_MENU_INDEX].categories.length;
    if (totalItems > 0) {
        for (i = 0; i < totalItems; i++) {
            focusName = "row_item_" + i;

            if (i == (totalItems - 1)) rigthFocus = " data-sn-right='null'";
            else rigthFocus = " data-sn-right='#row_item_" + (i + 1) + "'";

            if (i > 0) leftFocus = " data-sn-left='#row_item_" + (i - 1) + "'";
            else leftFocus = "data-sn-left='null'";

            downFocus = " data-sn-down='null'";

            title = APP_DATA_ARRAY[SELECTED_MENU_INDEX].categories[i]['cat_title'];
            imgSrc = APP_DATA_ARRAY[SELECTED_MENU_INDEX].categories[i]['cat_poster'];

            str += '<div class="home_listbox focusable" tabindex="1" id="' + focusName + '" ' + rigthFocus + leftFocus + upFocus + downFocus + ' aria-label="' + title + '">';
            str += '<div class="home_innerbox" id="row_item_innerbox_' + i + '">';
            str += '<div class="home_contentbox" id="row_item_contentbox_' + i + '">';
            str += '<img src="' + imgSrc + '" id="row_item_img_' + i + '" onerror="image_error(this);">';
            str += '<div class="home_textlist text_bright" id="row_item_title_' + i + '">' + title + '</div>';
            str += '</div>';
            str += '</div>';
            str += '</div>';
        }

        $(".loader_page").hide();
        $("div#homeList").html(str);
        addEventListeners();
        add_focus("homeList", "row_item_0");

        if (APP_LAUNCH_FLAG) SN.focus('homeList');
        APP_LAUNCH_FLAG = false;

    } else {
        str = '<li class="no_record"><p class="no_record_text">' + NO_RECORD_MSG + '</p></li>';
        $("div#homeList").html(str);
    }
}

// About menu screen
function set_about_screen() {
    $(".main_container").removeAttr('style');
    $(".home_container, .cat_container, .about_container, .subcat_container, .error_container, .search_container, .search_loader_page").removeClass("active").hide();

    $(".error_container").html("");
    $(".error_container").html("");
    var str = "";
    $(".about_container").html("").show();
    str = '<span class="about_heading">App Version: 1.0.0</span>';
    if (APP_DATA_ARRAY[SELECTED_MENU_INDEX].menu_page_description) {
        str += '<div class="about_box focusable" role="list" tabindex="1" id="aboutBox" data-sn-right="null" data-sn-left="null" data-sn-down="null">';
        str += '<p class="about_text" id="aboutText">' + APP_DATA_ARRAY[SELECTED_MENU_INDEX].menu_page_description + '</p>';
        str += '</div>';

        $(".loader_page").hide();
        $(".about_container").html(str);
        addEventListeners();
        add_focus("aboutContainer", "aboutBox");

    } else {
        str = '<div class="no_record"><p class="no_record_text">' + NO_RECORD_MSG + '</p></div>';
        $(".about_container").html(str).show();
    }
}

// Set categories grid
function set_cat_list_data(timestamp) {
    $(".main_container").css("padding-top", "239px");

    $(".home_container, .cat_container, .about_container, .subcat_container, .error_container, .search_container, .search_loader_page").removeClass("active").hide();
    $(".error_container").html("");
    $("#catList, #subcatList").html("").removeAttr("style");
    $(".cat_container").addClass("active");
    $(".loader_page").show();

    set_background("");
    set_background(APP_DATA_ARRAY[SELECTED_MENU_INDEX].categories[FIRST_PAGE_FOCUSED_INDEX].cat_bg_poster);

    $.ajax({
        type: "GET",
        url: CAT_FEED_URL,
        dataType: "json",
        async: true,
        cache: false,
        timeout: REQUEST_TIMEOUT * 1000,
        success: function (response) {
            if (TIME_STATMP == timestamp) {
                if (response != undefined && response != "") {
                    var focusName = "",
                        rigthFocus = "",
                        leftFocus = "",
                        upFocus = "",
                        downFocus = "",
                        title = "",
                        imgSrc = "",
                        str = "",
                        liClass = "",
                        divClass = "",
                        innerDivClass = "";

                    // For shows
                    if (FIRST_PAGE_SELECTED_INDEX == 2) {
                        $(".cat_container").removeClass("category_containebox").addClass("category_innrer_containebox");
                        $("#catList").addClass("catergory_inner_list").removeClass("catergory_container_list");
                        liClass = "category_inlinebox focusable";
                        divClass = "category_inline";
                        innerDivClass = "category_textinline";
                        breakRow = 4;

                        // for rest items
                    } else {
                        $(".cat_container").removeClass("category_innrer_containebox").addClass("category_containebox");
                        $("#catList").addClass("catergory_container_list").removeClass("catergory_inner_list");
                        liClass = "category_innerbox focusable";
                        divClass = "category_box";
                        innerDivClass = "category_textlist";
                        breakRow = 3;
                    }

                    totalItems = response.subcategories.length;
                    console.log("totalItems", totalItems);
                    if (totalItems > 1) {
                        SUBCAT_DATA_ARRAY = response.subcategories;
                        for (i = 0; i < totalItems; i++) {
                            focusName = "cat_item_" + i;

                            if (i == (totalItems - 1) || ((i + 1) % breakRow == 0 && i > 0)) rigthFocus = " data-sn-right='null'";
                            else rigthFocus = "";

                            if (i % breakRow == 0) leftFocus = " data-sn-left='null'";
                            else if (i > 0) leftFocus = "";

                            if ((totalItems - 1) >= (i + breakRow)) downFocus = "";
                            else downFocus = " data-sn-down='null'";

                            title = "";
                            if (response.subcategories[i]['sub_cat_title'] != undefined) {
                                title = response.subcategories[i]['sub_cat_title'];
                            }
                            imgSrc = response.subcategories[i]['sub_cat_poster'];

                            str += '<div class="' + liClass + '" tabindex="2" id="' + focusName + '" ' + rigthFocus + leftFocus + upFocus + downFocus + ' aria-label="' + title + '">';
                            str += '<div class="' + divClass + '" id="cat_item_div_' + i + '" >';
                            str += '<img src="' + imgSrc + '" id="cat_item_img_' + i + '" onerror="image_error(this);">';
                            str += '<div class="' + innerDivClass + ' text_bright" id="cat_item_innerdiv_' + i + '" >' + title + '</div>';
                            str += '</div>';
                            str += '</div>';
                        }

                        $(".loader_page").hide();

                        if (TIME_STATMP == timestamp) {
                            $("#catList").html(str);
                            addEventListeners();
                            $(".cat_container").show();
                            add_focus("catList", "cat_item_0");
                            SN.focus('catList');
                        }

                    } else if (totalItems == 1) {
                        SECOND_PAGE_FOCUSED_INDEX = 0;
                        SECOND_PAGE_SELECTED_INDEX = 0;
                        PAGE_COUNTER = 1;
                        ITEM_COUNTER = 0;
                        LOAD_NEXT_PAGE = 0;
                        SUBCAT_DATA_ARRAY = response.subcategories;
                        set_subcat_list(timestamp);

                    } else {
                        console.log("cat has no data..");
                        if (!navigator.onLine) msg = NET_CONNECTION_ERR;
                        else msg = NO_RECORD_MSG;
                        set_error_msg(msg, 2);
                    }

                } else {
                    console.log("cat has no data..");
                    if (!navigator.onLine) msg = NET_CONNECTION_ERR;
                    else msg = NO_RECORD_MSG;
                    set_error_msg(msg, 2);
                }
            }
        },
        error: function (xhr, error) {
            console.log("error", error);
            if (TIME_STATMP == timestamp) {
                if (!navigator.onLine) msg = NET_CONNECTION_ERR;
                else msg = NO_RECORD_MSG;
                set_error_msg(msg, 2);
            }
        }
    });

}

function set_search_screen() {
    console.log('Search keyboard...');

    $(".main_container").removeAttr('style');
    $(".home_container, .cat_container, .about_container, .subcat_container, .error_container, .search_container, .search_loader_page").removeClass("active").hide();

    $(".search_container").html('').show();
    set_background(APP_DATA_ARRAY[SELECTED_MENU_INDEX]['menu_page_bg_poster']);

    var str = "";
    str += '<div class="search_container_box form-check" id="searchInput">';
    str += '<div class="search_leftbox" id="searchBox">';
    str += '<img src="images/search_box.png" alt="seach" class="sarch_img">';
    //str += 			'<div class="search_text">SEARCH:</div>';
    str += '<input type="text" name="search" class="search_input focusable" tabindex="1" data-sn-right="null" data-sn-left="null" id="searchInputText" placeholder="Type here..." value="">';
    str += '</div>';
    str += '</div>';
    $(".search_container").html(str);


    SN.remove("searchBox");
    add_focus("searchBox", "searchInputText");
    SN.focus("searchBox");
    // SN.focus("#key_q");
    // When search input box focused
    $('#searchBox').on('sn:focused', function (e) {
        console.log("search input box focused ...");
        $(".menu_container, .subcat_container").removeClass("active");
        $(".search_container").addClass("active");
        $(".menu_container").css('visibility', 'hidden');
        $("#keyboard_container").css("display", "block");
        // SN.focus("keyboard_container");
        SN.focus("#key_q");
    });

    $("#keyboard_container").css("display", "block");
    // SN.focus("keyboard_container");
    SN.focus("#key_q");
}

function request_search_results() {
    console.log('search results request...');
    searchText = get_searched_text();
    $('#searchInputText').blur();
    $('#keyboard_container').hide();
    $(".error_container").html("");
    if (searchText != "") {
        console.log('search request result...');
        TIME_STATMP = jQuery.now();
        PAGE_COUNTER = 1;
        ITEM_COUNTER = 0;
        LOAD_NEXT_PAGE = 0;
        $(".detail_container").addClass("search_result_container");
        set_subcat_list(TIME_STATMP);

    } else {
        var ele = $('.search_container').find("div.search_popup:contains('Please enter text to search.')");
        if (ele.length < 1) {
            var popup = '<div class="search_popup">Please enter text to search.</div>';
            $(".search_box").append(popup);
        }
        SN.focus('searchBox');
        $(".search_popup").fadeIn(1000);
        setTimeout(function () { $.when($(".search_popup").fadeOut(1000)).done(function () { $(".search_popup").remove(); }); }, 2000);
    }
}

function get_searched_text() {
    return $.trim($('#searchInputText').val());
}

// Set sub categories list
function set_subcat_list(timestamp) {
    var url = "",
        focusName = "",
        rigthFocus = "",
        leftFocus = "",
        upFocus = "",
        downFocus = "",
        //row = 0,
        title = "",
        imgSrc = "",
        description = "",
        videoUrl = "",
        data = "",
        str = "",
        catType = "",
        menuType = APP_DATA_ARRAY[SELECTED_MENU_INDEX]['menu_type'],
        bgImg = "";

    $(".subcat_container").addClass("active");

    if (menuType == "L") catType = APP_DATA_ARRAY[SELECTED_MENU_INDEX].categories[FIRST_PAGE_SELECTED_INDEX]['cat_type'];

    // For podcast  
    if (catType == "P") {
        $(".main_container").css("padding-top", "95px");
        $(".home_container, .cat_container, .about_container, .subcat_container, .error_container, .search_container, .search_loader_page").removeClass("active").hide();
        $(".loader_page").show();
        $(".subcat_container").addClass("active");

        $("#subCatgHeading, #subCatDesc").text('');
        $("#subCatgHeading").text(APP_DATA_ARRAY[SELECTED_MENU_INDEX].categories[FIRST_PAGE_FOCUSED_INDEX]['cat_title']);
        $("#subcatList").html("").removeAttr("style");
        $("#subCatPlayIconContainer").hide();
        CHANNEL_DATA_ARRAY['channels'] = {};
        ITEM_COUNTER = 0;

        url = APP_DATA_ARRAY[SELECTED_MENU_INDEX].categories[FIRST_PAGE_SELECTED_INDEX]['feed_url'];
        bgImg = APP_DATA_ARRAY[SELECTED_MENU_INDEX].categories[FIRST_PAGE_FOCUSED_INDEX]['cat_bg_poster'];
        set_background("");
        if (APP_DATA_ARRAY[SELECTED_MENU_INDEX]['menu_name'] == 'Search') set_background(APP_DATA_ARRAY[SELECTED_MENU_INDEX]['menu_page_bg_poster']);
        else set_background(bgImg);

        // for video subcategory
    } else if (catType == "S" || menuType == 'S') {
        // For Search
        if (menuType == 'S') {
            //Pi Jacobs, Leftover salmon, charley crockett
            //searchInput = "Pi ja";
            searchInput = get_searched_text();
            url = APP_DATA_ARRAY[SELECTED_MENU_INDEX]['menu_url'] + searchInput;

        } else {
            if (catType == "S") {
                url = SUBCAT_DATA_ARRAY[SECOND_PAGE_SELECTED_INDEX]['stream_feed_url'];
            }
        }

        if (PAGE_COUNTER == 1) {
            $(".main_container").css("padding-top", "95px");
            $(".home_container, .cat_container, .about_container, .subcat_container, .error_container, .search_container, .search_loader_page").removeClass("active").hide();
            $(".subcat_container").addClass("active");

            $("#subCatgHeading, #subCatDesc").text('');
            $("#subcatList").html("").removeAttr("style");
            $("#subCatPlayIconContainer").show();
            CHANNEL_DATA_ARRAY['channels'] = {};
            ITEM_COUNTER = 0;

            if (catType == "S") {
                $(".loader_page").show();
                set_background("");

                bgImg = SUBCAT_DATA_ARRAY[SECOND_PAGE_SELECTED_INDEX]['sub_cat_bg_poster'];
                if (APP_DATA_ARRAY[SELECTED_MENU_INDEX]['menu_name'] == 'Search') set_background(APP_DATA_ARRAY[SELECTED_MENU_INDEX]['menu_page_bg_poster']);
                else set_background(bgImg);

                $("#subCatgHeading").text(SUBCAT_DATA_ARRAY[SECOND_PAGE_SELECTED_INDEX]['sub_cat_title']);
            } else {
                $(".search_loader_page, .search_container").show();
                $(".main_container").removeAttr('style');
                if (APP_DATA_ARRAY[SELECTED_MENU_INDEX]['menu_name'] == 'Search') set_background(APP_DATA_ARRAY[SELECTED_MENU_INDEX]['menu_page_bg_poster']);
                $("#subCatgHeading").text(APP_DATA_ARRAY[SELECTED_MENU_INDEX]['menu_name']);
            }

        } else if (PAGE_COUNTER > 1) {
            var result = url.split('&page=');
            url = result[0] + '&page=' + PAGE_COUNTER;
            if (result[1] != "undefined") url += "&" + result[1];
        }
    }

    $.ajax({
        type: "GET",
        url: url,
        dataType: "json",
        async: true,
        cache: false,
        timeout: REQUEST_TIMEOUT * 1000,
        beforeSend: function (xhr) {
            //for video subcategory
            if (catType == "S" || menuType == 'S') xhr.setRequestHeader("Authorization", "bearer " + TOKEN);

            xhr.setRequestHeader("Content-Type", "application/json");
        },
        success: function (data) {
            //console.log("data", data);
            if (data != undefined && data != "") {
                // For podcast
                if (catType == "P") {
                    totalItems = data.data.length;

                    // for video subcategory
                } else if (catType == "S" || menuType == 'S') {
                    totalItems = data.total;
                    PER_PAGE_LIMIT = data.per_page;
                }

                if (totalItems > 0) {
                    CHANNEL_DATA_ARRAY['channels']['total'] = totalItems;

                    for (i = 0; i < totalItems; i++) {
                        if (data['data'][i] != "undefined" && _.size(data['data'][i]) > 0) {
                            focusName = " id='subcat_item_" + ITEM_COUNTER + "'";
                            rigthFocus = " data-sn-right='null'";
                            leftFocus = "data-sn-left='null' ";
                            downFocus = "";
                            description = "";
                            titleClass = "";
                            titleId = "",
                                playPauehtml = "";

                            // For podcast
                            if (catType == "P") {
                                if (data['data'][i]['title'] != null) {
                                    title = data['data'][i]['title'];
                                    title = title.replace(/"/g, '&quot;');
                                }

                                if (data['data'][i]['desc'] != null) {
                                    description = data['data'][i]['desc']
                                    description = description.replace(/"/g, '&quot;');
                                }

                                imgSrc = data['data'][i]['poster'];
                                videoUrl = data['data'][i]['media'];

                                titleClass = "podcast_sub_title";
                                titleId = "podcast_subcat_title_";

                                playPauehtml = '<div class="play_icon" id="play_pause_button_' + i + '" onclick="play_pause_audio();"></div>';

                                // for video subcategory
                            } else if (catType == "S" || menuType == 'S') {
                                var pictureURL = data['data'][i]['pictures']['sizes'];
                                if (pictureURL != "undefined" && _.size(pictureURL) > 0) {

                                    pictureURL.forEach(function (pic) {
                                        if (pic.width <= 1000) {
                                            imgSrc = pic.link;
                                        }
                                    });
                                }

                                if (data['data'][i]['name'] != null) {
                                    title = data['data'][i]['name'];
                                    title = title.replace(/"/g, '&quot;');
                                }

                                if (data['data'][i]['description'] != null) {
                                    description = data['data'][i]['description']
                                    description = description.replace(/"/g, '&quot;');
                                }

                                // Get video url
                                var videoUrlArray = data['data'][i]['files'],
                                    width = 0;
                                if (videoUrlArray != "undefined" && _.size(videoUrlArray) > 0) {
                                    videoUrlArray.forEach(function (video) {
                                        if (video.width > width) {
                                            width = video.width;
                                            videoUrl = video.link;
                                        }
                                    });
                                }

                                titleClass = "video_sub_title";
                                titleId = "video_subcat_title_";
                            }

                            titleId += ITEM_COUNTER;

                            CHANNEL_DATA_ARRAY['channels'][ITEM_COUNTER] = {};
                            CHANNEL_DATA_ARRAY['channels'][ITEM_COUNTER]['title'] = title;
                            CHANNEL_DATA_ARRAY['channels'][ITEM_COUNTER]['description'] = description;
                            CHANNEL_DATA_ARRAY['channels'][ITEM_COUNTER]['image'] = imgSrc;
                            CHANNEL_DATA_ARRAY['channels'][ITEM_COUNTER]['url'] = videoUrl;

                            str += '<div class="detail_list_text focusable" id="video_subcat_' + ITEM_COUNTER + '" tabindex="3" ' + focusName + rigthFocus + leftFocus + upFocus + downFocus + '" aria-label="' + title + '"><div class="sub_title_container" id="sub_title_container_' + i + '"><div class="sub_title ' + titleClass + '" id="' + titleId + '">' + playPauehtml + title + '</div></div></div>';

                            ITEM_COUNTER++;
                        }
                    }

                    if (TIME_STATMP == timestamp) {
                        $("#subcatList").append(str);
                        addEventListeners();

                        // For podcast
                        if (catType == "P") {
                            THIRD_PAGE_SELECTED_INDEX = 0;
                            $("#subCatImg").removeClass('category_img').addClass('podcast_img');

                            $(".loader_page, .search_loader_page").hide();
                            $(".subcat_container").addClass("active").css("display", "flex");
                            add_focus("subcatList", "subcat_item_0");
                            SN.focus('subcatList');

                            // for video subcategory
                        } else if (catType == "S" || menuType == 'S') {
                            $("#subCatImg").removeClass('podcast_img').addClass('category_img');
                            if (PAGE_COUNTER == 1) {
                                $(".loader_page, .search_loader_page").hide();
                                $(".subcat_container").addClass("active").css("display", "flex");

                                add_focus("subcatList", "subcat_item_0");
                                if (!$(".menu_container").hasClass("active")) SN.focus('subcatList');
                            }

                            PAGE_COUNTER++;
                            LOAD_NEXT_PAGE = 1;
                        }
                    }

                } else {
                    console.log("subcat has no data..");
                    // For podcast
                    if (catType == "P") {
                        if (!navigator.onLine) msg = NET_CONNECTION_ERR;
                        else msg = NO_RECORD_MSG;
                        set_error_msg(msg, 3);

                        // for video subcategory
                    } else if (catType == "S" || menuType == 'S') {
                        sub_cat_pagoination_onerror(timestamp);
                    }
                }

            } else {
                console.log("subcat has no data..");
                // For podcast
                if (catType == "P") {
                    if (!navigator.onLine) msg = NET_CONNECTION_ERR;
                    else msg = NO_RECORD_MSG;
                    set_error_msg(msg, 3);

                    // for video subcategory
                } else if (catType == "S" || menuType == 'S') {
                    sub_cat_pagoination_onerror(timestamp);
                }
            }
        },
        error: function (xhr, error) {
            console.log("subcat has no data..");
            // For podcast
            if (catType == "P") {
                if (!navigator.onLine) msg = NET_CONNECTION_ERR;
                else msg = NO_RECORD_MSG;
                set_error_msg(msg, 3);

                // for video subcategory
            } else if (catType == "S") {
                sub_cat_pagoination_onerror(timestamp);
            }
        }
    });
}

function sub_cat_pagoination_onerror(timestamp) {
    $(".loader_page, .search_loader_page").hide();
    if (TIME_STATMP == timestamp) {
        var page = 1;
        PAGE_COUNTER++;
        console.log(_.size(CHANNEL_DATA_ARRAY['channels']));
        if (_.size(CHANNEL_DATA_ARRAY['channels']) > 0) {
            page = Math.ceil(CHANNEL_DATA_ARRAY['channels']['total'] / PER_PAGE_LIMIT);
        }

        if (PAGE_COUNTER <= page) {
            set_subcat_list(timestamp);

        } else {
            if ($("#subcatList div").length < 1) {
                LOAD_NEXT_PAGE = 1;
                if (!navigator.onLine) msg = NET_CONNECTION_ERR;
                else msg = NO_RECORD_MSG;
                set_error_msg(msg, 3);
            }
        }
    }
}

function set_error_msg(msg, depth) {
    $(".loader_page").hide();
    $(".error_container").show().addClass("active");
    $(".error_container").html("<div class='loader_text focusable' id='errorMsg' tabindex='" + depth + "'>" + msg + "</div>");

    add_focus("errorContainer", "errorMsg");
    SN.focus('errorContainer');
}

function set_background(bgImg) {
    $("img.background_img").attr("src", bgImg);
}

// Open video screen
function show_hide_video_container() {
    $(".pause-icon").hide();
    $(".video-inner").show();
    $(".video-loader").show();
    $(".container_box").hide();
    $("#video_container").show();
    $(".subcat_container").removeClass("active").hide();
    $(".video_container").addClass('active');
}

// Open error popup when error will occur during video playing.
function retry_error_popup() {
    if (navigator.onLine) msg = PLAYER_ERR;
    else msg = NET_CONNECTION_ERR;

    if ($('#video_container').is(':visible') && $('#video_container').hasClass('active')) hide_show_modal(true, 'RETRY_CANCEL', msg);
    else if (AUDIO_PLAYER != "") hide_show_modal(true, 'RETRY_CANCEL', msg);
}

function scroll_up_down(scroll) {
    var $this = $('.about_box');
    var scrolled = $this.scrollTop();
    if (scroll == -5) {
        if (scrolled < 0) scrolled = scrolled - 60;
        else scrolled = scrolled + 60;

        $this.animate({ scrollTop: scrolled });

    } else if (scroll == 5) {
        if (scrolled < 0) scrolled = scrolled + 60;
        else scrolled = scrolled - 60;

        $this.animate({ scrollTop: scrolled });
    }
}

function change_search_list_view() {
    SUBCAT_DATA_ARRAY = {};
    CHANNEL_DATA_ARRAY['channels'] = {};

    if (APP_DATA_ARRAY[SELECTED_MENU_INDEX]['menu_type'] == 'S') {
        // $(".detail_container").css('padding-top', '165px');
        $(".detail_box").removeClass("detail_box").addClass('search_detail_box');
        $(".category_img").removeClass("category_img").addClass('search_category_img');
        $(".image_sub_container").removeClass("image_sub_container").addClass('search_image_sub_container');
        $(".loader_page").removeClass('loader_page').addClass('search_loader_page');

    } else {
        // $(".detail_container").css('padding-top', '190px');
        $(".search_detail_box").removeClass("search_detail_box").addClass('detail_box');
        $(".search_category_img").removeClass("search_category_img").addClass('category_img');
        $(".search_image_sub_container").removeClass("search_image_sub_container").addClass('image_sub_container');
        $(".search_loader_page").removeClass('search_loader_page').addClass('loader_page');
    }
}

function call_menu_data() {
    set_background("");
    set_background(APP_DATA_ARRAY[SELECTED_MENU_INDEX].menu_page_bg_poster);
    switch (APP_DATA_ARRAY[SELECTED_MENU_INDEX]['menu_type']) {
        case "L":
            set_home_screen();
            break;

        case "C":
            set_about_screen();
            break;

        case "S":
            set_search_screen();
            break;
    }
}

// Calculate text width for manage marquee on prelaunch page 
function calculate_text_width(text) {
    var Elem = $("<label></label>").css("display", "none").html(text);
    $(Elem).prependTo('body');
    var width = Elem.width();
    Elem.remove();
    return width;
}

function add_focus(containerId, itemId) {
    SN.remove(containerId);
    SN.add({
        id: containerId,
        selector: '#' + containerId + ' .focusable',
        defaultElement: '#' + itemId,
        enterTo: 'last-focused'
    });
    SN.makeFocusable();
}

// Placed default image when error occured
function image_error(image, focusDepth) {
    var catType = "";
    if (_.size(APP_DATA_ARRAY) > 0 && APP_DATA_ARRAY[SELECTED_MENU_INDEX]['menu_type'] == 'L') {
        catType = APP_DATA_ARRAY[SELECTED_MENU_INDEX].categories[FIRST_PAGE_SELECTED_INDEX]['cat_type'];
    }

    image.onerror = "";
    if (catType == "P" && $(".subcat_container").is(":visible")) image.src = "images/pod_default.png";
    else image.src = "images/vod_default.png";
}

function resetKeyboard() {
    var elements = $('.key-letters');
    elements.each(function () { $("#" + $(this).attr('id')).text($("#" + $(this).attr('id')).text().toLowerCase()); });
    $("#key_caps").attr('style', function (i, style) { return style && style.replace(/color[^;]+;?/g, ''); });
}

function rtrim(str) {
    return str.replace(/\s+$/, "");
}

function ltrim(str) {
    return str.replace(/^\s+/, "");
}
