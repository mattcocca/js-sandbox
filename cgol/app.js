// Conway's Game of Life
// All elements drawn within 'app_wrapper' 
// Written by Matt Cocca

const app_wrapper = document.getElementById('app_wrapper')

// Globals for game state
var gameGrid = []
var run = false
const cols = 20 
const rows = calculate_num_rows(app_wrapper, cols)


function calculate_num_rows(element, x){
  var cell_size = element.clientWidth/x
  num_rows = ((element.clientHeight)/cell_size)-2
  return num_rows
}

function generate_cell_style(element, x){
  var cell_size = (element.clientWidth-20)/(2*x)
  var cell_style = `
  border: none;
  border-radius: 3px; 
  background-color: #b8b8b8;
  padding: ${cell_size-1}px ${cell_size-1}px;
  text-decoration: none;
  margin: 1px 1px
  `
  return cell_style
}


function generate_grid(x,y){
  var grid = []
  for (rx = 0; rx < x; rx++){
    var column = []
    for (ry = 0; ry < y; ry++){
      column.unshift(0)
    }
    grid.push(column)
  }
  return grid
}


function init_button_grid(grid, element){
  const cellButtonStyle = generate_cell_style(app_wrapper, cols)
  width = grid.length
  height = grid[0].length

  for (i = 0; i < width*height; i++){
    const button = document.createElement('button')
    button.id = ((width*height) - ((width-i%width)) - ~~(i/width)*width)
    button.style.cssText = cellButtonStyle
    button.addEventListener('click', () => {
      gameGrid[button.id%width][~~(button.id/width)]^=1
      button.style.backgroundColor = ""
      console.log('cell #: ' + button.id + 
                '   x: ' + button.id%width + '  y: ' + ~~(button.id/width) + 
                '   live neighbors: ' + calc_live_neighbors(grid, button.id%width, ~~(button.id/width)))
    })
    button.addEventListener('mouseenter', () => {
      button.style.backgroundColor = "#e2ed47"
    })
    button.addEventListener('mouseleave', () => {
      if (gameGrid[button.id%width][~~(button.id/width)]){
        button.style.backgroundColor = ""
      }
      else {
        button.style.backgroundColor = "#b8b8b8"
      }
    })
    
    element.appendChild(button)
    if ((i+1)%width === 0){
      element.append(document.createElement('br'))
    }
  }
}


function init_run_button(element){
  const button = document.createElement('button')
  button.innerText = "RUN/STOP"
  button.addEventListener('click', () => {
    if (run) {run = false}
    else {run = true}
  })
  element.appendChild(button)
}


function calculate_next_grid_iteration(cellGrid){
  var x_max = cellGrid.length
  var y_max = cellGrid[0].length
  
  var iteration_next =  []

  for (x = 0; x < x_max; x++){
    column = []
    for (y = 0; y < y_max; y++){
      var cell_next = 0
      var num_live = calc_live_neighbors(cellGrid, x, y)
      if ((cellGrid[x][y] && num_live === 2) || num_live === 3){
        cell_next = 1
      }
      column.push(cell_next)
    }
    iteration_next.push(column)
  }
  return iteration_next
}


function calc_live_neighbors(cellGrid, x, y){
  const y_max = cellGrid.length
  const x_max = cellGrid[0].length

  var num_live = 0

  // Generate list of coordinates of all 8 potential neighboring cells [x, y]
  var neighbors = [] 
  for (y_shift = -1; y_shift < 2; y_shift++){
    for (x_shift = -1; x_shift < 2; x_shift++){
      var coord = [y + x_shift]
      coord.push(x + y_shift)
      if (coord[0] === y && coord[1] === x){ continue }
      neighbors.push(coord)
    }
  }

  // Validate neighbor indices and sum valid cells
  for(coord of neighbors){
    if ((coord[1] >= 0 && coord[1] < y_max) && (coord[0] >= 0 && coord[0] < x_max)){
      num_live += cellGrid[coord[1]][coord[0]]
    }
  }

  return num_live
}


function update_cell_colors(cellGrid){
  for (i = 0; i < cellGrid.length*cellGrid[0].length; i++){
    document.getElementById(String(i)).dispatchEvent(new Event('mouseleave'))
  }
}


function runloop() {
  if (run){
    gameGrid = calculate_next_grid_iteration(gameGrid)
    update_cell_colors(gameGrid)
  }
}


app_wrapper.append(document.createElement('br'))
gameGrid = generate_grid(cols,rows)
init_button_grid(gameGrid, app_wrapper)
app_wrapper.append(document.createElement('br'))
init_run_button (app_wrapper)

setInterval(runloop, 200)