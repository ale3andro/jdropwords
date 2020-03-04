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
    sentences = [];
    words = [];
    ids = [];
    var answers = new Object();
    var a1 = getUrlParams('id');
    if ( (a1.length>0) && (a1!='not available') ) {
        var jqxhr = $.getJSON("activities/" + a1 + ".json", function(data) {
            title = data['metadata']['title'];
            subtitle = data['metadata']['subtitle'];
            document.title = title;
            $.each(data['sentences'], function(index, value) {
                sentences.push(value['sentence']);
                words.push(value['missing_word']);
                ids.push(Math.random().toString(36));
            });
            
            var answers = {}; 
            for (var i=0; i<sentences.length; i++) {
                $('#alx_sentences').append("<p>" + sentences[i].replace("***", "<span class=\"blank\" id=\"gap_" + ids[i] + "\"></span>") + "</p>");
                $("#alx_words").append("<li class=\"word\" id=\"word_" + ids[i] + "\">" + words[i] + "</li>");                 
                answers["gap_" + ids[i]] = 'word_' + ids[i];
            }
            $("#alx_words").shuffleChildren();
            $(function(){
                $('.jdropwords').jDropWords({
                    answers : answers
                });
            });
           
        })
        .fail(function() {
            $('#alx_sentences').append("<p>Δεν βρέθηκε δραστηριότητα με αυτό το id</p>");
            $('.actions').hide();
        });
    }
    else {
        $('#alx_sentences').append("<p>Δεν ορίστηκε το id της δραστηριότητας</p>");
        $('.actions').hide();
    }      
});