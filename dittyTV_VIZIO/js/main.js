window.onload = function () {
    $(".splash-screen").show();
    $(".container_box").hide();
    $("span#modal_container").load("popup.html");
    parse_main_feed();
};