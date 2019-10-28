
var selected_coins = [];
var xAxis = 0;
$(document).ready(function () {
    
    getCoins();
    $("#Home").on("click", function () {
        
        $(".About").hide();
        $(".cube").show();
        $("#chartContainer").hide();
        
        addCoinToSelectedCoinsArray()
        getCoins();
        
    });
    $("#Live_Repots").on("click", function () {
        xAxis = 0;
        new_data = [];
        data_values = [];
        $(".cube").hide();
        $(".About").hide();
        $("#chartContainer").show();
        getCoinsPrice();
        
        
    });
    $("#About").on("click", function () {
        
        
        $(".About").show();
        $(".cube").hide();
        $("#chartContainer").hide();
      
       
        

        About();
        
    });
    $("#search").on("click", function () {
        var value = $(".form-control").val().toLowerCase();
        $(".cube ").filter(function () {
            $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
        });
    });
});




function getCoins() {
    $("#coins").html("<img src='image/bitcoin-globe.gif' class='col-md-12'/>");
    var my_url = "https://api.coingecko.com/api/v3/coins/list";
    $.ajax({
        url: my_url,
        type: "get",
        data: {},
        success: function (result) {
            console.log(result);
            $("#coins").html("");
            printAllCoins(result);
        },
        error: function (xhr) {
            console.log("Error:", xhr);
        }
    });
}

function printAllCoins(result) {
    for (let i = 0; i < result.length; i++) {
        let cube = $("<div class='cube col-md-4 cube'></div>");
        $(cube).append(`<label class="switch col-md-3"  ><input type="checkbox"  id="_${result[i].symbol}" onClick="addCoinToSelectedCoinsArray(this)">(<span class="slider round" ></span>)</label>`);
        $(cube).append("<h3>" + result[i].symbol + "</h3>");
        $(cube).append("<h6>" + result[i].name + "</h6>");
        $(cube).append(`<div class=" btn btn-outline-warning" id="` + result[i].id + `"  onclick= 'getCoinsInfo( this.id )'> More Info </div>`);
        if (!$("#coins").find(result).length) {
            $("#coins").append(cube);
        }
    }
}

function addCoinToSelectedCoinsArray(id) {
    let myStr = id.id;
    myStr = myStr.replace(/_/g, '');
    console.log(myStr)
    if (selected_coins.indexOf(myStr) >= 0) {
        selected_coins.splice(selected_coins.indexOf(myStr), 1);
        console.log(selected_coins);
        console.log(selected_coins.length)
    } else {
        if (selected_coins.length <= 4) {
            selected_coins.push(myStr);
            $('#coins #_' + myStr).prop("checked", true);
            console.log(selected_coins)
        } else {
            $('#_' + myStr).prop("checked", false);
            console.log(selected_coins)
            showPopUpForCoins()
        }
    }
}

function showPopUpForCoins() {
    $("#Open_a_modal").html('');
    Modal = $('<div class="modal col-md-12" id="myModal">');
    $(Modal).append('<div class="modal-header">' + '<h1 class="H">Select up to five coins</h1>' + '</div>');
    for (let i = 0; i < 5; i++) {
        $(Modal).append('<div class="modal-body col-md-12">' + `<label class="switch i"  ><input type="checkbox" checked id="${selected_coins[i]}" onClick="removeCoinfrompopup(this)"><span class="slider round" ></span></label>` + "<h1 class='H'>" + selected_coins[i] + "</h1>")
    }
    $(Modal).append('<div class="modal-footer">' + '<div class="btn btn-outline-dark" id="close">close</div>' + '</div>');
    $("#Open_a_modal").append(Modal);
    var modal = document.getElementById('myModal');
    modal.style.display = "block";

    $("#close").on("click", function () {
        modal.style.display = "none";
    });
}

function removeCoinfrompopup(id) {
    let myStr = id.id;
    myStr = myStr.replace(/_/g, '');
    console.log(myStr)
    if ($(id).prop("checked") == false) {
        $('#Open_a_modal #_' + myStr).prop("checked", false);
        $('#coins #_' + myStr).prop("checked", false);
        selected_coins.splice(selected_coins.indexOf(id.id), 1);
        console.log(selected_coins)
    } else {
        $('#Open_a_modal #_' + myStr).prop("checked", true);
        $('#coins #_' + myStr).prop("checked", true);
        selected_coins.push(myStr);
        console.log(selected_coins)

    }

}

function getCoinsInfo(id) {
    if (id in localStorage) {
        var stored_id = JSON.parse(localStorage.getItem(id));
        // calculate expiration time for item after 2 minutes,
        now = new Date();
        expiration = new Date(stored_id.time);
        expiration.setMinutes(expiration.getMinutes() + 2);
        showFromLS(stored_id);
        // Delete the item if too old
        if (now.getTime() > expiration.getTime()) {
            localStorage.removeItem(id);
        }
        
    } else {
        id = id.toLowerCase();
        my_url = "https://api.coingecko.com/api/v3/coins/" + id;
        console.log(my_url)
        $.ajax({
            url: my_url,
            type: "get",
            data: {},
            success: function (result) {
                localStorage.setItem(id, JSON.stringify({ time: new Date(), info: result }));
                printAllCoinsInfo(result);
                console.log(result);
            },
            error: function (xhr) {
                console.log("Error:", xhr);
            }
        });
    }
}

