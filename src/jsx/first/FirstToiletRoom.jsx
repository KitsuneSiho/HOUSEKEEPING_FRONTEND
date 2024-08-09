import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import styles from '../../css/first/firstRoomDesign.module.css';

const FirstToiletRoom = () => {
    const navigate = useNavigate();
    const mountRef = useRef(null);
    const sceneRef = useRef(new THREE.Scene());
    const rendererRef = useRef(null);
    const cameraRef = useRef(null);
    const controlsRef = useRef(null);
    const [selectedFurniture, setSelectedFurniture] = useState(null);
    const [position, setPosition] = useState({ x: 0, y: 0, z: 0 });
    const [rotation, setRotation] = useState(0);  // Only Y-axis rotation
    const [scale, setScale] = useState(1);
    const [activeCategory, setActiveCategory] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [modalType, setModalType] = useState('furniture'); // 'furniture' or 'color'
    const [selectedObject, setSelectedObject] = useState(null); // Selected wall or floor for color change

    useEffect(() => {
        const mount = mountRef.current;

        if (!rendererRef.current) {
            const renderer = new THREE.WebGLRenderer({ antialias: true });
            renderer.setSize(mount.clientWidth, mount.clientHeight);
            mount.appendChild(renderer.domElement);
            rendererRef.current = renderer;
        }

        if (!cameraRef.current) {
            const camera = new THREE.PerspectiveCamera(50, mount.clientWidth / mount.clientHeight, 0.1, 1000);
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
        const floorGeometry = new THREE.BoxGeometry(20, 1, 20);
        const floorMaterial = new THREE.MeshStandardMaterial({ color: 0xc5f1cf });
        const floor = new THREE.Mesh(floorGeometry, floorMaterial);
        floor.name = 'floor'; // Naming the floor
        floor.position.set(0, 0, 0);
        scene.add(floor);

        // Left wall setup
        const wallLeftGeometry = new THREE.BoxGeometry(1, 15, 20);
        const wallLeftMaterial = new THREE.MeshStandardMaterial({ color: 0xa9f2ff });
        const wallLeft = new THREE.Mesh(wallLeftGeometry, wallLeftMaterial);
        wallLeft.name = 'leftWall'; // Naming the wall
        wallLeft.position.set(-9.5, 7.5, 0);
        scene.add(wallLeft);


        // Back wall setup
        const wallBackGeometry = new THREE.BoxGeometry(20, 15, 1);
        const wallBackMaterial = new THREE.MeshStandardMaterial({ color: 0xe0e0e0 });
        const wallBack = new THREE.Mesh(wallBackGeometry, wallBackMaterial);
        wallBack.name = 'backWall'; // Naming the wall
        wallBack.position.set(0, 7.5, -9.5);
        scene.add(wallBack);

        // 로컬 스토리지에서 저장된 가구 위치 불러오기
        const savedFurniture = JSON.parse(localStorage.getItem('furniture')) || [];
        savedFurniture.forEach(item => {
            loadFurniture(item.path, item.position, item.rotation, item.scale);
        });

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

            // Compute bounding box to determine size
            const box = new THREE.Box3().setFromObject(model);
            const size = new THREE.Vector3();
            box.getSize(size);

            // Set initial scale based on model size, adjust as needed
            const initialScale = Math.min(4 / size.x, 4 / size.y, 4 / size.z);
            model.scale.set(initialScale, initialScale, initialScale);

            // Center the model
            const center = box.getCenter(new THREE.Vector3());
            model.position.sub(center);
            model.position.y = -(box.min.y * model.scale.y);

            const group = new THREE.Group();
            group.add(model);
            sceneRef.current.add(group);

            setSelectedFurniture(group);
            setPosition({ x: group.position.x, y: group.position.y, z: group.position.z });
            setRotation(0); // Reset rotation on Y-axis
            setScale(1); // Reset scale
            setModalType('furniture');
            setShowModal(true);
        }, undefined, (error) => {
            console.error('Error loading model:', error);
        });
    };

    const updatePosition = (axis, value) => {
        // Ensure the position does not exceed the boundaries
        const newValue = Math.max(-10, Math.min(10, parseFloat(value)));
        setPosition((prev) => ({ ...prev, [axis]: newValue }));
    };

    const updateRotation = (value) => {
        setRotation(parseFloat(value));
    };

    const updateScale = (value) => {
        setScale(parseFloat(value));
    };

    useEffect(() => {
        if (selectedFurniture) {
            selectedFurniture.position.set(position.x, position.y, position.z);
            selectedFurniture.rotation.y = rotation; // Only Y-axis rotation
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

            if (intersectedObject.name !== 'floor' && intersectedObject.name !== 'leftWall' && intersectedObject.name !== 'rightWall' && intersectedObject.name !== 'backWall') {
                setSelectedFurniture(intersectedObject);
                setPosition({ x: intersectedObject.position.x, y: intersectedObject.position.y, z: intersectedObject.position.z });
                setRotation(intersectedObject.rotation.y);
                setScale(intersectedObject.scale.x);
                setModalType('furniture');
                setShowModal(true);
            }
        }
    };

    const handleDelete = () => {
        if (selectedFurniture) {
            sceneRef.current.remove(selectedFurniture);
            setSelectedFurniture(null);
            setShowModal(false);
        }
    };

    const handleCategoryClick = (category) => {
        setActiveCategory(category);
        setShowModal(false);
    };

    const handleColorChange = (event) => {
        if (selectedObject) {
            const newColor = new THREE.Color(event.target.value);
            selectedObject.material.color.set(newColor);
        }
    };

    const openColorModal = (objectName) => {
        const selected = sceneRef.current.getObjectByName(objectName);
        if (selected) {
            setSelectedObject(selected);
            setModalType('color');
            setShowModal(true);
        }
    };

    const closeModal = () => {
        setShowModal(false);
    };

    const saveFurnitureState = () => {
        const furnitureState = [];
        sceneRef.current.children.forEach(child => {
            if (child.type === 'Group' && child.children[0] && child.children[0].type === 'Scene') {
                furnitureState.push({
                    path: child.children[0].userData.path,
                    position: child.position,
                    rotation: child.rotation.y,
                    scale: child.scale.x
                });
            }
        });
        localStorage.setItem('furniture', JSON.stringify(furnitureState));
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <img
                    src="/lib/back.svg"
                    alt="back"
                    onClick={() => navigate('/design/livingroom')}
                />
                <h2>내 화장실 설정</h2>
            </div>
            <div ref={mountRef} className={styles.roomDesign} onClick={handleFurnitureSelection}></div>
            <div className={styles.furniture}>
                <div className={styles.furnitureCategories}>
                    <p onClick={() => handleCategoryClick('wallFloor')}>벽</p>
                    <p onClick={() => handleCategoryClick('toilet')}>화장실</p>
                    <p onClick={() => handleCategoryClick('pocketmon')}>포켓몬</p>
                    <p onClick={() => handleCategoryClick('etc')}>기타</p>
                </div>
                {activeCategory && (
                    <div className={styles.furnitureAddButton}>
                        {activeCategory === 'wallFloor' && (
                            <>
                                <button onClick={() => openColorModal('leftWall')}>왼쪽 벽</button>
                                <button onClick={() => openColorModal('backWall')}>오른쪽 벽</button>
                                <button onClick={() => openColorModal('floor')}>바닥</button>
                                <button onClick={() => loadFurniture('/public/furniture/ETC/문1.glb')}>
                                    <img src="/furniture/ETC/문1.png" alt="문1"/>
                                </button>
                                <button onClick={() => loadFurniture('/public/furniture/ETC/문2.glb')}>
                                    <img src="/furniture/ETC/문2.png" alt="문2"/>
                                </button>
                                <button onClick={() => loadFurniture('/public/furniture/ETC/문3.glb')}>
                                    <img src="/furniture/ETC/문3.png" alt="문3"/>
                                </button>
                                <button onClick={() => loadFurniture('/public/furniture/ETC/문4.glb')}>
                                    <img src="/furniture/ETC/문4.png" alt="문4"/>
                                </button>
                                <button onClick={() => loadFurniture('/public/furniture/ETC/문5.glb')}>
                                    <img src="/furniture/ETC/문5.png" alt="문5"/>
                                </button>
                                <button onClick={() => loadFurniture('/public/furniture/ETC/창문1.glb')}>
                                    <img src="/furniture/ETC/창문1.png" alt="창문1"/>
                                </button>
                                <button onClick={() => loadFurniture('/public/furniture/ETC/창문2.glb')}>
                                    <img src="/furniture/ETC/창문2.png" alt="창문2"/>
                                </button>
                                <button onClick={() => loadFurniture('/public/furniture/ETC/창문3.glb')}>
                                    <img src="/furniture/ETC/창문3.png" alt="창문3"/>
                                </button>
                                <button onClick={() => loadFurniture('/public/furniture/ETC/커튼1.glb')}>
                                    <img src="/furniture/ETC/커튼1.png" alt="커튼1"/>
                                </button>
                            </>
                        )}
                        {activeCategory === 'toilet' && (
                            <>
                                <button onClick={() => loadFurniture('/public/furniture/ETC/변기1.glb')}>
                                    <img src="/furniture/ETC/변기1.png" alt="변기1"/>
                                </button>
                                <button onClick={() => loadFurniture('/public/furniture/ETC/세면대1.glb')}>
                                    <img src="/furniture/ETC/세면대1.png" alt="세면대1"/>
                                </button>
                                <button onClick={() => loadFurniture('/public/furniture/ETC/욕조1.glb')}>
                                    <img src="/furniture/ETC/욕조1.png" alt="욕조1"/>
                                </button>
                                <button onClick={() => loadFurniture('/public/furniture/ETC/수건걸이1.glb')}>
                                    <img src="/furniture/ETC/수건걸이1.png" alt="수건걸이1"/>
                                </button>
                                <button onClick={() => loadFurniture('/public/furniture/ETC/휴지걸이1.glb')}>
                                    <img src="/furniture/ETC/휴지걸이1.png" alt="휴지걸이1"/>
                                </button>
                                <button onClick={() => loadFurniture('/public/furniture/ETC/휴지1.glb')}>
                                    <img src="/furniture/ETC/휴지1.png" alt="휴지1"/>
                                </button>
                            </>
                        )}
                        {activeCategory === 'etc' && (
                            <>
                                <button onClick={() => loadFurniture('/public/furniture/ETC/쓰레기통1.glb')}>
                                    <img src="/furniture/ETC/쓰레기통1.png" alt="쓰레기통1"/>
                                </button>
                                <button onClick={() => loadFurniture('/public/furniture/ETC/쓰레기통2.glb')}>
                                    <img src="/furniture/ETC/쓰레기통2.png" alt="쓰레기통2"/>
                                </button>
                                <button onClick={() => loadFurniture('/public/furniture/ETC/쓰레기통3.glb')}>
                                    <img src="/furniture/ETC/쓰레기통3.png" alt="쓰레기통3"/>
                                </button>
                                <button onClick={() => loadFurniture('/public/furniture/ETC/쓰레기통4.glb')}>
                                    <img src="/furniture/ETC/쓰레기통4.png" alt="쓰레기통4"/>
                                </button>
                                <button onClick={() => loadFurniture('/public/furniture/ETC/쓰레기통5.glb')}>
                                    <img src="/furniture/ETC/쓰레기통5.png" alt="쓰레기통5"/>
                                </button>
                            </>
                        )}
                        {activeCategory === 'pocketmon' && (
                            <>
                                <button onClick={() => loadFurniture('/public/furniture/POCKETMON/피카츄.glb')}>
                                    <img src="/furniture/POCKETMON/피카츄.png" alt="피카츄"/>
                                </button>
                                <button onClick={() => loadFurniture('/public/furniture/POCKETMON/폴리곤.glb')}>
                                    <img src="/furniture/POCKETMON/폴리곤.png" alt="폴리곤"/>
                                </button>
                                <button onClick={() => loadFurniture('/public/furniture/POCKETMON/파이리.glb')}>
                                    <img src="/furniture/POCKETMON/파이리.png" alt="파이리"/>
                                </button>
                                <button onClick={() => loadFurniture('/public/furniture/POCKETMON/탕구리.glb')}>
                                    <img src="/furniture/POCKETMON/탕구리.png" alt="탕구리"/>
                                </button>
                                <button onClick={() => loadFurniture('/public/furniture/POCKETMON/코일.glb')}>
                                    <img src="/furniture/POCKETMON/코일.png" alt="코일"/>
                                </button>
                                <button onClick={() => loadFurniture('/public/furniture/POCKETMON/잠만보.glb')}>
                                    <img src="/furniture/POCKETMON/잠만보.png" alt="잠만보"/>
                                </button>
                                <button onClick={() => loadFurniture('/public/furniture/POCKETMON/이브이.glb')}>
                                    <img src="/furniture/POCKETMON/이브이.png" alt="이브이"/>
                                </button>
                                <button onClick={() => loadFurniture('/public/furniture/POCKETMON/잉어킹.glb')}>
                                    <img src="/furniture/POCKETMON/잉어킹.png" alt="잉어킹"/>
                                </button>
                                <button onClick={() => loadFurniture('/public/furniture/POCKETMON/꼬지모.glb')}>
                                    <img src="/furniture/POCKETMON/꼬지모.png" alt="꼬지모"/>
                                </button>
                                <button onClick={() => loadFurniture('/public/furniture/POCKETMON/뮤.glb')}>
                                    <img src="/furniture/POCKETMON/뮤.png" alt="뮤"/>
                                </button>
                                <button onClick={() => loadFurniture('/public/furniture/POCKETMON/몬스터볼.glb')}>
                                    <img src="/furniture/POCKETMON/몬스터볼.png" alt="몬스터볼"/>
                                </button>
                            </>
                        )}
                    </div>
                )}
                {showModal && (
                    <div className={styles.modal}>
                        {modalType === 'furniture' ? (
                            <div className={styles.sliderControls}>
                                <label className={styles.xControls}>
                                    <p>X축위치:</p>
                                    <input
                                        type="range"
                                        min="-10"
                                        max="10"
                                        value={position.x}
                                        onChange={(e) => updatePosition('x', e.target.value)}
                                    />
                                    <input
                                        type="number"
                                        value={position.x}
                                        onChange={(e) => updatePosition('x', e.target.value)}
                                    />
                                </label>
                                <label className={styles.zControls}>
                                    <p>Y축위치:</p>
                                    <input
                                        type="range"
                                        min="-10"
                                        max="10"
                                        value={position.z}
                                        onChange={(e) => updatePosition('z', e.target.value)}
                                    />
                                    <input
                                        type="number"
                                        value={position.z}
                                        onChange={(e) => updatePosition('z', e.target.value)}
                                    />
                                </label>
                                <label className={styles.yControls}>
                                    <p>Z축위치:</p>
                                    <input
                                        type="range"
                                        min="-10"
                                        max="10"
                                        value={position.y}
                                        onChange={(e) => updatePosition('y', e.target.value)}
                                    />
                                    <input
                                        type="number"
                                        value={position.y}
                                        onChange={(e) => updatePosition('y', e.target.value)}
                                    />
                                </label>
                                <label className={styles.rotation}>
                                    <p>회전:</p>
                                    <input
                                        type="range"
                                        min="0"
                                        max={Math.PI * 2}
                                        step={0.01}
                                        value={rotation}
                                        onChange={(e) => updateRotation(e.target.value)}
                                    />
                                    <input
                                        type="number"
                                        value={rotation}
                                        onChange={(e) => updateRotation(e.target.value)}
                                    />
                                </label>
                                <label className={styles.scale}>
                                    <p>크기:</p>
                                    <input
                                        type="range"
                                        min="0.1"
                                        max="15"
                                        step="0.1"
                                        value={scale}
                                        onChange={(e) => updateScale(e.target.value)}
                                    />
                                    <input
                                        type="number"
                                        value={scale}
                                        onChange={(e) => updateScale(e.target.value)}
                                    />
                                </label>
                            </div>
                        ) : (
                            <div className={styles.colorControls}>
                                <p>색상 선택:</p>
                                <input type="color" onChange={handleColorChange}/>
                            </div>
                        )}
                        <div className={styles.furnitureSubmit}>
                            <button onClick={handleDelete}>삭제</button>
                            <button onClick={closeModal}>확인</button>
                        </div>
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
                    onClick={() => {
                        saveFurnitureState(); // 상태 저장
                        navigate('/main');
                    }}
                >
                    다음
                </button>
            </div>
        </div>
    );
};

export default FirstToiletRoom;

