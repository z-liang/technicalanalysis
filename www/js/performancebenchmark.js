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
        if(dist <= epsilon){
            // Compose the data for plotting
            var dataFound = new Array(m);
            for (var j = 0; j<m; j++){
                dataFound[j] = new Array(2);
                dataFound[j][0] = data[i+j][0];
                dataFound[j][1] = data[i+j][1];
            }
            var denormalizedPat = bruteForceDenormalizePattern(normalizedPat, normalizedData.dataMean, normalizedData.dataSD);
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
        sum = sum + data[i][1];
    }
    mean = sum/n;
    // Compute standard deviation
    sum = 0;
    for (var i = 0; i< n; i++){
        sum = sum + Math.pow(data[i][1]-mean,2);
    }
    sd = Math.sqrt(sum/n);
    // Normalize the mean to be 0 and standard deviation to be 1
    var nData = new Array(n);
    for (var i = 0; i<n; i++){
        nData[i]=(data[i][1]-mean)/sd;
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
        var s = data[i];
        var q = query[i];
        sum += Math.pow(s-q,2);
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

/* The following functions are implemented to do the rule-based pattern matching. */

function ruleBasedMatchPattern(data, pat, m, windowStep){
    var n = data.length;
    var k=0;
    var results = new Array();
    for(var i=0; i<n-m;i+=windowStep){
        var dataSeg = data.slice(i, i + m);
        var valid = false;
        var pips = new Array();
        switch(pat){
            case 0:
                pips = findPIPs(dataSeg, 7);
                valid = validateHeadAndShoulders(pips);
                break;
            case 1:
                pips = findPIPs(dataSeg, 7);
                valid = validateInverseHeadAndShoulders(pips);
                break;
            case 2:
                pips = findPIPs(dataSeg, 5);
                valid = validateDoubleTops(pips);
                break;
            case 3:
                pips = findPIPs(dataSeg, 5);
                valid = validateDoubleBottoms(pips);
                break;
            case 4:
                pips = findPIPs(dataSeg, 7);
                valid = validateTripleTops(pips);
                break;
            case 5:
                pips = findPIPs(dataSeg, 7);
                valid = validateTripleBottoms(pips);
        }
        if(valid){
            // Compose the data for plotting
            var dataFound = new Array(m);
            for (var j = 0; j<m; j++){
                dataFound[j] = new Array(2);
                dataFound[j][0] = data[i+j][0];
                dataFound[j][1] = data[i+j][1];
            }
            var patternFound = composeRuleBasedPattern(pips);
            results[k] = {data:dataFound, pattern:patternFound};
            k++;
        }
    }
    return results;
}

function composeRuleBasedPattern(pips){
    var k = pips.length;
    var pat = new Array(k);
    for(var i=0; i<k; i++){
        pat[i] = new Array(2);
        pat[i][0] = pips[i].x;
        pat[i][1] = pips[i].y;
    }
    return pat;
}

function findPIPs(data, k){
    var n = data.length;
    var pips = new Array();
    
    pips.push({y: data[0][1], x: data[0][0]});
    pips.push({y: data[n-1][1], x:data[n-1][0]});
    
    var count = 2;
    var pipCounted = new Array();
    
    while(count<k){
        var maxDist = 0;
        var maxIdx = 1;
        for(var i=1; i<n-1; i++){
            if(pipCounted.indexOf(i)==-1){
                var point = {y: data[i][1], x:data[i][0]};
                var adjacent = findAdjacentPoints(pips, point);
                var dist = computePointDist(adjacent.left, adjacent.right, point);
                if(dist>maxDist){
                    maxDist = dist;
                    maxIdx = i;
                }
            }
        }
        pips.push({y: data[maxIdx][1], x:data[maxIdx][0]});
        pipCounted.push(maxIdx);
        
        count ++;
    }
    pips.sort(function(a,b){return a.x-b.x});
    return pips;
}

function findAdjacentPoints(pips, p){
    var tempPips = new Array();
    for(var i=0; i<pips.length; i++){
        tempPips.push(pips[i]);
    }
    tempPips.push(p);
    tempPips.sort(function(a,b){return a.x-b.x});
    var index = tempPips.indexOf(p);
    return {left: tempPips[index-1], right:tempPips[index+1]};
}

function computePointDist(p1, p2, p3){
    var dist = Math.sqrt(Math.pow(p2.x-p3.x,2)+Math.pow(p2.y-p2.y,2))+Math.sqrt(Math.pow(p1.x-p3.x,2)+Math.pow(p1.y-p3.y,2));
    return dist;
}

function validateHeadAndShoulders(pips){
    if(pips.length != 7){
        alert("The number of PIPs for Head and Shoulders is not 7");
        return false;
    }else {
        var valid = (pips[3].y > pips[1].y) && (pips[3].y > pips[5].y);
        valid = valid && (pips[1].y > pips[0].y) && (pips[1].y > pips[2].y);
        valid = valid && (pips[5].y > pips[4].y) && (pips[5].y > pips[6].y);
        valid = valid && (pips[2].y > pips[0].y);
        valid = valid && (pips[4].y > pips[6].y);
        valid = valid && ((Math.abs(pips[1].y-pips[5].y)/Math.min(pips[1].y, pips[5].y)) < 0.15);
        valid = valid && ((Math.abs(pips[2].y-pips[4].y)/Math.min(pips[2].y, pips[4].y)) < 0.15);
        return valid;
    }
}

function validateInverseHeadAndShoulders(pips){
    if(pips.length != 7){
        alert("The number of PIPs for Inverse Head and Shoulders is not 7");
        return false;
    }else {
        var valid = (pips[3].y < pips[1].y) && (pips[3].y < pips[5].y);
        valid = valid && (pips[1].y < pips[0].y) && (pips[1].y < pips[2].y);
        valid = valid && (pips[5].y < pips[4].y) && (pips[5].y < pips[6].y);
        valid = valid && (pips[2].y < pips[0].y);
        valid = valid && (pips[4].y < pips[6].y);
        valid = valid && ((Math.abs(pips[1].y-pips[5].y)/Math.min(pips[1].y, pips[5].y)) < 0.15);
        valid = valid && ((Math.abs(pips[2].y-pips[4].y)/Math.min(pips[2].y, pips[4].y)) < 0.15);
        return valid;
    }
}
function validateDoubleTops(pips){
    if(pips.length != 5){
        alert("The number of PIPs for Double Tops is not 5");
        return false;
    }else{
        var valid = ((Math.abs(pips[1].y-pips[3].y)/Math.min(pips[1].y, pips[3].y)) < 0.15);
        valid = valid && (pips[1].y > pips[0].y) && (pips[1].y > pips[2].y);
        valid = valid && (pips[3].y > pips[2].y) && (pips[3].y > pips[4].y);
        return valid;
    }
}

function validateDoubleBottoms(pips){
    if(pips.length != 5){
        alert("The number of PIPs for Double Bottoms is not 5");
        return false;
    } else{
        var valid = ((Math.abs(pips[1].y-pips[3].y)/Math.min(pips[1].y, pips[3].y)) < 0.15);
        valid = valid && (pips[1].y < pips[0].y) && (pips[1].y < pips[2].y);
        valid = valid && (pips[3].y < pips[2].y) && (pips[3].y < pips[4].y);
        return valid;
    }
}
function validateTripleTops(pips){
    if(pips.length != 7){
        alert("The number of PIPs for Triple Tops is not 7");
        return false;
    }else {
        var valid = ((Math.abs(pips[1].y-pips[3].y)/Math.min(pips[1].y, pips[3].y)) < 0.15);
        valid = valid && ((Math.abs(pips[1].y-pips[5].y)/Math.min(pips[1].y, pips[5].y)) < 0.15);
        valid = valid && ((Math.abs(pips[3].y-pips[5].y)/Math.min(pips[3].y, pips[5].y)) < 0.15);
        valid = valid && ((Math.abs(pips[2].y-pips[4].y)/Math.min(pips[2].y, pips[4].y)) < 0.15);
        valid = valid && (pips[1].y > pips[0].y) && (pips[1].y > pips[2].y);
        valid = valid && (pips[3].y > pips[2].y) && (pips[3].y > pips[4].y);
        valid = valid && (pips[5].y > pips[4].y) && (pips[5].y > pips[6].y);
        return valid;
    }
}

function validateTripleBottoms(pips){
    if(pips.length != 7){
        alert("The number of PIPs for Triple Bottoms is not 7");
        return false;
    }else {
        var valid = ((Math.abs(pips[1].y-pips[3].y)/Math.min(pips[1].y, pips[3].y)) < 0.15);
        valid = valid && ((Math.abs(pips[1].y-pips[5].y)/Math.min(pips[1].y, pips[5].y)) < 0.15);
        valid = valid && ((Math.abs(pips[3].y-pips[5].y)/Math.min(pips[3].y, pips[5].y)) < 0.15);
        valid = valid && ((Math.abs(pips[2].y-pips[4].y)/Math.min(pips[2].y, pips[4].y)) < 0.15);
        valid = valid && (pips[1].y < pips[0].y) && (pips[1].y < pips[2].y);
        valid = valid && (pips[3].y < pips[2].y) && (pips[3].y < pips[4].y);
        valid = valid && (pips[5].y < pips[4].y) && (pips[5].y < pips[6].y);
        return valid;
    }
}