//Show information from localStorage
function showFromLS(result) {
    var more = $("<div class='more'></div>");
    $(more).html("<img src='image/coin.gif' width=372 height=160/>");
    setTimeout(function () {
        $(more).html("");
    }, 1000);
    setTimeout(function () {
        $(more).append("<img  src='" + result.info.image.small + "' />");
        $(more).append("<h4>" + result.info.market_data.current_price.usd.toFixed(4) + '$' + "</h4>");
        $(more).append("<h4>" + result.info.market_data.current_price.eur.toFixed(4) + '€' + "</h4>");
        $(more).append("<h4>" + result.info.market_data.current_price.ils.toFixed(4) + '₪' + "</h3>");
    }, 1000);
    $("#" + result.info.id).parent().append(more);
    $("#" + result.info.id).one('click', function () {
        $(more).slideToggle("slow")
        $("#" + result.info.id).parent().append(more);

    })
}

//Show information from api
function printAllCoinsInfo(result) {
    let more = $("<div class='more'></div>");
    $(more).html("<img src='image/coin.gif' width=372 height=160/>");
    setTimeout(function () {
        $(more).html("");
    }, 1000);
    setTimeout(function () {
        $(more).append("<img  src='" + result.image.small + "' />");
        $(more).append("<h4>" + result.market_data.current_price.usd.toFixed(4) + '$' + "</h4>");
        $(more).append("<h4>" + result.market_data.current_price.eur.toFixed(4) + '€' + "</h4>");
        $(more).append("<h4>" + result.market_data.current_price.ils.toFixed(4) + '₪' + "</h3>");
    }, 1000);

    if (!$("#" + result.id).find('.more').length) {
        $("#" + result.id).parent().append(more);
    }
    $("#" + result.id).one('click', function () {
        $(more).slideToggle("slow")
        $("#" + result.id).parent().append(more);
    })
}

function About() {
    let About = $("<div class='col-md-12 About' >");
    $(About).append("<div> Name: Gal Rubin. </div>");
    $(About).append("<div> Email: galrubin2410@gmail.com. </div>");
    $(About).append("<div> Cellphone Number: 050-4241095. </div>");
    $(About).append("<div> Address: Afula 16/B Egoz st.</div>");
    if (!$("#coins").find('.About').length) {
        $("#coins").append(About);
    }
}

var data_values = []
function getCoinsPrice() {

    my_url = "";
    let coins = "";
    for (let i = 0; i < selected_coins.length; i++) {
        var res = selected_coins[i].toUpperCase()
        coins += res + ",";
    }
    my_url = "https://min-api.cryptocompare.com/data/pricemulti?fsyms=" + coins.slice(0, -1) + "&tsyms=USD";
    if (coins != "") {
        $.ajax({
            url: my_url,
            type: "get",
            data: {},
            success: function (result) {
                var d = new Date();
                console.log(result);
                new_data = [];

                for (let r = 0; r < selected_coins.length; r++) {
                    if (result[selected_coins[r].toUpperCase()]) { // if coin exist
                        if (!data_values[selected_coins[r].toUpperCase()]) {
                            data_values[selected_coins[r].toUpperCase()] = [];
                        }
                        data_values[selected_coins[r].toUpperCase()].push({ x: xAxis, y: result[selected_coins[r].toUpperCase()].USD });
                        new_data.push(
                            {
                                type: "line",
                                name: selected_coins[r].toUpperCase(),
                                showInLegend: true,
                                axisYIndex: 1,
                                label: xAxis,
                                dataPoints: data_values[selected_coins[r].toUpperCase()]
                            }
                        )
                    }
                }

                var chart = new CanvasJS.Chart("chartContainer", {
                    title: {
                        text: selected_coins + ' to USD',
                    },
                    axisY: [{
                        title: "Coin value",
                        lineColor: "#C24642",
                        tickColor: "#C24642",
                        labelFontColor: "#C24642",
                        titleFontColor: "#C24642",
                        suffix: "k"
                    },],
                    toolTip: {
                        shared: true
                    },
                    legend: {
                        cursor: "pointer",
                        itemclick: toggleDataSeries
                    },
                    data: new_data

                });


                function toggleDataSeries(e) {
                    if (typeof (e.dataSeries.visible) === "undefined" || e.dataSeries.visible) {
                        e.dataSeries.visible = false;
                    } else {
                        e.dataSeries.visible = true;
                    }
                    e.chart.render();

                }
                $("#coins").append(chart);
                chart.render();
                xAxis += 2;
            },
            error: function (xhr) {
                console.log("Error:", xhr);
            }
        });
    } else {
        $("#chartContainer").hide();

    }


}


var interval = setInterval(function () { getCoinsPrice(); }, 2000);

