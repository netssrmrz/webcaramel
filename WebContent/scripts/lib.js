
function Get_JSON(url) {
  var res;

  $.ajax({
    dataType: "json",
    url: url,
    success: function (data) { res = data; },
    async: false
  });
  return res;
}

function Get_Request_Parameter(name)
{
  return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.search) || [, ""])[1].replace(/\+/g, '%20')) || null
}

// Type Conversion =============================================================

function ToBool(obj)
{
  var
    res, z, hr, min, sec,
    typeName;

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
    res, typeName;

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
    res = null, z, hr, min, sec,
    typeName;

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
  var i, w, h, finished, all_finished, pat, pt;

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

// Table ====================================================================

function table_Init(tableId)
{
  var fn, tableElem, cols, c, pageSize;

  $("body").bind("click", { "tableId": tableId }, table_HideContextMenu);

  tableId = JqFixId(tableId);
  tableElem = $(tableId)[0];

  fn = window[$(tableId).attr("ongetids")];
  if (Not_Empty(fn))
    tableElem.table_GetIds = fn;

  fn = window[$(tableId).attr("onupdaterow")];
  if (Not_Empty(fn))
    tableElem.table_UpdateRow = fn;

  // determine column ids
  cols = $(tableId + " thead th[colid]");
  if (Not_Empty(cols))
  {
    tableElem.colIds = new Array();
    for (c = 0; c < cols.length; c++)
    {
      col = $(cols[c]);
      tableElem.colIds.push(col.attr("colid"));
    }
  }

  pageSize = $(tableId).attr("pagesize");
  if (Not_Empty(pageSize))
  {
    tableElem.pageSize = parseInt(pageSize);
    $("[inspagebuttons]")
      .append($("<button>").text("|<").bind("click", table_First_Click))
      .append($("<button>").text("<").bind("click", table_Prev_Click))
      .append($("<button>").text(">").bind("click", table_Next_Click))
      .append($("<button>").text(">|").bind("click", table_Last_Click));
  }
}

function BackupColor(i)
{
  var elem;

  elem = $(this);
  elem.attr("altColor", elem.css("background-color"));
}

function table_GetItems(tableId, filter)
{
  var
    tableId, tableElem;

  tableId = JqFixId(tableId);
  tableElem = $(tableId)[0];
  tableElem.ids = tableElem.table_GetIds(filter);

  if (Not_Empty(tableElem.pageSize))
  {
    table_ShowRows(tableId, 0, tableElem.pageSize);
  }
  else
  {
    table_ShowRows(tableId, 0, tableElem.ids.length);
  }
}

function table_Next_Click(event)
{
  var tableId, tableElem, fromRow, toRow;

  tableId = JqFixId($(event.currentTarget).parents("table").attr("id"));
  tableElem = $(tableId)[0];
  if (Not_Empty(tableElem.ids))
  {
    fromRow = tableElem.firstVisibleRow + tableElem.pageSize;
    if (fromRow < tableElem.ids.length)
    {
      toRow = fromRow + tableElem.pageSize;

      table_ShowRows(tableId, fromRow, toRow);
    }
  }
}

function table_Prev_Click(event)
{
  var tableId, tableElem, fromRow, toRow;

  tableId = JqFixId($(event.currentTarget).parents("table").attr("id"));
  tableElem = $(tableId)[0];
  if (Not_Empty(tableElem.ids))
  {
    fromRow = tableElem.firstVisibleRow - tableElem.pageSize;
    if (fromRow < 0)
      fromRow = 0;

    toRow = fromRow + tableElem.pageSize;

    table_ShowRows(tableId, fromRow, toRow);
  }
}

function table_First_Click(event)
{
  var fromRow, toRow, tableId, tableElem;

  tableId = JqFixId($(event.currentTarget).parents("table").attr("id"));
  tableElem = $(tableId)[0];
  if (Not_Empty(tableElem.ids))
  {
    fromRow = 0;
    toRow = tableElem.pageSize;
    if (toRow > tableElem.ids.length)
      toRow = tableElem.ids.length;
    table_ShowRows(tableId, fromRow, toRow);
  }
}

function table_Last_Click(event)
{
  var fromRow, toRow, tableId, tableElem;

  tableId = JqFixId($(event.currentTarget).parents("table").attr("id"));
  tableElem = $(tableId)[0];
  if (Not_Empty(tableElem.ids))
  {
    toRow = tableElem.ids.length;
    fromRow = toRow - tableElem.pageSize;
    if (fromRow < 0)
      fromRow = 0;
    table_ShowRows(tableId, fromRow, toRow);
  }
}

function table_ShowRows(tableId, fromRow, toRow)
{
  var
    tableElem, ids, c, row, col,
    d, id;

  tableId = JqFixId(tableId);
  tableElem = $(tableId)[0];
  $(tableId + " tbody").empty();

  ids = tableElem.ids;
  if (Not_Empty(ids))
  {
    if (toRow > ids.length)
      toRow = ids.length;
    tableElem.firstVisibleRow = fromRow;
    for (c = fromRow; c < toRow; c++)
    {
      row = $("<tr>")
        .attr("itemId", ids[c])
        .attr("rowNo", c)
        .each(BackupColor)
        .bind("selectstart", function () { return false; })
        .bind("click", table_Row_Click)
        .bind("contextmenu", table_Row_ContextMenu)
        .hover(table_Row_HoverIn, table_Row_HoverOut);

      col = $("<td>").html(c + 1);
      row.append(col);

      if (Not_Empty(tableElem.colIds))
      {
        for (d = 0; d < tableElem.colIds.length; d++)
        {
          col = $("<td>").attr("colid", tableElem.colIds[d]);
          row.append(col);
        }
      }

      tableElem.table_UpdateRow(row, ids[c]);

      $(tableId + " tbody").append(row);
    }

    $(tableId + " tbody tr:odd").addClass("trOdd");
    table_MarkSelectedRows(tableId);
    table_UpdatePagingInfo(tableId, fromRow, toRow);
  }
}

function table_UpdatePagingInfo(tableId, fromRow, toRow)
{
  var
    c, tableElem;

  tableId = JqFixId(tableId);
  tableElem = $(tableId)[0];

  c = fromRow / tableElem.pageSize;
  c = Math.ceil(c) + 1;
  $("[inscurrpage]").text(c);

  c = tableElem.ids.length / tableElem.pageSize;
  c = Math.ceil(c);
  $("[instotpages]").text(c);

  c = tableElem.ids.length;
  $("[instotrows]").text(c);

  c = fromRow + 1;
  $("[insfromrow]").text(c);

  c = toRow;
  $("[instorow]").text(c);
}

function table_MarkSelectedRows(tableId)
{
  var rows, c, row, tableElem;

  tableId = JqFixId(tableId);
  tableElem = $(tableId)[0];
  rows = $(tableId + " tbody tr");
  if (Not_Empty(tableElem.selectedIds) && Not_Empty(rows))
  {
    for (c = 0; c < rows.length; c++)
    {
      row = $(rows[c]);
      if ($.inArray(row.attr("itemId"), tableElem.selectedIds) != -1)
        row.addClass("trSelected");
    }
  }
}

function table_Row_Click(event)
{
  var
    elem, fromRowNo, toRowNo, c, tableId,
    lastSelected, t, rowSelected, tableElem, isSelected;

  elem = $(event.currentTarget);
  tableId = JqFixId($(elem).parents("table").attr("id"));
  tableElem = $(tableId)[0];

  if (event.shiftKey && Not_Empty(tableElem.lastSelectedRow))
  {
    fromRowNo = tableElem.lastSelectedRow;
    toRowNo = parseInt(elem.attr("rowNo"));
    if (fromRowNo > toRowNo)
    {
      t = fromRowNo;
      fromRowNo = toRowNo;
      toRowNo = t;
    }

    tableElem.selectedIds = new Array();
    for (c = fromRowNo; c <= toRowNo; c++)
    {
      tableElem.selectedIds.push(tableElem.ids[c].toString());
    }
    table_MarkSelectedRows(tableId);
  }
  else
  {
    isSelected = elem.hasClass("trSelected");

    // clear all selected items
    tableElem.selectedIds = null;
    tableElem.lastSelectedRow = null;
    $(tableId + " tbody tr")
      .removeClass("trSelected");

    if (!isSelected)
    {
      elem.addClass("trSelected");
      tableElem.lastSelectedRow = parseInt(elem.attr("rowNo"));
      tableElem.selectedIds = new Array();
      tableElem.selectedIds.push(elem.attr("itemId"));
    }
  }

  event.preventDefault();
}

function table_Row_HoverIn(event)
{
  var row;

  row = $(event.currentTarget);
  row.addClass("trHover");
}

function table_Row_HoverOut(event)
{
  var row;

  row = $(event.currentTarget);
  row.removeClass("trHover");
}

function table_Row_ContextMenu(event)
{
  var menu, id, menuId;

  id = $(event.currentTarget).attr("itemId");

  menuId = $(event.currentTarget).parents("table").attr("contextmenu");
  if (Not_Empty(menuId))
  {
    menu = $("#" + menuId);
    menu.attr("itemId", id);
    menu.css("top", event.pageY);
    menu.css("left", event.pageX);
    menu.show();
  }

  event.preventDefault();
}

function table_HideContextMenu(event)
{
  var menuId;

  if (Not_Empty(event.data.tableId))
  {
    menuId = $("#" + event.data.tableId).attr("contextMenu");
    if (Not_Empty(menuId))
      $("#" + menuId).hide();
  }
}

function CentreElem(elem)
{
  elem.css("top", Math.max(0, (($(window).height() - elem.outerHeight()) / 2) +
                                                $(window).scrollTop()) + "px");
  elem.css("left", Math.max(0, (($(window).width() - elem.outerWidth()) / 2) +
                                                $(window).scrollLeft()) + "px");
}

function ToggleElems(event)
{
  $("#" + $(this).attr("elem_a")).toggle();
  $("#" + $(this).attr("elem_b")).toggle();
  event.stopPropagation();
}

// Context Menu ==================================================================

function contextMenu_Init(id)
{
  var
    fn, contextElem, editButtons, c, addButtons,
    delButtons, searchButtons;

  id = JqFixId(id);
  contextElem = $(id)[0];
  if (contextElem != null)
  {
    editButtons = $(contextElem).find("[editdlgid]");
    if (Not_Empty(editButtons))
    {
      for (c = 0; c < editButtons.length; c++)
      {
        $(editButtons[c]).bind("click", contextMenu_Edit_Click);

        fn = window[$(editButtons[c]).attr("onedititem")];
        if (Not_Empty(fn))
          editButtons[c].context_EditItem = fn;
      }
    }

    addButtons = $(contextElem).find("[adddlgid]");
    if (Not_Empty(addButtons))
    {
      for (c = 0; c < addButtons.length; c++)
      {
        $(addButtons[c]).bind("click", contextMenu_Add_Click);
      }
    }

    delButtons = $(contextElem).find("[ondeleteitem]");
    if (Not_Empty(delButtons))
    {
      for (c = 0; c < delButtons.length; c++)
      {
        $(delButtons[c])
          .bind("click", contextMenu_Del_Click)
          .attr("parentdlgid", contextElem.id);

        fn = window[$(delButtons[c]).attr("ondeleteitem")];
        if (Not_Empty(fn))
          delButtons[c].context_DeleteItem = fn;
      }
    }

    searchButtons = $(contextElem).find("[searchdlgid]");
    if (Not_Empty(searchButtons))
    {
      for (c = 0; c < searchButtons.length; c++)
      {
        $(searchButtons[c]).bind("click", contextMenu_Search_Click);
      }
    }
  }
}

function contextMenu_Del_Click(event)
{
  var
    id, rows, c,
    menu, updateTableId;

  updateTableId = JqFixId($(event.currentTarget).attr("updatetableid"));
  if (Not_Empty(updateTableId) && confirm("Are you sure?"))
  {
    rows = $(updateTableId)[0].selectedIds;
    if (Not_Empty(rows))
    {
      for (c = 0; c < rows.length; c++)
      {
        id = rows[c];
        contextMenu_DeleteItem(id, event);
      }
    }
    else
    {
      id = $(event.currentTarget).parents("[itemId]").attr("itemId");
      contextMenu_DeleteItem(id, event);
    }
  }
}

function contextMenu_DeleteItem(objId, event)
{
  var
    updateTableId, row;

  if (objId != null)
  {
    if (event.currentTarget.context_DeleteItem != null &&
      event.currentTarget.context_DeleteItem(event, objId))
    {
      updateTableId = JqFixId($(event.currentTarget).attr("updatetableid"));
      if (Not_Empty(updateTableId))
      {
        row = $(updateTableId + " tbody tr[itemId=" + objId + "]");
        row.remove();
        // update row numbers
        // update paging info
        // update alt colors
        // refresh page
      }
    }
  }
}

function contextMenu_Edit_Click(event)
{
  var
    editDlgId, obj, editDlgElem, fields, c,
    objFieldVal, objFieldName, objId, fieldElem, contextElem,
    objFieldType, fieldElemVal;

  editDlgId = JqFixId($(event.currentTarget).attr("editdlgid"));
  editDlgElem = $(editDlgId)[0];
  if (editDlgElem != null)
  {
    if (event.currentTarget.context_EditItem != null)
    {
      //objId = $("#contextMenu").attr("itemId");
      objId = $(event.currentTarget).parents("[itemId]").attr("itemId");
      obj = event.currentTarget.context_EditItem(event, objId);
      if (obj != null)
      {
        fields = $(editDlgElem).find("[objfield]");
        for (c = 0; c < fields.length; c++)
        {
          fieldElem = fields[c];
          fieldElemVal = "";

          objFieldName = $(fieldElem).attr("objfield");
          objFieldType = $(fieldElem).attr("objfieldtype");
          objFieldVal = obj[objFieldName];

          if ($(fieldElem).attr("type") == "text")
          {
            if (Not_Empty(objFieldVal))
              fieldElemVal = ToString(objFieldVal);
          }
          else if (fieldElem.nodeName.toLowerCase() == "select")
          {
            if (Not_Empty(objFieldVal))
              fieldElemVal = ToString(objFieldVal);
          }
          $(fieldElem).val(fieldElemVal);
        }
      }
    }

    editDlgElem.objId = objId;
    CentreElem($(editDlgElem));
    $(editDlgElem).fadeIn("fast");
  }
}

function contextMenu_Add_Click(event)
{
  var
    dlgId, dlgElem, fields, c, fieldElem,
    fieldElemVal;

  dlgId = JqFixId($(event.currentTarget).attr("adddlgid"));
  dlgElem = $(dlgId)[0];
  if (dlgElem != null)
  {
    fields = $(dlgElem).find("[objfield]");
    for (c = 0; c < fields.length; c++)
    {
      fieldElem = fields[c];
      fieldElemVal = "";
      $(fieldElem).val(fieldElemVal);
    }

    dlgElem.objId = null;
    CentreElem($(dlgElem));
    $(dlgElem).fadeIn("fast");
  }
}

function contextMenu_Search_Click(event)
{
  var
    dlgId, dlgElem;

  dlgId = JqFixId($(event.currentTarget).attr("searchdlgid"));
  dlgElem = $(dlgId)[0];

  if (dlgElem != null)
  {
    CentreElem($(dlgElem));
    $(dlgElem).fadeIn("fast");
  }
}

// Edit Dlg =============================================================

function editDlg_Save_Click(event)
{
  var fieldVal, row, fn,
          obj, editDlgId, editDlgElem, fields, c,
          fieldElem, objFieldName, objFieldVal, tableId, row,
          objFieldType;

  editDlgId = JqFixId($(event.currentTarget).attr("parentdlgid"));
  editDlgElem = $(editDlgId)[0];
  if (editDlgElem != null)
  {
    obj = new Object();
    obj.id = editDlgElem.objId;

    fields = $(editDlgElem).find("[objfield]");
    for (c = 0; c < fields.length; c++)
    {
      fieldElem = fields[c];
      /*if ($(fieldElem).attr("type") == "text")
      {
        objFieldVal = $(fieldElem).val();
      }
      else if (fieldElem.nodeName.toLowerCase() == "select")
      {
        objFieldVal = $(fieldElem).val();
      }*/

      if (Not_Empty($(fieldElem).val()))
        objFieldVal = $(fieldElem).val();
      else
        objFieldVal = null;
      objFieldName = $(fieldElem).attr("objfield");
      objFieldType = $(fieldElem).attr("objfieldtype");
      if (Not_Empty(objFieldType))
      {
        if (objFieldType == "bool")
          objFieldVal = ToBool(objFieldVal);
      }
      obj[objFieldName] = objFieldVal;
    }

    fn = window[$(event.currentTarget).attr("onclicksave")];
    if (Not_Empty(fn))
      fn(obj);

    tableId = JqFixId($(event.currentTarget).attr("updatetableid"));
    if (Not_Empty(obj.id) && Not_Empty(tableId))
    {
      row = $(tableId + " tbody tr[itemId=" + obj.id + "]");

      fn = window[$(tableId).attr("onupdaterow")];
      if (Not_Empty(fn))
        fn(row, obj.id);
    }
    else
    {
      // update table
    }

    $(editDlgElem).fadeOut("fast");
  }
}

function editDlg_Cancel_Click(event)
{
  var dlgId;

  dlgId = JqFixId($(event.currentTarget).attr("parentdlgid"));
  $(dlgId).fadeOut("fast");
}

function editDlg_Init(id)
{
  var
          editDlgElem;

  id = JqFixId(id);
  editDlgElem = $(id)[0];
  if (editDlgElem != null)
  {
    $(editDlgElem).find("[onclickcancel]")
            .bind("click", editDlg_Cancel_Click)
            .attr("parentdlgid", editDlgElem.id);
    $(editDlgElem).find("[onclicksave]")
            .bind("click", editDlg_Save_Click)
            .attr("parentdlgid", editDlgElem.id);
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
    filterType, filterVal, filterLabel, filtersText, filterDesId,
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
}