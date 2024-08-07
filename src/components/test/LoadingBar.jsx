import "../../css/test/loadingBar.css"

const LoadingBar = () => {

    return (
        <>
            <div className="loader-container">
                <img className="roomie-forward" src="/animationImage/루미.png" alt="roomie"/>
                <img className="roomie-flip" src="/animationImage/루미좌우반전.png" alt="roomie-flip"/>
                <div className="loader">
                    <div className="scanner">
                        <span>Loading...</span>
                    </div>
                </div>
            </div>
        </>
    )
}

export default LoadingBar