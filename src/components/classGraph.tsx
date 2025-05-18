"use client"
import { useState, useEffect, useRef } from 'react';
import * as THREE from 'three';

// Type definition for Student
type Student = {
  id: string;
  name: string;
  age: number;
  grades: string;
  gender: string;
  friends: string;
  disrespectfull: string;
};


export default function ClassGraph({ students }: { students: Student[] }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<any>(null);
  const [hoveredStudent, setHoveredStudent] = useState<Student | null>(null);
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted || !containerRef.current) return;

    // Initialize Three.js scene
    const container = containerRef.current;
    const width = container.clientWidth;
    const height = 500;

    // Create scene, camera, and renderer
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf0f0f0);

    const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 1000);
    camera.position.z = 400;

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);

    // Clear container if there's any previous render
    while (container.firstChild) {
      container.removeChild(container.firstChild);
    }
    container.appendChild(renderer.domElement);

    // Add ambient light
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    // Add directional light
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(0, 20, 10);
    scene.add(directionalLight);

    // Process students data for 3D
    const { nodes, links } = processStudentData3D(students);

    // Create spheres for students
    const sphereGeometry = new THREE.SphereGeometry(15, 32, 32);
    const studentMeshes: { [key: string]: THREE.Mesh } = {};

    nodes.forEach((node, index) => {
      const sphereMaterial = new THREE.MeshPhongMaterial({ color: 0x6495ED });
      const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
      sphere.position.set(node.x, node.y, node.z);
      sphere.userData = { name: node.name, index: index + 1 };
      scene.add(sphere);
      studentMeshes[node.name] = sphere;

      // Add text labels (numbers)
      const textCanvas = document.createElement('canvas');
      const context = textCanvas.getContext('2d');
      textCanvas.width = 64;
      textCanvas.height = 64;

      if (context) {
        context.fillStyle = 'white';
        context.font = '48px Arial';
        context.textAlign = 'center';
        context.textBaseline = 'middle';
        context.fillText(`${index + 1}`, 32, 32);

        const textTexture = new THREE.CanvasTexture(textCanvas);
        const textMaterial = new THREE.SpriteMaterial({ map: textTexture });
        const textSprite = new THREE.Sprite(textMaterial);
        textSprite.scale.set(20, 20, 1);
        textSprite.position.set(node.x, node.y, node.z);
        scene.add(textSprite);
      }
    });

    // Create lines for connections
    links.forEach((link: any) => {
      const points = [
        new THREE.Vector3(link.source.x, link.source.y, link.source.z),
        new THREE.Vector3(link.target.x, link.target.y, link.target.z)
      ];

      const lineGeometry = new THREE.BufferGeometry().setFromPoints(points);
      const lineMaterial = new THREE.LineBasicMaterial({
        color: link.type === 'friend' ? 0x0066cc : 0xcc0000,
        linewidth: 2
      });

      const line = new THREE.Line(lineGeometry, lineMaterial);
      scene.add(line);
    });

    // Add legend
    const createLegendLine = (x: any, y: any, color: any, text: any) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (ctx) {
        canvas.width = 120;
        canvas.height = 30;
        ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
        ctx.fillRect(0, 0, 120, 30);
        ctx.strokeStyle = color;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(5, 15);
        ctx.lineTo(35, 15);
        ctx.stroke();
        ctx.fillStyle = '#000';
        ctx.font = '12px Arial';
        ctx.fillText(text, 40, 18);
      }

      const texture = new THREE.CanvasTexture(canvas);
      const material = new THREE.SpriteMaterial({ map: texture });
      const sprite = new THREE.Sprite(material);
      sprite.position.set(x, y, 0);
      sprite.scale.set(120, 30, 1);
      return sprite;
    };

    const legendContainer = new THREE.Object3D();
    legendContainer.position.set(-width / 2 + 100, height / 2 - 50, -200);
    scene.add(legendContainer);

    const friendLegend = createLegendLine(0, 0, '#0066cc', 'Friend');
    const disrespectLegend = createLegendLine(0, -40, '#cc0000', 'Disrespectful');
    legendContainer.add(friendLegend);
    legendContainer.add(disrespectLegend);

    // Raycaster for mouse interaction
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const onMouseMove = (event: MouseEvent) => {
      // Calculate mouse position in normalized device coordinates
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      // Update the picking ray with the camera and mouse position
      raycaster.setFromCamera(mouse, camera);

      // Calculate objects intersecting the picking ray
      const intersects = raycaster.intersectObjects(Object.values(studentMeshes));

      if (intersects.length > 0) {
        const intersectedObject = intersects[0].object as THREE.Mesh;
        if (intersectedObject.userData?.name) {
          const matched = students.find(s => s.name === intersectedObject.userData.name);
          if (matched) {
            setHoveredStudent(matched);
          }
        }

      } else {
        setHoveredStudent(null);
      }
    };

    // Auto-rotation
    let autoRotate = true;
    const toggleRotation = () => {
      autoRotate = !autoRotate;
    };

    // Mouse controls for rotation
    let isDragging = false;
    let previousMousePosition = { x: 0, y: 0 };

    const onMouseDown = (event: MouseEvent) => {
      isDragging = true;
      previousMousePosition = {
        x: event.clientX,
        y: event.clientY
      };
    };

    const onMouseUp = () => {
      isDragging = false;
    };

    const onDrag = (event: MouseEvent) => {
      if (isDragging) {
        autoRotate = false;
        const deltaMove = {
          x: event.clientX - previousMousePosition.x,
          y: event.clientY - previousMousePosition.y
        };

        const rotationSpeed = 0.01;
        const nodeContainer = new THREE.Group();
        scene.rotation.y += deltaMove.x * rotationSpeed;
        scene.rotation.x += deltaMove.y * rotationSpeed;

        previousMousePosition = {
          x: event.clientX,
          y: event.clientY
        };
      }
    };

    // Wheel event for zoom
    const onWheel = (event: WheelEvent) => {
      event.preventDefault();
      camera.position.z += event.deltaY * 0.1;
      // Limit zoom
      camera.position.z = Math.max(100, Math.min(camera.position.z, 600));
    };

    // Add event listeners
    renderer.domElement.addEventListener('mousemove', onMouseMove);
    renderer.domElement.addEventListener('mousedown', onMouseDown);
    renderer.domElement.addEventListener('mouseup', onMouseUp);
    renderer.domElement.addEventListener('mousemove', onDrag);
    renderer.domElement.addEventListener('wheel', onWheel);
    renderer.domElement.addEventListener('dblclick', toggleRotation);

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);

      // Auto-rotate the scene if enabled
      if (autoRotate) {
        scene.rotation.y += 0.003;
      }

      renderer.render(scene, camera);
    };

    animate();

    // Save scene reference for cleanup
    sceneRef.current = {
      container,
      renderer,
      cleanup: () => {
        renderer.domElement.removeEventListener('mousemove', onMouseMove);
        renderer.domElement.removeEventListener('mousedown', onMouseDown);
        renderer.domElement.removeEventListener('mouseup', onMouseUp);
        renderer.domElement.removeEventListener('mousemove', onDrag);
        renderer.domElement.removeEventListener('wheel', onWheel);
        renderer.domElement.removeEventListener('dblclick', toggleRotation);
      }
    };

    // Handle window resize
    const handleResize = () => {
      if (!containerRef.current) return;
      const newWidth = containerRef.current.clientWidth;
      camera.aspect = newWidth / height;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, height);
    };

    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      if (sceneRef.current) {
        sceneRef.current.cleanup();
        while (sceneRef.current.container.firstChild) {
          sceneRef.current.container.removeChild(sceneRef.current.container.firstChild);
        }
      }
    };
  }, [students, mounted]);

  return (
    <div className="flex flex-col items-center w-full">
      <div className="text-lg font-bold mb-4">3D Student Relationship Graph</div>

      <div className="relative w-full h-[500px] sm:h-[600px] md:h-[700px] bg-gray-100 rounded-lg shadow-md p-4">
        <div
          ref={containerRef}
          className="w-full h-full relative"
        ></div>

        {hoveredStudent && (
          <div className="absolute top-2 left-2 bg-white p-3 rounded-lg shadow-lg text-sm space-y-1 z-10 w-60">
            <p><span className="font-semibold">Name:</span> {hoveredStudent.name}</p>
            <p><span className="font-semibold">Age:</span> {hoveredStudent.age}</p>
            <p><span className="font-semibold">Gender:</span> {hoveredStudent.gender}</p>
            <p><span className="font-semibold">Grades:</span> {hoveredStudent.grades}</p>
          </div>
        )}
      </div>

      <div className="mt-4 text-gray-600 text-sm space-y-1">
        <p>Blue lines represent friendships, red lines represent disrespectful relationships.</p>
        <p>Hover over a sphere to see the student's name.</p>
        <p>Drag to rotate manually. Mouse wheel to zoom in/out.</p>
        <p>Double-click to toggle auto-rotation.</p>
      </div>
    </div>
  );
}

