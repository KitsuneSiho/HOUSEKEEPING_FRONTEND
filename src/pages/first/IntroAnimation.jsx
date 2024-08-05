import '../../css/first/introAnimation.css';
import { useEffect, useRef, useState } from 'react';
import knockSound from '/sounds/wood-door-knock-106669.mp3';
import doorOpenSound from '/sounds/open-and-close-door-29595.mp3';
import popSound from '/sounds/happy-pop-2-185287.mp3';
import roomieMovingSound from '/sounds/little-robot-sound-84657.mp3';
import housekeepingSound from '/sounds/housekeeping-housekeeping.wav';
import {useNavigate} from "react-router-dom";

const IntroAnimation = () => {
    const [doorStatus, setDoorStatus] = useState('close');
    const [timer, setTimer] = useState(0);
    const [positionX, setPositionX] = useState(-10);
    const [angle, setAngle] = useState(0);
    const [hasInteracted, setHasInteracted] = useState(false);
    const audioRef = useRef(new Audio());
    const startSecond = 70;
    const roomieSecond = 18;
    const doorSecond = startSecond - 25;
    const navigate = useNavigate();

    // 오디오 파일 목록
    const audioFiles = [
        { time: 1, file: knockSound },
        { time: doorSecond - 5, file: doorOpenSound },
        { time: startSecond + 13, file: popSound },
        { time: startSecond + 42, file: roomieMovingSound },
        { time: startSecond + 80, file: "" },
        { time: startSecond + 90, file: housekeepingSound },
    ];

    // 타이머
    useEffect(() => {
        let interval;
        if (hasInteracted) {
            interval = setInterval(() => {
                setTimer(prevTimer => prevTimer + 1);
            }, 50);
        }
        return () => clearInterval(interval);
    }, [hasInteracted]);

    // 애니메이션
    useEffect(() => {
        setDoorStatus(() => {
            if (timer <= doorSecond) {
                return 'close';
            } else {
                return 'open';
            }
        });

        setAngle(prev => {
            if (timer === 0) {
                return prev + 25;
            } else if (timer === startSecond + 32) {
                return 0;
            } else {
                return prev;
            }
        });

        setPositionX(prev => {
            if (timer <= startSecond) {
                return prev;
            } else if (timer <= startSecond + 32) {
                if (timer >= startSecond + 15) {
                    return prev - 4;
                }
                return prev + 4;
            } else if (timer <= startSecond + 80) {
                return prev + 4;
            } else {
                return prev;
            }
        });
    }, [timer]);

    // 사운드 재생
    useEffect(() => {

        if (timer === startSecond + 80) {
             audioRef.current.pause();
             return;
        }

        const currentAudio = audioFiles.find(audio => timer === audio.time);
        if (currentAudio && audioRef.current) {
            audioRef.current.src = currentAudio.file;
            audioRef.current.play().catch(error => {
                console.error('Audio play failed:', error);
            });
        }
    }, [timer]);

    const handleEnter = () => {
        setHasInteracted(true);
        audioRef.current.currentTime = 0;
    };

    return (
        <div className="image-container">
            {!hasInteracted && (
                <div>
                    <h1>knock door to start</h1>
                    <img src="/animationImage/닫힌문-배경없.png" alt="img not found" className={`door-closed`} onClick={handleEnter}/>
                </div>
            )}
            {hasInteracted && (
                <div>
                    <h1>click door to login</h1>
                    <img
                        src={timer <= startSecond + 32 ? `animationImage/루미사분의삼쪽.png` :
                            timer <= startSecond + roomieSecond + 32 ? `animationImage/루미좌우반전반갈죽.png` :
                                `animationImage/루미좌우반전.png`}
                        alt="img not found"
                        style={{transform: `translate(${positionX}px, 0px) rotate(${angle}deg)`}}
                        className="roomie"
                    />

                    <div className="door-area" onClick={() => navigate('/temp/login')}>
                        <img src="/animationImage/닫힌문-배경없.png" alt="img not found"
                             className={`door-closed ${doorStatus}`}/>
                        <img src="/animationImage/문틀왼쪽.png" alt="img not found"
                             className={`door-frame-left ${doorStatus}`}/>
                        <img src="/animationImage/문틀오른쪽.png" alt="img not found"
                             className={`door-frame-right ${doorStatus}`}/>
                        <img src="/animationImage/열린문짝.png" alt="img not found" className={`door-panel ${doorStatus}`}/>
                    </div>
                    <audio ref={audioRef}/>
                </div>
            )}
        </div>
    );
};

export default IntroAnimation;
