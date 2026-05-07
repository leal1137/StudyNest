import { useEffect, useRef, useState } from "react";

export default function Whiteboard({ socket, room }) {
  const canvasRef = useRef(null);
  const contextRef = useRef(null);
  const fileInputRef = useRef(null);
  const isDrawingRef = useRef(false);
  const shapeStartRef = useRef(null);
  const shapeBaseRef = useRef(null);
  const imageBaseRef = useRef(null);
  const pendingImageRef = useRef(null);
  const imageDragOffsetRef = useRef(null);
  const [brushColor, setBrushColor] = useState("#000000");
  const [brushWidth, setBrushWidth] = useState(4);
  const [isDrawingEnabled, setIsDrawingEnabled] = useState(true);
  const [isBoardReady, setIsBoardReady] = useState(false);
  const [toolMode, setToolMode] = useState("draw");
  const [shapeType, setShapeType] = useState("rectangle");
  const [textValue, setTextValue] = useState("");
  const [fontSize, setFontSize] = useState(24);
  const [pendingImage, setPendingImage] = useState(null);
  const [imageScale, setImageScale] = useState(100);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.width = 800;
    canvas.height = 500;
    canvas.style.width = "100%";
    canvas.style.height = "100%";

    const ctx = canvas.getContext("2d");
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.strokeStyle = brushColor;
    ctx.lineWidth = brushWidth;
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    contextRef.current = ctx;
  }, []);

  useEffect(() => {
    const ctx = contextRef.current;
    if (!ctx) return;
    ctx.strokeStyle = brushColor;
  }, [brushColor]);

  useEffect(() => {
    const ctx = contextRef.current;
    if (!ctx) return;
    ctx.lineWidth = brushWidth;
  }, [brushWidth]);

  useEffect(() => {
    if (!isBoardReady) return undefined;

    const handlePaste = (event) => {
      const imageItem = Array.from(event.clipboardData?.items || []).find((item) =>
        item.type.startsWith("image/")
      );

      if (!imageItem) return;

      const file = imageItem.getAsFile();
      if (!file) return;

      event.preventDefault();
      insertImageFile(file);
    };

    window.addEventListener("paste", handlePaste);

    return () => {
      window.removeEventListener("paste", handlePaste);
    };
  }, [isBoardReady]);

  useEffect(() => {
    if (!socket || !room) return;

    const drawBoard = (board, onDone) => {
      const canvas = canvasRef.current;
      const ctx = contextRef.current;
      if (!canvas || !ctx || !board) {
        onDone?.();
        return;
      }

      const img = new Image();
      img.onload = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = "white";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        onDone?.();
      };
      img.src = board;
    };

    const handleBoardUpdate = ({ board }) => {
      drawBoard(board, () => {
        const canvas = canvasRef.current;
        const ctx = contextRef.current;

        if (canvas && ctx && pendingImageRef.current) {
          imageBaseRef.current = ctx.getImageData(0, 0, canvas.width, canvas.height);
          drawPendingImage(pendingImageRef.current.placement);
          setToolMode("image");
          setPendingImage(pendingImageRef.current.placement);
        }

        setIsBoardReady(true);
      });
    };

    socket.on("whiteboard_update", handleBoardUpdate);
    setIsBoardReady(false);
    socket.emit("whiteboard_request", { room }, ({ board } = {}) => {
      drawBoard(board, () => setIsBoardReady(true));
    });

    return () => {
      socket.off("whiteboard_update", handleBoardUpdate);
    };
  }, [socket, room]);

  const emitBoardUpdate = () => {
    const canvas = canvasRef.current;
    if (!canvas || !socket) return;
    socket.emit("whiteboard_update", {
      room,
      board: canvas.toDataURL(),
    });
  };

  const getCanvasCoordinates = (event) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    return {
      x: ((event.clientX - rect.left) / rect.width) * canvas.width,
      y: ((event.clientY - rect.top) / rect.height) * canvas.height,
    };
  };

  const getImagePlacement = (image, point) => {
    const canvas = canvasRef.current;
    if (!canvas) return null;

    const scale = Math.min(1, canvas.width / image.width, canvas.height / image.height);
    const width = image.width * scale;
    const height = image.height * scale;
    const preferredX = point ? point.x - width / 2 : (canvas.width - width) / 2;
    const preferredY = point ? point.y - height / 2 : (canvas.height - height) / 2;

    return {
      x: Math.max(0, Math.min(preferredX, canvas.width - width)),
      y: Math.max(0, Math.min(preferredY, canvas.height - height)),
      width,
      height,
      baseWidth: width,
      baseHeight: height,
    };
  };

  const restoreImageBase = () => {
    const canvas = canvasRef.current;
    const ctx = contextRef.current;
    if (!canvas || !ctx || !imageBaseRef.current) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.putImageData(imageBaseRef.current, 0, 0);
  };

  const drawPendingImage = (placement) => {
    const ctx = contextRef.current;
    const image = pendingImageRef.current?.image;
    if (!ctx || !image || !placement) return;

    restoreImageBase();
    ctx.drawImage(image, placement.x, placement.y, placement.width, placement.height);

    ctx.save();
    ctx.strokeStyle = "#2d90e1";
    ctx.lineWidth = 2;
    ctx.setLineDash([8, 5]);
    ctx.strokeRect(placement.x, placement.y, placement.width, placement.height);
    ctx.restore();
  };

  const updatePendingImage = (placement) => {
    pendingImageRef.current.placement = placement;
    setPendingImage(placement);
    drawPendingImage(placement);
  };

  const clampImagePlacement = (placement) => {
    const canvas = canvasRef.current;
    if (!canvas) return placement;

    return {
      ...placement,
      x: Math.max(0, Math.min(placement.x, canvas.width - placement.width)),
      y: Math.max(0, Math.min(placement.y, canvas.height - placement.height)),
    };
  };

  const getMaxImageScale = (placement) => {
    const canvas = canvasRef.current;
    if (!canvas || !placement) return 100;

    return Math.floor(
      Math.min(200, (canvas.width / placement.baseWidth) * 100, (canvas.height / placement.baseHeight) * 100)
    );
  };

  const startPendingImage = (image, placement) => {
    const canvas = canvasRef.current;
    const ctx = contextRef.current;
    if (!canvas || !ctx) return;

    imageBaseRef.current = ctx.getImageData(0, 0, canvas.width, canvas.height);
    pendingImageRef.current = {
      image,
      placement,
    };
    setToolMode("image");
    setImageScale(100);
    setPendingImage(placement);
    drawPendingImage(placement);
  };

  const clearPendingImage = (restoreBase = true) => {
    if (restoreBase) {
      restoreImageBase();
    }

    imageBaseRef.current = null;
    pendingImageRef.current = null;
    imageDragOffsetRef.current = null;
    setPendingImage(null);
    setImageScale(100);
  };

  const insertImageSource = (source, point) => {
    const canvas = canvasRef.current;
    const ctx = contextRef.current;
    if (!canvas || !ctx || !source || !isBoardReady) return;

    if (pendingImageRef.current) {
      clearPendingImage(true);
    }

    const img = new Image();
    img.onload = () => {
      const placement = getImagePlacement(img, point);
      if (!placement) return;

      startPendingImage(img, placement);
    };
    img.src = source;
  };

  const insertImageFile = (file, point) => {
    if (!file?.type.startsWith("image/")) return;

    const reader = new FileReader();
    reader.onload = () => insertImageSource(reader.result, point);
    reader.readAsDataURL(file);
  };

  const drawText = (text, x, y) => {
    const canvas = canvasRef.current;
    const ctx = contextRef.current;
    const trimmedText = text.trim();
    if (!canvas || !ctx || !trimmedText) return false;

    const safeFontSize = Number.isFinite(fontSize) ? fontSize : 24;
    const lineHeight = safeFontSize * 1.25;
    const maxWidth = Math.max(canvas.width - x - 12, 40);
    const paragraphs = trimmedText.split("\n");
    const lines = [];

    ctx.save();
    ctx.font = `${safeFontSize}px Arial, sans-serif`;

    paragraphs.forEach((paragraph) => {
      const words = paragraph.split(" ");
      let line = "";

      words.forEach((word) => {
        const testLine = line ? `${line} ${word}` : word;
        if (line && ctx.measureText(testLine).width > maxWidth) {
          lines.push(line);
          line = word;
        } else {
          line = testLine;
        }
      });

      lines.push(line);
    });

    ctx.fillStyle = brushColor;
    ctx.textBaseline = "top";
    lines.forEach((line, index) => {
      ctx.fillText(line, x, y + index * lineHeight, maxWidth);
    });
    ctx.restore();

    return true;
  };

  const drawShape = (start, end) => {
    const ctx = contextRef.current;
    if (!ctx || !start || !end) return;

    const width = end.x - start.x;
    const height = end.y - start.y;
    const radiusX = Math.abs(width) / 2;
    const radiusY = Math.abs(height) / 2;
    const centerX = start.x + width / 2;
    const centerY = start.y + height / 2;

    ctx.save();
    ctx.strokeStyle = brushColor;
    ctx.lineWidth = brushWidth;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.beginPath();

    if (shapeType === "rectangle") {
      ctx.rect(start.x, start.y, width, height);
    } else if (shapeType === "ellipse") {
      ctx.ellipse(centerX, centerY, radiusX, radiusY, 0, 0, Math.PI * 2);
    } else if (shapeType === "triangle") {
      ctx.moveTo(centerX, start.y);
      ctx.lineTo(end.x, end.y);
      ctx.lineTo(start.x, end.y);
      ctx.closePath();
    } else if (shapeType === "arrow") {
      const angle = Math.atan2(height, width);
      const headLength = Math.max(16, Math.min(42, Math.hypot(width, height) * 0.22));

      ctx.moveTo(start.x, start.y);
      ctx.lineTo(end.x, end.y);
      ctx.moveTo(end.x, end.y);
      ctx.lineTo(
        end.x - headLength * Math.cos(angle - Math.PI / 6),
        end.y - headLength * Math.sin(angle - Math.PI / 6)
      );
      ctx.moveTo(end.x, end.y);
      ctx.lineTo(
        end.x - headLength * Math.cos(angle + Math.PI / 6),
        end.y - headLength * Math.sin(angle + Math.PI / 6)
      );
    } else if (shapeType === "heart") {
      const left = Math.min(start.x, end.x);
      const right = Math.max(start.x, end.x);
      const top = Math.min(start.y, end.y);
      const bottom = Math.max(start.y, end.y);
      const heartWidth = right - left;
      const heartHeight = bottom - top;
      const midX = left + heartWidth / 2;

      ctx.moveTo(midX, top + heartHeight * 0.34);
      ctx.bezierCurveTo(
        left + heartWidth * 0.5,
        top + heartHeight * 0.05,
        left,
        top + heartHeight * 0.05,
        left,
        top + heartHeight * 0.34
      );
      ctx.bezierCurveTo(
        left,
        top + heartHeight * 0.56,
        left + heartWidth * 0.22,
        top + heartHeight * 0.72,
        midX,
        bottom
      );
      ctx.bezierCurveTo(
        right - heartWidth * 0.22,
        top + heartHeight * 0.72,
        right,
        top + heartHeight * 0.56,
        right,
        top + heartHeight * 0.34
      );
      ctx.bezierCurveTo(
        right,
        top + heartHeight * 0.05,
        right - heartWidth * 0.5,
        top + heartHeight * 0.05,
        midX,
        top + heartHeight * 0.34
      );
      ctx.closePath();
    } else {
      ctx.moveTo(start.x, start.y);
      ctx.lineTo(end.x, end.y);
    }

    ctx.stroke();
    ctx.restore();
  };

  const getShapeEndCoordinates = (event) => {
    const end = getCanvasCoordinates(event);
    const start = shapeStartRef.current;
    const lockableShapes = ["rectangle", "triangle", "heart", "ellipse"];

    if (!event.shiftKey || !start || !lockableShapes.includes(shapeType)) {
      return end;
    }

    const width = end.x - start.x;
    const height = end.y - start.y;
    const size = Math.max(Math.abs(width), Math.abs(height));

    return {
      x: start.x + Math.sign(width || 1) * size,
      y: start.y + Math.sign(height || 1) * size,
    };
  };

  const hexToRgb = (hexColor) => {
    const normalizedHex = hexColor.replace("#", "");
    const value = parseInt(normalizedHex, 16);

    return {
      r: (value >> 16) & 255,
      g: (value >> 8) & 255,
      b: value & 255,
      a: 255,
    };
  };

  const getColorDistance = (data, index, color) => {
    const redDifference = data[index] - color.r;
    const greenDifference = data[index + 1] - color.g;
    const blueDifference = data[index + 2] - color.b;

    return Math.sqrt(
      redDifference * redDifference +
      greenDifference * greenDifference +
      blueDifference * blueDifference
    );
  };

  const colorsAreClose = (data, index, targetColor, tolerance = 92) => (
    getColorDistance(data, index, targetColor) <= tolerance
  );

  const fillArea = (x, y) => {
    const canvas = canvasRef.current;
    const ctx = contextRef.current;
    if (!canvas || !ctx) return false;

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const { data, width, height } = imageData;
    const startX = Math.floor(x);
    const startY = Math.floor(y);
    const startIndex = (startY * width + startX) * 4;
    const targetColor = {
      r: data[startIndex],
      g: data[startIndex + 1],
      b: data[startIndex + 2],
      a: data[startIndex + 3],
    };
    const fillColor = hexToRgb(brushColor);

    if (colorsAreClose(data, startIndex, fillColor, 0)) return false;

    const pixelsToCheck = [[startX, startY]];
    const visitedPixels = new Uint8Array(width * height);

    while (pixelsToCheck.length > 0) {
      const [currentX, currentY] = pixelsToCheck.pop();
      if (currentX < 0 || currentX >= width || currentY < 0 || currentY >= height) continue;

      const pixelPosition = currentY * width + currentX;
      if (visitedPixels[pixelPosition]) continue;
      visitedPixels[pixelPosition] = 1;

      const index = pixelPosition * 4;
      if (!colorsAreClose(data, index, targetColor)) continue;

      data[index] = fillColor.r;
      data[index + 1] = fillColor.g;
      data[index + 2] = fillColor.b;
      data[index + 3] = fillColor.a;

      pixelsToCheck.push(
        [currentX + 1, currentY],
        [currentX - 1, currentY],
        [currentX, currentY + 1],
        [currentX, currentY - 1],
        [currentX + 1, currentY + 1],
        [currentX - 1, currentY + 1],
        [currentX + 1, currentY - 1],
        [currentX - 1, currentY - 1]
      );
    }

    ctx.putImageData(imageData, 0, 0);
    return true;
  };

  const restoreShapeBase = () => {
    const canvas = canvasRef.current;
    const ctx = contextRef.current;
    if (!canvas || !ctx || !shapeBaseRef.current) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.putImageData(shapeBaseRef.current, 0, 0);
  };

  const handlePointerDown = (event) => {
    if (!isBoardReady) return;

    if (toolMode === "text") {
      const { x, y } = getCanvasCoordinates(event);
      if (drawText(textValue, x, y)) {
        emitBoardUpdate();
      }
      return;
    }

    if (toolMode === "shape") {
      const canvas = canvasRef.current;
      const ctx = contextRef.current;
      if (!canvas || !ctx) return;

      shapeStartRef.current = getCanvasCoordinates(event);
      shapeBaseRef.current = ctx.getImageData(0, 0, canvas.width, canvas.height);
      isDrawingRef.current = true;
      return;
    }

    if (toolMode === "image" && pendingImage) {
      const point = getCanvasCoordinates(event);
      const isInsideImage =
        point.x >= pendingImage.x &&
        point.x <= pendingImage.x + pendingImage.width &&
        point.y >= pendingImage.y &&
        point.y <= pendingImage.y + pendingImage.height;

      if (isInsideImage) {
        imageDragOffsetRef.current = {
          x: point.x - pendingImage.x,
          y: point.y - pendingImage.y,
        };
        isDrawingRef.current = true;
      }
      return;
    }

    if (toolMode === "fill") {
      const { x, y } = getCanvasCoordinates(event);
      if (fillArea(x, y)) {
        emitBoardUpdate();
      }
      return;
    }

    if (!isDrawingEnabled) return;
    const ctx = contextRef.current;
    if (!ctx) return;

    const { x, y } = getCanvasCoordinates(event);
    isDrawingRef.current = true;
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const handlePointerMove = (event) => {
    if (toolMode === "shape" && isBoardReady && isDrawingRef.current) {
      restoreShapeBase();
      drawShape(shapeStartRef.current, getShapeEndCoordinates(event));
      return;
    }

    if (toolMode === "image" && pendingImageRef.current?.placement && isDrawingRef.current) {
      const point = getCanvasCoordinates(event);
      const offset = imageDragOffsetRef.current || { x: 0, y: 0 };
      const currentPlacement = pendingImageRef.current.placement;
      const nextPlacement = clampImagePlacement({
        ...currentPlacement,
        x: point.x - offset.x,
        y: point.y - offset.y,
      });

      updatePendingImage(nextPlacement);
      return;
    }

    if (toolMode !== "draw" || !isDrawingEnabled || !isBoardReady || !isDrawingRef.current) return;
    const ctx = contextRef.current;
    if (!ctx) return;

    const { x, y } = getCanvasCoordinates(event);
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const handlePointerUp = (event) => {
    if (toolMode === "shape" && isBoardReady && isDrawingRef.current) {
      restoreShapeBase();
      drawShape(shapeStartRef.current, getShapeEndCoordinates(event));
      shapeStartRef.current = null;
      shapeBaseRef.current = null;
      isDrawingRef.current = false;
      emitBoardUpdate();
      return;
    }

    if (toolMode === "image" && pendingImage && isDrawingRef.current) {
      imageDragOffsetRef.current = null;
      isDrawingRef.current = false;
      return;
    }

    if (toolMode !== "draw" || !isDrawingEnabled || !isBoardReady || !isDrawingRef.current) return;
    const ctx = contextRef.current;
    if (!ctx) return;

    ctx.closePath();
    isDrawingRef.current = false;
    emitBoardUpdate();
  };

  const handleClear = () => {
    if (!isBoardReady) return;

    const canvas = canvasRef.current;
    const ctx = contextRef.current;
    if (!canvas || !ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    emitBoardUpdate();
  };

  const handleDownloadBoard = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const downloadLink = document.createElement("a");
    downloadLink.href = canvas.toDataURL("image/png");
    downloadLink.download = `${room || "whiteboard"}-whiteboard.png`;
    downloadLink.click();
  };

  const handleImageUpload = (event) => {
    const file = event.target.files?.[0];
    insertImageFile(file);
    event.target.value = "";
  };

  const handleImageScaleChange = (event) => {
    const requestedScale = Number(event.target.value);
    const currentPlacement = pendingImageRef.current?.placement;
    if (!currentPlacement) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const nextScale = Math.min(requestedScale, getMaxImageScale(currentPlacement));
    const centerX = currentPlacement.x + currentPlacement.width / 2;
    const centerY = currentPlacement.y + currentPlacement.height / 2;
    const width = currentPlacement.baseWidth * (nextScale / 100);
    const height = currentPlacement.baseHeight * (nextScale / 100);
    const nextPlacement = clampImagePlacement({
      ...currentPlacement,
      x: centerX - width / 2,
      y: centerY - height / 2,
      width,
      height,
    });

    setImageScale(nextScale);
    updatePendingImage(nextPlacement);
  };

  const handleApplyImage = () => {
    const placement = pendingImageRef.current?.placement;
    if (!placement) return;

    restoreImageBase();
    const ctx = contextRef.current;
    const image = pendingImageRef.current?.image;
    if (!ctx || !image) return;

    ctx.drawImage(image, placement.x, placement.y, placement.width, placement.height);
    clearPendingImage(false);
    emitBoardUpdate();
  };

  const handleCanvasDragOver = (event) => {
    if (!isBoardReady) return;

    const hasImage = Array.from(event.dataTransfer?.items || []).some((item) =>
      item.type.startsWith("image/")
    );

    if (hasImage) {
      event.preventDefault();
    }
  };

  const handleCanvasDrop = (event) => {
    if (!isBoardReady) return;

    const file = Array.from(event.dataTransfer?.files || []).find((item) =>
      item.type.startsWith("image/")
    );

    if (!file) return;

    event.preventDefault();
    insertImageFile(file, getCanvasCoordinates(event));
  };

  const canShowColorControl = ["draw", "text", "shape", "fill"].includes(toolMode);
  const canShowBrushControl = ["draw", "shape"].includes(toolMode);

  return (
    <div className="whiteboard-layout">
      <div className="whiteboard-toolbar">
        <div className="whiteboard-toolbar-row whiteboard-toolbar-row-primary">
          <div className="whiteboard-toolbar-group">
            <button
              type="button"
              onClick={() => setToolMode("draw")}
              disabled={!isBoardReady}
              className={toolMode === "draw" ? "is-active" : ""}
            >
              Draw
            </button>
            <button
              type="button"
              onClick={() => setToolMode("text")}
              disabled={!isBoardReady}
              className={toolMode === "text" ? "is-active" : ""}
            >
              Text
            </button>
            <button
              type="button"
              onClick={() => setToolMode("shape")}
              disabled={!isBoardReady}
              className={toolMode === "shape" ? "is-active" : ""}
            >
              Shape
            </button>
            <button
              type="button"
              onClick={() => setToolMode("fill")}
              disabled={!isBoardReady}
              className={toolMode === "fill" ? "is-active" : ""}
            >
              Fill
            </button>
          </div>
          <div className="whiteboard-toolbar-group whiteboard-toolbar-actions">
            <button type="button" onClick={handleClear} disabled={!isBoardReady}>
              Clear board
            </button>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={!isBoardReady}
            >
              Insert image
            </button>
            <button type="button" onClick={handleDownloadBoard} disabled={!isBoardReady}>
              Download
            </button>
          </div>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="whiteboard-file-input"
        />
        <div className="whiteboard-toolbar-row whiteboard-toolbar-row-options">
          {pendingImage && (
            <div className="whiteboard-toolbar-group">
              <label>
                Image scale
                <input
                  type="range"
                  min="10"
                  max={getMaxImageScale(pendingImage)}
                  value={imageScale}
                  onChange={handleImageScaleChange}
                />
                <span>{imageScale}%</span>
              </label>
              <button type="button" onClick={handleApplyImage}>
                Apply image
              </button>
              <button type="button" onClick={() => clearPendingImage(true)}>
                Cancel image
              </button>
            </div>
          )}
          {canShowColorControl && (
            <div className="whiteboard-toolbar-group">
              <label>
                Color
                <input
                  type="color"
                  value={brushColor}
                  onChange={(event) => setBrushColor(event.target.value)}
                />
              </label>
              {canShowBrushControl && (
                <label>
                  Brush
                  <input
                    type="range"
                    min="1"
                    max="40"
                    value={brushWidth}
                    onChange={(event) => setBrushWidth(Number(event.target.value))}
                  />
                  <span>{brushWidth}px</span>
                </label>
              )}
              {toolMode === "draw" && (
                <button
                  type="button"
                  onClick={() => setIsDrawingEnabled((enabled) => !enabled)}
                  disabled={!isBoardReady}
                >
                  {isDrawingEnabled ? "Disable drawing" : "Enable drawing"}
                </button>
              )}
            </div>
          )}
          {toolMode === "shape" && (
            <div className="whiteboard-toolbar-group">
              <label>
                Shape
                <select
                  value={shapeType}
                  onChange={(event) => setShapeType(event.target.value)}
                  disabled={!isBoardReady}
                  className="whiteboard-select-input"
                >
                  <option value="rectangle">Rectangle</option>
                  <option value="ellipse">Ellipse</option>
                  <option value="triangle">Triangle</option>
                  <option value="arrow">Arrow</option>
                  <option value="heart">Heart</option>
                  <option value="line">Line</option>
                </select>
              </label>
            </div>
          )}
          {toolMode === "text" && (
            <div className="whiteboard-toolbar-group">
              <label>
                Text
                <input
                  type="text"
                  value={textValue}
                  onChange={(event) => setTextValue(event.target.value)}
                  placeholder="Type text, then click board"
                  disabled={!isBoardReady}
                  className="whiteboard-text-input"
                />
              </label>
              <label>
                Size
                <input
                  type="number"
                  min="0"
                  max="256"
                  value={fontSize}
                  onChange={(event) => setFontSize(Number(event.target.value) || 24)}
                  disabled={!isBoardReady}
                  className="whiteboard-number-input"
                />
              </label>
            </div>
          )}
        </div>
      </div>
      <canvas
        ref={canvasRef}
        className={`whiteboard-canvas-wrapper whiteboard-canvas-${toolMode}`}
        onMouseDown={handlePointerDown}
        onMouseMove={handlePointerMove}
        onMouseUp={handlePointerUp}
        onMouseLeave={handlePointerUp}
        onDragOver={handleCanvasDragOver}
        onDrop={handleCanvasDrop}
      />
    </div>
  );
}
