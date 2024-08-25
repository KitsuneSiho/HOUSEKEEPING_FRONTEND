import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../../css/clothes/uploadCloset.module.css';
import Footer from '../../jsx/fix/Footer.jsx';
import apiClient from '../../config/axiosConfig';
import { useModal } from "../../contexts/ModalContext.jsx";
import LoadingBar from "../../components/test/LoadingBar.jsx";

const UploadCloset = () => {
    const navigate = useNavigate();
    const { setModalType, setModalTitle, setModalBody, showModal, hideModal } = useModal();
    const [file, setFile] = useState(null);
    const [filePreview, setFilePreview] = useState(null);
    const [fileUrl, setFileUrl] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleFileChange = (event) => {
        const selectedFile = event.target.files[0];
        setFile(selectedFile);
        setFileUrl(null);

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

        setIsLoading(true);
        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await apiClient.post('/files/closetUpload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            const combined_data = response.data;
            const [uploadedUrl, classify] = combined_data.split(',');
            setFileUrl(uploadedUrl);

            setModalType("inform");
            setModalTitle("루미의 알람");
            setModalBody(`루미: 올린 사진은... ${classify}인 것 같아요!`);
            showModal();

            navigate('/closet/register/check', { state: { fileUrl: uploadedUrl, classify: classify } });
        } catch (error) {
            console.error('파일 업로드 실패:', error);
        } finally {
            setIsLoading(false);
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
            {isLoading && <LoadingBar />}
        </div>
    );
};

export default UploadCloset;