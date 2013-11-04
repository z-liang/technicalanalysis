function retrievePattern(n){
    var sel = $('select[name="patternSelector"]').val();
    var pat = new Array();
    if(sel== "allPat"){
        pat.push(generateHS(n));
        pat.push(generateIHS(n));
        pat.push(generateDT(n));
        pat.push(generateDB(n));
        pat.push(generateTT(n));
        pat.push(generateTB(n));
    }else if(sel=="hsOpt"){
        pat.push(generateHS(n));
    }else if(sel=="ihsOpt"){
        pat.push(generateIHS(n));
    }else if(sel=="dtOpt"){
        pat.push(generateDT(n));
    }else if(sel=="dbOpt"){
        pat.push(generateDB(n));
    }else if(sel=="ttOpt"){
        pat.push(generateTT(n));
    }else if(sel=="tbOpt"){
        pat.push(generateTB(n));
    }
    return pat;
}

function generateHS(n){
    var hs = new Array(n);
    if (n<7){
        alert("Head and shoulder pattern must have at least 7 points");
    } else{
        // Define critical points
        
        var segLength = Math.floor(n/6);
        
        hs[0] = -1;
        hs[segLength] = 0.5;
        hs[segLength*2] = -0.5;
        hs[segLength*3] = 1;
        hs[segLength*4] = -0.5;
        hs[segLength*5] = 0.5;
        hs[segLength*6] = -1;
        
        for(var i = 0; i< 6; i++){
            var c1 = segLength*i;
            var c2 = segLength * (i+1);
            for(var j=c1+1; j<c2; j++){
                hs[j] = hs[j-1] + (hs[c2]-hs[c1])/segLength;
            }
        }
        
        // Handler extra points
        var m = n-segLength*6;
        var c5 = segLength*5;
        var c6 = segLength*6;
        for(var i = 1; i<= m; i++){
            hs[c6+i] = hs[c6]+(hs[c6]-hs[c5])/segLength;
        }
    }
    return hs;
}

function generateIHS(n){
    var ihs = new Array(n);
    if (n<7){
        alert("Inverse head and shoulder pattern must have at least 7 points");
    } else{
        // Define critical points
        
        var segLength = Math.floor(n/6);
        
        ihs[0] = 1;
        ihs[segLength] = -0.5;
        ihs[segLength*2] = 0.5;
        ihs[segLength*3] = -1;
        ihs[segLength*4] = 0.5;
        ihs[segLength*5] = -0.5;
        ihs[segLength*6] = 1;
        
        for(var i = 0; i< 6; i++){
            var c1 = segLength*i;
            var c2 = segLength * (i+1);
            for(var j=c1+1; j<c2; j++){
                ihs[j] = ihs[j-1] + (ihs[c2]-ihs[c1])/segLength;
            }
        }
        
        // Handler extra points
        var m = n-segLength*6;
        var c5 = segLength*5;
        var c6 = segLength*6;
        for(var i = 1; i<= m; i++){
            ihs[c6+i] = ihs[c6]+(ihs[c6]-ihs[c5])/segLength;
        }
    }
    return ihs;
}

function generateDT(n){
    var dt = new Array(n);
    if (n<5){
        alert("Inverse head and shoulder pattern must have at least 7 points");
    } else{
        // Define critical points
        
        var segLength = Math.floor(n/4);
        
        dt[0] = -1;
        dt[segLength] = 1;
        dt[segLength*2] = -0.5;
        dt[segLength*3] = 1;
        dt[segLength*4] = -1;
        
        for(var i = 0; i< 4; i++){
            var c1 = segLength*i;
            var c2 = segLength * (i+1);
            for(var j=c1+1; j<c2; j++){
                dt[j] = dt[j-1] + (dt[c2]-dt[c1])/segLength;
            }
        }
        
        // Handler extra points
        var m = n-segLength*4;
        var c4 = segLength*4;
        var c3 = segLength*3;
        for(var i = 1; i<= m; i++){
            dt[c4+i] = dt[c4+i-1]+(dt[c4]-dt[c3])/segLength;
        }
    }
    return dt;
}

function generateDB(n){
    var db = new Array(n);
    if (n<5){
        alert("Inverse head and shoulder pattern must have at least 7 points");
    } else{
        // Define critical points
        
        var segLength = Math.floor(n/4);
        
        db[0] = 1;
        db[segLength] = -1;
        db[segLength*2] = 0.5;
        db[segLength*3] = -1;
        db[segLength*4] = 1;
        
        for(var i = 0; i< 4; i++){
            var c1 = segLength*i;
            var c2 = segLength * (i+1);
            for(var j=c1+1; j<c2; j++){
                db[j] = db[j-1] + (db[c2]-db[c1])/segLength;
            }
        }
        
        // Handler extra points
        var m = n-segLength*4;
        var c4 = segLength*4;
        var c3 = segLength*3;
        for(var i = 1; i<= m; i++){
            db[c4+i] = db[c4+i-1]+(db[c4]-db[c3])/segLength;
        }
    }
    return db;
}

function generateTT(n){
    var tt = new Array(n);
    if (n<7){
        alert("Head and shoulder pattern must have at least 7 points");
    } else{
        // Define critical points
        
        var segLength = Math.floor(n/6);
        
        tt[0] = -1;
        tt[segLength] = 1;
        tt[segLength*2] = -0.5;
        tt[segLength*3] = 1;
        tt[segLength*4] = -0.5;
        tt[segLength*5] = 1;
        tt[segLength*6] = -1;
        
        for(var i = 0; i< 6; i++){
            var c1 = segLength*i;
            var c2 = segLength * (i+1);
            for(var j=c1+1; j<c2; j++){
                tt[j] = tt[j-1] + (tt[c2]-tt[c1])/segLength;
            }
        }
        
        // Handler extra points
        var m = n-segLength*6;
        var c5 = segLength*5;
        var c6 = segLength*6;
        for(var i = 1; i<= m; i++){
            tt[c6+i] = tt[c6]+(tt[c6]-tt[c5])/segLength;
        }
    }
    return tt;
}

function generateTB(n){
    var tb = new Array(n);
    if (n<7){
        alert("Triple Bottem pattern must have at least 7 points");
    } else{
        // Define critical points
        
        var segLength = Math.floor(n/6);
        
        tb[0] = 1;
        tb[segLength] = -1;
        tb[segLength*2] = 0.5;
        tb[segLength*3] = -1;
        tb[segLength*4] = 0.5;
        tb[segLength*5] = -1;
        tb[segLength*6] = 1;
        
        for(var i = 0; i< 6; i++){
            var c1 = segLength*i;
            var c2 = segLength * (i+1);
            for(var j=c1+1; j<c2; j++){
                tb[j] = tb[j-1] + (tb[c2]-tb[c1])/segLength;
            }
        }
        
        // Handler extra points
        var m = n-segLength*6;
        var c5 = segLength*5;
        var c6 = segLength*6;
        for(var i = 1; i<= m; i++){
            tb[c6+i] = tb[c6]+(tb[c6]-tb[c5])/segLength;
        }
    }
    return tb;
}