function Db_Cache(name, version, on_success_fn, on_upgrade_fn, cache_on)
{
  this.on_success_fn = on_success_fn;
  this.on_upgrade_fn = on_upgrade_fn;
  this.copy_tables = false;
  this.dir="db";
  this.host=null;
  this.user_name=null;
  this.password=null;
  
  if (cache_on)
  {
    this.db_local=new Db_Local(name, version, this.Db_Success, this.Db_Upgrade_Needed);
    this.db_local.db_cache=this;
  }
  else
    this.db_local=null;
  
  this.db_json=new Db_JSON(name);
  if (!cache_on && this.on_success_fn!=null)
  {
    this.on_success_fn(this);
  }
}

Db_Cache.prototype.Save=function(table_name, obj, success_fn)
{
  this.db_local.Save(table_name, obj, success_fn);
};

Db_Cache.prototype.Delete = function(table_name, obj_id, success_fn)
{
  this.db_local.Delete(table_name, obj_id, success_fn);
};

Db_Cache.prototype.Select_Objs=function(table_name, success_fn, success_fn_data)
{
  var objs;
  
  if (this.db_local!=null)
    this.db_local.Select_Objs(table_name, success_fn, success_fn_data);
  else
  {
    objs=this.db_json.Select_Objs(table_name);
    success_fn(objs, success_fn_data);
  }
};

Db_Cache.prototype.Select_Ids=function(table_name, success_fn)
{
  var ids;
	  
  if (this.db_local!=null)
    this.db_local.Select_Ids(table_name, success_fn);
  else
  {
	ids=this.db_json.Select_Ids(table_name);
    success_fn(ids);
  }
};

Db_Cache.prototype.Select_Obj_By_Id=function(table_name, id, success_fn, success_fn_data)
{
  var obj;
	  
  if (this.db_local!=null)
	this.db_local.Select_Obj_By_Id(table_name, id, success_fn, success_fn_data);
  else
  {
    obj=this.db_json.Select_Obj_By_Id(table_name, id);
    success_fn(obj, success_fn_data);
  }
};

Db_Cache.prototype.Clear_Table_Changes = function(table_names, success_fn)
{
  this.db_local.Clear_Tables(table_names, //Success);
  function Success()
  {
    db.Clear_Local_Versions(table_names);
    if (success_fn!=null)
      success_fn();
  });
};
	
Db_Cache.prototype.Clear_Changes = function(success_fn)
{
  var all_tables;
  
  all_tables = Sys_Table.Get_Table_Names(this.db_json);
  this.Clear_Table_Changes(all_tables, success_fn);
};

Db_Cache.prototype.Publish_Table = function(table_name, success_fn)
{
  var this_db=this;
  
  this.Upload_Table(table_name, //Success);
  function Success(ftp_res)
  {
	var sys_table;
	
	if (ftp_res=="OK")
	{
	  ftp_res=null;
      sys_table=Sys_Table.Inc_Version(this_db.db_json, table_name);
      ftp_res=this_db.Upload_Objs("Sys_Table", sys_table);
	}
    success_fn(ftp_res);
  });
};

Db_Cache.prototype.Upload_Table = function(table_name, success_fn)
{
  var this_db;
  
  this_db=this;
  this.Select_Objs(table_name, //Success);
  function Success(objs)
  {
	var ftp_res;
	
	ftp_res=this_db.Upload_Objs(table_name, objs);
    success_fn(ftp_res);
  });
};

Db_Cache.prototype.Upload_Objs = function(table_name, objs)
{
  var json_str, ftp_res=null, file_name, ftp;
	
  ftp=document.getElementById("ftp_buddy");
  if (ftp!=null)
  {
    file_name=this.dir+"/"+table_name+".json";
    json_str=JSON.stringify(objs);
    ftp.host=this.host;
    ftp.user_name=this.user_name;
    ftp.password=this.password;
    ftp_res=ftp.Test2(json_str, file_name);
  }
  return ftp_res;
};

Db_Cache.prototype.Calc_New_Tables = function()
{
  var res=null, all_tables, new_tables;
  
  all_tables=Sys_Table.Get_Tables(this.db_json);
  if (this.copy_tables)
    new_tables = Enumerable
	  .From(all_tables)
      .Select(function (table) { return table.name; })
      .ToArray();
  else
    new_tables = Enumerable
      .From(all_tables)
      .Where(Expression)
      .Select(function (table) { return table.name; })
      .ToArray();
  function Expression(table)
  {
    var local_version;
    
    local_version=localStorage["Sys_Table."+table.name+".version"];
    if (local_version==null)
      local_version=0;
    else
      local_version=parseInt(local_version);
      
    return table.version>local_version;
  }
  if (Not_Empty(new_tables))
    res=new_tables;
  return res;
};

Db_Cache.prototype.Update_Local_Versions = function(table_names)
{
  var c, all_tables, new_tables;
  
  all_tables=Sys_Table.Get_Tables(this.db_json);
  new_tables=Enumerable
    .From(all_tables)
    .Where(function(table){return table_names.indexOf(table.name)!=-1;})
    .ToArray();
  if (Not_Empty(new_tables))
  {
	for (c=0; c<new_tables.length; c++)
	{
	  localStorage["Sys_Table."+new_tables[c].name+".version"]=new_tables[c].version;
	}
  }
};

Db_Cache.prototype.Clear_Local_Versions = function(table_names)
{
  var c, all_tables, new_tables;
  
  all_tables=Sys_Table.Get_Tables(this.db_json);
  new_tables=Enumerable
    .From(all_tables)
    .Where(function(table){return table_names.indexOf(table.name)!=-1;})
    .ToArray();
  if (Not_Empty(new_tables))
  {
	for (c=0; c<new_tables.length; c++)
	{
	  localStorage["Sys_Table."+new_tables[c].name+".version"]=0;
	}
  }
};

Db_Cache.prototype.Db_Upgrade_Needed = function()
{
  var db, tables, c, table; 
  
  db = this.db_cache;
  tables=db.db_json.Select_Objs("Sys_Table");
  if (Not_Empty(tables))
  {
    for (c=0; c<tables.length; c++)
    {
      table=tables[c];
    
      if (this.conn.objectStoreNames.contains(table.name)>0)
        this.conn.deleteObjectStore(table.name);
      this.conn.createObjectStore(table.name, {autoIncrement: true});
    }
    db.copy_tables=true;
  }
};

Db_Cache.prototype.Db_Success = function()
{
  var db, new_tables; 

  db = this.db_cache;
  new_tables = db.Calc_New_Tables();
  if (Not_Empty(new_tables))
  {
    db.db_local.Clear_Tables(new_tables, //Success);
    function Success()
    {
  	db.Copy_Tables(new_tables, //Success);
  	function Success()
  	{
  	  db.Update_Local_Versions(new_tables);
  	  if (Not_Empty(db.on_success_fn))
  	    db.on_success_fn(db);
  	});
    });
    db.copy_tables=false;
  }
  else if (Not_Empty(db.on_success_fn))
    db.on_success_fn(db);
};

Db_Cache.prototype.Copy_Tables = function(table_names, success_fn)
{
  var table_objs, c, count=0;
  
  for (c=0; c<table_names.length; c++)
  {
    table_objs = this.db_json.Select_Objs(table_names[c]);
    this.db_local.Save_Objs(table_names[c], table_objs, //Success);
    function Success()
    {
      count++;
      if (count==table_names.length && success_fn!=null)
        success_fn();
    });
  }
};


