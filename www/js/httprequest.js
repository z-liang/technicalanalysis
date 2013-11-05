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
        
        // Parse the csv data
        $.each(lines, function(lineCount, line){
               if (lineCount > 0){
                count = lineCount - 1;
                var items = line.split(",");
                if (items.length > 1){
                    rawdata[count] = new Array(2);
                    sodata[count] = new Array(2);
                    rawdata[count][0] = (items[0].parseDate()).getTime();
                    rawdata[count][1] = parseFloat(items[6]);
                    sodata[count][0] = parseFloat(items[2]);
                    sodata[count][1] = parseFloat(items[3]);
                    volumedata[count] = parseFloat(items[4]);
                }}});
        
        // Reorder the raw data into correct order
        var sortedRawData = new Array(count);
        var sortedExtraData = new Array(count);
        var sortedVolumeData = new Array(count);
        for(var i = 0; i < count ; i++){
            var k = count - i- 1;
            sortedRawData[i] = new Array(2);
            sortedExtraData[i] = new Array(2);
            sortedRawData[i][0] = rawdata[k][0];
            sortedRawData[i][1] = rawdata[k][1];
            sortedExtraData[i][0] = sodata[k][0];
            sortedExtraData[i][1] = sodata[k][1];
            sortedVolumeData[i] = volumedata[k];
        }
        //var data = {label: ticker, basicData: rawdata, extraData:sodata, volume: volumedata};
        var data = {label:ticker, basicData: sortedRawData, extraData: sortedExtraData, volume: sortedVolumeData};

        callback(data);
    }else {
        // Handle request failure
        alert("Failed to send the request.");
        return;
    }
    String.prototype.trim=function(){return this.replace(/^\s+|\s+$/g, '');};
}

function getMinDate(){
    var fromDate = document.getElementById("fromdate").value;
    var minDate = (new Date(fromDate)).getTime();
    return minDate;
}
