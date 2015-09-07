function Db_Local(name, version, on_success_fn, on_upgrade_fn)
{
  this.Delete = function(table_name, obj_id, success_fn)
  {
    var tran, table, req;

    tran=this.conn.transaction([table_name], "readwrite");
    tran.oncomplete=success_fn;
    tran.onerror=function(){alert("tran error");};
    table=tran.objectStore(table_name);

    if (obj_id!=null)
   	{
      table.delete(obj_id);
   	}
  };
  
  this.Select_Objs=function(table_name, success_fn, success_fn_data)
  {
	var tran, table, req, objs;
	
    if (success_fn!=null)
    {
      objs=new Array();
      tran=this.conn.transaction(table_name);
      table=tran.objectStore(table_name);
      req=table.openCursor();
      req.onsuccess=function ()
      {
    	var cursor, obj;
    	
    	cursor=this.result;
    	if (cursor)
        {
    	  obj=cursor.value;
    	  obj.id=cursor.key;
          objs.push(obj);
          cursor.continue();
        }
    	else if (objs.length>0)
          success_fn(objs, success_fn_data);
      };
    }
  };
  
  this.Select_Ids=function(table_name, success_fn)
  {
	var tran, table, req, objs;
	
    if (success_fn!=null)
    {
      objs=new Array();
      tran=this.conn.transaction(table_name);
      table=tran.objectStore(table_name);
      req=table.openCursor();
      req.onsuccess=function ()
      {
    	var cursor;
    	
    	cursor=this.result;
    	if (cursor)
        {
          objs.push(cursor.key);
          cursor.continue();
        }
    	else if (objs.length>0)
          success_fn(objs);
      };
    }
  };
  
  this.Select_Obj_By_Id=function(table_name, id, success_fn, success_fn_data)
  {
	var tran, table, req;
	
    if (success_fn!=null)
    {
      objs=new Array();
      tran=this.conn.transaction(table_name);
      table=tran.objectStore(table_name);
      req=table.get(id);
      req.onsuccess=function ()
      {
    	var obj;
    	
    	obj=req.result;
    	if (obj!=null)
    	{
    	  obj.id=id;
          success_fn(obj, success_fn_data);
    	}
      };
    }
  };


  this.Db_Upgrade_Needed = function()
  {
    this.db.conn=this.result;
    if (this.db.on_upgrade_fn!=null)
      this.db.on_upgrade_fn(db);
  };
    
  this.Db_Success = function(event)
  {
	this.db.conn=this.result;
    if (this.db.on_success_fn!=null)
      this.db.on_success_fn(this.db);
  };
    
  this.Db_Error = function(event)
  {
	this.db.conn=null;
  };

  var req;

  this.on_success_fn=on_success_fn;
  this.on_upgrade_fn=on_upgrade_fn;
    
  req=window.indexedDB.open(name, version);
  req.db=this;
  req.onsuccess=this.Db_Success;
  req.onerror=this.Db_Error;
  req.onupgradeneeded=this.Db_Upgrade_Needed;
}

Db_Local.prototype.Clear_Tables = function(table_names, success_fn)
{
  var tran, table, c;
  
  tran=this.conn.transaction(table_names, "readwrite");
  tran.oncomplete = success_fn;
  for (c=0; c<table_names.length; c++)
  {
    table=tran.objectStore(table_names[c]);
    table.clear();
  }
};

Db_Local.prototype.Req_Error = function(event)
{
  alert("error");
};

Db_Local.prototype.Save = function(table_name, obj, success_fn)
{
  var tran, table, req, obj_id;

  tran=this.conn.transaction([table_name], "readwrite");
  tran.oncomplete = function()
  {
	if (success_fn!=null)
	  success_fn(obj);
  };
  table=tran.objectStore(table_name);

  obj_id=obj.id;
  if (obj_id!=null)
  {
	obj_id=parseInt(obj_id);
    req=table.put(obj, obj_id);
  }
  else
    req=table.add(obj);
  
  req.onsuccess = function(event)
  {
	obj_id=parseInt(this.result);
    obj.id=obj_id;
  };
};

Db_Local.prototype.Save_Objs = function(table_name, objs, success_fn)
{
  var tran, table, req, c, obj, obj_id;

  tran=this.conn.transaction([table_name], "readwrite");
  tran.oncomplete = function()
  {
	if (success_fn!=null)
	  success_fn(objs);
  };
  table=tran.objectStore(table_name);

  for (c=0; c<objs.length; c++)
  {
	obj=objs[c];
	obj_id=obj.id;
    if (obj_id!=null)
    {
      obj_id=parseInt(obj_id);
      req=table.put(obj, obj_id);
    }
    else
      req=table.add(obj);
    req.obj=obj;
    req.onsuccess = function(event)
    {
      obj_id=parseInt(this.result);
      this.obj.id=obj_id;
    };
  }
};

