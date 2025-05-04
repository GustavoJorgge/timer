import { createContext, ReactNode, useState, useReducer } from "react";
 
interface createCycleData{
    task: string;
    minutesAmount: number
}

interface Cycle {
    id: string;
    task: string;
    minutesAmount: number;
    startDate: Date;
    interruptedDate?: Date;
    finishedDate?: Date;
}


interface CyclesContextType {
    cycles: Cycle[];
    activeCycle: Cycle | undefined;
    activeCycleId: string | null;
    amountSecondsPassed: number;
    markCurrentCycleAsFinished: () => void;
    setSecondsPassed: (seconds: number) => void
    createNewCycle: (data: createCycleData) => void
    interruptCurrentCycle: () => void
}


export const CyclesContext = createContext({} as CyclesContextType)

interface CyclesContextProviderProps {
    children: ReactNode
}

export function CyclesContextProvider({children}:CyclesContextProviderProps ){

    const [cycles, dispatch] = useReducer((state: Cycle[], action: any) => {
        console.log(state)
        console.log(action)

        if(action.type == 'ADD_NEW_CYCLE'){
            return [...state, action.payload.newCycle]
        }
        return state
    }, [])


    const [activeCycleId, setActiveCycleId] = useState<string | null>(null)
    const [amountSecondsPassed, setAmountSecondsPassed] = useState(0) // essa variavel armazena o tanto de segundos que ja se passaram desde que iniciou o ciclo

    const activeCycle = cycles.find((cycle) => cycle.id == activeCycleId)

    function setSecondsPassed(seconds: number) {
        setAmountSecondsPassed(seconds)
    }

    function markCurrentCycleAsFinished() {

        dispatch({
            type:'MARK_CURRENT_CYCLE_AS_FINISHED',
            payload: {
                activeCycleId,
            },
        })

        // setCycles((state) =>
        //     state.map((cycle) => {
        //         if (cycle.id == activeCycleId) {
        //             return { ...cycle, finishedDate: new Date() }
        //         } else {
        //             return cycle
        //         }
        //     }),
        // )
    }

    
    function interruptCurrentCycle() {

        dispatch({
            type:'INTERRUPT_CURRENT_CYCLE',
            payload: {
                data: activeCycleId,
            },
        })

        // setCycles(state => state.map((cycle) => {
        //     if (cycle.id == activeCycleId) {
        //         return { ...cycle, interruptedDate: new Date() }
        //     } else {
        //         return cycle
        //     }
        // }),
        // )
        setActiveCycleId(null)
    }

    function createNewCycle(data: createCycleData) {
        const id = String(new Date().getTime())//utilizando o horario como id em milisegundos

        const newCycle: Cycle = {
            id,
            task: data.task,
            minutesAmount: data.minutesAmount,
            startDate: new Date(),
        }
        
        dispatch({
            type:'ADD_NEW_CYCLE',
            payload: {
                newCycle,
            },
        })

        // setCycles((state) => [...cycles, newCycle])
        setActiveCycleId(id)
        setAmountSecondsPassed(0)
    }

   return(
    <CyclesContext.Provider
          value={{
            cycles,
            activeCycle,
            activeCycleId,
            markCurrentCycleAsFinished,
            amountSecondsPassed,
            setSecondsPassed,
            createNewCycle,
            interruptCurrentCycle
          }}>
            {children}
          </CyclesContext.Provider>
   ) 
}