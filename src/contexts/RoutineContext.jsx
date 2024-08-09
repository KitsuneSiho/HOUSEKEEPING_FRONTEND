import React, { createContext, useContext, useState } from 'react';

const RoutineContext = createContext();

export const RoutineProvider = ({ children }) => {
    const [tempRoutines, setTempRoutines] = useState({});

    return (
        <RoutineContext.Provider value={{ tempRoutines, setTempRoutines }}>
            {children}
        </RoutineContext.Provider>
    );
};

export const useRoutine = () => useContext(RoutineContext);
