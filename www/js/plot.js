function plotBasicChart(data){
    var plotdata = new Array();
    
    for(var i=0; i<data.length; i++){
        var currData = data[i];
        plotdata.push({label:currData.label, data:currData.basicData});
    }

    var ph1 = $("#basicPlot")[0];
    $.plot(ph1, plotdata, {
           xaxis: {mode: "time", minTickSize:[1, "month"]},
           yaxis:{labelWidth:22},
           legend:{backgroundColor: null, position:"nw"}
           });
}


function addOption(selectbox, value, text)
{
    var optn = document.createElement("OPTION");
    optn.text = text;
    optn.value = value;
    
    selectbox.options.add(optn);
}

function removeAllOptions(selectbox)
{
    var i;
    for(i=selectbox.options.length-1;i>=0;i--)
    {
        selectbox.remove(i);
    }
}