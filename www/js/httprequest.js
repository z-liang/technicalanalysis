function sendMultiRequest(callback){
    var tickers = document.getElementById("ticker").value.split(",");
    var data = new Array();
    
    for(var i = 0; i<tickers.length; i++){
        var ticker = tickers[i];
        sendRequest(ticker, function(d){
                    data.push(d);
                    });
    }
    while(i!=tickers.length);
    callback(data);
}

function sendRequest(ticker, callback){
    /**
     *
     * CSV Parser credit goes to Brian Huisman, from his blog entry entitled "CSV String to Array in JavaScript":
     * http://www.greywyvern.com/?post=258
     *
     */
    /*String.prototype.splitCSV = function(sep) {
        for (var thisCSV = this.split(sep = sep || ","), x = thisCSV.length - 1, tl; x >= 0; x--){
            if (thisCSV[x].replace(/"\s+$/, '"').charAt(thisCSV[x].length - 1) == '"'){
                                   if ((tl = thisCSV[x].replace(/^\s*"|"\s*$/g, '')).length > 1 && tl.charAt(0) == '"') {
                                   thisCSV[x] = thisCSV[x].replace(/^\s*"|"\s*$/g, '').replace(/""/g, '"');
                                   } else if (x) {
                                   thisCSV.splice(x - 1, 2, [thisCSV[x - 1], thisCSV[x]].join(sep));
                                   } else {
                                   thisCSV = thisCSV.shift().split(sep).concat(thisCSV);
                                   }
                                   } else {
                                   thisCSV[x].replace(/""/g, '"');
                                   }
                                   }
                                   return thisCSV;
                                   };*/
                                   
    String.prototype.parseDate = function (){
                                   var parts = this.split("-");
                                   // new Date(year, month [, date [, hours[, minutes[, seconds[, ms]]]]])
                                   return new Date(parts[0], parts[1]-1, parts[2]); // months are 0-based
                                   }
    var form;

    var fromDate;
    var toDate;

    form = document.getElementById("dataRequestForm");

    fromDate = document.getElementById("fromdate").value.split("-");
    toDate = document.getElementById("todate").value.split("-");

        var url = "http://ichart.yahoo.com/table.csv?s="+ticker;
        if (fromDate.length > 0){
            url = url + "&a="+(fromDate[1]-1)+"&b="+fromDate[2]+"&c="+fromDate[0];
        }
        if (toDate.length > 0){
            url = url + "&d="+(toDate[1]-1)+"&e="+toDate[2]+"&f="+toDate[0];
        }
        var req = new XMLHttpRequest();
        
        req.open("GET",url,false);
        req.send();
    if(req.status === 200){
       
        // Request successful, read the response
        var resp = req.responseText;
        var lines = resp.replace('\r','').split('\n');
        var rawdata = new Array();
        var sodata = new Array();
        var volumedata = new Array();
        var count = 0;

        $.each(lines, function(lineCount, line){
               if (lineCount > 0){
                count = lineCount - 1;
                var items = line.split(",");
                if (items.length > 1){
                    rawdata[count] = new Array(2);
                    sodata[count] = new Array(2);
                    rawdata[count][0] = (items[0].parseDate()).getTime();
                    rawdata[count][1] = items[6];
                    sodata[count][0] = items[2];
                    sodata[count][1] = items[3];
                    volumedata[count] = items[4];
                }}});
        var data = {label: ticker, basicData: rawdata, extraData:sodata, volume: volumedata};

        callback(data);
    }else {
        // Handle request failure
        alert("Failed to send the request.");
        return;
    }
    String.prototype.trim=function(){return this.replace(/^\s+|\s+$/g, '');};
}
