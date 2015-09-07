function Db_JSON(name)
{
  /*this.Save=function(obj)
  {
    var table_name, tran, table, req;

    table_name=obj.constructor.name;
    tran=this.conn.transaction([table_name], "readwrite");
    tran.oncomplete=function(){alert("tran complete");};
    tran.onerror=function(){alert("tran error");};
    table=tran.objectStore(table_name);

    if (obj.id!=null)
      req=table.put(obj);
    else
    {
      req=table.add(obj);
      req.onsuccess=function(event){obj.id=this.result;};
      req.onerror=function(event){alert("req error");};
    }
  };*/
  
  this.Select_Objs=function(table_name)
  {
	return Get_JSON("db/"+table_name+".json");
  };
  
  this.Select_Ids=function(table_name)
  {
    var res = null, table, items;
		
	table = Get_JSON("db/"+table_name+".json");
    items = Enumerable
      .From(table)
      .Select(function (x) { return x.id; })
      .ToArray();
	if (Not_Empty(items))
	  res = items;
	return res;
  };
  
  this.Select_Obj_By_Id=function(table_name, id)
  {
    var res = null, table, items;

    if (id != null)
    {
      table = Get_JSON("db/"+table_name+".json");
      items = Enumerable
        .From(table)
        .Where(function (x) { return x.id == id; })
        .ToArray();
      if (Not_Empty(items))
        res = items[0];
    }
    return res;
  };
  
  this.name=name;
}
