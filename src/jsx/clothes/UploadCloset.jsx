import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../../css/clothes/uploadCloset.module.css';
import Footer from '../../jsx/fix/Footer.jsx';
import apiClient from '../../config/axiosConfig';
import {useModal} from "../../contexts/ModalContext.jsx";


const UploadCloset = () => {
    const navigate = useNavigate();
    const {setModalType, setModalTitle, setModalBody, showModal, hideModal} = useModal();
    const [file, setFile] = useState(null);
    const [filePreview, setFilePreview] = useState(null); // 로컬에서 선택한 파일의 미리보기 URL
    const [fileUrl, setFileUrl] = useState(null); // 서버에 업로드된 파일의 URL

    const handleFileChange = (event) => {
        const selectedFile = event.target.files[0];
        setFile(selectedFile);
        setFileUrl(null); // 새로운 파일 선택 시 서버 URL 초기화

        // 파일 미리보기 설정
        const reader = new FileReader();
        reader.onloadend = () => {
            setFilePreview(reader.result);
        };
        if (selectedFile) {
            reader.readAsDataURL(selectedFile);
        } else {
            setFilePreview(null);
        }
    };

    const handleUpload = async () => {
        if (!file) return;

        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await apiClient.post('/files/closetUpload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            // const uploadedUrl = response.data; // 서버에서 반환한 URL
            // setFileUrl(uploadedUrl); // URL 저장
            const combined_data = response.data;
            const [uploadedUrl, classify] = combined_data.split(',');
            setFileUrl(uploadedUrl);

            // classify 값을 팝업으로 표시
            // alert(`루미: 올린 사진은... ${classify}인 것 같아요!`);

            setModalType("inform");
            setModalTitle("루미의 알람");
            setModalBody(`루미: 올린 사진은... ${classify}인 것 같아요!`);
            showModal();

            // 업로드 후 업로드된 파일의 URL과 옷 라벨을 상태로 전달하며 페이지 이동
            navigate('/closet/register/check', { state: { fileUrl: uploadedUrl, classify: classify } });
        } catch (error) {
            console.error('파일 업로드 실패:', error);
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <img className={styles.back} src="/lib/back.svg" alt="back" onClick={() => navigate('/closet')} />
                <h2>옷 등록</h2>
            </div>
            <div className={styles.camera}>
                {filePreview ? (
                    <img src={filePreview} alt="Preview" style={{ maxWidth: '100%', maxHeight: '100%' }} />
                ) : (
                    <p>촬영 또는 사진 선택 후 <br/>
                        업로드 버튼을 눌러주세요</p>
                )}
            </div>
            <div className={styles.cameraButton}>
                <button type="button" onClick={() => navigate('/closet/register/check')}>
                    촬영
                </button>
                <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    style={{ display: 'none' }}
                    id="file-upload"
                />
                <label htmlFor="file-upload" style={{ cursor: 'pointer' }}>
                    사진 선택
                </label>
                <button type="button" onClick={handleUpload} disabled={!file}>
                    업로드
                </button>
            </div>
            <Footer />
        </div>
    );
};

export default UploadCloset;
