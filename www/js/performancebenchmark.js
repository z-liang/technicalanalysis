function bruteForceMatchPattern(data, query, epsilon, windowStep){
    var n = data.length;
    var m = query.length;
    var k = 0;
    var results = new Array();
    
    var normalizedPat = bruteForceNormalizePattern(query);
    
    for(var i=0;i<n-m; i+= windowStep){
        var dataSeg = data.slice(i, i + m);
        var normalizedData = bruteForceNormalize(dataSeg);
        // Compute brute force distance
        var dist = bruteForceDistance(normalizedData.data, normalizedPat);
       // alert(dist);
        if(dist <= epsilon){
            // Compose the data for plotting
            
            var dataFound = new Array(m);
            for (var j = 0; j<m; j++){
                dataFound[j] = new Array(2);
                dataFound[j][0] = data[i+j][0];
                dataFound[j][1] = data[i+j][1];
            }
            var denormalizedPat = bruteForceDenormalizePattern(normalizedPat, normalizedData.dataMean, normalizedData.dataSD);
            alert
            results[k] = {data:dataFound, pattern:denormalizedPat, dist: dist};
            k++;
        }
    }
    results.sort(function(a,b){return a.dist-b.dist});
    return results;
}

function bruteForceNormalize(data){
    var mean;
    var sd;
    var n = data.length;
    var sum = 0;
    
    // Compute mean
    for (var i = 0; i < n; i++){
        sum = sum + parseFloat(data[i][1]);
    }
    mean = sum/n;
    // Compute standard deviation
    sum = 0;
    for (var i = 0; i< n; i++){
        sum = sum + Math.pow(parseFloat(data[i][1])-mean,2);
    }
    sd = Math.sqrt(sum/n);
    // Normalize the mean to be 0 and standard deviation to be 1
    var nData = new Array(n);
    for (var i = 0; i<n; i++){
        nData[i]=(parseFloat(data[n-1-i][1])-mean)/sd;
    }
    
    var returnVal = {data: nData, dataMean: mean, dataSD: sd};
    return returnVal;

}

function bruteForceNormalizePattern(pat){
    var mean;
    var sd;
    var n = pat.length;
    var sum = 0;
    
    // Compute mean
    for (var i = 0; i < n; i++){
        sum = sum + pat[i];
    }
    mean = sum/n;
    // Compute standard deviation
    sum = 0;
    for (var i = 0; i< n; i++){
        sum = sum + Math.pow(pat[i]-mean,2);
    }
    sd = Math.sqrt(sum/n);
    // Normalize the mean to be 0 and standard deviation to be 1
    var nData = new Array(n);
    for (var i = 0; i<n; i++){
        nData[i]=(pat[i]-mean)/sd;
    }
    return nData;
}


function bruteForceDistance(data, query){
    var m = query.length;
    var sum = 0;
    for(var i=0; i<m; i++){
        var s = parseFloat(data[i][1]);
        var q = query[i];
        sum += (s-q)^2;
    }
    var dist = Math.sqrt(sum);
    return dist;
}

function bruteForceDenormalizePattern(pat, m, sd){
    var denormalized = new Array(pat.length);

    for(var i = 0; i<pat.length; i++){
        denormalized[i] = pat[i]*sd+m;
    }
    return denormalized;
}