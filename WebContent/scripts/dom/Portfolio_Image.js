function Portfolio_Image()
{
}

Portfolio_Image.Get_Portfolio_Image_By_Id = function (db, id, success_fn)
{
  if (id != null && success_fn!=null)
  {
    db.Select_Obj_By_Id("Portfolio_Image", id, //Select_Obj_By_Id_Success);
    function Select_Obj_By_Id_Success(obj)
    {
      new_obj=new Portfolio_Image();
      new_obj.id=obj.id;
      new_obj.portfolio_item_id=obj.portfolio_item_id;
      new_obj.thumbnail_url=obj.thumbnail_url;
      new_obj.image_url=obj.image_url;
      success_fn(new_obj);
    });
  }
};


Portfolio_Image.Get_Portfolio_Images = function (db, success_fn)
{
  db.Select_Objs("Portfolio_Image", success_fn);
};
