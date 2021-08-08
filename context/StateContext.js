import {createContext,useState} from "react";


export const StateContext =createContext();

// グローバルに共有したいものをおく
export default function StateContextProvider(props){
    // 選択されたタスク
    const [selectedTask,setSelectedTask] =useState({id:0,title:""});

    return(
        <StateContext.Provider
            value={{
                selectedTask,
                setSelectedTask
            }}
        >
            {props.children}
        </StateContext.Provider>

    )

}
