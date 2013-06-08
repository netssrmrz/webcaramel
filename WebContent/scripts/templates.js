
function Draw_Menu()
{
  var res = "", items = "", c, menu_items;

  menu_items = Get_JSON("db/menu_item.json");
  if (menu_items != null)
  {
    for (c = 0; c < menu_items.length; c++)
    {
      items +=
        "<li>" +
          "<a href=\"" + menu_items[c].url + "\">" +
            "<span class=\"menu_title\">" + menu_items[c].title + "</span>" +
            "<br />" +
            "<span class=\"menu_details\">" + menu_items[c].caption + "</span>" +
            "</a>" +
          "</li>";
    }
    res =
      "<div id=\"menu\"><ul>" + items + "</ul></div>";
  }
  return res;
}

function Draw_Footer()
{
  var res, items = "", c, menu_items;

  menu_items = Get_JSON("db/menu_item.json");
  if (menu_items != null)
  {
    for (c = 0; c < menu_items.length; c++)
    {
      items += "<a href=\"" + menu_items[c].url + "\">" + menu_items[c].title + "</a>";
      if (c != menu_items.length - 1)
        items += " | ";
    }
    res = "<div id=\"footer_menu\">" + items + "</div>";
  }
  return res;
}

function Draw_Header()
{
  var res;

  res =
    "<div id=\"header\">" +
      "<span style=\"width: 980px; display: inline-block; text-align: left;\">" +
        "<img src=\"images/logo.png\" class=\"dev\" />" +
        //"<span id=\"hdr_opts\"><span class=\"hdr_opt\">Sitemap</span><img id=\"menu_separator\" src=\"images/menu-separator.png\" /><span class=\"hdr_opt\">Contact</span></span>" +
      "</span></div>";
  return res;
}

function On_Portfolio_Selected(id)
{
  var url, x;

  x = $("#img_grp").position().left;
  url = "portfolio.html?id=" + id + "&x=" + x;
  window.open(url, "_self");
}

function Draw_Portfolio_Footer()
{
  var items = "", c, portfolio_item_table, portfolio_image_table, res;

  portfolio_item_table = Get_JSON("db/portfolio_item.json");
  portfolio_image_table = Get_JSON("db/portfolio_image.json");

  if (portfolio_item_table != null)
  {
    for (c = 0; c < portfolio_item_table.length; c++)
    {
      curr_item_imgs = Enumerable.From(portfolio_image_table)
        .Where(function (x) { return x.portfolio_item_id == portfolio_item_table[c].id })
        .ToArray();
      items +=
        //"<a href=\"portfolio.html?id=" + portfolio_item_table[c].id + "\">"+
          "<img src=\"" + curr_item_imgs[0].thumbnail_url + "\" width=\"80\" height=\"80\" title=\"" + portfolio_item_table[c].title + "\" class=\"portfolio\" onclick=\"On_Portfolio_Selected(" + portfolio_item_table[c].id + ")\">";
          //"</a>";
    }
  }

  res =
    "<div id=\"footer_content\">" +
    "<img src=\"images/slider-prev.png\" class=\"control\" onclick=\"Portfolio_Footer_Prev_Click(this)\" />" +
    "<div id=\"images\">" +
      "<div id=\"img_grp\">" +
        items +
        "</div>" +
      "</div>" +
    "<img src=\"images/slider-next.png\" class=\"control\" onclick=\"Portfolio_Footer_Next_Click(this)\" />" +
    "</div>";

  return res;
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
