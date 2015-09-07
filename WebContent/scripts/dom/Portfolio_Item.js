function Portfolio_Item()
{
}

Portfolio_Item.prototype.Get_Portfolio_Images = function(db, success_fn)
{
  var this_id;
  
  if (this.id!=null)
  {
    this_id=this.id;
    db.Select_Objs("Portfolio_Image", //Success1);
    function Success(table)
    {
      var items;

      items = Enumerable.From(table)
        .Where(function (x) { return parseInt(x.portfolio_item_id) == this_id; })
        .ToArray();
      if (Not_Empty(items) && success_fn!=null)
        success_fn(items);
    });
  }
};

Portfolio_Item.prototype.Get_Main_Image = function(db, success_fn)
{
  if (success_fn!=null)
  {
    this.Get_Portfolio_Images(db, //Success2);
    function Success(images)
    {
	  success_fn(images[0]);
    });
  }
};

Portfolio_Item.Get_Portfolio_By_Id = function (db, id, success_fn)
{
  if (id != null && success_fn!=null)
  {
    db.Select_Obj_By_Id("Portfolio_Item", id, //Success3);
    function Success(obj)
    {
      new_obj=new Portfolio_Item();
      new_obj.id=obj.id;
      new_obj.title=obj.title;
      new_obj.description=obj.description;
      new_obj.recent_order=obj.recent_order;
      new_obj.website_url=obj.website_url;
      success_fn(new_obj);
    });
  }
};

Portfolio_Item.Get_Portfolio_Items = function (db, success_fn)
{
  db.Select_Objs("Portfolio_Item", success_fn);
};

Portfolio_Item.Get_Portfolio_Items_and_Main_Images = function (db, success_fn)
{
  Portfolio_Item.Get_Portfolio_Items(db, //Success);
  function Success(portfolios)
  {
    Portfolio_Image.Get_Portfolio_Images(db, //Success);
    function Success(images)
    {
      var c, item, items, portfolio_images;
      
      items=new Array();
      for (c=0; c<portfolios.length; c++)
      {
    	portfolio_images=Enumerable
    	  .From(images)
    	  .Where(function(image){return parseInt(image.portfolio_item_id)==parseInt(portfolios[c].id);})
    	  .ToArray();
    	
    	item={"portfolio_item": portfolios[c], "main_image": portfolio_images[0]};
    	items.push(item);
      }
      success_fn(items);
    });
  });
};

Portfolio_Item.Get_Ids = function(db, success_fn)
{
  db.Select_Ids("Portfolio_Item", success_fn);
};
