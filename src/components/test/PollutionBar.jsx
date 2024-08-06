import PropTypes from "prop-types";
import '../../css/test/pollutionBar.css'

const PollutionBar = ({pollution}) => {

    const loaderStyle = {
        '--loader-width': `${pollution}%`,
        '--loader-content': `"${pollution}%"`,
    };

    return (
        <>
            <div className="loader-container">
                <div className="loader" style={loaderStyle}></div>
                {/*<div className="loader-behind" style={loaderStyle}></div>*/}
                {/*<div className="cursor-container">*/}
                {/*    <div className="cursor" style={loaderStyle}></div>*/}
                {/*    <div className="cursor-content" style={loaderStyle}></div>*/}
                {/*</div>*/}
                {/*<div className="speech-bubble">*/}
                {/*    <div className="bubble-text" style={loaderStyle}>{`${pollution}%`}</div>*/}
                {/*    <div className="triangle-top" style={loaderStyle}></div>*/}
                {/*</div>*/}
                <div className="chat-icon-container">
                    {pollution < 34 ?
                        <img className="chat-icon" src="/pollution/good_icon.png" style={loaderStyle}
                             alt="not found"/> :
                        pollution < 67 ?
                            <img className="chat-icon" src="/pollution/normal_icon.png" style={loaderStyle}
                                 alt="not found"/> :
                            <img className="chat-icon" src="/pollution/angry_icon.png" style={loaderStyle}
                                 alt="not found"/>}
                </div>
            </div>
        </>
    )
}

PollutionBar.propTypes = {
    pollution: PropTypes.number.isRequired,
}

export default PollutionBar;