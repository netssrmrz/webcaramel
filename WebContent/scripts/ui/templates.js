
function Draw_Menu(db, id)
{
  if (Elem_Exists(id))
  {
	Menu_Item.Get_Menu_Items(db, //Get_Menu_Items_Success);
    function Get_Menu_Items_Success(menu_items)
    {
      var c, items="", html;
    
      if (menu_items != null)
      {
        for (c = 0; c < menu_items.length; c++)
        {
          items +=
            "<li>" +
            "<a href=\"" + menu_items[c].url + "\">" +
            "<span class=\"menu_title\">" + menu_items[c].title + "</span>";
          if (Not_Empty(menu_items[c].caption))
            items += "<br /><span class=\"menu_details\">" + menu_items[c].caption + "</span>";
          items +=
            "</a>" +
            "</li>";
        }
        html = "<ul>" + items + "</ul>";
        $("#"+id).html(html);
      }
    });
  }
}

function Draw_Footer(db, id)
{
  if (Elem_Exists(id))
  {
	Menu_Item.Get_Menu_Items(db, //Get_Menu_Items_Success);
    function Get_Menu_Items_Success(menu_items)
    {
      var html, items = "", c;

      if (menu_items != null)
      {
        for (c = 0; c < menu_items.length; c++)
        {
          items += "<a href=\"" + menu_items[c].url + "\">" + menu_items[c].title + "</a>";
          if (c != menu_items.length - 1)
            items += " | ";
        }
        html = items;
        $("#"+id).html(html);
      }
    });
  }
}

function Draw_Header(id)
{
  var html;

  if (Elem_Exists(id))
  {
    html =
      "<span style=\"width: 980px; display: inline-block; text-align: left;\">" +
        "<a href=\"index.html\"><img src=\"images/logo.png\" border=\"0\" class=\"dev\" /></a>" +
        //"<span id=\"hdr_opts\"><span class=\"hdr_opt\">Sitemap</span><img id=\"menu_separator\" src=\"images/menu-separator.png\" /><span class=\"hdr_opt\">Contact</span></span>" +
      "</span>";
    $("#"+id).html(html);
  }
}

function On_Portfolio_Selected(id)
{
  var url, x;

  x = $("#img_grp").position().left;
  url = "portfolio.html?id=" + id + "&x=" + x;
  window.open(url, "_self");
}

function Draw_Portfolio_Footer(db, id)
{
  if (Elem_Exists(id))
  {
	Portfolio_Item.Get_Portfolio_Items_and_Main_Images(db, //Success);
    function Success(items)
    {
      var html = "", c;

      for (c = 0; c < items.length; c++)
      {
    	html +=
          "<img src=\"" + items[c].main_image.thumbnail_url + "\" width=\"80\" height=\"80\" title=\"" + items[c].portfolio_item.title + "\" class=\"portfolio\" onclick=\"On_Portfolio_Selected(" + items[c].portfolio_item.id + ")\">";
      }
      
      html =
        "<img src=\"images/slider-prev.png\" class=\"control\" onclick=\"Portfolio_Footer_Prev_Click(this)\" />" +
        "<div id=\"images\">" +
          "<div id=\"img_grp\">" +
            html +
            "</div>" +
          "</div>" +
        "<img src=\"images/slider-next.png\" class=\"control\" onclick=\"Portfolio_Footer_Next_Click(this)\" />";
      $("#"+id).html(html);
    });
  }
}

function Portfolio_Footer_Prev_Click(obj)
{
  var img_grp;

  img_grp = $("#img_grp");
  if (img_grp.position().left < 0)
    img_grp.animate({ "left": "+=92px" }, "fast");
}

function Portfolio_Footer_Next_Click(obj)
{
  var img_grp;

  img_grp = $("#img_grp");
  if (img_grp.position().left + img_grp.width() > $("#images").width())
    img_grp.animate({ "left": "-=92px" }, "fast");
}

function Draw_Templates(db)
{
  Draw_Header("header");
  Draw_Menu(db, "menu");
  Draw_Portfolio_Footer(db, "footer_content");
  Draw_Footer(db, "footer_menu");
}

