import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../../css/clothes/uploadCloset.module.css';
import Footer from '../../jsx/fix/Footer.jsx';
import apiClient from '../../api/axiosConfig';

const UploadCloset = () => {
    const navigate = useNavigate();
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
            const response = await apiClient.post('/files/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            const uploadedUrl = response.data; // 서버에서 반환한 URL
            setFileUrl(uploadedUrl); // URL 저장

            // 업로드 후 업로드된 파일의 URL을 상태로 전달하며 페이지 이동
            navigate('/uploadClosetCheck', { state: { fileUrl: uploadedUrl } });
        } catch (error) {
            console.error('파일 업로드 실패:', error);
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <img className={styles.back} src="public/lib/back.svg" alt="back" onClick={() => navigate('/closetRoom')} />
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
            <div className={styles.buttons}>
                <button type="button" onClick={() => navigate('/uploadClosetCheck')}>
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
