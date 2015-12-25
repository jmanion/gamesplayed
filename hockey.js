var jQuery;
(function() {

  if(typeof jQuery !=='undefined') {
      return;
  } else if (typeof $=='function') {
      var otherlib=true;
  }

  // more or less stolen form jquery core and adapted by paul irish
  function getScript(url,success){
        var script=document.createElement('script');
        script.src=url;
        var head=document.getElementsByTagName('head')[0],
        done=false;
 // Attach handlers for all browsers
         script.onload=script.onreadystatechange = function(){
           if ( !done && (!this.readyState
             || this.readyState == 'loaded'
             || this.readyState == 'complete') ) {
                  done=true;
                  success();
                  script.onload = script.onreadystatechange = null;
                  head.removeChild(script);
           }
        };
    head.appendChild(script);
  }
  getScript('https://code.jquery.com/jquery-latest.min.js',function() {
    if (otherlib) {
       jQuery.noConflict();
    }
  });
 })();

function getParameterByName(name, url) {
     name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
     var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
         results = regex.exec(url);
     return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
 }

function sortByKey(array, key) {
  return array.sort(function(a, b) {
  var x = a[key]; var y = b[key];
  return ((x < y) ? -1 : ((x > y) ? 1 : 0));
  });
}

var timer = setInterval(function(){ jQuerified(jQuery) }, 100);

function jQuerified($) {
    if (typeof jQuery =='undefined') {
        return;
    } else {
        clearInterval(timer);
        myCode($);
    }
}


function myCode($){

//Get urls for days
var urls = [];
//totals for games played
var myTotalCount = 0;
var yourTotalCount = 0;

//totals by day object
var totals = [];

//temp object of a single day totals
var temp;

//counter for completed ajax requests
var counter = 0;
var positions = ['C', 'LW', 'RW', 'D'];

var days = $('#matchup_table div.Grid-u-5-6 ul').children();

//don't add matchup totals
days.each(function(i, o){
    if(i !== 0){
    urls[i - 1] = $(this).find('a.Navtarget').attr('href');
    }
});

var numDays = urls.length;

urls.forEach(function(e, i, o) {
    $.ajax({
        method: "GET",
        url: e + "&ajaxrequest=1",

        success: function(response) {

            var content = response.content; //works - leave it be
            var matchups = $(content).find('#matchupcontent1 table tbody').children(); //seems to work as well

            var breakpoint = matchups.length / 2;
            var myCount = 0;
            var yourCount = 0;

            //loop rows
            matchups.each(function(index, o){

                //make sure they are actually playing this week
                if ($.inArray($(this).find('td.Bg-shade').children('div').children('span').html(), positions) > -1){
                    //loop tds

                    $(this).children().each(function(index, out){
                        if ($(this).find('a.F-reset').length > 0){
                            if (index > breakpoint){
                                yourTotalCount++;
                                yourCount++;
                            } else {
                                myTotalCount++;
                                myCount++;
                            }
                        }

                    });
                }
            });
        //get the date of the current request
        var date = getParameterByName('date', e);
        //all rows are counted, add them to the array with the date as the index
        // $totals[$date] = array('mine' => myCount, 'yours' => yourCount)
        temp = {};
        temp['date'] = date;
        temp['myCount'] = myCount;
        temp['yourCount'] = yourCount;

        totals.push(temp);
        counter++;

        //if all requests have completed
        if (counter == numDays){
          totals = sortByKey(totals, 'date');
          // loop through the days $date => $values
          var today = new Date();
          today = today.valueOf();
          var myRemainingTotal = 0;
          var yourRemainingTotal = 0;

          totals.forEach(function(e, i, o) {
            //if the iteration is less than the current day - superstrike and don't add to the remaining total
             var matchupDate = new Date(e.date);
             if (matchupDate.valueOf() <= today){
               //strikethrough and don't add to remaining total
             } else {
               //add to total remaining
               myRemainingTotal += e.myCount;
               yourRemainingTotal += e.yourCount;
             }
          });
          console.log(myRemainingTotal);
        }


      }
    });

});
}

/* notes

//date stuff
var d = new Date("2015-12-22" + " 12:00:00");


document.getElementById("demo").innerHTML = d;
document.getElementById("demo2").innerHTML = today;

*/
