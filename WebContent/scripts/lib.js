
function Get_JSON(url) 
{
  var res=null;

  $.ajax({
    dataType: "json",
    url: url,
    success: function (data) { res = data; },
    async: false,
    cache: false
  });
  return res;
}

function Get_Request_Parameter(name)
{
  return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.search) || [, ""])[1].replace(/\+/g, '%20')) || null;
}

// Type Conversion =============================================================

function ToBool(obj)
{
  var
    res, typeName;

  if (Not_Empty(obj))
  {
    res = true;
    typeName = typeof (obj);
    if (obj instanceof String || typeName == "string")
    {
      obj = obj.toLowerCase();
      if (obj == "no" || obj == "false" || obj == "0")
        res = false;
    }
  }
  else
    res = false;
  return res;
}

function ToDate(obj)
{
  var
    res=null, typeName;

  if (Not_Empty(obj))
  {
    typeName = typeof (obj);
    if (obj instanceof String || typeName == "string")
    {
      res = Date.parse(obj);
      if (isNaN(res))
        res = obj;
      else
      {
        res = new Date();
        res.setTime(Date.parse(obj));
      }
    }
    else
    {
      res = obj;
    }
  }
  return res;
}

function TimeToString(obj)
{
  var z, hr, min, sec, res = null;

  if (Not_Empty(obj))
  {
    if (obj.getHours() > 11)
    {
      z = "pm";
      if (obj.getHours() > 12)
        hr = obj.getHours() - 12;
      else
        hr = obj.getHours();
    }
    else
    {
      z = "am";
      if (obj.getHours() == 0)
        hr = 12;
      else
        hr = obj.getHours();
    }
    min = obj.getMinutes();
    if (min < 10)
      min = "0" + min;
    sec = obj.getSeconds();
    if (sec < 10)
      sec = "0" + sec;
    res = hr + ":" + min + ":" + sec + " " + z;
  }
  return res;
}

function ToString(obj, format)
{
  var
    res = null, typeName;

  if (Not_Empty(obj))
  {
    typeName = typeof (obj);
    if (obj instanceof Date)
    {
      if (format == "date")
        res = obj.toLocaleDateString();
      else if (format == "time")
        res = TimeToString(obj);
      else
        res = obj.toLocaleDateString() + " " + TimeToString(obj);
    }
    else if (obj instanceof String)
      res = res.valueOf();
    else if (typeName == "string")
      res = obj;
    else
    {
      res = new String(obj);
      res = res.valueOf();
    }
  }
  else
  {
    res = "n/a";
  }
  return res;
}

// Misc ==============================================================================

function SortHTML(a, b)
{
  var res;

  if (a.innerHTML > b.innerHTML)
    res = 1;
  else if (a.innerHTML < b.innerHTML)
    res = -1;
  else
    res = 0;

  return res;
}

function SortSelect(id)
{
  var options;

  id = JqFixId(id);
  options = $(id + " option");
  options = options.sort(SortHTML);
  options.appendTo(id);
}

function RemoveNewLines(str, repStr)
{
  var res = null, c;

  if (str != null && str.length > 0)
  {
    res = "";
    for (c = 0; c < str.length; c++)
    {
      if (str.charCodeAt(c) != 13)
      {
        if (str.charCodeAt(c) == 10)
        {
          if (repStr != null)
            res += repStr;
          else
            res += " ";
        }
        else
          res += str.charAt(c);
      }
    }
  }
  return res;
}

function Not_Empty(obj)
{
  var res = false;

  if (obj != null)
  {
    res = true;
    if (obj instanceof String && $.trim(obj).length == 0)
      res = false;
    else if (typeof (obj) == "string" && $.trim(obj).length == 0)
      res = false;
    else if (obj instanceof Array && obj.length == 0)
      res = false;
    else if (obj instanceof jQuery && obj.length == 0)
      res = false;
  }

  return res;
}

