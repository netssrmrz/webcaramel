
function Add_Dialog(id)
{
  this.Save_Click = function(event)
  {
    var
      fn, obj, fields, c, add_dlg,
      fieldElem, objFieldName, objFieldVal,
      objFieldType;

    add_dlg=event.data.add_dialog;
    if (add_dlg != null)
    {
      obj = new Object();
      obj.id = null;

      // build object
      fields = $(add_dlg.elem).find("[objfield]");
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

      $(add_dlg.elem).fadeOut("fast");
    }
  };

  this.Cancel_Click = function(event)
  {
    $(event.data.add_dialog.elem).fadeOut("fast");
  };
	
  this.Show = function()
  {
    var c, fields, fieldElem, fieldElemVal, objFieldName, objFieldType, objFieldVal;
    
    fields = $(this.elem).find("[objfield]");
    for (c = 0; c < fields.length; c++)
    {
      fieldElem = fields[c];
      fieldElemVal = "";

      objFieldName = $(fieldElem).attr("objfield");
      objFieldType = $(fieldElem).attr("objfieldtype");
      objFieldVal = null;

      if ($(fieldElem).attr("type") == "text")
      {
        fieldElemVal = "";
      }
      else if (fieldElem.nodeName.toLowerCase() == "select")
      {
        fieldElemVal = "";
      }
      $(fieldElem).val(fieldElemVal);
    }

    this.obj_id = null;
    CentreElem($(this.elem));
    $(this.elem).fadeIn("fast");
  };
  
  this.id = JqFixId(id);
  this.elem = $(this.id)[0];
  if (this.elem != null)
  {
	this.elem.add_dialog=this;
    $(this.elem)
      .find("[onclickcancel]")
      .bind("click", { "add_dialog": this }, this.Cancel_Click);
    $(this.elem)
      .find("[onclicksave]")
      .bind("click", { "add_dialog": this }, this.Save_Click);
  }
}

