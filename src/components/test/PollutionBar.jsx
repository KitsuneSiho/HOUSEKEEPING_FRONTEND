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
                <div className="speech-bubble">
                    <div className="bubble-text" style={loaderStyle}>{`${pollution}%`}</div>
                    <div className="triangle-top" style={loaderStyle}></div>
                </div>
            </div>
        </>
    )
}

PollutionBar.propTypes = {
    pollution: PropTypes.number.isRequired,
}

export default PollutionBar;
