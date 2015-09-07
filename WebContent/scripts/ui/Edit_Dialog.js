
function Edit_Dialog(id)
{
  this.Save_Click = function(event)
  {
    var
      fn, obj, fields, c, edit_dlg,
      fieldElem, objFieldName, objFieldVal,
      objFieldType;

    edit_dlg=event.data.edit_dialog;
    if (edit_dlg != null)
    {
      obj = new Object();
      obj.id = edit_dlg.obj_id;

      // build object
      fields = $(edit_dlg.elem).find("[objfield]");
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

      // pass obj to be saved
      fn = window[$(event.currentTarget).attr("onclicksave")];
      if (Not_Empty(fn))
        fn(obj);

      $(edit_dlg.elem).fadeOut("fast");
    }
  };

  this.Cancel_Click = function(event)
  {
    $(event.data.edit_dialog.elem).fadeOut("fast");
  };
	
  this.Show = function(obj)
  {
    var c, fields, fieldElem, fieldElemVal, objFieldName, objFieldType, objFieldVal;
    
    if (obj != null)
    {
      fields = $(this.elem).find("[objfield]");
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

      this.obj_id = obj.id;
      CentreElem($(this.elem));
      $(this.elem).fadeIn("fast");
    }
  };
  
  this.id = JqFixId(id);
  this.elem = $(this.id)[0];
  if (this.elem != null)
  {
    $(this.elem)
      .find("[onclickcancel]")
      .bind("click", { "edit_dialog": this }, this.Cancel_Click);
    $(this.elem)
      .find("[onclicksave]")
      .bind("click", { "edit_dialog": this }, this.Save_Click);
  }
}

