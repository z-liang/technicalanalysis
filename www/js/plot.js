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