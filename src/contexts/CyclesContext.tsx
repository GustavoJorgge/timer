import { createContext, ReactNode, useState, useReducer, useEffect } from "react";
import { Cycle, cyclesReducer } from "../reducers/cycles/reducer";
import { ActionTypes, addNewCycleAction, interruptedCycleAction, markCurrentCycleAsFinishedAction } from "../reducers/cycles/actions";
import { differenceInSeconds } from 'date-fns';



interface createCycleData {
    task: string;
    minutesAmount: number
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



export function CyclesContextProvider({
    children,
}: CyclesContextProviderProps) {
    const [cyclesState, dispatch] = useReducer(cyclesReducer, {
        // Estado inicial padrão, caso não haja dados no localStorage
        cycles: [],
        activeCycleId: null
    },
        // Função de inicialização que será chamada apenas uma vez ao montar o componente
        (initialState) => {
            // Tenta buscar um estado previamente salvo no localStorage
            const storedStateAsJSON = localStorage.getItem('@timer: cycles-state-1.0.0');

            // Se houver dados salvos, retorna o estado recuperado
            if (storedStateAsJSON) {
                return JSON.parse(storedStateAsJSON);
            }

            return initialState
        }
    )


    useEffect(() => {
        const stateJSON = JSON.stringify(cyclesState)
        // Salva o estado no localStorage para persistência dos dados
        localStorage.setItem('@timer: cycles-state-1.0.0', stateJSON)
    }, [cyclesState])

    const { cycles, activeCycleId } = cyclesState;
    const activeCycle = cycles.find((cycle) => cycle.id == activeCycleId)

    // const [activeCycleId, setActiveCycleId] = useState<string | null>(null)
    const [amountSecondsPassed, setAmountSecondsPassed] = useState(() => {
        if (activeCycle) {
            return differenceInSeconds(
                new Date(),
                new Date(activeCycle.startDate),
            )
        }

        return 0
    }) // essa variavel armazena o tanto de segundos que ja se passaram desde que iniciou o ciclo




    function setSecondsPassed(seconds: number) {
        setAmountSecondsPassed(seconds)
    }

    function markCurrentCycleAsFinished() {

        dispatch(markCurrentCycleAsFinishedAction())

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

        dispatch(interruptedCycleAction())

        // setCycles(state => state.map((cycle) => {
        //     if (cycle.id == activeCycleId) {
        //         return { ...cycle, interruptedDate: new Date() }
        //     } else {
        //         return cycle
        //     }
        // }),
        // )
        // setActiveCycleId(null)
    }

    function createNewCycle(data: createCycleData) {
        const id = String(new Date().getTime())//utilizando o horario como id em milisegundos

        const newCycle: Cycle = {
            id,
            task: data.task,
            minutesAmount: data.minutesAmount,
            startDate: new Date(),
        }

        dispatch(addNewCycleAction(newCycle))

        // setCycles((state) => [...cycles, newCycle])
        // setActiveCycleId(id)
        setAmountSecondsPassed(0)
    }

    return (
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