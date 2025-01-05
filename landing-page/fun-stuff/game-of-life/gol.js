/* game-of-life is a pure JavaScript/HTML/CSS implementation of Conway's Game of Life
 * Copyright (C) 2017 Nikolaos Moumoulidis
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/
window.onload = function() {

/**
 * TODOs:
 * - Include buttons that generate popular patterns (preferably drag'n'drop).
 * - Make the game more colorful by creating mapping between specific colors and number generations.
 */

    function Petritable(w, h)
    {
        this.width = w;
        this.height = h;
        this.htmlPetriTable;
        this.cellArray = new Array();
        this.getWidth = getWidth;
        this.getHeight = getHeight;
        this.getCell = getCell;
        this.buildCellObject = buildCellObject;
        this.assignCellToArray = assignCellToArray;
        this.buildPetriTable = buildPetriTable;
        this.deletePetritable = deletePetritable;
        this.syncDrawingStatusToLife = syncDrawingStatusToLife;
        this.syncLifeStatusToDrawing = syncLifeStatusToDrawing;

        function getWidth() {
            return this.width;
        }

        function getHeight() {
            return this.height;
        }

        function getCell(width, height) {
            return this.cellArray[ width + "_" + height ];
        }

        function buildCellObject(cellHTMLElement, width, height) {
            var newCell = new Cell(cellHTMLElement);
            newCell.setID(width, height);
            newCell.setAttribute("id", width + "_" + height);
            newCell.setAttribute("class", "deadcell");
            newCell.addEventListener("click",function myfunc() {
                if (this.getAttribute("class") == "deadcell") {
                    this.setAttribute("class", "alivecell");
                }
                else {
                    this.setAttribute("class", "deadcell");
                }
            });
            return newCell;
        }

        function assignCellToArray(cell, width, height) {
            this.cellArray[ width + "_" + height ] = cell;
        }

        function buildPetriTable() {
            this.htmlPetriTable = document.createElement("table");
            this.htmlPetriTable.setAttribute("class","petritable");
            this.htmlPetriTable.setAttribute("id", "petritable");

            for (var i = 0; i < this.width ; i++) {
                var rowHTMLElement = this.htmlPetriTable.insertRow(i);
                for (var j = 0; j < this.height ; j++) {
                    var cellHTMLElement = rowHTMLElement.insertCell(j);
                    var newCell = buildCellObject(cellHTMLElement, i, j);
                    this.assignCellToArray(newCell, i, j);
                }
            }

            document.body.appendChild(this.htmlPetriTable);
        }

        function deletePetritable() {
            document.getElementById("petritable").remove();
        }

        function syncDrawingStatusToLife() {
            for (var i = 0; i < this.width ; i++) {
                for (var j = 0; j < this.height ; j++) {
                    var currentCell = this.getCell(i, j);
                    if (currentCell.isAlive()) {
                        currentCell.setAttribute("class", "alivecell");
                    } else {
                        currentCell.setAttribute("class", "deadcell");
                    }
                }
            }
        }

        function syncLifeStatusToDrawing() {
            for (var i = 0; i < this.width ; i++) {
                for (var j = 0; j < this.height ; j++) {
                    var currentCell = this.getCell(i, j);
                    if (currentCell.getAttribute("class") == "alivecell") {
                        currentCell.setAlive(true);
                    } else {
                        currentCell.setAlive(false);
                    }
                }
            } 
        }

        this.buildPetriTable();
    }

    function Cell(c)
    {
        this.element = c;
        this.row;
        this.column;
        this.alive = false;
        this.generation = 0;
        this.setID = setID;
        this.setAttribute = setAttribute;
        this.getAttribute = getAttribute;
        this.addEventListener = addEventListener;
        this.setAlive = setAlive;
        this.isAlive = isAlive;
        this.getNumberOfNeighbours = getNumberOfNeighbours;
        this.getNeighborCoords = getNeighborCoords;
        this.isNeighbourAlive = isNeighbourAlive;

        function setAttribute(attribute, value) {
            this.element.setAttribute(attribute, value);
        }

        function getAttribute(attribute) {
            return this.element.getAttribute(attribute);
        }

        function addEventListener(action, func) {
            this.element.addEventListener(action ,func);
        }

        function setID(row, col) {
            this.row = row;
            this.column = col;
        }

        function setAlive(isAlive) {
            this.alive = isAlive;
        }

        function isAlive() {
            return this.alive;
        }

        function getNumberOfNeighbours(table) {
            var num = 0;
            var neighborCoords = this.getNeighborCoords();
            for (var i = 0; i < neighborCoords.length; i += 2) {
                if (this.isNeighbourAlive(i, neighborCoords, table)) {
                    num++;
                }
            }
            return num;
        }

        function getNeighborCoords() {
            var neighborCoords = new Array();
            neighborCoords[0] = this.row - 1; // top row
            neighborCoords[1] = this.column; // top col
            neighborCoords[2] = this.row + 1; // bottom row
            neighborCoords[3] = this.column; // bottom col
            neighborCoords[4] = this.row; // left row
            neighborCoords[5] = this.column - 1; // left col
            neighborCoords[6] = this.row; // right row
            neighborCoords[7] = this.column + 1; // right col
            neighborCoords[8] = this.row - 1; // top left row
            neighborCoords[9] = this.column - 1; // top left col
            neighborCoords[10] = this.row - 1; // top right row
            neighborCoords[11] = this.column + 1; // top right col
            neighborCoords[12] = this.row + 1; // bottom left row
            neighborCoords[13] = this.column - 1; // bottom left col
            neighborCoords[14] = this.row + 1; // bottom right row
            neighborCoords[15] = this.column + 1; // bottom right col
            return neighborCoords;
        }

        function isNeighbourAlive(index, coords, table) {
            var dir_r = coords[ index ];
            var dir_c = coords[ index + 1 ];

            if (dir_r < 0 || dir_c < 0 ||
                dir_r > table.getWidth() - 1 ||
                dir_c > table.getHeight() - 1) {
                return false;
            }

            if(table.getCell(dir_r, dir_c).getAttribute("class") == "alivecell") {
                return true;
            }

            return false;
        }
    }

    function LifeGen(w, h) 
    {
        this.width = w;
        this.height = h;
        this.theTable = new Petritable(w,h);
        this.lifeAndDeath = lifeAndDeath;

        function lifeAndDeath() {
            this.theTable.syncDrawingStatusToLife();

            for (var i = 0; i < this.width ; i++) {
                for (var j = 0; j < this.height ; j++) {
                    var currentCell = this.theTable.getCell(i, j);
                    var nOn = currentCell.getNumberOfNeighbours(this.theTable);
                    if (currentCell.isAlive()) {
                        if (nOn < 2) {
                            currentCell.setAlive(false);
                        } else if (nOn == 2 || nOn == 3) {
                            currentCell.generation++;
                        } else {
                            currentCell.setAlive(false);
                        }
                    } else {
                        if (nOn == 3) {
                            currentCell.setAlive(true);
                        }
                    }
                }
            }
        }
    }

    var petritableWidth = 80;
    var petritableHeight = 130;
    var generator = new LifeGen(petritableWidth,petritableHeight);

    var intervalId;

    var startBtnListener = function() {
        generator.theTable.syncLifeStatusToDrawing();
        intervalId = setInterval(function() { generator.lifeAndDeath(); }, 50);
        this.setAttribute("disabled", true);
    }

    var resetBtnListener = function() {
        generator.theTable.deletePetritable();
        clearInterval(intervalId);
        document.getElementById("startBtn").removeAttribute("disabled");
        generator = new LifeGen(petritableWidth,petritableHeight);
    }

    document.getElementById("startBtn").addEventListener("click", startBtnListener, false);
    document.getElementById("resetBtn").addEventListener("click", resetBtnListener, false);
}
 