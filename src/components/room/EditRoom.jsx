import {useEffect, useRef, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import * as THREE from 'three';
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls';
import styles from '../../css/first/firstRoomDesign.module.css';
import PropTypes from "prop-types";
import FurnitureList from "./FurnitureList.jsx";
import FurnitureController from "./FurnitureController.jsx";

const EditRoom = ({room, placementList, furniture, userLevel}) => {
    const navigate = useNavigate();
    const mountRef = useRef(null);
    const sceneRef = useRef(new THREE.Scene());
    const rendererRef = useRef(null);
    const cameraRef = useRef(null);
    const controlsRef = useRef(null);
    const [selectedFurniture, setSelectedFurniture] = useState(null);
    const [position, setPosition] = useState({x: 0, y: 0, z: 0});
    const [rotation, setRotation] = useState(0);  // Only Y-axis rotation
    const [scale, setScale] = useState(1);
    const [showModal, setShowModal] = useState(false);
    const [modalType, setModalType] = useState('furniture'); // 'furniture' or 'color'
    const [activeCategory, setActiveCategory] = useState(null);
    const [selectedObject, setSelectedObject] = useState(null); // Selected wall or floor for color change

    const [floorAndWallsColor, setFloorAndWallsColor] = useState(null);

    useEffect(() => {

        setFloorAndWallsColor(JSON.parse(room.roomWallsColor));
    }, [])

    useEffect(() => {

        if (floorAndWallsColor === null) {
            return;
        }

        const mount = mountRef.current;

        if (!rendererRef.current) {
            const renderer = new THREE.WebGLRenderer({antialias: true});
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
        const floorMaterial = new THREE.MeshStandardMaterial({color: floorAndWallsColor.floor});
        const floor = new THREE.Mesh(floorGeometry, floorMaterial);
        floor.name = 'floor'; // Naming the floor
        floor.position.set(0, 0, 0);
        scene.add(floor);

        // Left wall setup
        const wallLeftGeometry = new THREE.BoxGeometry(1, 15, 20);
        const wallLeftMaterial = new THREE.MeshStandardMaterial({color: floorAndWallsColor.leftWall});
        const wallLeft = new THREE.Mesh(wallLeftGeometry, wallLeftMaterial);
        wallLeft.name = 'leftWall'; // Naming the wall
        wallLeft.position.set(-9.5, 7.5, 0);
        scene.add(wallLeft);


        // Back wall setup
        const wallBackGeometry = new THREE.BoxGeometry(20, 15, 1);
        const wallBackMaterial = new THREE.MeshStandardMaterial({color: floorAndWallsColor.backWall});
        const wallBack = new THREE.Mesh(wallBackGeometry, wallBackMaterial);
        wallBack.name = 'backWall'; // Naming the wall
        wallBack.position.set(0, 7.5, -9.5);
        scene.add(wallBack);

        const animate = () => {
            requestAnimationFrame(animate);
            controlsRef.current.update();
            rendererRef.current.render(scene, cameraRef.current);
        };

        animate();

        placementList.map(placement => loadFurniture(placement));

        return () => {
            rendererRef.current.dispose();
        };
    }, [floorAndWallsColor]);

    useEffect(() => {
        if (selectedFurniture) {
            selectedFurniture.position.set(position.x, position.y, position.z);
            selectedFurniture.rotation.y = rotation; // Only Y-axis rotation
            selectedFurniture.scale.set(scale, scale, scale);
        }
    }, [position, rotation, scale, selectedFurniture]);

    const loadFurniture = (placement) => {
        const loader = new GLTFLoader();
        loader.load(`/furniture/${placement.furnitureType}/${placement.furnitureName}.glb`, (gltf) => {
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

            // 좌표를 JSON화
            const position = JSON.parse(placement.placementLocation);

            setSelectedFurniture(group);
            setPosition({x: position.x, y: position.y, z: position.z});
            setRotation(placement.placementAngle); // Reset rotation on Y-axis
            setScale(placement.placementSize); // Reset scale
            setModalType('furniture');
            setShowModal(true);
        }, undefined, (error) => {
            console.error('Error loading model:', error);
        });
    };

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
                setPosition({
                    x: intersectedObject.position.x,
                    y: intersectedObject.position.y,
                    z: intersectedObject.position.z
                });
                setRotation(intersectedObject.rotation.y);
                setScale(intersectedObject.scale.x);
                setModalType('furniture');
                setShowModal(true);
            }
        }
    };

    const handleCategoryClick = (category) => {
        setActiveCategory(category);
        setShowModal(false);
    };

    const handleDelete = () => {
        if (selectedFurniture) {
            sceneRef.current.remove(selectedFurniture);
            setSelectedFurniture(null);
            setShowModal(false);
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

    const updatePosition = (axis, value) => {
        // Ensure the position does not exceed the boundaries
        const newValue = Math.max(-10, Math.min(10, parseFloat(value)));
        setPosition((prev) => ({...prev, [axis]: newValue}));
    };

    const updateRotation = (value) => {
        setRotation(parseFloat(value));
    };

    const updateScale = (value) => {
        setScale(parseFloat(value));
    };

    const handleColorChange = (event) => {
        if (selectedObject) {
            const newColor = new THREE.Color(event.target.value);
            selectedObject.material.color.set(newColor);
        }
    };

    const closeModal = () => {
        setShowModal(false);
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
                <FurnitureList furniture={furniture} userLevel={userLevel} activeCategory={activeCategory}
                               userId={room.userId} showModal={showModal} setShowModal={setShowModal}
                               handleCategoryClick={handleCategoryClick} openColorModal={openColorModal}
                               loadFurniture={loadFurniture}/>
                <FurnitureController showModal={showModal} modalType={modalType} position={position} rotation={rotation}
                                     scale={scale} updatePosition={updatePosition} updateRotation={updateRotation}
                updateScale={updateScale} handleColorChange={handleColorChange} handleDelete={handleDelete} closeModal={closeModal}/>
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

EditRoom.propTypes = {
    room: PropTypes.object,
    placementList: PropTypes.array,
    furniture: PropTypes.array,
    userLevel: PropTypes.string,
}

export default EditRoom;