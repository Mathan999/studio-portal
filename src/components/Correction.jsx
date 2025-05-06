import React, { useState, useRef, useEffect } from 'react';
import { ref, set, push, onValue } from 'firebase/database';
import { database } from '../services/firebaseService'; // Import from your Firebase service

const Correction = ({ imageData }) => {
  const [version] = useState(1);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [activeToolIndex, setActiveToolIndex] = useState(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [drawingMode, setDrawingMode] = useState(null);
  const [drawings, setDrawings] = useState([]);
  const [currentShape, setCurrentShape] = useState(null);
  const [, setStartPoint] = useState({ x: 0, y: 0 });
  const [drawingColor, setDrawingColor] = useState("red");
  const [lineWidth, setLineWidth] = useState(3);
  const [user, setUser] = useState(null);
  const [userName, setUserName] = useState("");
  const [showLoginModal, setShowLoginModal] = useState(true);
  const [imageSize, setImageSize] = useState({ width: 0, height: 0 });
  const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 });
  
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const imageRef = useRef(null);
  
  // Tools array with icons and types
  const tools = [
    { icon: "M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z", type: "pencil" },
    { icon: "M21 12a9 9 0 11-18 0 9 9 0 0118 0z", type: "circle" },
    { icon: "M4 4h16v16H4z", type: "square" },
    { icon: "M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16", type: "eraser" },
    { icon: "M4 6h16M4 12h16M4 18h16", type: "text" },
    { icon: "M3 21v-4m0 0V5a2 2 0 012-2h6.5L21 11.5V19a2 2 0 01-2 2h-8a2 2 0 01-2-2z", type: "note" }
  ];

  // Load comments from Firebase
  useEffect(() => {
    const commentsRef = ref(database, `corrections/${imageData?.id}/comments`);
    const unsubscribe = onValue(commentsRef, (snapshot) => {
      const data = snapshot.val();
      const loadedComments = [];
      if (data) {
        Object.keys(data).forEach(key => {
          loadedComments.push({
            id: key,
            ...data[key]
          });
        });
        setComments(loadedComments);
      }
    });

    // Check for logged in user in localStorage
    const savedUser = localStorage.getItem('proofingUser');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
      setShowLoginModal(false);
    }

    return () => unsubscribe();
  }, [imageData]);

  // Adjust canvas and container sizes when image loads
  const handleImageLoad = () => {
    if (imageRef.current && containerRef.current) {
      const containerWidth = containerRef.current.offsetWidth;
      const containerHeight = containerRef.current.offsetHeight;
      const imgNaturalWidth = imageRef.current.naturalWidth;
      const imgNaturalHeight = imageRef.current.naturalHeight;
      
      // Calculate aspect ratios
      const containerRatio = containerWidth / containerHeight;
      const imageRatio = imgNaturalWidth / imgNaturalHeight;
      
      let newWidth, newHeight;
      
      // Determine how to fit the image
      if (imageRatio > containerRatio) {
        // Image is wider than container (relative to height)
        newWidth = containerWidth;
        newHeight = containerWidth / imageRatio;
      } else {
        // Image is taller than container (relative to width)
        newHeight = containerHeight;
        newWidth = containerHeight * imageRatio;
      }
      
      setImageSize({ width: newWidth, height: newHeight });
      setCanvasSize({ width: newWidth, height: newHeight });
      
      // Setup canvas
      adjustCanvas(newWidth, newHeight);
    }
  };
  
  // Adjust canvas size and position
  const adjustCanvas = (width, height) => {
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      canvas.width = width;
      canvas.height = height;
      redrawCanvas();
    }
  };

  // Setup canvas and draw all saved shapes
  useEffect(() => {
    if (containerRef.current) {
      // Initial setup with container dimensions
      const containerWidth = containerRef.current.offsetWidth;
      const containerHeight = containerRef.current.offsetHeight;
      
      setCanvasSize({ 
        width: containerWidth,
        height: containerHeight 
      });
      
      if (canvasRef.current) {
        canvasRef.current.width = containerWidth;
        canvasRef.current.height = containerHeight;
        redrawCanvas();
      }
    }
  }, [drawings, drawingMode]);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      if (imageRef.current && containerRef.current) {
        handleImageLoad();
      }
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [drawings]);

  // Redraw all saved shapes
  const redrawCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw all saved drawings (filter out erased areas)
    drawings.forEach(drawing => {
      if (drawing.type === 'pencil' && !drawing.erased) {
        drawPencilPath(ctx, drawing.points, drawing.color, drawing.width);
      } else if (drawing.type === 'circle' && !drawing.erased) {
        drawCircle(ctx, drawing.start, drawing.end, drawing.color, drawing.width);
      } else if (drawing.type === 'square' && !drawing.erased) {
        drawSquare(ctx, drawing.start, drawing.end, drawing.color, drawing.width);
      }
      // Eraser paths are represented by setting "erased" flag on existing shapes
    });
    
    // Draw the current shape being created
    if (currentShape && isDrawing) {
      if (currentShape.type === 'circle') {
        drawCircle(ctx, currentShape.start, currentShape.current, drawingColor, lineWidth);
      } else if (currentShape.type === 'square') {
        drawSquare(ctx, currentShape.start, currentShape.current, drawingColor, lineWidth);
      }
    }
  };

  // Draw a pencil path
  const drawPencilPath = (ctx, points, color, width) => {
    if (points.length < 2) return;
    
    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    ctx.strokeStyle = color;
    ctx.lineWidth = width;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    
    for (let i = 1; i < points.length; i++) {
      ctx.lineTo(points[i].x, points[i].y);
    }
    
    ctx.stroke();
  };

  // Draw a circle
  const drawCircle = (ctx, start, end, color, width) => {
    const radius = Math.sqrt(
      Math.pow(end.x - start.x, 2) + Math.pow(end.y - start.y, 2)
    );
    
    ctx.beginPath();
    ctx.arc(start.x, start.y, radius, 0, 2 * Math.PI);
    ctx.strokeStyle = color;
    ctx.lineWidth = width;
    ctx.stroke();
  };

  // Draw a square/rectangle
  const drawSquare = (ctx, start, end, color, width) => {
    const width_ = end.x - start.x;
    const height = end.y - start.y;
    
    ctx.beginPath();
    ctx.rect(start.x, start.y, width_, height);
    ctx.strokeStyle = color;
    ctx.lineWidth = width;
    ctx.stroke();
  };

  // Check if a point is within a drawing
  const isPointInShape = (x, y, shape) => {
    const tolerance = 15; // Tolerance radius for erasing
    
    if (shape.type === 'pencil') {
      // Check if the point is close to any line segment in the pencil path
      for (let i = 1; i < shape.points.length; i++) {
        const p1 = shape.points[i-1];
        const p2 = shape.points[i];
        
        // Calculate distance from point to line segment
        const d = distanceToSegment({x, y}, p1, p2);
        if (d < tolerance) return true;
      }
    } else if (shape.type === 'circle') {
      // Calculate distance from center to the point
      const radius = Math.sqrt(
        Math.pow(shape.end.x - shape.start.x, 2) + Math.pow(shape.end.y - shape.start.y, 2)
      );
      const dist = Math.sqrt(
        Math.pow(x - shape.start.x, 2) + Math.pow(y - shape.start.y, 2)
      );
      
      // Check if point is near the circle's perimeter
      return Math.abs(dist - radius) < tolerance;
    } else if (shape.type === 'square') {
      // Check if point is near the rectangle's edges
      const left = Math.min(shape.start.x, shape.end.x);
      const right = Math.max(shape.start.x, shape.end.x);
      const top = Math.min(shape.start.y, shape.end.y);
      const bottom = Math.max(shape.start.y, shape.end.y);
      
      // Check if the point is near any of the four edges
      if (Math.abs(x - left) < tolerance && y >= top && y <= bottom) return true;
      if (Math.abs(x - right) < tolerance && y >= top && y <= bottom) return true;
      if (Math.abs(y - top) < tolerance && x >= left && x <= right) return true;
      if (Math.abs(y - bottom) < tolerance && x >= left && x <= right) return true;
    }
    
    return false;
  };
  
  // Helper function to calculate distance from point to line segment
  const distanceToSegment = (p, v, w) => {
    const l2 = Math.pow(w.x - v.x, 2) + Math.pow(w.y - v.y, 2);
    if (l2 === 0) return Math.sqrt(Math.pow(p.x - v.x, 2) + Math.pow(p.y - v.y, 2));
    
    let t = ((p.x - v.x) * (w.x - v.x) + (p.y - v.y) * (w.y - v.y)) / l2;
    t = Math.max(0, Math.min(1, t));
    
    const projX = v.x + t * (w.x - v.x);
    const projY = v.y + t * (w.y - v.y);
    
    return Math.sqrt(Math.pow(p.x - projX, 2) + Math.pow(p.y - projY, 2));
  };

  // Erase at position
  const eraseAtPosition = (x, y) => {
    // Mark drawings at this position as erased instead of removing them
    setDrawings(prev => {
      return prev.map(drawing => {
        if (isPointInShape(x, y, drawing)) {
          return { ...drawing, erased: true };
        }
        return drawing;
      });
    });
    
    redrawCanvas();
  };

  // Handle mouse events for drawing
  const handleMouseDown = (e) => {
    if (!drawingMode) return;
    
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    setIsDrawing(true);
    setStartPoint({ x, y });
    
    if (drawingMode === 'pencil') {
      setCurrentShape({
        type: 'pencil',
        points: [{ x, y }],
        color: drawingColor,
        width: lineWidth,
        erased: false
      });
    } else if (drawingMode === 'circle') {
      setCurrentShape({
        type: 'circle',
        start: { x, y },
        current: { x, y },
        color: drawingColor,
        width: lineWidth,
        erased: false
      });
    } else if (drawingMode === 'square') {
      setCurrentShape({
        type: 'square',
        start: { x, y },
        current: { x, y },
        color: drawingColor,
        width: lineWidth,
        erased: false
      });
    } else if (drawingMode === 'eraser') {
      eraseAtPosition(x, y);
    }
  };

  const handleMouseMove = (e) => {
    if (!isDrawing || !drawingMode) return;
    
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    if (drawingMode === 'pencil') {
      setCurrentShape(prev => {
        if (!prev) return null;
        
        const updatedShape = {
          ...prev,
          points: [...prev.points, { x, y }]
        };
        
        // Draw the current path
        const ctx = canvasRef.current.getContext('2d');
        const lastTwo = updatedShape.points.slice(-2);
        if (lastTwo.length === 2) {
          ctx.beginPath();
          ctx.moveTo(lastTwo[0].x, lastTwo[0].y);
          ctx.lineTo(lastTwo[1].x, lastTwo[1].y);
          ctx.strokeStyle = drawingColor;
          ctx.lineWidth = lineWidth;
          ctx.lineCap = 'round';
          ctx.lineJoin = 'round';
          ctx.stroke();
        }
        
        return updatedShape;
      });
    } else if (drawingMode === 'circle' || drawingMode === 'square') {
      setCurrentShape(prev => {
        if (!prev) return null;
        return {
          ...prev,
          current: { x, y }
        };
      });
      
      // Redraw canvas to show shape preview
      redrawCanvas();
    } else if (drawingMode === 'eraser') {
      eraseAtPosition(x, y);
    }
  };

  const handleMouseUp = () => {
    if (isDrawing && drawingMode) {
      setIsDrawing(false);
      
      if (currentShape) {
        if (drawingMode === 'pencil' && currentShape.points.length > 1) {
          setDrawings(prev => [...prev, currentShape]);
        } else if ((drawingMode === 'circle' || drawingMode === 'square') && 
                   (currentShape.start.x !== currentShape.current.x || 
                    currentShape.start.y !== currentShape.current.y)) {
          setDrawings(prev => [...prev, {
            ...currentShape,
            end: currentShape.current
          }]);
        }
      }
      
      setCurrentShape(null);
    }
  };

  const handleToolClick = (index, type) => {
    setActiveToolIndex(index);
    setDrawingMode(type);
    
    // Canvas specific setup for different tools
    if (canvasRef.current) {
      if (type === 'eraser') {
        canvasRef.current.style.cursor = 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'20\' height=\'20\' viewBox=\'0 0 20 20\'%3E%3Ccircle cx=\'10\' cy=\'10\' r=\'9\' fill=\'%23FFFFFF\' stroke=\'%23000000\' stroke-width=\'1\'/%3E%3C/svg%3E") 10 10, auto';
      } else {
        canvasRef.current.style.cursor = 'crosshair';
      }
    }
  };

  // Clear all drawings
  const clearCanvas = () => {
    setDrawings([]);
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d');
      ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    }
  };

  // Handle login
  const handleLogin = () => {
    if (!userName.trim()) {
      alert("Please enter your name!");
      return;
    }
    
    const userObj = {
      name: userName,
      avatar: userName.charAt(0).toUpperCase(),
      color: getRandomColor()
    };
    
    // Save user to localStorage
    localStorage.setItem('proofingUser', JSON.stringify(userObj));
    setUser(userObj);
    
    // Add user to Firebase if needed
    const usersRef = ref(database, 'users/' + userName.replace(/\s+/g, '_').toLowerCase());
    set(usersRef, {
      name: userName,
      timestamp: new Date().toISOString()
    });

    setShowLoginModal(false);
  };

  // Add a new comment
  const addComment = () => {
    if (!newComment.trim() || !user) return;

    const commentData = {
      author: user.name,
      avatar: user.avatar,
      text: newComment,
      status: "Pending",
      timestamp: new Date().toISOString(),
      color: user.color
    };

    // Add to Firebase
    const commentsRef = ref(database, `corrections/${imageData?.id}/comments`);
    push(commentsRef, commentData);

    setNewComment("");
  };

  // Helper function to get a random color
  const getRandomColor = () => {
    const colors = ['blue', 'green', 'purple', 'orange', 'pink'];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  // Format timestamp for display
  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffDays > 0) {
      return diffDays === 1 ? 'Yesterday' : `${diffDays} days ago`;
    } else if (diffHours > 0) {
      return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    } else if (diffMins > 0) {
      return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
    } else {
      return 'Just now';
    }
  };

  return (
    <div className="flex flex-col h-screen bg-white">
      {/* Login Modal */}
      {showLoginModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-2xl font-bold mb-4">Login</h2>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Enter your name</label>
              <input
                type="text"
                className="w-full border border-gray-300 rounded p-2"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                placeholder="Your Name"
              />
            </div>
            <button
              className="w-full bg-blue-500 text-white rounded-md py-2 hover:bg-blue-600"
              onClick={handleLogin}
            >
              Continue
            </button>
          </div>
        </div>
      )}

      {/* Top navigation bar */}
      <div className="flex justify-between items-center p-4 border-b border-gray-200 bg-white">
        <div className="text-xl font-semibold text-gray-800">Proofing</div>
        <div className="flex items-center gap-2">
          {user && (
            <div className="flex items-center gap-2 mr-4">
              <div className={`w-8 h-8 rounded-full bg-${user.color}-500 flex items-center justify-center text-white font-bold`}>
                {user.avatar}
              </div>
              <span className="font-medium">{user.name}</span>
            </div>
          )}
          <button className="border border-gray-300 rounded-md px-4 py-2 text-gray-700 hover:bg-gray-100">Approve</button>
          <button className="bg-blue-500 text-white rounded-md px-4 py-2 hover:bg-blue-600">Request Changes</button>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex justify-between items-center p-2 border-b border-gray-200 bg-white">
        <div className="flex gap-4">
          <div className="border-r border-gray-200 pr-4 flex gap-4">
            {tools.map((tool, index) => (
              <button 
                key={index}
                className={`p-2 ${activeToolIndex === index ? 'text-blue-600 bg-blue-50 rounded' : 'text-gray-600 hover:text-gray-800'}`}
                onClick={() => handleToolClick(index, tool.type)}
                title={tool.type.charAt(0).toUpperCase() + tool.type.slice(1)}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={tool.icon}></path>
                </svg>
              </button>
            ))}
          </div>
          <div className="flex gap-4">
            <button className="p-2 text-gray-600 hover:text-gray-800" onClick={clearCanvas} title="Clear canvas">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
            <button className="p-2 text-gray-600 hover:text-gray-800" title="Search">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
              </svg>
            </button>
          </div>
        </div>
        <div className="flex gap-4 items-center">
          {/* Color picker */}
          <div className="flex gap-2 items-center">
            <div 
              className="w-6 h-6 rounded-full border border-gray-300 cursor-pointer" 
              style={{ backgroundColor: 'red' }}
              onClick={() => setDrawingColor('red')}
              title="Red"
            />
            <div 
              className="w-6 h-6 rounded-full border border-gray-300 cursor-pointer" 
              style={{ backgroundColor: 'blue' }}
              onClick={() => setDrawingColor('blue')}
              title="Blue"
            />
            <div 
              className="w-6 h-6 rounded-full border border-gray-300 cursor-pointer" 
              style={{ backgroundColor: 'green' }}
              onClick={() => setDrawingColor('green')}
              title="Green"
            />
            <div 
              className="w-6 h-6 rounded-full border border-gray-300 cursor-pointer" 
              style={{ backgroundColor: 'black' }}
              onClick={() => setDrawingColor('black')}
              title="Black"
            />
          </div>

          {/* Line width selector */}
          <select 
            className="border border-gray-300 rounded p-1 text-sm"
            value={lineWidth}
            onChange={(e) => setLineWidth(parseInt(e.target.value))}
            title="Line width"
          >
            <option value="1">Thin</option>
            <option value="3">Medium</option>
            <option value="5">Thick</option>
          </select>

          <button className="p-2 bg-red-500 rounded-full text-white flex items-center justify-center hover:bg-red-600">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
            </svg>
          </button>
        </div>
        <div className="border border-gray-300 rounded-md px-4 py-2 bg-white">
          <div className="flex items-center gap-2 text-gray-700">
            <span>Version {version}</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
            </svg>
          </div>
        </div>
      </div>

      {/* Main content area */}
      <div className="flex flex-1 bg-gray-50">
        {/* Image preview with canvas overlay */}
        <div 
          ref={containerRef}
          className="flex-1 relative flex items-center justify-center"
          style={{ 
            overflow: 'hidden',
            backgroundColor: '#f3f4f6' // Light gray background
          }}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          <div className="relative" style={{ 
            maxWidth: '100%', 
            maxHeight: '100%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
          }}>
            {imageData && imageData.imageUrl ? (
              <img 
                ref={imageRef}
                src={imageData.imageUrl} 
                alt={imageData.title || "Image"} 
                className="max-w-full max-h-full object-contain"
                style={{ 
                  width: imageSize.width > 0 ? imageSize.width : 'auto',
                  height: imageSize.height > 0 ? imageSize.height : 'auto'
                }}
                onLoad={handleImageLoad}
              />
            ) : (
              <img 
                ref={imageRef}
                src="/api/placeholder/800/600" 
                alt="Preview image" 
                className="max-w-full max-h-full object-contain"
                style={{ 
                  width: imageSize.width > 0 ? imageSize.width : 'auto',
                  height: imageSize.height > 0 ? imageSize.height : 'auto'
                }}
                onLoad={handleImageLoad}
              />
            )}

            <canvas
              ref={canvasRef}
              className="absolute top-0 left-0"
              style={{ 
                width: canvasSize.width,
                height: canvasSize.height,
                pointerEvents: drawingMode ? 'auto' : 'none'
              }}
            />
          </div>
        </div>

        {/* Comments sidebar */}
        <div className="w-1/3 border-l border-gray-200 bg-white flex flex-col h-full">
          {/* Comments list */}
          <div className="flex-1 overflow-y-auto">
            {comments.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)).map((comment) => (
              <div key={comment.id} className="p-4 border-b border-gray-200">
                <div className="flex justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <div className={`w-8 h-8 rounded-full bg-${comment.color}-500 flex items-center justify-center text-white font-bold`}>
                      {comment.avatar}
                    </div>
                    <div className="font-semibold text-gray-800">{comment.author}</div>
                  </div>
                  <div className="text-gray-500 text-sm">{formatTimestamp(comment.timestamp)}</div>
                </div>
                <p className="mb-2 text-gray-700">
                  {comment.mentions?.map(mention => (
                    <span key={mention} className="text-blue-600">@{mention} </span>
                  ))}
                  {comment.text}
                </p>
                <div className="flex justify-end">
                <span className={`px-3 py-1 rounded-full text-sm ${
      comment.status === "Pending" 
        ? "bg-yellow-100 text-yellow-700" 
        : comment.status === "Resolved" 
          ? "bg-green-100 text-green-700" 
          : "bg-gray-100 text-gray-700"
    }`}>
      {comment.status}
    </span>
                </div>
              </div>
            ))}
            {comments.length === 0 && (
              <div className="flex flex-col items-center justify-center h-64 text-gray-500">
                <svg className="w-12 h-12 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"></path>
                </svg>
                <p>No comments yet</p>
              </div>
            )}
          </div>

          {/* Comment input */}
          <div className="p-4 border-t border-gray-200">
            <div className="flex gap-2 items-start">
              {user && (
                <div className={`w-8 h-8 rounded-full bg-${user.color}-500 flex-shrink-0 flex items-center justify-center text-white font-bold`}>
                  {user.avatar}
                </div>
              )}
              <div className="flex-1">
                <textarea
                  className="w-full border border-gray-300 rounded-md p-2 mb-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows="3"
                  placeholder="Add a comment..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                ></textarea>
                <div className="flex justify-between">
                  <div className="flex gap-2">
                    <button className="p-1 text-gray-500 hover:text-gray-700">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"></path>
                      </svg>
                    </button>
                    <button className="p-1 text-gray-500 hover:text-gray-700">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                      </svg>
                    </button>
                    <button className="p-1 text-gray-500 hover:text-gray-700">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path>
                      </svg>
                    </button>
                  </div>
                  <button
                    className="bg-blue-500 text-white px-4 py-1 rounded-md hover:bg-blue-600 disabled:opacity-50"
                    onClick={addComment}
                    disabled={!newComment.trim() || !user}
                  >
                    Comment
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Correction;