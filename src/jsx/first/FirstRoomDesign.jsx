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
    const [isFurnitureFloating, setIsFurnitureFloating] = useState(false);

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

        // 씬 초기화
        while (scene.children.length > 0) {
            scene.remove(scene.children[0]);
        }

        // Scene setting (lights, floor, etc.)
        const ambientLight = new THREE.AmbientLight(0xffffff, 3);
        scene.add(ambientLight);

        const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
        directionalLight.position.set(10, 10, 10);
        scene.add(directionalLight);

        const floorGeometry = new THREE.BoxGeometry(20, 0, 20);
        const floorMaterial = new THREE.MeshStandardMaterial({ color: 0xc5f1cf });
        const floor = new THREE.Mesh(floorGeometry, floorMaterial);
        floor.name = 'floor';
        floor.position.set(0, 0, 0);
        scene.add(floor);

        const wallLeftGeometry = new THREE.BoxGeometry(1, 15, 20);
        const wallLeftMaterial = new THREE.MeshStandardMaterial({ color: 0xa9f2ff });
        const wallLeft = new THREE.Mesh(wallLeftGeometry, wallLeftMaterial);
        wallLeft.position.set(-10.5, 7.5, 0);
        scene.add(wallLeft);

        const wallBackGeometry = new THREE.BoxGeometry(20, 15, 1);
        const wallBackMaterial = new THREE.MeshStandardMaterial({ color: 0xe0e0e0 });
        const wallBack = new THREE.Mesh(wallBackGeometry, wallBackMaterial);
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
            model.scale.set(4, 4, 4);

            // 모델의 위치를 중앙에 맞추기 위해 초기 위치 조정
            const box = new THREE.Box3().setFromObject(model);
            const center = box.getCenter(new THREE.Vector3());
            model.position.sub(center);
            model.position.y = -(box.min.y * model.scale.y);

            const group = new THREE.Group();
            group.add(model);
            sceneRef.current.add(group);

            console.log('Loaded furniture:', group);
            console.log('Scene children count:', sceneRef.current.children.length);

            setSelectedFurniture(group);
            setIsFurnitureFloating(false);
        }, undefined, (error) => {
            console.error('An error happened during loading the model:', error);
        });
    };

    const handleRotation = () => {
        if (selectedFurniture) {
            selectedFurniture.rotation.y += Math.PI / 2;
        }
    };

    const getIntersectedObject = useCallback((event) => {
        const renderer = rendererRef.current;
        const camera = cameraRef.current;
        if (!renderer || !camera) return null;

        const rect = renderer.domElement.getBoundingClientRect();
        const mouse = new THREE.Vector2(
            ((event.clientX - rect.left) / rect.width) * 2 - 1,
            -((event.clientY - rect.top) / rect.height) * 2 + 1
        );

        console.log("Mouse coordinates:", mouse);
        console.log("Camera:", camera);

        const raycaster = new THREE.Raycaster();
        raycaster.near = 0.1;
        raycaster.far = 1000;
        raycaster.precision = 0.1;
        raycaster.setFromCamera(mouse, camera);

        const intersects = raycaster.intersectObjects(sceneRef.current.children, true);
        console.log("Intersected objects:", intersects);

        if (intersects.length > 0) {
            let object = intersects[0].object;
            while (object.parent && object.parent.type !== "Scene") {
                object = object.parent;
            }
            return object;
        }

        return null;
    }, []);

    const handleDoubleClick = useCallback((event) => {
        console.log("Double click detected:", event);

        const intersectedObject = getIntersectedObject(event);
        if (intersectedObject) {
            console.log("Selected object:", intersectedObject);
            setSelectedFurniture(intersectedObject);
            setIsFurnitureFloating(true);
        }
    }, [getIntersectedObject]);

    useEffect(() => {
        const renderer = rendererRef.current;
        if (renderer) {
            renderer.domElement.addEventListener('dblclick', (event) => {
                console.log('Double click detected on DOM element');
                handleDoubleClick(event);
            });
        }

        return () => {
            if (renderer) {
                renderer.domElement.removeEventListener('dblclick', handleDoubleClick);
            }
        };
    }, [handleDoubleClick]);

    const handleMouseMove = useCallback((event) => {
        if (isFurnitureFloating && selectedFurniture) {
            const { clientX, clientY } = event;
            const rect = rendererRef.current.domElement.getBoundingClientRect();
            const x = ((clientX - rect.left) / rect.width) * 2 - 1;
            const y = -((clientY - rect.top) / rect.height) * 2 + 1;

            const vector = new THREE.Vector3(x, y, 0.5);
            vector.unproject(cameraRef.current);
            const dir = vector.sub(cameraRef.current.position).normalize();
            const distance = -cameraRef.current.position.y / dir.y;
            const pos = cameraRef.current.position.clone().add(dir.multiplyScalar(distance));

            selectedFurniture.position.set(pos.x, selectedFurniture.position.y, pos.z);
        }
    }, [isFurnitureFloating, selectedFurniture]);

    useEffect(() => {
        const renderer = rendererRef.current;
        if (renderer) {
            renderer.domElement.addEventListener('mousemove', handleMouseMove);
        }

        return () => {
            if (renderer) {
                renderer.domElement.removeEventListener('mousemove', handleMouseMove);
            }
        };
    }, [handleMouseMove]);

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
            <div ref={mountRef} className={styles.roomDesign}></div>
            <div className={styles.furniture}>
                <div className={styles.furnitureAddButton}>
                    <button onClick={() => loadFurniture('/public/furniture/desk.glb')}>책상 (Desk)</button>
                    <button onClick={() => loadFurniture('/public/furniture/desk2.glb')}>책상2 (Desk2)</button>
                </div>
                {selectedFurniture && (
                    <div className={styles.controls}>
                        <button onClick={handleRotation}>회전</button>
                        {isFurnitureFloating && (
                            <button onClick={() => setIsFurnitureFloating(false)}>배치</button>
                        )}
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