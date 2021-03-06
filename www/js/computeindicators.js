function computeMovingAverage(data, n) {
    var sma = new Array();
    for (var i = 0; i < data.length-n; i++){
        sma[i] = new Array(2);
        sma[i][0] = data[i+n][0];
        var sum = data[i][1];
        for (var j = i+1; j < i+n; j++){
            sum += data[j][1];
        }
        sma[i][1] = sum/n;
    }
    return sma;
}

function computeMACD(data, sn, ln){
    var macd = new Array();
    for (var i = 0; i<data.length-ln; i++){
        macd[i] = new Array(2);
        macd[i][0] = data[i+ln][0];
        var sumst = data[i][1];
        var sumlt = data[i][1];
        for (var j =i+1; j<i+ln;j++){
            sumlt += data[j][1];
            if(j<i+sn)
                sumst += data[j][1];
        }
        macd[i][1] = sumlt/ln -sumst/sn;
    }
    return macd;
}

function computeStochasticOscillator(data, n){
    var kResult = new Array();
    var dResult = new Array();

   for (var i = 0; i<data.basic.length-n; i++){
       kResult[i] = new Array(2);
       kResult[i][0] = data.basic[i+n-1][0];
       var max = data.extra[i][0];
       var min = data.extra[i][1];
       for (j=i+1;j<i+n;j++){
           if(data.extra[j][0]>max){
               max = data.extra[j][0];
           }
           if(data.extra[j][1]<min){
               min = data.extra[j][1];
           }
       }
       kResult[i][1] = 100*(data.basic[i+n-1][1]-min)/(max-min);
    }
    
    for (var i = 0; i <kResult.length-2;i++){
        dResult[i] = new Array(2);
        dResult[i][0] = kResult[i][0];
        dResult[i][1] = (kResult[i][1]+kResult[i+1][1]+kResult[i+2][1])/3;
    }
    var sc = {k:kResult, d:dResult};
    return sc;
}
