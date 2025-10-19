import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

export default function CompleteSolarSystemExplorer() {
  const mountRef = useRef(null);
  const [isPaused, setIsPaused] = useState(false);
  const [timeScale, setTimeScale] = useState(5);
  const [selectedBody, setSelectedBody] = useState('earth');
  const [showOrbits, setShowOrbits] = useState(true);
  const [showInfo, setShowInfo] = useState(true);
  const [showLabels, setShowLabels] = useState(true);
  const [cameraMode, setCameraMode] = useState('free');
  const [distanceScale, setDistanceScale] = useState(1);
  const [sizeScale, setSizeScale] = useState(1);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const celestialBodies = useRef({});
  const orbitLines = useRef({});
  const labels = useRef({});

  const bodyData = {
    sun: {
      name: 'Sun',
      radius: 30,
      color: 0xfdb813,
      emissive: 0xfdb813,
      distance: 0,
      orbitalPeriod: 0,
      rotationPeriod: 25.4,
      mass: '1.989 × 10³⁰ kg',
      type: 'star',
      description: 'The Sun is the star at the center of our Solar System, containing 99.86% of its mass',
      facts: 'Surface temperature: 5,505°C. Powers Earth through nuclear fusion.',
      diameter: '1.39 million km'
    },
    mercury: {
      name: 'Mercury',
      radius: 2.4,
      color: 0x8c7853,
      distance: 58,
      orbitalPeriod: 88,
      rotationPeriod: 58.6,
      mass: '3.285 × 10²³ kg',
      type: 'terrestrial',
      description: 'The smallest and innermost planet, with extreme temperature variations',
      facts: 'No atmosphere. Temperature ranges from -173°C to 427°C',
      diameter: '4,879 km'
    },
    venus: {
      name: 'Venus',
      radius: 6,
      color: 0xffc649,
      distance: 108,
      orbitalPeriod: 225,
      rotationPeriod: -243,
      mass: '4.867 × 10²⁴ kg',
      type: 'terrestrial',
      description: 'The hottest planet with a thick toxic atmosphere',
      facts: 'Rotates backwards! Surface pressure 92x Earth. Temperature: 462°C',
      diameter: '12,104 km',
      atmosphereColor: 0xffdd88
    },
    earth: {
      name: 'Earth',
      radius: 6.4,
      color: 0x2233ff,
      distance: 150,
      orbitalPeriod: 365.25,
      rotationPeriod: 1,
      mass: '5.972 × 10²⁴ kg',
      type: 'terrestrial',
      description: 'Our home planet, the only known world with life',
      facts: 'Orbital velocity: 30 km/s. 71% covered by water. Habitable zone.',
      diameter: '12,742 km',
      atmosphereColor: 0x88ccff,
      moons: ['moon']
    },
    moon: {
      name: 'Moon',
      radius: 1.7,
      color: 0xaaaaaa,
      distance: 15,
      orbitalPeriod: 27.3,
      rotationPeriod: 27.3,
      parent: 'earth',
      mass: '7.342 × 10²² kg',
      type: 'moon',
      description: 'Earth\'s only natural satellite, stabilizes our planet\'s tilt',
      facts: 'Tidally locked. Causes ocean tides. Distance: 384,400 km from Earth',
      diameter: '3,474 km'
    },
    mars: {
      name: 'Mars',
      radius: 3.4,
      color: 0xcd5c5c,
      distance: 228,
      orbitalPeriod: 687,
      rotationPeriod: 1.03,
      mass: '6.39 × 10²³ kg',
      type: 'terrestrial',
      description: 'The Red Planet, primary target for human exploration',
      facts: 'Has polar ice caps. Olympus Mons: largest volcano in solar system (21 km high)',
      diameter: '6,779 km',
      atmosphereColor: 0xcc6644,
      moons: ['phobos', 'deimos']
    },
    phobos: {
      name: 'Phobos',
      radius: 0.4,
      color: 0x888888,
      distance: 6,
      orbitalPeriod: 0.32,
      rotationPeriod: 0.32,
      parent: 'mars',
      mass: '1.066 × 10¹⁶ kg',
      type: 'moon',
      description: 'Larger moon of Mars, doomed to crash into planet',
      facts: 'Orbits Mars faster than Mars rotates. Will break apart in 50 million years',
      diameter: '22.2 km'
    },
    deimos: {
      name: 'Deimos',
      radius: 0.3,
      color: 0x999999,
      distance: 10,
      orbitalPeriod: 1.26,
      rotationPeriod: 1.26,
      parent: 'mars',
      mass: '1.48 × 10¹⁵ kg',
      type: 'moon',
      description: 'Smaller moon of Mars',
      facts: 'May be a captured asteroid. Very dark surface.',
      diameter: '12.6 km'
    },
    jupiter: {
      name: 'Jupiter',
      radius: 14,
      color: 0xc88b3a,
      distance: 778,
      orbitalPeriod: 4333,
      rotationPeriod: 0.41,
      mass: '1.898 × 10²⁷ kg',
      type: 'gas giant',
      description: 'The largest planet, a gas giant with 95+ moons',
      facts: 'Great Red Spot is a storm larger than Earth. Has faint rings.',
      diameter: '139,820 km',
      atmosphereColor: 0xdaa55a,
      moons: ['io', 'europa', 'ganymede', 'callisto']
    },
    io: {
      name: 'Io',
      radius: 1.8,
      color: 0xffcc33,
      distance: 25,
      orbitalPeriod: 1.77,
      rotationPeriod: 1.77,
      parent: 'jupiter',
      mass: '8.93 × 10²² kg',
      type: 'moon',
      description: 'Most volcanically active body in the solar system',
      facts: 'Over 400 active volcanoes! Tidal heating from Jupiter causes volcanism',
      diameter: '3,643 km'
    },
    europa: {
      name: 'Europa',
      radius: 1.6,
      color: 0xccddee,
      distance: 40,
      orbitalPeriod: 3.55,
      rotationPeriod: 3.55,
      parent: 'jupiter',
      mass: '4.8 × 10²² kg',
      type: 'moon',
      description: 'Ice-covered moon with subsurface ocean, potential for life',
      facts: 'Global ocean beneath ice. Prime target in search for extraterrestrial life',
      diameter: '3,122 km'
    },
    ganymede: {
      name: 'Ganymede',
      radius: 2.6,
      color: 0xaaaaaa,
      distance: 50,
      orbitalPeriod: 7.15,
      rotationPeriod: 7.15,
      parent: 'jupiter',
      mass: '1.48 × 10²³ kg',
      type: 'moon',
      description: 'Largest moon in the solar system, bigger than Mercury',
      facts: 'Only moon with its own magnetic field. Has subsurface ocean',
      diameter: '5,268 km'
    },
    callisto: {
      name: 'Callisto',
      radius: 2.4,
      color: 0x776655,
      distance: 60,
      orbitalPeriod: 16.7,
      rotationPeriod: 16.7,
      parent: 'jupiter',
      mass: '1.08 × 10²³ kg',
      type: 'moon',
      description: 'Ancient, heavily cratered moon',
      facts: 'Most heavily cratered object in solar system. Possible subsurface ocean',
      diameter: '4,821 km'
    },
    saturn: {
      name: 'Saturn',
      radius: 12,
      color: 0xfad5a5,
      distance: 1427,
      orbitalPeriod: 10759,
      rotationPeriod: 0.45,
      mass: '5.683 × 10²⁶ kg',
      type: 'gas giant',
      description: 'The ringed planet, famous for its spectacular ring system',
      facts: 'Rings are made of ice and rock. 146 known moons. Density less than water!',
      diameter: '116,460 km',
      hasRings: true,
      atmosphereColor: 0xfce5b5,
      moons: ['titan', 'enceladus']
    },
    titan: {
      name: 'Titan',
      radius: 2.6,
      color: 0xff9933,
      distance: 60,
      orbitalPeriod: 15.95,
      rotationPeriod: 15.95,
      parent: 'saturn',
      mass: '1.35 × 10²³ kg',
      type: 'moon',
      description: 'Saturn\'s largest moon with thick atmosphere and liquid lakes',
      facts: 'Only moon with substantial atmosphere. Has lakes of liquid methane',
      diameter: '5,150 km',
      atmosphereColor: 0xffaa66
    },
    enceladus: {
      name: 'Enceladus',
      radius: 0.8,
      color: 0xffffff,
      distance: 40,
      orbitalPeriod: 1.37,
      rotationPeriod: 1.37,
      parent: 'saturn',
      mass: '1.08 × 10²⁰ kg',
      type: 'moon',
      description: 'Icy moon with water geysers, potential for life',
      facts: 'Shoots water plumes into space. Subsurface ocean detected',
      diameter: '504 km'
    },
    uranus: {
      name: 'Uranus',
      radius: 5,
      color: 0x4fd0e7,
      distance: 2871,
      orbitalPeriod: 30687,
      rotationPeriod: -0.72,
      mass: '8.681 × 10²⁵ kg',
      type: 'ice giant',
      description: 'The tilted ice giant, rotates on its side',
      facts: 'Rotates on its side (98° tilt). 13 faint rings. Coldest planetary atmosphere',
      diameter: '50,724 km',
      atmosphereColor: 0x7fd0e7
    },
    neptune: {
      name: 'Neptune',
      radius: 4.9,
      color: 0x4166f5,
      distance: 4497,
      orbitalPeriod: 60190,
      rotationPeriod: 0.67,
      mass: '1.024 × 10²⁶ kg',
      type: 'ice giant',
      description: 'The windiest planet with supersonic winds',
      facts: 'Winds reach 2,100 km/h! Great Dark Spot storm. Has 14 moons',
      diameter: '49,244 km',
      atmosphereColor: 0x5577ff,
      moons: ['triton']
    },
    triton: {
      name: 'Triton',
      radius: 1.4,
      color: 0xffccdd,
      distance: 30,
      orbitalPeriod: -5.88,
      rotationPeriod: 5.88,
      parent: 'neptune',
      mass: '2.14 × 10²² kg',
      type: 'moon',
      description: 'Neptune\'s largest moon, orbits backwards',
      facts: 'Only large moon with retrograde orbit. Nitrogen geysers. Coldest known surface',
      diameter: '2,707 km'
    },
    pluto: {
      name: 'Pluto',
      radius: 1.2,
      color: 0xccaa88,
      distance: 5906,
      orbitalPeriod: 90560,
      rotationPeriod: 6.39,
      mass: '1.309 × 10²² kg',
      type: 'dwarf planet',
      description: 'Dwarf planet with heart-shaped glacier, former 9th planet',
      facts: 'Reclassified in 2006. Heart-shaped Tombaugh Regio. 5 moons including Charon',
      diameter: '2,377 km'
    }
  };

  useEffect(() => {
    if (!mountRef.current) return;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000011);
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(
      60,
      mountRef.current.clientWidth / mountRef.current.clientHeight,
      0.1,
      50000
    );
    camera.position.set(0, 300, 500);
    camera.lookAt(0, 0, 0);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    mountRef.current.appendChild(renderer.domElement);

    const ambientLight = new THREE.AmbientLight(0x404040, 0.5);
    scene.add(ambientLight);

    const sunLight = new THREE.PointLight(0xffffff, 2.5, 20000);
    sunLight.position.set(0, 0, 0);
    scene.add(sunLight);

    // Add hemisphere light for better overall illumination
    const hemisphereLight = new THREE.HemisphereLight(0xffffff, 0x444444, 0.3);
    scene.add(hemisphereLight);

    // Enhanced starfield
    const starsGeometry = new THREE.BufferGeometry();
    const starsMaterial = new THREE.PointsMaterial({ 
      color: 0xffffff, 
      size: 1.5,
      transparent: true,
      opacity: 0.8
    });
    const starsVertices = [];
    for (let i = 0; i < 5000; i++) {
      const x = (Math.random() - 0.5) * 20000;
      const y = (Math.random() - 0.5) * 20000;
      const z = (Math.random() - 0.5) * 20000;
      starsVertices.push(x, y, z);
    }
    starsGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starsVertices, 3));
    const stars = new THREE.Points(starsGeometry, starsMaterial);
    scene.add(stars);

    // Asteroid belt visualization
    const asteroidBelt = new THREE.Group();
    const asteroidGeometry = new THREE.SphereGeometry(0.3, 6, 6);
    const asteroidMaterial = new THREE.MeshPhongMaterial({ color: 0x888888 });
    
    for (let i = 0; i < 500; i++) {
      const asteroid = new THREE.Mesh(asteroidGeometry, asteroidMaterial);
      const angle = Math.random() * Math.PI * 2;
      const distance = 300 + Math.random() * 150;
      const height = (Math.random() - 0.5) * 20;
      asteroid.position.set(
        Math.cos(angle) * distance,
        height,
        Math.sin(angle) * distance
      );
      asteroidBelt.add(asteroid);
    }
    scene.add(asteroidBelt);

    // Create celestial bodies
    Object.entries(bodyData).forEach(([key, data]) => {
      const geometry = new THREE.SphereGeometry(data.radius, 32, 32);
      const materialProps = data.emissive 
        ? { 
            color: data.color, 
            emissive: data.emissive, 
            emissiveIntensity: 1.5 
          }
        : { 
            color: data.color,
            emissive: data.color,
            emissiveIntensity: 0.15,
            shininess: 10,
            specular: 0x333333
          };
      const material = new THREE.MeshPhongMaterial(materialProps);
      const mesh = new THREE.Mesh(geometry, material);
      
      // Add atmosphere
      if (data.atmosphereColor) {
        const atmosphereGeometry = new THREE.SphereGeometry(data.radius * 1.15, 32, 32);
        const atmosphereMaterial = new THREE.MeshPhongMaterial({
          color: data.atmosphereColor,
          transparent: true,
          opacity: 0.15,
          side: THREE.BackSide
        });
        const atmosphere = new THREE.Mesh(atmosphereGeometry, atmosphereMaterial);
        mesh.add(atmosphere);
      }

      // Add rings for Saturn
      if (data.hasRings) {
        const ringGeometry = new THREE.RingGeometry(data.radius * 1.5, data.radius * 2.5, 64);
        const ringMaterial = new THREE.MeshBasicMaterial({
          color: 0xccaa88,
          side: THREE.DoubleSide,
          transparent: true,
          opacity: 0.6
        });
        const rings = new THREE.Mesh(ringGeometry, ringMaterial);
        rings.rotation.x = Math.PI / 2;
        mesh.add(rings);
      }

      const group = new THREE.Group();
      group.add(mesh);
      
      if (!data.parent) {
        scene.add(group);
      }
      
      celestialBodies.current[key] = {
        mesh: mesh,
        group: group,
        angle: Math.random() * Math.PI * 2,
        data: data
      };

      // Create orbit lines
      if (data.distance > 0 && !data.parent) {
        const orbitGeometry = new THREE.BufferGeometry();
        const orbitPoints = [];
        const segments = 128;
        for (let i = 0; i <= segments; i++) {
          const angle = (i / segments) * Math.PI * 2;
          orbitPoints.push(
            Math.cos(angle) * data.distance * distanceScale,
            0,
            Math.sin(angle) * data.distance * distanceScale
          );
        }
        orbitGeometry.setAttribute('position', new THREE.Float32BufferAttribute(orbitPoints, 3));
        const orbitMaterial = new THREE.LineBasicMaterial({ 
          color: data.type === 'dwarf planet' ? 0x666666 : 0x444444,
          transparent: true,
          opacity: 0.4
        });
        const orbitLine = new THREE.Line(orbitGeometry, orbitMaterial);
        scene.add(orbitLine);
        orbitLines.current[key] = orbitLine;
      }
    });

    // Set up parent-child relationships for moons
    Object.entries(bodyData).forEach(([key, data]) => {
      if (data.parent && celestialBodies.current[data.parent]) {
        celestialBodies.current[data.parent].group.add(celestialBodies.current[key].group);
      }
    });

    // Mouse controls
    let isDragging = false;
    let previousMousePosition = { x: 0, y: 0 };
    let cameraRotation = { x: 0.3, y: 0 };
    let cameraDistance = 500;

    const onMouseDown = (e) => {
      isDragging = true;
      previousMousePosition = { x: e.clientX, y: e.clientY };
    };

    const onMouseMove = (e) => {
      if (!isDragging) return;
      
      const deltaX = e.clientX - previousMousePosition.x;
      const deltaY = e.clientY - previousMousePosition.y;
      
      cameraRotation.y += deltaX * 0.005;
      cameraRotation.x += deltaY * 0.005;
      cameraRotation.x = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, cameraRotation.x));
      
      previousMousePosition = { x: e.clientX, y: e.clientY };
    };

    const onMouseUp = () => {
      isDragging = false;
    };

    const onWheel = (e) => {
      e.preventDefault();
      cameraDistance += e.deltaY * 0.5;
      cameraDistance = Math.max(50, Math.min(10000, cameraDistance));
    };

    renderer.domElement.addEventListener('mousedown', onMouseDown);
    renderer.domElement.addEventListener('mousemove', onMouseMove);
    renderer.domElement.addEventListener('mouseup', onMouseUp);
    renderer.domElement.addEventListener('wheel', onWheel, { passive: false });

    // Animation
    let time = 0;
    const animate = () => {
      requestAnimationFrame(animate);

      if (!isPaused) {
        time += 0.001 * timeScale;

        // Update celestial body positions
        Object.entries(celestialBodies.current).forEach(([key, body]) => {
          const data = body.data;
          
          // Rotation (handle retrograde rotation with negative periods)
          if (data.rotationPeriod !== 0) {
            const rotationSpeed = (2 * Math.PI / Math.abs(data.rotationPeriod)) * 0.01 * timeScale;
            body.mesh.rotation.y += data.rotationPeriod > 0 ? rotationSpeed : -rotationSpeed;
          }

          // Orbital motion
          if (data.orbitalPeriod > 0 && !data.parent) {
            body.angle += (2 * Math.PI / data.orbitalPeriod) * 0.01 * timeScale;
            body.group.position.x = Math.cos(body.angle) * data.distance * distanceScale;
            body.group.position.z = Math.sin(body.angle) * data.distance * distanceScale;
          } else if (data.parent) {
            // Moon orbits (handle retrograde orbits)
            const orbitSpeed = (2 * Math.PI / Math.abs(data.orbitalPeriod)) * 0.01 * timeScale;
            body.angle += data.orbitalPeriod > 0 ? orbitSpeed : -orbitSpeed;
            body.group.position.x = Math.cos(body.angle) * data.distance;
            body.group.position.z = Math.sin(body.angle) * data.distance;
          }
        });
      }

      // Camera controls
      if (cameraMode === 'free') {
        camera.position.x = Math.sin(cameraRotation.y) * Math.cos(cameraRotation.x) * cameraDistance;
        camera.position.y = Math.sin(cameraRotation.x) * cameraDistance;
        camera.position.z = Math.cos(cameraRotation.y) * Math.cos(cameraRotation.x) * cameraDistance;
        camera.lookAt(0, 0, 0);
      } else if (cameraMode === 'follow' && celestialBodies.current[selectedBody]) {
        const body = celestialBodies.current[selectedBody];
        const worldPos = new THREE.Vector3();
        body.mesh.getWorldPosition(worldPos);
        
        const offset = body.data.radius * 3;
        camera.position.x = worldPos.x + offset;
        camera.position.y = worldPos.y + offset * 0.5;
        camera.position.z = worldPos.z + offset;
        camera.lookAt(worldPos);
      } else if (cameraMode === 'orbit' && celestialBodies.current[selectedBody]) {
        const body = celestialBodies.current[selectedBody];
        const worldPos = new THREE.Vector3();
        body.mesh.getWorldPosition(worldPos);
        
        const radius = body.data.radius * 4;
        const speed = 0.001 * timeScale;
        camera.position.x = worldPos.x + Math.cos(time * speed) * radius;
        camera.position.y = worldPos.y + radius * 0.3;
        camera.position.z = worldPos.z + Math.sin(time * speed) * radius;
        camera.lookAt(worldPos);
      }

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!mountRef.current) return;
      camera.aspect = mountRef.current.clientWidth / mountRef.current.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      renderer.domElement.removeEventListener('mousedown', onMouseDown);
      renderer.domElement.removeEventListener('mousemove', onMouseMove);
      renderer.domElement.removeEventListener('mouseup', onMouseUp);
      renderer.domElement.removeEventListener('wheel', onWheel);
      if (mountRef.current && renderer.domElement.parentNode === mountRef.current) {
        mountRef.current.removeChild(renderer.domElement);
      }
    };
  }, [isPaused, timeScale, selectedBody, cameraMode, distanceScale, sizeScale]);

  useEffect(() => {
    if (!sceneRef.current) return;
    Object.entries(orbitLines.current).forEach(([key, line]) => {
      line.visible = showOrbits;
    });
  }, [showOrbits]);

  const selectedBodyData = bodyData[selectedBody];

  const focusOnBody = (bodyKey) => {
    setSelectedBody(bodyKey);
    setCameraMode('follow');
  };

  // Group bodies by type
  const planets = Object.entries(bodyData).filter(([k, d]) => d.type === 'terrestrial' || d.type === 'gas giant' || d.type === 'ice giant');
  const moons = Object.entries(bodyData).filter(([k, d]) => d.type === 'moon');
  const dwarf = Object.entries(bodyData).filter(([k, d]) => d.type === 'dwarf planet');

  return (
    <div className="w-full h-screen bg-black relative overflow-hidden">
      <div ref={mountRef} className="w-full h-full" />
      
      {/* Title */}
      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 text-white text-center z-10">
        <h1 className="text-4xl font-bold mb-1">Complete Solar System Explorer</h1>
        <p className="text-sm text-gray-300">All 8 Planets • Major Moons • Dwarf Planets • Asteroid Belt</p>
      </div>

      {/* Controls Panel */}
      <div className="absolute top-20 left-4 bg-black bg-opacity-90 text-white p-4 rounded-lg max-w-xs max-h-[calc(100vh-100px)] overflow-y-auto">
        <h2 className="text-lg font-bold mb-3 sticky top-0 bg-black pb-2">Controls</h2>
        
        <div className="space-y-3">
          <div>
            <label className="text-sm block mb-1">Time Speed: {timeScale}x</label>
            <input
              type="range"
              min="0.1"
              max="50"
              step="0.5"
              value={timeScale}
              onChange={(e) => setTimeScale(parseFloat(e.target.value))}
              className="w-full"
            />
          </div>

          <button
            onClick={() => setIsPaused(!isPaused)}
            className="w-full bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded transition"
          >
            {isPaused ? '▶ Resume' : '⏸ Pause'}
          </button>

          <div>
            <label className="text-sm block mb-1">Camera Mode</label>
            <select
              value={cameraMode}
              onChange={(e) => setCameraMode(e.target.value)}
              className="w-full bg-gray-800 border border-gray-600 rounded px-2 py-1"
            >
              <option value="free">Free Camera</option>
              <option value="follow">Follow Selected</option>
              <option value="orbit">Orbit Selected</option>
            </select>
          </div>

          <div className="border-t border-gray-700 pt-3 mt-3">
            <h3 className="text-sm font-bold mb-2">Planets</h3>
            <div className="space-y-1">
              {planets.map(([key, data]) => (
                <button
                  key={key}
                  onClick={() => focusOnBody(key)}
                  className={`w-full text-left px-3 py-1 rounded text-sm transition ${
                    selectedBody === key ? 'bg-blue-600' : 'bg-gray-700 hover:bg-gray-600'
                  }`}
                >
                  {data.name}
                </button>
              ))}
            </div>
          </div>

          <div className="border-t border-gray-700 pt-3">
            <h3 className="text-sm font-bold mb-2">Major Moons ({moons.length})</h3>
            <div className="space-y-1 max-h-40 overflow-y-auto">
              {moons.map(([key, data]) => (
                <button
                  key={key}
                  onClick={() => focusOnBody(key)}
                  className={`w-full text-left px-3 py-1 rounded text-xs transition ${
                    selectedBody === key ? 'bg-green-600' : 'bg-gray-700 hover:bg-gray-600'
                  }`}
                >
                  {data.name} ({bodyData[data.parent]?.name})
                </button>
              ))}
            </div>
          </div>

          <div className="border-t border-gray-700 pt-3">
            <h3 className="text-sm font-bold mb-2">Dwarf Planets</h3>
            <div className="space-y-1">
              {dwarf.map(([key, data]) => (
                <button
                  key={key}
                  onClick={() => focusOnBody(key)}
                  className={`w-full text-left px-3 py-1 rounded text-sm transition ${
                    selectedBody === key ? 'bg-purple-600' : 'bg-gray-700 hover:bg-gray-600'
                  }`}
                >
                  {data.name}
                </button>
              ))}
            </div>
          </div>

          <div className="border-t border-gray-700 pt-3 space-y-2">
            <button
              onClick={() => { setSelectedBody('sun'); setCameraMode('free'); }}
              className="w-full bg-yellow-600 hover:bg-yellow-700 px-4 py-2 rounded transition"
            >
              View Entire System
            </button>

            <button
              onClick={() => setShowOrbits(!showOrbits)}
              className={`w-full px-4 py-2 rounded transition ${
                showOrbits ? 'bg-green-600 hover:bg-green-700' : 'bg-gray-600 hover:bg-gray-700'
              }`}
            >
              {showOrbits ? '✓' : '✗'} Orbital Paths
            </button>

            <button
              onClick={() => setShowInfo(!showInfo)}
              className={`w-full px-4 py-2 rounded transition ${
                showInfo ? 'bg-green-600 hover:bg-green-700' : 'bg-gray-600 hover:bg-gray-700'
              }`}
            >
              {showInfo ? '✓' : '✗'} Information Panel
            </button>
          </div>

          <div className="mt-4 pt-3 border-t border-gray-600 text-xs text-gray-400">
            <p className="font-bold mb-1">Navigation:</p>
            <p>• Drag to rotate camera</p>
            <p>• Scroll to zoom in/out</p>
            <p>• Click planets to focus</p>
            <p className="mt-2 text-yellow-300">Note: Scales adjusted for visibility</p>
          </div>
        </div>
      </div>

      {/* Information Panel */}
      {showInfo && selectedBodyData && (
        <div className="absolute top-20 right-4 bg-black bg-opacity-90 text-white p-4 rounded-lg max-w-md max-h-[calc(100vh-100px)] overflow-y-auto">
          <div className="flex items-start justify-between mb-2">
            <h2 className="text-2xl font-bold">{selectedBodyData.name}</h2>
            <span className={`px-2 py-1 rounded text-xs font-bold ${
              selectedBodyData.type === 'star' ? 'bg-yellow-600' :
              selectedBodyData.type === 'terrestrial' ? 'bg-orange-600' :
              selectedBodyData.type === 'gas giant' ? 'bg-purple-600' :
              selectedBodyData.type === 'ice giant' ? 'bg-blue-600' :
              selectedBodyData.type === 'moon' ? 'bg-gray-600' :
              'bg-pink-600'
            }`}>
              {selectedBodyData.type.toUpperCase()}
            </span>
          </div>
          
          <p className="text-sm text-gray-300 mb-3">{selectedBodyData.description}</p>
          
          <div className="space-y-2 text-sm mb-3">
            <div className="flex justify-between border-b border-gray-700 pb-1">
              <span className="text-gray-400">Diameter:</span>
              <span className="font-mono">{selectedBodyData.diameter}</span>
            </div>
            
            <div className="flex justify-between border-b border-gray-700 pb-1">
              <span className="text-gray-400">Mass:</span>
              <span className="font-mono">{selectedBodyData.mass}</span>
            </div>
            
            {selectedBodyData.orbitalPeriod > 0 && (
              <div className="flex justify-between border-b border-gray-700 pb-1">
                <span className="text-gray-400">Orbital Period:</span>
                <span className="font-mono">
                  {selectedBodyData.orbitalPeriod > 365 
                    ? `${(selectedBodyData.orbitalPeriod / 365.25).toFixed(1)} years`
                    : `${selectedBodyData.orbitalPeriod} days`}
                </span>
              </div>
            )}
            
            <div className="flex justify-between border-b border-gray-700 pb-1">
              <span className="text-gray-400">Rotation Period:</span>
              <span className="font-mono">
                {Math.abs(selectedBodyData.rotationPeriod)} days
                {selectedBodyData.rotationPeriod < 0 ? ' (retrograde)' : ''}
              </span>
            </div>
            
            {selectedBodyData.distance > 0 && (
              <div className="flex justify-between border-b border-gray-700 pb-1">
                <span className="text-gray-400">Distance from {selectedBodyData.parent ? bodyData[selectedBodyData.parent]?.name : 'Sun'}:</span>
                <span className="font-mono">{selectedBodyData.distance.toLocaleString()} million km</span>
              </div>
            )}

            {selectedBodyData.moons && (
              <div className="flex justify-between border-b border-gray-700 pb-1">
                <span className="text-gray-400">Known Moons:</span>
                <span className="font-mono">{selectedBodyData.moons.length}+</span>
              </div>
            )}
          </div>

          <div className="bg-blue-900 bg-opacity-30 p-3 rounded border border-blue-700">
            <p className="text-xs text-blue-200 leading-relaxed">{selectedBodyData.facts}</p>
          </div>
        </div>
      )}

      {/* Educational Overlay */}
      <div className="absolute bottom-4 left-4 right-4 bg-black bg-opacity-90 text-white p-4 rounded-lg">
        <h3 className="text-lg font-bold mb-2">Solar System Facts & Physics</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-sm">
          <div className="bg-blue-900 bg-opacity-30 p-2 rounded">
            <strong className="text-blue-300">Orbital Mechanics</strong>
            <p className="text-xs text-gray-300 mt-1">Inner planets orbit faster than outer planets due to stronger solar gravity</p>
          </div>
          <div className="bg-purple-900 bg-opacity-30 p-2 rounded">
            <strong className="text-purple-300">Planet Types</strong>
            <p className="text-xs text-gray-300 mt-1">Terrestrial (rocky), Gas Giants (Jupiter/Saturn), Ice Giants (Uranus/Neptune)</p>
          </div>
          <div className="bg-green-900 bg-opacity-30 p-2 rounded">
            <strong className="text-green-300">Habitable Zone</strong>
            <p className="text-xs text-gray-300 mt-1">Earth orbits in the "Goldilocks zone" where liquid water can exist</p>
          </div>
          <div className="bg-yellow-900 bg-opacity-30 p-2 rounded">
            <strong className="text-yellow-300">Scale</strong>
            <p className="text-xs text-gray-300 mt-1">Real solar system is 99.9% empty space. Neptune is 30× farther from Sun than Earth!</p>
          </div>
        </div>
      </div>
    </div>
  );
}