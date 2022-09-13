
jQuery(".navButton").click(function(){
    id = this.id;
    d_source = jQuery("#"+id).data("source");
    console.log("clicked button id: "+ id);
    // console.log("d_source: "+ d_source);

    // change the HTML
    newHTML = pageViews[d_source];
    // console.log("newHTML: "+ newHTML);
    jQuery("#mainPanel").html(newHTML);

    // update button appearances
    jQuery('.navButton').each(function(i, obj) {
        id_navButton=this.id;
        jQuery("#"+id_navButton).removeClass("active");
    });
    jQuery("#"+id).addClass("active");
});
