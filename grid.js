function drawgrid() {
  var n = $('#n').val();
  var k = $('#k').val();

  if (n <= 0 || k <= 0) return;

  //cell size
  var cs = 40;
  //grid width and height
  var bw = cs * k;
  var bh = cs * n;
  //padding
  var p = 10;
  //canvas size
  var cw = bw + (p * 2) + 1;
  var ch = bh + (p * 2) + 1;

  if ($('.container')) $('.container').remove();

  $('<div/>').attr({ class: 'container' }).css({ position: 'relative'}).appendTo('body');
  var canvas = $('<canvas/>').attr({ id: 'canvas', width: cw, height: ch }).appendTo('.container');
  var menu = $('<ul/>')
    .attr({ id: 'contextMenu' })
    .css({
      border: '1px solid black',
      background: 'white',
      position: 'absolute',
      'list-style': 'none',
      padding: '3px',
    }).appendTo('.container');

  var ctx = canvas.get(0).getContext('2d');

  ctx.font = '20px Arial';
  ctx.textBaseline = 'middle';

  var cells = [];
  //draw grid
  for (var x = 0; x <= k; x++) {
    //heder
    var text = String(x + 1);
    var m = ctx.measureText(text);
    if (x < k) {
      ctx.fillText(text, 0.5 + x * cs + p + (cs - m.width) / 2, p + cs / 2);
      cells.push({
        x: 0.5 + x * cs + p,
        y: p,
        id: x + 1,
        size: cs,
      });
    }
    //cols
    ctx.moveTo(0.5 + x * cs + p, p);
    ctx.lineTo(0.5 + x * cs + p, bh + p);
  }

  for (var x = 0; x <= n; x++) {
    //rows
    ctx.moveTo(p, 0.5 + x * cs + p);
    ctx.lineTo(bw + p, 0.5 + x * cs + p);
  }

  ctx.strokeStyle = 'black';
  ctx.stroke();

  bindMenu(menu, cells);
}

function bindMenu(menu, cells) {
  hideMenu();
  menu.on('click', 'li', function (e) {
    var value = $(this).val();
    if (value === 0) return;
    hideMenu();
    alert('Item '+ value +' is clicked');
  });

  var canvas = document.getElementById('canvas');
  canvas.addEventListener('mousedown', handleMouseDown, false);
  canvas.addEventListener('contextmenu', handleContextMenu, false);

  function handleMouseDown(e) {
    hideMenu();
  }

  function handleContextMenu(e) {
    e.preventDefault();
    e.stopPropagation();

    var br = canvas.getBoundingClientRect();
    var x = parseInt(e.clientX - br.left);
    var y = parseInt(e.clientY - br.top);

    hideMenu();

    for (var i = 0; i < cells.length; i++) {
      var cell = cells[i];
      var right = cell.x + cell.size;
      var bottom = cell.y + cell.size;
      if (x >= cell.x && x <= right && y >= cell.y && y <= bottom) {
        showMenu(cell, x, y);
      }
    }
    return (false);
  }

  function hideMenu() {
    menu.hide();
  }

  function getRandom(min, max) {
    return Math.random() * (max - min) + min;
  }

  function showMenu(c, x, y) {
    menu.show();
    menu.empty();
    menu.css({ left: x, top: y });

    $('<li>', { text: c.id, value: 0, }).appendTo(menu[0]);
    var itemCount = getRandom(2, 4);
    for (var i = 1; i < itemCount; i++) {
      $('<li>', { text: 'Menu ' + i, value: i, }).appendTo(menu[0]);
    }
  }
}