import {Route, BrowserRouter as Router, Routes} from "react-router-dom";
import Home from "./components/Home.jsx";
import ModalExample from "./components/test/ModalExample.jsx";
import {ModalProvider} from "./components/context/ModalContext.jsx";
import ChatPrototype from "./components/chat/ChatPrototype.jsx";

function App() {

    return (
        <ModalProvider>
            <Router>
                <Routes>
                    <Route path="/" element={<Home/>}/>


                    {/*    테스트 컴포넌트를 라우팅하는 부분입니다*/}
                    <Route path="/test/modal" element={<ModalExample/>}/>
                    <Route path="/test/chat" element={<ChatPrototype/>}/>
                </Routes>
            </Router>
        </ModalProvider>
    )
}

export default App
