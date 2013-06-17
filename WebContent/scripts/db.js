
// Portfolio functions =================================================================================

function Get_Portolio_Images(id)
{
  var res = null, table, items;

  if (id != null)
  {
    table = Get_JSON("db/portfolio_image.json");
    items = Enumerable.From(table)
      .Where(function (x) { return x.portfolio_item_id == id; })
      .ToArray();
    if (Not_Empty(items))
      res = items;
  }
  return res;
}

function Get_Portfolio_Image_By_Id(id)
{
  var res = null, table, items;

  if (id != null)
  {
    table = Get_JSON("db/portfolio_image.json");
    items = Enumerable
      .From(table)
      .Where(function (x) { return x.id == id; })
      .ToArray();
    if (Not_Empty(items))
      res = items[0];
  }
  return res;
}

function Get_Portfolio_By_Id(id)
{
  var res = null, table, items;

  if (id != null)
  {
    table = Get_JSON("db/portfolio_item.json");
    items = Enumerable.From(table)
      .Where(function (x) { return x.id == id; })
      .ToArray();
    if (Not_Empty(items))
      res = items[0];
  }
  return res;
}

// =========================================================================

function Get_Table(url)
{
  //if table not in local storage
	//get remote table
	//save to local storage
  //return local table
}

function Select_Menu_Item_Ids()
{
  var res = null, table, items;

  table = Get_JSON("db/menu_item.json");
  items = Enumerable.From(table)
    .Select(function(x){return x.id;})
    .ToArray();
  if (Not_Empty(items))
    res = items;
  return res;
}

function Select_Menu_Item_By_Id(id)
{
  var res = null, table, items;

  if (id != null)
  {
    table = Get_JSON("db/menu_item.json");
    items = Enumerable.From(table)
      .Where(function (x) { return x.id == id; })
      .ToArray();
    if (Not_Empty(items))
      res = items[0];
  }
  return res;
}

function Save_Menu_Item(obj)
{
}

