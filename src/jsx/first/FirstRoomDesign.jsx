import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import styles from '../../css/first/firstRoomDesign.module.css';

const FirstRoomDesign = () => {
    const navigate = useNavigate();
    const mountRef = useRef(null);
    const sceneRef = useRef(new THREE.Scene());
    const rendererRef = useRef(null);
    const cameraRef = useRef(null);
    const controlsRef = useRef(null);
    const [selectedFurniture, setSelectedFurniture] = useState(null);
    const [position, setPosition] = useState({ x: 0, y: 0, z: 0 });
    const [rotation, setRotation] = useState({ x: 0, y: 0, z: 0 });
    const [scale, setScale] = useState(1);

    useEffect(() => {
        const mount = mountRef.current;

        if (!rendererRef.current) {
            const renderer = new THREE.WebGLRenderer({ antialias: true });
            renderer.setSize(mount.clientWidth, mount.clientHeight);
            mount.appendChild(renderer.domElement);
            rendererRef.current = renderer;
        }

        if (!cameraRef.current) {
            const camera = new THREE.PerspectiveCamera(55, mount.clientWidth / mount.clientHeight, 0.1, 1000);
            camera.position.set(25, 25, 25);
            camera.lookAt(new THREE.Vector3(0, 0, 0));
            cameraRef.current = camera;
        }

        if (!controlsRef.current) {
            const controls = new OrbitControls(cameraRef.current, rendererRef.current.domElement);
            controls.enableDamping = true;
            controls.dampingFactor = 0.25;
            controls.enableZoom = true;
            controlsRef.current = controls;
        }

        const scene = sceneRef.current;
        scene.background = new THREE.Color(0xffffff);

        while (scene.children.length > 0) {
            scene.remove(scene.children[0]);
        }

        const ambientLight = new THREE.AmbientLight(0xffffff, 3);
        scene.add(ambientLight);

        const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
        directionalLight.position.set(10, 10, 10);
        scene.add(directionalLight);

        // Floor setup
        const floorGeometry = new THREE.BoxGeometry(20, 0, 20);
        const floorMaterial = new THREE.MeshStandardMaterial({ color: 0xc5f1cf });
        const floor = new THREE.Mesh(floorGeometry, floorMaterial);
        floor.name = 'floor'; // Naming the floor
        floor.position.set(0, 0, 0);
        scene.add(floor);

        // Left wall setup
        const wallLeftGeometry = new THREE.BoxGeometry(1, 15, 20);
        const wallLeftMaterial = new THREE.MeshStandardMaterial({ color: 0xa9f2ff });
        const wallLeft = new THREE.Mesh(wallLeftGeometry, wallLeftMaterial);
        wallLeft.name = 'wall'; // Naming the wall
        wallLeft.position.set(-10.5, 7.5, 0);
        scene.add(wallLeft);

        // Back wall setup
        const wallBackGeometry = new THREE.BoxGeometry(20, 15, 1);
        const wallBackMaterial = new THREE.MeshStandardMaterial({ color: 0xe0e0e0 });
        const wallBack = new THREE.Mesh(wallBackGeometry, wallBackMaterial);
        wallBack.name = 'wall'; // Naming the wall
        wallBack.position.set(0, 7.5, -10.5);
        scene.add(wallBack);

        const gridHelper = new THREE.GridHelper(20, 20);
        scene.add(gridHelper);

        const animate = () => {
            requestAnimationFrame(animate);
            controlsRef.current.update();
            rendererRef.current.render(scene, cameraRef.current);
        };

        animate();

        return () => {
            rendererRef.current.dispose();
        };
    }, []);

    const loadFurniture = (path) => {
        const loader = new GLTFLoader();
        loader.load(path, (gltf) => {
            const model = gltf.scene;
            model.scale.set(scale, scale, scale);

            const box = new THREE.Box3().setFromObject(model);
            const center = box.getCenter(new THREE.Vector3());
            model.position.sub(center);
            model.position.y = -(box.min.y * model.scale.y);

            const group = new THREE.Group();
            group.add(model);
            sceneRef.current.add(group);

            setSelectedFurniture(group);
            setPosition({ x: group.position.x, y: group.position.y, z: group.position.z });
            setRotation({ x: group.rotation.x, y: group.rotation.y, z: group.rotation.z });
        }, undefined, (error) => {
            console.error('Error loading model:', error);
        });
    };

    const updatePosition = (axis, value) => {
        setPosition((prev) => ({ ...prev, [axis]: parseFloat(value) }));
    };

    const updateRotation = (axis, value) => {
        setRotation((prev) => ({ ...prev, [axis]: parseFloat(value) }));
    };

    const updateScale = (value) => {
        setScale(parseFloat(value));
    };

    useEffect(() => {
        if (selectedFurniture) {
            selectedFurniture.position.set(position.x, position.y, position.z);
            selectedFurniture.rotation.set(rotation.x, rotation.y, rotation.z);
            selectedFurniture.scale.set(scale, scale, scale);
        }
    }, [position, rotation, scale, selectedFurniture]);

    const handleFurnitureSelection = (event) => {
        const raycaster = new THREE.Raycaster();
        const mouse = new THREE.Vector2();
        const rect = rendererRef.current.domElement.getBoundingClientRect();

        mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

        raycaster.setFromCamera(mouse, cameraRef.current);

        const intersects = raycaster.intersectObjects(sceneRef.current.children, true);
        if (intersects.length > 0) {
            let intersectedObject = intersects[0].object;
            while (intersectedObject.parent && intersectedObject.parent.type !== "Scene") {
                intersectedObject = intersectedObject.parent;
            }

            if (intersectedObject.name !== 'floor' && intersectedObject.name !== 'wall') {
                setSelectedFurniture(intersectedObject);
                setPosition({ x: intersectedObject.position.x, y: intersectedObject.position.y, z: intersectedObject.position.z });
                setRotation({ x: intersectedObject.rotation.x, y: intersectedObject.rotation.y, z: intersectedObject.rotation.z });
                setScale(intersectedObject.scale.x);
            }
        }
    };

    const handleDelete = () => {
        if (selectedFurniture) {
            sceneRef.current.remove(selectedFurniture);
            setSelectedFurniture(null);
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <img
                    src="public/lib/back.svg"
                    alt="back"
                    onClick={() => navigate('/firstLogin')}
                />
                <h2>내 방 설정</h2>
            </div>
            <div ref={mountRef} className={styles.roomDesign} onClick={handleFurnitureSelection}></div>
            <div className={styles.furniture}>
                <div className={styles.furnitureAddButton}>
                    <button onClick={() => loadFurniture('/public/furniture/desk.glb')}>책상 (Desk)</button>
                    <button onClick={() => loadFurniture('/public/furniture/desk2.glb')}>책상2 (Desk2)</button>
                    <button onClick={() => loadFurniture('/public/furniture/탕구리.glb')}>탕구리</button>
                    <button onClick={() => loadFurniture('/public/furniture/잠만보.glb')}>잠만보</button>
                </div>
                {selectedFurniture && (
                    <div className={styles.controls}>
                        <div className={styles.sliderControls}>
                            <label>
                                X축위치:
                                <input
                                    type="range"
                                    min="-10"
                                    max="10"
                                    value={position.x}
                                    onChange={(e) => updatePosition('x', e.target.value)}
                                />
                            </label>
                            <label>
                                Y축위치:
                                <input
                                    type="range"
                                    min="-10"
                                    max="10"
                                    value={position.y}
                                    onChange={(e) => updatePosition('y', e.target.value)}
                                />
                            </label>
                            <label>
                                Z축위치:
                                <input
                                    type="range"
                                    min="-10"
                                    max="10"
                                    value={position.z}
                                    onChange={(e) => updatePosition('z', e.target.value)}
                                />
                            </label>
                            <label>
                                X축회전:
                                <input
                                    type="range"
                                    min="0"
                                    max={Math.PI * 2}
                                    step={0.01}
                                    value={rotation.x}
                                    onChange={(e) => updateRotation('x', e.target.value)}
                                />
                            </label>
                            <label>
                                Y축회전:
                                <input
                                    type="range"
                                    min="0"
                                    max={Math.PI * 2}
                                    step={0.01}
                                    value={rotation.y}
                                    onChange={(e) => updateRotation('y', e.target.value)}
                                />
                            </label>
                            <label>
                                Z축회전:
                                <input
                                    type="range"
                                    min="0"
                                    max={Math.PI * 2}
                                    step={0.01}
                                    value={rotation.z}
                                    onChange={(e) => updateRotation('z', e.target.value)}
                                />
                            </label>
                            <label>
                                크기:
                                <input
                                    type="range"
                                    min="0.1"
                                    max="15"
                                    step="0.1"
                                    value={scale}
                                    onChange={(e) => updateScale(e.target.value)}
                                />
                            </label>
                        </div>
                        <button onClick={handleDelete}>삭제</button>
                    </div>
                )}
            </div>
            <div className={styles.submit}>
                <button
                    type="button"
                    className={styles.cancel}
                    onClick={() => navigate('/login')}
                >
                    취소
                </button>
                <button
                    type="button"
                    className={styles.next}
                    onClick={() => navigate('/firstLivingRoom')}
                >
                    다음
                </button>
            </div>
        </div>
    );
};

export default FirstRoomDesign;
