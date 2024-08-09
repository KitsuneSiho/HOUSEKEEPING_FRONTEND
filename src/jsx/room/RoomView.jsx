import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import styles from '../../css/first/firstRoomDesign.module.css';

const RoomView = () => {
    const mountRef = useRef(null);
    const sceneRef = useRef(new THREE.Scene());
    const rendererRef = useRef(null);
    const cameraRef = useRef(null);
    const controlsRef = useRef(null);
    const raycasterRef = useRef(new THREE.Raycaster());
    const mouseRef = useRef(new THREE.Vector2());

    useEffect(() => {
        const mount = mountRef.current;

        if (!rendererRef.current) {
            const renderer = new THREE.WebGLRenderer({ antialias: true });
            renderer.setSize(mount.clientWidth, mount.clientHeight);
            mount.appendChild(renderer.domElement);
            rendererRef.current = renderer;
        }

        if (!cameraRef.current) {
            const camera = new THREE.PerspectiveCamera(60, mount.clientWidth / mount.clientHeight, 0.1, 1000);
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

        // 마우스 클릭 이벤트 리스너 추가
        const handleClick = (event) => {
            event.preventDefault();
            const bounds = mount.getBoundingClientRect();
            mouseRef.current.x = ((event.clientX - bounds.left) / bounds.width) * 2 - 1;
            mouseRef.current.y = -((event.clientY - bounds.top) / bounds.height) * 2 + 1;

            raycasterRef.current.setFromCamera(mouseRef.current, cameraRef.current);
            const intersects = raycasterRef.current.intersectObjects(scene.children, true);

            if (intersects.length > 0) {
                const object = intersects[0].object;
                console.log(`Clicked on: ${object.name}`);
                onclick(window.location.href='/main/guestbook')
            }
        };

        mount.addEventListener('click', handleClick);

        return () => {
            rendererRef.current.dispose();
            mount.removeEventListener('click', handleClick);
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
        }, undefined, (error) => {
            console.error('모델 로드 중 오류 발생:', error);
        });
    };

    return <div ref={mountRef} className={styles.roomDesign}></div>;
};

export default RoomView;
