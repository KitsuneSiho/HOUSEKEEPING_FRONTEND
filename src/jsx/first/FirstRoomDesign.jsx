import React, { useEffect, useRef, useState } from 'react';
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
    const [rotation, setRotation] = useState(0);  // Y축 회전만 적용
    const [scale, setScale] = useState(1);
    const [activeCategory, setActiveCategory] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [modalType, setModalType] = useState('furniture'); // 'furniture' 또는 'color'
    const [selectedObject, setSelectedObject] = useState(null); // 색상 변경을 위한 선택된 벽 또는 바닥

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

        // 바닥 설정
        const floorGeometry = new THREE.BoxGeometry(20, 1, 20);
        const floorMaterial = new THREE.MeshStandardMaterial({ color: 0xc5f1cf });
        const floor = new THREE.Mesh(floorGeometry, floorMaterial);
        floor.name = 'floor'; // 바닥 이름 지정
        floor.position.set(0, 0, 0);
        scene.add(floor);

        // 왼쪽 벽 설정
        const wallLeftGeometry = new THREE.BoxGeometry(1, 15, 20);
        const wallLeftMaterial = new THREE.MeshStandardMaterial({ color: 0xa9f2ff });
        const wallLeft = new THREE.Mesh(wallLeftGeometry, wallLeftMaterial);
        wallLeft.name = 'leftWall'; // 벽 이름 지정
        wallLeft.position.set(-9.5, 7.5, 0);
        scene.add(wallLeft);

        // 뒤쪽 벽 설정
        const wallBackGeometry = new THREE.BoxGeometry(20, 15, 1);
        const wallBackMaterial = new THREE.MeshStandardMaterial({ color: 0xe0e0e0 });
        const wallBack = new THREE.Mesh(wallBackGeometry, wallBackMaterial);
        wallBack.name = 'backWall'; // 벽 이름 지정
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

    const loadFurniture = (path, position = { x: 0, y: 0, z: 0 }, rotation = 0, scale = 1) => {
        const loader = new GLTFLoader();
        loader.load(path, (gltf) => {
            const model = gltf.scene;

            // 크기를 결정하기 위한 경계 상자 계산
            const box = new THREE.Box3().setFromObject(model);
            const size = new THREE.Vector3();
            box.getSize(size);

            // 모델 크기를 기반으로 초기 스케일 설정, 필요에 따라 조정
            const initialScale = Math.min(4 / size.x, 4 / size.y, 4 / size.z);
            model.scale.set(initialScale * scale, initialScale * scale, initialScale * scale);

            // 모델 중앙 설정
            const center = box.getCenter(new THREE.Vector3());
            model.position.sub(center);
            model.position.y = -(box.min.y * model.scale.y);

            const group = new THREE.Group();
            group.add(model);
            group.position.set(position.x, position.y, position.z);
            group.rotation.y = rotation;
            group.scale.set(scale, scale, scale);
            sceneRef.current.add(group);

            setSelectedFurniture(group);
            setPosition({ x: group.position.x, y: group.position.y, z: group.position.z });
            setRotation(rotation); // Y축 회전 초기화
            setScale(scale); // 크기 초기화
            setModalType('furniture');
            setShowModal(true);
        }, undefined, (error) => {
            console.error('모델 로드 중 오류 발생:', error);
        });
    };

    const updatePosition = (axis, value) => {
        // 위치가 경계를 넘지 않도록 보장
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
            selectedFurniture.rotation.y = rotation; // Y축 회전만 적용
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
                    onClick={() => navigate('/*')}
                />
                <h2>내 방 설정</h2>
            </div>
            <div ref={mountRef} className={styles.roomDesign} onClick={handleFurnitureSelection}></div>
            <div className={styles.furniture}>
                <div className={styles.furnitureCategories}>
                    <p onClick={() => handleCategoryClick('wallFloor')}>벽</p>
                    <p onClick={() => handleCategoryClick('desk')}>책상</p>
                    <p onClick={() => handleCategoryClick('bed')}>침대</p>
                    <p onClick={() => handleCategoryClick('sofa')}>소파</p>
                    <p onClick={() => handleCategoryClick('closet')}>옷장</p>
                    <p onClick={() => handleCategoryClick('chair')}>의자</p>
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
                            </>
                        )}
                        {activeCategory === 'desk' && (
                            <>
                                <button onClick={() => loadFurniture('/public/furniture/책상1.glb')}>책상1</button>
                                <button onClick={() => loadFurniture('/public/furniture/책상2.glb')}>책상2</button>
                                <button onClick={() => loadFurniture('/public/furniture/책상3.glb')}>책상3</button>
                                <button onClick={() => loadFurniture('/public/furniture/책상4.glb')}>책상4</button>
                                <button onClick={() => loadFurniture('/public/furniture/책상5.glb')}>책상5</button>
                            </>
                        )}
                        {activeCategory === 'bed' && (
                            <>
                                <button onClick={() => loadFurniture('/public/furniture/침대1.glb')}>침대1</button>
                                <button onClick={() => loadFurniture('/public/furniture/침대2.glb')}>침대2</button>
                                <button onClick={() => loadFurniture('/public/furniture/침대3.glb')}>침대3</button>
                                <button onClick={() => loadFurniture('/public/furniture/침대4.glb')}>침대4</button>
                                <button onClick={() => loadFurniture('/public/furniture/침대5.glb')}>침대5</button>
                            </>
                        )}
                        {activeCategory === 'sofa' && (
                            <>
                                <button onClick={() => loadFurniture('/public/furniture/소파1.glb')}>소파1</button>
                                <button onClick={() => loadFurniture('/public/furniture/소파2.glb')}>소파2</button>
                                <button onClick={() => loadFurniture('/public/furniture/소파3.glb')}>소파3</button>
                                <button onClick={() => loadFurniture('/public/furniture/소파4.glb')}>소파4</button>
                                <button onClick={() => loadFurniture('/public/furniture/소파5.glb')}>소파5</button>
                                <button onClick={() => loadFurniture('/public/furniture/소파6.glb')}>소파6</button>
                            </>
                        )}
                        {activeCategory === 'closet' && (
                            <>
                                <button onClick={() => loadFurniture('/public/furniture/옷장1.glb')}>옷장1</button>
                                <button onClick={() => loadFurniture('/public/furniture/옷장2.glb')}>옷장2</button>
                            </>
                        )}
                        {activeCategory === 'chair' && (
                            <>
                                <button onClick={() => loadFurniture('/public/furniture/의자1.glb')}>의자1</button>
                                <button onClick={() => loadFurniture('/public/furniture/의자2.glb')}>의자2</button>
                                <button onClick={() => loadFurniture('/public/furniture/의자3.glb')}>의자3</button>
                                <button onClick={() => loadFurniture('/public/furniture/의자4.glb')}>의자4</button>
                            </>
                        )}
                        {activeCategory === 'etc' && (
                            <>
                                <button onClick={() => loadFurniture('/public/furniture/게시판.glb')}>게시판</button>
                                <button onClick={() => loadFurniture('/public/furniture/서랍장1.glb')}>서랍장1</button>
                                <button onClick={() => loadFurniture('/public/furniture/문1.glb')}>문1</button>
                                <button onClick={() => loadFurniture('/public/furniture/문2.glb')}>문2</button>
                                <button onClick={() => loadFurniture('/public/furniture/문3.glb')}>문3</button>
                            </>
                        )}
                        {activeCategory === 'pocketmon' && (
                            <>
                                <button onClick={() => loadFurniture('/public/furniture/피카츄.glb')}>피카츄</button>
                                <button onClick={() => loadFurniture('/public/furniture/폴리곤.glb')}>폴리곤</button>
                                <button onClick={() => loadFurniture('/public/furniture/파이리.glb')}>파이리</button>
                                <button onClick={() => loadFurniture('/public/furniture/탕구리.glb')}>탕구리</button>
                                <button onClick={() => loadFurniture('/public/furniture/코일.glb')}>코일</button>
                                <button onClick={() => loadFurniture('/public/furniture/잠만보.glb')}>잠만보</button>
                                <button onClick={() => loadFurniture('/public/furniture/이브이.glb')}>이브이</button>
                                <button onClick={() => loadFurniture('/public/furniture/잉어킹.glb')}>잉어킹</button>
                                <button onClick={() => loadFurniture('/public/furniture/꼬지모.glb')}>꼬지모</button>
                                <button onClick={() => loadFurniture('/public/furniture/뮤.glb')}>뮤</button>
                                <button onClick={() => loadFurniture('/public/furniture/몬스터볼.glb')}>몬스터볼</button>
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
                        navigate('/design/livingroom');
                    }}
                >
                    다음
                </button>
            </div>
        </div>
    );
};

export default FirstRoomDesign;
