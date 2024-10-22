import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import styles from '../../css/first/firstRoomDesign.module.css';

const FirstLivingRoom = () => {
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
        directionalLight.position.set(10, 10, 5);
        scene.add(directionalLight);

        // 바닥 설정
        const floorGeometry = new THREE.BoxGeometry(20, 1, 20);
        const floorMaterial = new THREE.MeshStandardMaterial({ color: 0xf2e0c8 });
        const floor = new THREE.Mesh(floorGeometry, floorMaterial);
        floor.name = 'floor'; // 바닥 이름 지정
        floor.position.set(0, 0, 0);
        scene.add(floor);

        // 왼쪽 벽 설정
        const wallLeftGeometry = new THREE.BoxGeometry(1, 15, 20);
        const wallLeftMaterial = new THREE.MeshStandardMaterial({ color: 0xcdcdcd });
        const wallLeft = new THREE.Mesh(wallLeftGeometry, wallLeftMaterial);
        wallLeft.name = 'leftWall'; // 벽 이름 지정
        wallLeft.position.set(-9.5, 7.5, 0);
        scene.add(wallLeft);

        // 뒤쪽 벽 설정
        const wallBackGeometry = new THREE.BoxGeometry(20, 15, 1);
        const wallBackMaterial = new THREE.MeshStandardMaterial({ color: 0xcdcdcd });
        const wallBack = new THREE.Mesh(wallBackGeometry, wallBackMaterial);
        wallBack.name = 'backWall'; // 벽 이름 지정
        wallBack.position.set(0, 7.5, -9.5);
        scene.add(wallBack);

        // 기본 가구 배치 - 원하는 가구를 이곳에 추가합니다.
        loadFurniture('/public/furniture/ETC/게시판.glb', { x: -8.8, y: 10, z: 6}, Math.PI / 9999, 1.3);

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

            // 모델 크기를 기반으로 초기 스케일 설정
            const initialScale = Math.min(4 / size.x, 4 / size.y, 4 / size.z);
            model.scale.set(initialScale, initialScale, initialScale);

            // 모델 중앙 설정
            const center = box.getCenter(new THREE.Vector3());
            model.position.sub(center);
            model.position.y = -(box.min.y * model.scale.y);

            const group = new THREE.Group();
            group.add(model);

            // 주어진 위치, 회전 및 크기 적용
            group.position.set(position.x, position.y, position.z);
            group.rotation.y = rotation;
            group.scale.set(scale * initialScale, scale * initialScale, scale * initialScale);

            sceneRef.current.add(group);

            // 가구 선택 상태 업데이트
            setSelectedFurniture(group);
            setPosition({ x: group.position.x, y: group.position.y, z: group.position.z });
            setRotation(group.rotation.y);
            setScale(scale);
            setModalType('furniture');
            setShowModal(true);
        }, undefined, (error) => {
            console.error('모델 로드 중 오류 발생:', error);
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
                    onClick={() => navigate('/design/myroom')}
                />
                <h2>내 주방 설정</h2>
            </div>
            <div ref={mountRef} className={styles.roomDesign} onClick={handleFurnitureSelection}></div>
            <div className={styles.furniture}>
                <div className={styles.furnitureCategories}>
                    <p onClick={() => handleCategoryClick('wallFloor')}>벽</p>
                    <p onClick={() => handleCategoryClick('floor')}>바닥</p>
                    <p onClick={() => handleCategoryClick('desk')}>책상</p>
                    <p onClick={() => handleCategoryClick('chair')}>의자</p>
                    <p onClick={() => handleCategoryClick('refrigerator')}>냉장고</p>
                    <p onClick={() => handleCategoryClick('washingMachine')}>세탁기</p>
                    <p onClick={() => handleCategoryClick('sink')}>싱크대</p>
                </div>
                <div className={styles.furnitureCategories}>
                    <p onClick={() => handleCategoryClick('oven')}>오븐</p>
                    <p onClick={() => handleCategoryClick('wastebasket')}>쓰레기통</p>
                    <p onClick={() => handleCategoryClick('decoration')}>장식품</p>
                    <p onClick={() => handleCategoryClick('light')}>조명</p>
                    <p onClick={() => handleCategoryClick('pocketmon')}>포켓몬</p>
                    <p onClick={() => handleCategoryClick('etc')}>기타</p>
                </div>
                {activeCategory && (
                    <div className={styles.furnitureAddButton}>
                        {activeCategory === 'wallFloor' && (
                            <>
                            <button onClick={() => openColorModal('leftWall')}>왼쪽 벽</button>
                                <button onClick={() => openColorModal('backWall')}>오른쪽 벽</button>
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
                        {activeCategory === 'floor' && (
                            <>
                                <button onClick={() => openColorModal('floor')}>바닥</button>
                                <button onClick={() => loadFurniture('/public/furniture/ETC/러그1.glb')}>
                                    <img src="/furniture/ETC/러그1.png" alt="러그1"/>
                                </button>
                                <button onClick={() => loadFurniture('/public/furniture/ETC/러그2.glb')}>
                                    <img src="/furniture/ETC/러그2.png" alt="러그2"/>
                                </button>

                            </>
                        )}
                        {activeCategory === 'desk' && (
                            <>
                                <button onClick={() => loadFurniture('/public/furniture/DESK/책상1.glb')}>
                                    <img src="/furniture/DESK/책상1.png" alt="책상1"/>
                                </button>
                                <button onClick={() => loadFurniture('/public/furniture/DESK/책상2.glb')}>
                                    <img src="/furniture/DESK/책상2.png" alt="책상2"/>
                                </button>
                                <button onClick={() => loadFurniture('/public/furniture/DESK/책상3.glb')}>
                                    <img src="/furniture/DESK/책상3.png" alt="책상3"/>
                                </button>
                                <button onClick={() => loadFurniture('/public/furniture/DESK/책상4.glb')}>
                                    <img src="/furniture/DESK/책상4.png" alt="책상4"/>
                                </button>
                                <button onClick={() => loadFurniture('/public/furniture/DESK/책상5.glb')}>
                                    <img src="/furniture/DESK/책상5.png" alt="책상5"/>
                                </button>
                                <button onClick={() => loadFurniture('/public/furniture/DESK/책상6.glb')}>
                                    <img src="/furniture/DESK/책상6.png" alt="책상6"/>
                                </button>
                                <button onClick={() => loadFurniture('/public/furniture/DESK/책상7.glb')}>
                                    <img src="/furniture/DESK/책상7.png" alt="책상7"/>
                                </button>
                                <button onClick={() => loadFurniture('/public/furniture/DESK/책상8.glb')}>
                                    <img src="/furniture/DESK/책상8.png" alt="책상8"/>
                                </button>
                                <button onClick={() => loadFurniture('/public/furniture/DESK/책상9.glb')}>
                                    <img src="/furniture/DESK/책상9.png" alt="책상9"/>
                                </button>
                                <button onClick={() => loadFurniture('/public/furniture/DESK/책상10.glb')}>
                                    <img src="/furniture/DESK/책상10.png" alt="책상10"/>
                                </button>
                            </>
                        )}
                        {activeCategory === 'chair' && (
                            <>
                                <button onClick={() => loadFurniture('/public/furniture/CHAIR/의자1.glb')}>
                                    <img src="/furniture/CHAIR/의자1.png" alt="의자1"/>
                                </button>
                                <button onClick={() => loadFurniture('/public/furniture/CHAIR/의자3.glb')}>
                                    <img src="/furniture/CHAIR/의자3.png" alt="의자3"/>
                                </button>
                                <button onClick={() => loadFurniture('/public/furniture/CHAIR/의자4.glb')}>
                                    <img src="/furniture/CHAIR/의자4.png" alt="의자4"/>
                                </button>
                                <button onClick={() => loadFurniture('/public/furniture/CHAIR/의자5.glb')}>
                                    <img src="/furniture/CHAIR/의자5.png" alt="의자5"/>
                                </button>
                                <button onClick={() => loadFurniture('/public/furniture/CHAIR/의자6.glb')}>
                                    <img src="/furniture/CHAIR/의자6.png" alt="의자6"/>
                                </button>
                            </>
                        )}
                        {activeCategory === 'refrigerator' && (
                            <>
                                <button onClick={() => loadFurniture('/public/furniture/ETC/냉장고1.glb')}>
                                    <img src="/furniture/ETC/냉장고1.png" alt="냉장고1"/>
                                </button>
                            </>
                        )}
                        {activeCategory === 'washingMachine' && (
                            <>
                                <button onClick={() => loadFurniture('/public/furniture/ETC/세탁기1.glb')}>
                                    <img src="/furniture/ETC/세탁기1.png" alt="세탁기1"/>
                                </button>
                            </>
                        )}
                        {activeCategory === 'sink' && (
                            <>
                                <button onClick={() => loadFurniture('/public/furniture/ETC/씽크대1.glb')}>
                                    <img src="/furniture/ETC/씽크대1.png" alt="씽크대1"/>
                                </button>
                            </>
                        )}
                        {activeCategory === 'oven' && (
                            <>
                                <button onClick={() => loadFurniture('/public/furniture/ETC/오븐1.glb')}>
                                    <img src="/furniture/ETC/오븐1.png" alt="오븐1"/>
                                </button>
                            </>
                        )}
                        {activeCategory === 'wastebasket' && (
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
                        {activeCategory === 'decoration' && (
                            <>
                                <button onClick={() => loadFurniture('/public/furniture/ETC/식물1.glb')}>
                                    <img src="/furniture/ETC/식물1.png" alt="식물1"/>
                                </button>
                                <button onClick={() => loadFurniture('/public/furniture/ETC/식물2.glb')}>
                                    <img src="/furniture/ETC/식물2.png" alt="식물2"/>
                                </button>
                                <button onClick={() => loadFurniture('/public/furniture/ETC/식물3.glb')}>
                                    <img src="/furniture/ETC/식물3.png" alt="식물3"/>
                                </button>
                                <button onClick={() => loadFurniture('/public/furniture/ETC/식물4.glb')}>
                                    <img src="/furniture/ETC/식물4.png" alt="식물4"/>
                                </button>
                                <button onClick={() => loadFurniture('/public/furniture/ETC/식물5.glb')}>
                                    <img src="/furniture/ETC/식물5.png" alt="식물5"/>
                                </button>
                                <button onClick={() => loadFurniture('/public/furniture/ETC/식물6.glb')}>
                                    <img src="/furniture/ETC/식물6.png" alt="식물6"/>
                                </button>
                                <button onClick={() => loadFurniture('/public/furniture/ETC/식물7.glb')}>
                                    <img src="/furniture/ETC/식물7.png" alt="식물7"/>
                                </button>
                                <button onClick={() => loadFurniture('/public/furniture/ETC/식물8.glb')}>
                                    <img src="/furniture/ETC/식물8.png" alt="식물8"/>
                                </button>
                                <button onClick={() => loadFurniture('/public/furniture/ETC/장식품1.glb')}>
                                    <img src="/furniture/ETC/장식품1.png" alt="장식품1"/>
                                </button>
                                <button onClick={() => loadFurniture('/public/furniture/ETC/장식품2.glb')}>
                                    <img src="/furniture/ETC/장식품2.png" alt="장식품2"/>
                                </button>
                            </>
                        )}
                        {activeCategory === 'light' && (
                            <>
                                <button onClick={() => loadFurniture('/public/furniture/ETC/조명1.glb')}>
                                    <img src="/furniture/ETC/조명1.png" alt="조명1"/>
                                </button>
                                <button onClick={() => loadFurniture('/public/furniture/ETC/조명2.glb')}>
                                    <img src="/furniture/ETC/조명2.png" alt="조명2"/>
                                </button>
                                <button onClick={() => loadFurniture('/public/furniture/ETC/조명3.glb')}>
                                    <img src="/furniture/ETC/조명3.png" alt="조명3"/>
                                </button>
                                <button onClick={() => loadFurniture('/public/furniture/ETC/조명4.glb')}>
                                    <img src="/furniture/ETC/조명4.png" alt="조명4"/>
                                </button>
                                <button onClick={() => loadFurniture('/public/furniture/ETC/조명5.glb')}>
                                    <img src="/furniture/ETC/조명5.png" alt="조명5"/>
                                </button>
                                <button onClick={() => loadFurniture('/public/furniture/ETC/조명6.glb')}>
                                    <img src="/furniture/ETC/조명6.png" alt="조명6"/>
                                </button>
                                <button onClick={() => loadFurniture('/public/furniture/ETC/조명7.glb')}>
                                    <img src="/furniture/ETC/조명7.png" alt="조명7"/>
                                </button>
                                <button onClick={() => loadFurniture('/public/furniture/ETC/조명8.glb')}>
                                    <img src="/furniture/ETC/조명8.png" alt="조명8"/>
                                </button>
                                <button onClick={() => loadFurniture('/public/furniture/ETC/조명9.glb')}>
                                    <img src="/furniture/ETC/조명9.png" alt="조명9"/>
                                </button>
                                <button onClick={() => loadFurniture('/public/furniture/ETC/조명10.glb')}>
                                    <img src="/furniture/ETC/조명10.png" alt="조명10"/>
                                </button>
                                <button onClick={() => loadFurniture('/public/furniture/ETC/조명11.glb')}>
                                    <img src="/furniture/ETC/조명11.png" alt="조명11"/>
                                </button>
                                <button onClick={() => loadFurniture('/public/furniture/ETC/조명12.glb')}>
                                    <img src="/furniture/ETC/조명12.png" alt="조명12"/>
                                </button>
                                <button onClick={() => loadFurniture('/public/furniture/ETC/조명13.glb')}>
                                    <img src="/furniture/ETC/조명13.png" alt="조명13"/>
                                </button>
                                <button onClick={() => loadFurniture('/public/furniture/ETC/조명14.glb')}>
                                    <img src="/furniture/ETC/조명14.png" alt="조명14"/>
                                </button>
                                <button onClick={() => loadFurniture('/public/furniture/ETC/조명15.glb')}>
                                    <img src="/furniture/ETC/조명15.png" alt="조명15"/>
                                </button>
                            </>
                        )}
                        {activeCategory === 'etc' && (
                            <>
                                <button onClick={() => loadFurniture('/public/furniture/ETC/주방1.glb')}>
                                    <img src="/furniture/ETC/주방1.png" alt="주방1"/>
                                </button>
                                <button onClick={() => loadFurniture('/public/furniture/ETC/접시1.glb')}>
                                    <img src="/furniture/ETC/접시1.png" alt="접시1"/>
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
                        navigate('/design/toilet');
                    }}
                >
                    다음
                </button>
            </div>
        </div>
    );
};

export default FirstLivingRoom;

