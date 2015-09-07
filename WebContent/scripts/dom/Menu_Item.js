function Menu_Item()
{
}

/*Portfolio_Item.Get_Menu_Item_By_Id = function (db, id, success_fn)
{
  if (id != null && success_fn!=null)
  {
    db.Select_Obj_By_Id("Portfolio_Item", id, Select_Obj_By_Id_Success);
    function Select_Obj_By_Id_Success(obj)
    {
      new_obj=new Portfolio_Item();
      new_obj.id=obj.id;
      new_obj.title=obj.title;
      new_obj.description=obj.description;
      new_obj.recent_order=obj.recent_order;
      new_obj.website_url=obj.website_url;
      success_fn(new_obj);
    }
  }
};*/

Menu_Item.Get_Menu_Items = function (db, success_fn)
{
  db.Select_Objs("Menu_Item", success_fn);
};

/*Menu_Item.Build_JSON_File = function(db, success_fn)
{
  var str;
  
  db.Select_Objs("Menu_Item", Success);
  function Success(objs)
  {
	str=JSON.stringify(objs);
	success_fn(str);
  }
};*/