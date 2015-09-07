
function Context_Menu(id)
{
  this.Show_Edit_Dlg = function(event)
  {
    var fn_name, fn, obj_id;

    fn_name = $(event.currentTarget).attr("onedititem");
    fn = window[fn_name];
    obj_id = $(event.currentTarget).parents("[itemId]").attr("itemId");
    if (fn!=null)
      fn(obj_id);
  };

  this.Show_Add_Dlg = function(event)
  {
    var dlgId, dlgElem;

    dlgId = JqFixId($(event.currentTarget).attr("adddlgid"));
    dlgElem = $(dlgId)[0];
    if (dlgElem != null)
    {
      dlgElem.add_dialog.Show();
    }
  };

  this.Del_Click = function(event)
  {
    var fn_name, fn, obj_id;

    if (confirm("Are you sure?"))
    {
      fn_name = $(event.currentTarget).attr("ondeleteitem");
      fn = window[fn_name];
      obj_id = $(event.currentTarget).parents("[itemId]").attr("itemId");
      if (fn!=null)
        fn(obj_id);
    }
  };

  this.id = JqFixId(id);
  this.elem = $(this.id)[0];
  
  if (this.elem != null)
  {
    $(this.elem).find("[onedititem]").bind("click", this.Show_Edit_Dlg);
    $(this.elem).find("[adddlgid]").bind("click", this.Show_Add_Dlg);
    $(this.elem).find("[ondeleteitem]").bind("click", this.Del_Click);

    /*searchButtons = $(contextElem).find("[searchdlgid]");
    if (Not_Empty(searchButtons))
    {
      for (c = 0; c < searchButtons.length; c++)
      {
        $(searchButtons[c]).bind("click", contextMenu_Search_Click);
      }
    }*/
  }
}

/*function contextMenu_Del_Click(event)
{
  var
    id, rows, c,
    updateTableId;

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
}*/

/*function contextMenu_DeleteItem(objId, event)
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
}*/

/*function contextMenu_Edit_Click(event)
{
  var
    editDlgId, obj, editDlgElem, fields, c,
    objFieldVal, objFieldName, objId=null, fieldElem,
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
}*/

/*function contextMenu_Add_Click(event)
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
}*/

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

