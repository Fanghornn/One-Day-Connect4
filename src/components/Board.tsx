import * as React from "react"

interface GridCell {
  active: boolean
  owner?: number
}

interface BoardState {
  grid: Array<Array<GridCell>>
  activePlayer: number
}

export default class Board extends React.Component<void, BoardState> {

  constructor(){
    super()

    const defaultCell = {
      active: false
    }

    const grid = new Array(7).fill(undefined).map(() => {
      return new Array(6).fill(defaultCell);
    })

    const activePlayer = 1

    this.state = {
      grid,
      activePlayer
    }
  }

  selectColumn = (columnSelected: number) => {
    const { grid, activePlayer } = this.state

    if (!grid[columnSelected][0].active){

      const gridUpdated = grid.map((cellColumn, columnIndex) => {

        if (columnIndex === columnSelected) {

          return cellColumn.map((cell, cellIndex) => {

            if (!cell.active) {
              const bottomCell = cellColumn[cellIndex + 1]

              return bottomCell === undefined || bottomCell.active 
                ? { active: true, owner: activePlayer }
                : cell
            } else {
              return cell
            }
          })

        } else {
          return cellColumn
        }
      })

      const newActivePlayer = activePlayer === 1
        ? 2
        : 1

      this.setState({
        grid: gridUpdated,
        activePlayer: newActivePlayer
      })

    }
  }

  render(){
    const { grid } = this.state

    const columns = grid.map((column, index) => {
      return (
        <CellColumn
          key= { "column" + index }
          columnIndex={ index }
          onSelect={ this.selectColumn }
          cells={ column }
        />
      )
    })

    return (
      <div id="gameFrame">
        <div id="gameBoard">
          { columns }
        </div>
        <div id="boardBase">
          <div className="base-foot foot-left">
            <div className="triangle"></div>
          </div>
          <div className="base-foot foot-right">
            <div className="triangle"></div>
          </div>
        </div>
      </div>
    )
  }

}



interface CellColumnProps {
  columnIndex: number
  onSelect: (index: number) => void
  cells: Array<GridCell>
}

class CellColumn extends React.Component<CellColumnProps, void> {
  render(){

    const { onSelect, cells, columnIndex } = this.props

    const cellsEl = cells.map((cell, index) => {
      const key = "cell" + columnIndex + "-" + index 
      return (
        <Cell
          key={ key }
          crossed={ false }
          { ...cell }
        />
      )
    })

    return(
      <div 
        onClick={ () => onSelect(columnIndex) }
        className="cell-column"
      >
        <div className="column-pointer"></div>
        { cellsEl }
      </div>
    )
  }
}



interface CellProps {
  active: boolean
  crossed: boolean
  owner: number
}
class Cell extends React.Component<CellProps, void> {
  render(){
    const { active, owner } = this.props

    const activeClass = active
      ? 'active'
      : ''
    const ownerClass = owner 
      ? 'player' + owner
      : '' 
    const cellClass = ownerClass + ' cell ' + activeClass

    return (
      <div className="cell-block">
        <div className={ cellClass }></div>
      </div>
    )
  }
}