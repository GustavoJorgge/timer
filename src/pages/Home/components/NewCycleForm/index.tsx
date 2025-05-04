import { useForm, useFormContext } from "react-hook-form";
import { FormContainer, MinutesAmountInput, TaskInput } from "./styles";
import * as zod from 'zod' // utilizamos desta forma em bibliotecas que não possuem "export default"
import { useContext } from "react";
import { CyclesContext } from './../../../../contexts/CyclesContext';

export function NewCycleForm(){

    const {activeCycle} = useContext(CyclesContext)
    const { register } = useFormContext()


    


    return(
        <FormContainer>
                    <label htmlFor=""> Vou trabalhar em</label>
                    <TaskInput
                        id="task"
                        list="task-suggestions"
                        placeholder="Dê um nome para o seu projeto"
                        disabled={!!activeCycle}
                        {...register('task')}
                    />

                    <datalist id="task-suggestions">
                        <option value="projeto 1" />
                        <option value="projeto 2" />
                        <option value="projeto 3" />
                    </datalist>

                    <label htmlFor="">durante</label>
                    <MinutesAmountInput
                        type="number"
                        id="minutesAmount"
                        placeholder="00"
                        step={1}
                        min={1}
                        max={60}
                        disabled={!!activeCycle}
                        {...register('minutesAmount', { valueAsNumber: true })}//valueAsNumber informa que o valor do campo será do tipo numero
                    />
                    <span>.minutos</span>
                </FormContainer>

    )
}