function AppendStr(orig_str, new_str, div, env)
{
  var res = orig_str;

  if (Not_Empty(new_str))
  {
    if (Not_Empty(env))
      new_str = env + new_str + env;

    if (Not_Empty(orig_str))
      res = orig_str + div + new_str;
    else
      res = new_str;
  }
  return res;
}

function GetUrlParameter(id)
{
  var
    params = [], paramData, paramName, paramVal, i,
    paramVals = [], res = null;

  params = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
  for (i = 0; i < params.length; i++)
  {
    paramData = params[i].split('=');
    paramName = paramData[0];
    paramVal = paramData[1];
    if (paramName == id)
    {
      paramVals.push(paramVal);
    }
  }
  if (Not_Empty(paramVals))
  {
    if (paramVals.length == 1)
      res = paramVals[0];
    else
      res = paramVals;
  }
  return res;
}

function JqFixId(id)
{
  if (Not_Empty(id) && id.charAt(0) != "#")
    id = "#" + id;
  return id;
}

function AddDays(date, days)
{
  var currDay;

  if (Not_Empty(date) && Not_Empty(days))
  {
    currDay = date.getDate();
    date.setDate(currDay + days);
  }
  return date;
}

function Elem_Exists(id)
{
  var res=false;
  
  if (document.getElementById(id)!=null)
    res=true;
  return res;
}

// Goo ==============================================================================

function Goo_Goto(goo, i)
{
  goo.curr_img = i;
  Goo_Init(goo);
  Goo_Draw(goo);
}

function Goo_Img_Load()
{
  this.anim.imgs[this.anim.curr_img].loaded = true;
  Goo_Init(this.anim);
}

function Goo_Init(anim)
{
  var pat, i, pt;

  if (anim.imgs[anim.curr_img].loaded)
  {
    // create goo bk
    pat = anim.ctx.createPattern(anim.imgs[anim.curr_img].img, "repeat");
    anim.ctx.fillStyle = pat;

    // create goo
    anim.pts = new Array();
    for (i = 0; i < 20; i++)
    {
      if (i == 0)
        pt = { x: 0, y: 0, c: 20, dy: Math.random() * 8 + 2 };
      else
        pt = { x: anim.canvas.width * (i + 1) / 20, y: 0, c: 20, dy: Math.random() * 10 + 2 };
      anim.pts.push(pt);
    }

    // prep anim caption
    $("#" + anim.caption_id).hide();
    $("#" + anim.caption_title_id).html(anim.imgs[anim.curr_img].caption_title);
    $("#" + anim.caption_content_id).html(anim.imgs[anim.curr_img].caption_content);
    $("#" + anim.caption_id).delay(800).fadeIn("slow");

    // notify external listener
    if (anim.on_goo_start != null)
      anim.on_goo_start(anim);
  }
}

function Goo_Draw(anim)
{
  var i, w, h, finished, all_finished;

  if (anim.ctx == null)
  {
    anim.canvas = document.getElementById(anim.canvas_id);
    anim.ctx = anim.canvas.getContext("2d");
    anim.ctx.shadowColor = "black";
    anim.ctx.shadowBlur = 5;
    anim.ctx.shadowOffsetX = 2;
    anim.ctx.shadowOffsetY = 2;
    anim.curr_img = 0;
  }

  if (anim.imgs[anim.curr_img].loaded)
  {
    w = anim.canvas.width;
    h = anim.canvas.height;
    all_finished = true;

    anim.ctx.beginPath();
    anim.ctx.moveTo(w, 0);
    anim.ctx.lineTo(0, 0);
    for (i = 0; i < anim.pts.length; i++)
    {
      if (i == 0)
        anim.ctx.lineTo(anim.pts[i].x, anim.pts[i].y);
      else
        anim.ctx.bezierCurveTo(anim.pts[i - 1].x + anim.pts[i - 1].c, anim.pts[i - 1].y, anim.pts[i].x - anim.pts[i].c, anim.pts[i].y, anim.pts[i].x, anim.pts[i].y);

      finished = false;
      anim.pts[i].y += anim.pts[i].dy;
      if (anim.pts[i].y > h + 50)
      {
        anim.pts[i].y = h + 50;
        finished = true;
      }
      all_finished = all_finished && finished;
    }
    anim.ctx.closePath();
    anim.ctx.fill();

    if (all_finished)
    {
      anim.curr_img++;
      if (anim.curr_img > anim.imgs.length - 1)
        anim.curr_img = 0;
      Goo_Init(anim);
      setTimeout(Goo_Draw, 1000, anim);
    }
    else
      setTimeout(Goo_Draw, 50, anim);
  }
  else
  {
    anim.imgs[anim.curr_img].img = new Image();
    anim.imgs[anim.curr_img].img.anim = anim;
    anim.imgs[anim.curr_img].img.onload = Goo_Img_Load;
    anim.imgs[anim.curr_img].img.src = anim.imgs[anim.curr_img].url;
    setTimeout(Goo_Draw, 100, anim);
  }
}

