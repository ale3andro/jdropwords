/** FROM https://www.kevinleary.net/javascript-get-url-parameters/
 * JavaScript Get URL Parameter
 * 
 * @param String prop The specific URL parameter you want to retreive the value for
 * @return String|Object If prop is provided a string value is returned, otherwise an object of all properties is returned
 */
function getUrlParams( prop ) {
    var params = {};
    var search = decodeURIComponent( window.location.href.slice( window.location.href.indexOf( '?' ) + 1 ) );
    var definitions = search.split( '&' );

    definitions.forEach( function( val, key ) {
        var parts = val.split( '=', 2 );
        params[ parts[ 0 ] ] = parts[ 1 ];
    } );

    return ( prop && prop in params ) ? params[ prop ] : params;
}

// Shuffle Children elements of an html node
// https://css-tricks.com/snippets/jquery/shuffle-children/
$.fn.shuffleChildren = function() {
    $.each(this.get(), function(index, el) {
        var $el = $(el);
        var $find = $el.children();

        $find.sort(function() {
            return 0.5 - Math.random();
        });

        $el.empty();
        $find.appendTo($el);
    });
};


$( document ).ready(function() {
    $(".nodrag").on("dragstart", function() {
        return false; // Prevents dragging
    });
    sentences = [];
    words = [];
    ids = [];
    var answers = new Object();
    if (!('id' in getUrlParams())) {
        $.ajax(
        {   url: "activities/all_activities",
            type: "GET",
            dataType: "text",
            success: function(result) {
                $('#alx_sentences').html('Διαθέσιμες δραστηριότητες');

                $('#alx_words').html('');
                $('.nodrag').hide();
                
                console.log(result);
                var alldata = result.split('\n');
                for (var i=0; i<alldata.length; i+=3) {
                    activity_id = alldata[i].split(".")[0];
                    if (alldata[i]!='') {
                        activity_title = alldata[i+1].substring(1, alldata[i+1].length-1);
                        activity_class = alldata[i+2].substring(1, alldata[i+2].length-1);
                        let url = 'Τάξη: ' + activity_class + ' | '  + activity_title + ' | <a href="?id=' + activity_id + '">εδώ</a>.<br />';
                        $('#alx_words').html( $('#alx_words').html() + url);
                        console.log(url);
                    }
                }
            },
            error: function(xhr, status, error) {
                $('#alx_sentences').append("<p>Δεν βρέθηκε δραστηριότητα με αυτό το id</p>");
                $('.actions').hide();
            } 
        });
    } else {
        $.ajax(
            {   url: "activities/" + getUrlParams('id') + ".json",
                type: "GET",
                dataType: "json",
                success: function(data) {
                    title = data['metadata']['title'];
                    subtitle = data['metadata']['subtitle'];
                    document.title = title;
                    $("#alx_subtitle").html(subtitle);
                    $.each(data['sentences'], function(index, value) {
                        sentences.push(value['sentence']);
                        words.push(value['missing_word']);
                        ids.push(Math.random().toString(36));
                    });
                    
                    var answers = {}; 
                    for (var i=0; i<sentences.length; i++) {
                        $('#alx_sentences').append("<p>" + (i+1) +". " + sentences[i].replace("***", "<span class=\"blank\" id=\"gap_" + ids[i] + "\"></span>") + "</p>");
                        $("#alx_words").append("<li class=\"word\" id=\"word_" + ids[i] + "\">" + words[i] + "</li>");                 
                        answers["gap_" + ids[i]] = 'word_' + ids[i];
                    }
                    $("#alx_words").shuffleChildren();
                    $(function(){
                        $('.jdropwords').jDropWords({
                            answers : answers
                        });
                    });
                },
                error: function(xhr, status, error) {
                    window.location.href = "http://sxoleio.pw/alx_code/jdropwords/";
                } 
        });
    }  
});