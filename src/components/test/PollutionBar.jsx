import PropTypes from "prop-types";
import '../../css/test/pollutionBar.css'

const PollutionBar = ({pollution}) => {

    const loaderStyle = {
        '--loader-width': `${pollution-8}%`,
        '--loader-content': `"${pollution}%"`,
    };

    return (
        <>
            <div className="loader-container">
                <div className="loader" style={loaderStyle}>

                </div>
                <div className="chat-icon-container">
                    {pollution < 34 ?
                        <img className="chat-icon" src="/lib/오염도좋아.svg" style={loaderStyle}
                             alt="not found"/> :
                        pollution < 66 ?
                            <img className="chat-icon" src="/lib/오염도중간.svg" style={loaderStyle}
                                 alt="not found"/> :
                            <img className="chat-icon" src="/lib/오염도나빠.svg" style={loaderStyle}
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