// Search Dlg ===================================================================

function searchDlg_Init(id)
{
  var
    searchDlgElem;

  id = JqFixId(id);
  searchDlgElem = $(id)[0];
  if (searchDlgElem != null)
  {
    $(searchDlgElem).find("[onclickcancel]")
            .bind("click", searchDlg_Cancel_Click)
            .attr("parentdlgid", searchDlgElem.id);
    $(searchDlgElem).find("[onclicksearch]")
            .bind("click", searchDlg_Search_Click)
            .attr("parentdlgid", searchDlgElem.id);
  }
}

function searchDlg_Cancel_Click(event)
{
  var dlgId;

  dlgId = JqFixId($(event.currentTarget).attr("parentdlgid"));
  $(dlgId).fadeOut("fast");
}

function searchDlg_Search_Click(event)
{
  var
    filters, dlgId, dlgElem, fields, c,
    filterType, filterVal, filterLabel, filtersText=null, filterDesId,
    updateTableId;

  dlgId = JqFixId($(event.currentTarget).attr("parentdlgid"));
  dlgElem = $(dlgId)[0];
  if (dlgElem != null)
  {
    fields = $(dlgElem).find("[filtertype]");
    if (Not_Empty(fields))
    {
      filters = new Array();
      for (c = 0; c < fields.length; c++)
      {
        filterType = $(fields[c]).attr("filtertype");
        filterVal = $(fields[c]).val();
        filterLabel = $(fields[c]).attr("filterlabel");
        if (Not_Empty(filterLabel))
          filterLabel = filterLabel + " \"" + filterVal + "\"";
        else
          filterLabel = filterType + " \"" + filterVal + "\"";
        if (Not_Empty(filterVal))
        {
          filters.push(filterType);
          filters.push(filterVal);
          filtersText = AppendStr(filtersText, filterLabel, " and ");
        }
      }

      filterDesId = JqFixId($(event.currentTarget).attr("filterdesid"));
      if (Not_Empty(filtersText) && Not_Empty(filterDesId))
        $(filterDesId).text("Showing items where " + filtersText + ".");
      else
        $(filterDesId).text("Showing all.");

      updateTableId = JqFixId($(event.currentTarget).attr("updatetableid"));
      if (Not_Empty(updateTableId))
        table_GetItems(updateTableId, filters);
    }
    $(dlgId).fadeOut("fast");
  }

  function searchDlg_GetFilters(dlgId)
  {
    var
      filters=null, dlgElem, fields, c,
      filterType, filterVal;

    //dlgId = JqFixId($(event.currentTarget).attr("parentdlgid"));
    dlgElem = $(dlgId)[0];
    if (dlgElem != null)
    {
      fields = $(dlgElem).find("[filtertype]");
      if (Not_Empty(fields))
      {
        filters = new Array();
        for (c = 0; c < fields.length; c++)
        {
          filterType = $(fields[c]).attr("filtertype");
          filterVal = $(fields[c]).val();
          if (Not_Empty(filterVal))
          {
            filters.push(filterType);
            filters.push(filterVal);
          }
        }
      }
    }
    return filters;
  }
}