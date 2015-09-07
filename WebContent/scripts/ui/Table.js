// Table ====================================================================

function Table(table_id)
{
  this.Hide_Context_Menu = function(event)
  {
    if (Not_Empty(event.data.table.context_menu_id))
      $(event.data.table.context_menu_id).hide();
  };

  this.Set_Items = function(ids)
  {
    this.ids = ids;

    if (Not_Empty(this.page_size))
    {
      this.Show_Rows(0, this.page_size);
    }
    else
    {
      this.Show_Rows(0, this.ids.length);
    }
  };

  this.Row_Context_Menu = function(event)
  {
    var id;

    id = $(event.currentTarget).attr("itemId");

    if (Not_Empty(event.data.table.context_menu_id))
    {
      $(event.data.table.context_menu_id)
        .attr("itemId", id)
        .css("top", event.pageY)
        .css("left", event.pageX)
        .show();
    }

    //event.preventDefault();
    return false;
  };

  this.Show_Rows = function(fromRow, toRow)
  {
    var
      tableElem, c, row, col,
      d;

    $(this.id + " tbody").empty();

    if (Not_Empty(this.ids))
    {
      if (toRow > this.ids.length)
        toRow = this.ids.length;
      //tableElem.firstVisibleRow = fromRow;
      for (c = fromRow; c < toRow; c++)
      {
        row = $("<tr>")
          .attr("itemId", this.ids[c])
          //.attr("rowNo", c)
          //.each(BackupColor)
          //.bind("selectstart", function () { return false; })
          //.bind("click", table_Row_Click)
          //.hover(table_Row_HoverIn, table_Row_HoverOut);
          ;
        row.attr("altColor", row.css("background-color"));
        if (Not_Empty(this.context_menu_id))
          //row.bind("contextmenu", { "table": this }, this.Row_Context_Menu);
          row.bind("click", { "table": this }, this.Row_Context_Menu);

        col = $("<td>").html(c + 1);
        row.append(col);

        if (Not_Empty(this.col_ids))
        {
          for (d = 0; d < this.col_ids.length; d++)
          {
            col = $("<td>").attr("colid", this.col_ids[d]);
            row.append(col);
          }
        }

        this.on_update_row_fn(row, this.ids[c]);

        $(this.id + " tbody").append(row);
      }

      $(this.id + " tbody tr:odd").addClass("trOdd");
      //table_MarkSelectedRows(tableId);
      //table_UpdatePagingInfo(tableId, fromRow, toRow);
    }
  };

  this.Get_Row = function(obj_id)
  {
    return $(this.id + " tbody tr[itemId=" + obj_id + "]");
  };
  
  this.Delete_Row = function(obj_id)
  {
    var row;
    
    row = $(this.id + " tbody tr[itemId=" + obj_id + "]");
    if (row!=null)
      row.remove();
  };
  
  var fn, tableElem, cols, col, c;

  this.id = JqFixId(table_id);
  this.elem = $(this.id)[0];
  this.page_size=null;
  this.on_update_row_fn = window[$(this.id).attr("onupdaterow")];
  this.context_menu_id = JqFixId($(this.id).attr("contextmenu"));

  $("body").bind("click", { "table": this }, this.Hide_Context_Menu);

  // determine column ids
  cols = $(this.id + " thead th[colid]");
  if (Not_Empty(cols))
  {
    this.col_ids = new Array();
    for (c = 0; c < cols.length; c++)
    {
      col = $(cols[c]);
      this.col_ids.push(col.attr("colid"));
    }
  }

  /*pageSize = $(tableId).attr("pagesize");
  if (Not_Empty(pageSize))
  {
    tableElem.pageSize = parseInt(pageSize);
    $("[inspagebuttons]")
      .append($("<button>").text("|<").bind("click", table_First_Click))
      .append($("<button>").text("<").bind("click", table_Prev_Click))
      .append($("<button>").text(">").bind("click", table_Next_Click))
      .append($("<button>").text(">|").bind("click", table_Last_Click));
  }*/
}

/*function BackupColor(i)
{
  var elem;

  elem = $(this);
  elem.attr("altColor", elem.css("background-color"));
}*/

function table_GetItems(tableId, filter)
{
  var
    tableElem;

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

/*function table_SetItems(tableId, ids)
{
  var
    tableElem;

  tableId = JqFixId(tableId);
  tableElem = $(tableId)[0];
  tableElem.ids = ids;

  if (Not_Empty(tableElem.pageSize))
  {
    table_ShowRows(tableId, 0, tableElem.pageSize);
  }
  else
  {
    table_ShowRows(tableId, 0, tableElem.ids.length);
  }
}*/

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

/*function table_ShowRows(tableId, fromRow, toRow)
{
  var
    tableElem, ids, c, row, col,
    d;

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
}*/

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
    t, tableElem, isSelected;

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

/*function table_Row_ContextMenu(event)
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
}*/

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

