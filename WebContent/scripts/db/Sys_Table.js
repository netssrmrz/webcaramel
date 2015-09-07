function Sys_Table()
{
}

Sys_Table.Inc_Version = function(db, table_name, success_fn)
{
  var sys_table, i, res=null;
  
  sys_table=db.Select_Objs("Sys_Table");
  if (Not_Empty(sys_table))
  {
	for (i=0; i<sys_table.length; i++)
	{
	  if (sys_table[i].name==table_name)
	  {
		if (sys_table[i].version==null)
		  sys_table[i].version=0;
		sys_table[i].version++;
	  }
	}
	res=sys_table;
  }
  return res;
};

Sys_Table.Get_Tables = function (db)
{
  return db.Select_Objs("Sys_Table");
};

Sys_Table.Get_Table_Names = function (db)
{
  var all_tables, table_names;
  
  all_tables=Sys_Table.Get_Tables(db);
  table_names = Enumerable
    .From(all_tables)
    .Select(function (table) { return table.name; })
    .ToArray();
  if (Not_Empty(table_names))
    res=table_names;
  return res;
};
