class Whiteboard {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.isDrawing = false;
        this.currentTool = 'draw';
        this.startX = 0;
        this.startY = 0;
        this.textBoxInput = null;

        this.init();
    }

    init() {
        this.canvas.addEventListener('mousedown', (e) => this.onMouseDown(e));
        this.canvas.addEventListener('mousemove', (e) => this.onMouseMove(e));
        this.canvas.addEventListener('mouseup', (e) => this.onMouseUp(e));
        this.canvas.addEventListener('mouseleave', () => this.onMouseLeave());
    }

    setTool(tool) {
        this.currentTool = tool;
        if (tool === 'erase') {
            this.ctx.strokeStyle = 'white'; // Color for erase is white
            this.ctx.lineWidth = 20; // Larger line width for erasing
        } else {
            this.ctx.strokeStyle = 'black'; // Default color
            this.ctx.lineWidth = 2; // Default line width for drawing
        }
    }

    onMouseDown(e) {
        const { offsetX, offsetY } = e;
        this.isDrawing = true;
        this.startX = offsetX;
        this.startY = offsetY;

        if (this.currentTool === 'text') {
            this.addTextBox(e);
        } else {
            this.ctx.beginPath();
            this.ctx.moveTo(offsetX, offsetY);
        }
    }

    onMouseMove(e) {
        if (!this.isDrawing) return;

        const { offsetX, offsetY } = e;

        if (this.currentTool === 'draw') {
            this.draw(offsetX, offsetY);
        } else if (this.currentTool === 'erase') {
            this.erase(offsetX, offsetY);
        }
    }

    onMouseUp(e) {
        this.isDrawing = false;
        const { offsetX, offsetY } = e;

        if (this.currentTool === 'circle') {
            this.drawCircle(this.startX, this.startY, offsetX, offsetY);
        } else if (this.currentTool === 'square') {
            this.drawSquare(this.startX, this.startY, offsetX, offsetY);
        } else if (this.currentTool === 'line') {
            this.drawLine(this.startX, this.startY, offsetX, offsetY);
        }

        this.ctx.closePath();
    }

    onMouseLeave() {
        this.isDrawing = false;
    }

    draw(x, y) {
        this.ctx.lineTo(x, y);
        this.ctx.stroke();
    }

    erase(x, y) {
        this.ctx.clearRect(x - 10, y - 10, 20, 20);
    }

    drawCircle(startX, startY, endX, endY) {
        const radius = Math.hypot(endX - startX, endY - startY);
        this.ctx.beginPath();
        this.ctx.arc(startX, startY, radius, 0, Math.PI * 2);
        this.ctx.stroke();
    }

    drawSquare(startX, startY, endX, endY) {
        const width = endX - startX;
        const height = endY - startY;
        this.ctx.strokeRect(startX, startY, width, height);
    }

    drawLine(startX, startY, endX, endY) {
        this.ctx.beginPath();
        this.ctx.moveTo(startX, startY);
        this.ctx.lineTo(endX, endY);
        this.ctx.stroke();
    }

    addTextBox(e) {
        if (this.textBoxInput) {
            this.textBoxInput.remove();
        }

        const input = document.createElement('input');
        input.type = 'text';
        input.style.position = 'absolute';
        input.style.left = `${e.clientX}px`;
        input.style.top = `${e.clientY}px`;
        input.style.fontSize = '16px';
        input.style.border = '1px solid black';

        document.body.appendChild(input);
        input.focus();

        input.addEventListener('keydown', (ev) => {
            if (ev.key === 'Enter') {
                this.ctx.font = '16px Arial';
                this.ctx.fillText(input.value, e.offsetX, e.offsetY);
                input.remove();
            }
        });

        this.textBoxInput = input;
    }
}

// Usage example:
const canvas = document.getElementById('whiteboard');
const whiteboard = new Whiteboard(canvas);

// Switch between tools with this:
document.getElementById('tool-draw').addEventListener('click', () => whiteboard.setTool('draw'));
document.getElementById('tool-erase').addEventListener('click', () => whiteboard.setTool('erase'));
document.getElementById('tool-text').addEventListener('click', () => whiteboard.setTool('text'));
document.getElementById('tool-circle').addEventListener('click', () => whiteboard.setTool('circle'));
document.getElementById('tool-square').addEventListener('click', () => whiteboard.setTool('square'));
document.getElementById('tool-line').addEventListener('click', () => whiteboard.setTool('line'));
