"use strict";


function escapeHtml(unsafe) {
    return unsafe
         .replace(/&/g, "&amp;")
         .replace(/</g, "&lt;")
         .replace(/>/g, "&gt;")
         .replace(/"/g, "&quot;")
         .replace(/'/g, "&#039;");
 }


const MAX_CHARS_STRING=50;

function stringSummary(str)
{
    var meta='';
    var summary=escapeHtml(str);
    summary = summary.replace(/(\r\n|\n|\r)/gm," ");

    if(str.indexOf('\n')!=-1)meta+='multiline String ';
    if(summary.length>MAX_CHARS_STRING)
    {
        if(meta.length>0)meta+=' / ';
        meta+=summary.length-MAX_CHARS_STRING+' characters not shown ';
        summary=summary.slice(0,MAX_CHARS_STRING)+' [...]';
    }
    var ret='"'+summary+'"';
    if(meta.length>0)ret+=warning(meta);

    return ret;
}



const oneLevel='&nbsp;&nbsp;&nbsp;&nbsp;';
const newLine='<br/>';

function title(str)
{
    return '<span class="title">'+str+'</span>'
}

function value(str)
{
    return '<span class="value">'+str+'</span>'
}

function summary(str)
{
    return '<span class="summary">'+str+'</span>'
}

function warning(str)
{
    return '<span class="warning">'+str+'</span>'
    
}


const STR='string';
const NUM='number';
const OBJ='object';
const MIXED='mixed';
const BOOL='boolean';


function parseChild(data,str,level)
{
    var indent='';
    var strAdd='';

    var rootIsArray=Array.isArray(data);
    var rootIsObject=(typeof data=='object');

    for(var j=0;j<level;j++)indent+=oneLevel;

    var count=0;
    var lastWasMultiLine=false;
    var type='';

    for(var i in data)
    {
        type=typeof data[i];

        if(lastWasMultiLine && !rootIsArray) strAdd+=newLine;
        lastWasMultiLine=false;

        if(!rootIsArray) strAdd+=indent+title(i)+':&nbsp;';

        if(type==NUM) strAdd+=value(data[i])+',';
            else if(type==STR) strAdd+=value(stringSummary(data[i]))+',';
            else if(type==BOOL) strAdd+=value(data[i])+',';

        var contents='';
        var isArray=Array.isArray(data[i]);


        if(isArray)
        {
            if(data[i].length==0)
            {
                strAdd+=value('[]')+','+newLine;
                continue;
            }
            contents=typeof data[i][0];
            for(var ai=0;ai<data[i].length;ai++)
            {
                if(typeof(data[i][ai])!=contents)
                {
                    contents=MIXED;
                    break;
                }
            }

            if( (contents==NUM || contents==BOOL || contents==STR) && data[i].length<=16)
            {
                var arrStr='';

                if(contents==STR) for(var di=0;di<data[i].length;di++) arrStr+='"'+data[i][di]+'",';
                    else for(var di=0;di<data[i].length;di++) arrStr+=data[i][di]+',';
                
                arrStr=arrStr.slice(0,-1);
                strAdd+='['+value(arrStr)+']';
            }
            else if( contents!=OBJ)
            {
                if(rootIsArray)strAdd+=indent;
                strAdd+=summary('[array of '+data[i].length+' '+contents+'s]')+',';
            }
        }

        if(type==OBJ && rootIsArray && count==0) strAdd+='';
            else strAdd+=newLine;

        if(type==OBJ && (contents=='' || contents==OBJ))
        {
            if(isArray)strAdd+=indent+'['+newLine;
                else strAdd+=indent+'{'+newLine;

            if(contents==OBJ && data[i].length>200)
            {
                var contentStr=contents+'s';
                if(contents==MIXED)contentStr='mixed content';
                strAdd+=oneLevel+indent+warning('['+data[i].length+' '+contents+'s NOT SHOWN]')+newLine;
            }
            else
            {
                strAdd+=parseChild(data[i],'',level+1);
            }
            if(isArray)strAdd+=indent+']';
                else strAdd+=''+indent+'}';

            strAdd+=',';
            lastWasMultiLine=true;
        }
        count++;
    }
    
    if(rootIsArray || rootIsObject)strAdd=strAdd.slice(0,-1)+''+newLine;

    str+=strAdd;

    return str+'';
}

function parse(data)
{
    console.log('loaded');
    var str='';

    str+=parseChild(data,str,0);



    var ele=document.createElement("div");
    document.body.appendChild(ele);
    document.body.classList.add('fasterJSON');

    ele.innerHTML=str;
    console.log("done!");
}



function start()
{
    try
    {
        var rawString=document.body.innerText;
        var data=JSON.parse(rawString);
        document.body.innerText='';

        console.log("IS JSON!");
        parse(data);

        var size=rawString.length;
        console.log('size',size,'characters');

        var element = document.createElement('a');
        element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(rawString));
        element.setAttribute('download', filename);
        element.innerText="download";
        element.innerHTML="download";

        document.body.appendChild(element);

        return true;
    }
    catch(e)
    {
        return false;
    }

}

document.addEventListener("DOMContentLoaded", start, false);