// Function to process student data into 3D nodes and links
function processStudentData3D(students: Student[]) {
  // Create a map for quick lookup by name
  const studentMap = new Map();
  students.forEach(student => {
    studentMap.set(student.name, student);
  });

  // Calculate node positions in a 3D spherical layout
  const nodes = students.map((student, index) => {
    // Use spherical coordinates for 3D positioning
    const phi = Math.acos(-1 + (2 * index) / students.length);
    const theta = Math.sqrt(students.length * Math.PI) * phi;
    const radius = 200;

    return {
      ...student,
      x: radius * Math.sin(phi) * Math.cos(theta),
      y: radius * Math.sin(phi) * Math.sin(theta),
      z: radius * Math.cos(phi)
    };
  });

  // Process links
  const links = [] as any;

  // Add friendship links
  nodes.forEach(source => {
    const friendNames = (source.friends || "").split(',').map(name => name.trim()).filter(Boolean);
    friendNames.forEach(friendName => {
      const target = nodes.find(node => node.name === friendName.trim());
      if (target) {
        links.push({
          source,
          target,
          type: 'friend'
        });
      }
    });
  });

  // Add disrespectful links
  nodes.forEach(source => {
    const disrespectfulNames = (source.disrespectfull || "").split(',').map(name => name.trim()).filter(Boolean);
    disrespectfulNames.forEach(disrespectfulName => {
      const target = nodes.find(node => node.name === disrespectfulName.trim());
      if (target) {
        links.push({
          source,
          target,
          type: 'disrespectful'
        });
      }
    });
  });

  return { nodes, links };
}